import express from 'express';
import prisma from '../db/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage, uploadAudio } from '../middleware/upload.js';
import { checkDailyListingCap } from '../middleware/rateLimit.js';
import { uploadImageToCloud } from '../services/cloudinary.js';
import { processImageEnhancement } from '../services/enhance.js';
import { callGeminiWithRetry, getGenerativeModel } from '../services/gemini.js';
import { buildExtractionPrompt } from '../prompts/extraction.js';
import { buildDescriptionPrompt } from '../prompts/description.js';

const router = express.Router();

// All routes here require authentication
router.use(requireAuth);

// GET /api/articles/mine - List all articles for logged-in artisan
router.get('/mine', async (req, res, next) => {
  try {
    const articles = await prisma.article.findMany({
      where: { artisanId: req.user.id },
      include: {
        images: true,
        descriptions: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, articles });
  } catch (error) {
    next(error);
  }
});

// POST /api/articles - Create a new draft article
router.post('/', checkDailyListingCap, async (req, res, next) => {
  try {
    const { spokenLanguage = req.user.uiLanguage || 'hi' } = req.body;

    const draft = await prisma.article.create({
      data: {
        artisanId: req.user.id,
        status: 'draft',
        spokenLanguage: spokenLanguage
      }
    });

    res.status(201).json({ success: true, article: draft });
  } catch (error) {
    next(error);
  }
});

// GET /api/articles/:id - Get specific article details
router.get('/:id', async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const article = await prisma.article.findFirst({
      where: { id: articleId, artisanId: req.user.id },
      include: {
        images: { orderBy: { position: 'asc' } },
        descriptions: true,
        transcripts: true
      }
    });

    if (!article) {
      return res.status(404).json({ success: false, error: { message: 'Article not found' } });
    }

    res.json({ success: true, article });
  } catch (error) {
    next(error);
  }
});

// POST /api/articles/:id/images - Upload photo & trigger enhancement
router.post('/:id/images', uploadImage.single('image'), async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const article = await prisma.article.findFirst({
      where: { id: articleId, artisanId: req.user.id },
      include: { images: true }
    });

    if (!article) {
      return res.status(404).json({ success: false, error: { message: 'Article not found' } });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, error: { message: 'No image file provided' } });
    }

    // 1. Upload original to Cloudinary
    const originalCloud = await uploadImageToCloud(req.file.buffer, {
      folder: `artify/articles/${articleId}/original`
    });

    // 2. Process AI enhancement (Sharp + Gemini fallback)
    const enhancedResult = await processImageEnhancement(req.file.buffer, req.file.mimetype);

    // 3. Upload enhanced image to Cloudinary
    const enhancedCloud = await uploadImageToCloud(enhancedResult.buffer, {
      folder: `artify/articles/${articleId}/enhanced`
    });

    const isFirstImage = article.images.length === 0;

    // 4. Save to article_images table
    const imageRecord = await prisma.articleImage.create({
      data: {
        articleId: article.id,
        originalUrl: originalCloud.secure_url,
        enhancedUrl: enhancedCloud.secure_url,
        cloudinaryPublicId: enhancedCloud.public_id,
        enhancementMethod: enhancedResult.method,
        isHero: isFirstImage,
        position: article.images.length
      }
    });

    // If first image, set as heroImageId
    if (isFirstImage) {
      await prisma.article.update({
        where: { id: article.id },
        data: { heroImageId: imageRecord.id }
      });
    }

    res.json({
      success: true,
      image: imageRecord,
      method: enhancedResult.method,
      originalUrl: originalCloud.secure_url,
      enhancedUrl: enhancedCloud.secure_url
    });
  } catch (error) {
    console.error('Error during image upload & enhancement:', error);
    next(error);
  }
});

// POST /api/articles/:id/images/:imageId/choose - Choose between original or enhanced
router.post('/:id/images/:imageId/choose', async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const imageId = parseInt(req.params.imageId, 10);
    const { use } = req.body; // "original" | "enhanced"

    const image = await prisma.articleImage.findFirst({
      where: { id: imageId, articleId: articleId }
    });

    if (!image) {
      return res.status(404).json({ success: false, error: { message: 'Image not found' } });
    }

    const updated = await prisma.articleImage.update({
      where: { id: imageId },
      data: {
        enhancementMethod: use === 'original' ? 'none' : 'sharp+gemini'
      }
    });

    res.json({ success: true, image: updated });
  } catch (error) {
    next(error);
  }
});

// POST /api/articles/:id/audio - Transcribe & extract attributes in one call
router.post('/:id/audio', uploadAudio.single('audio'), async (req, res, next) => {
  let audioBuffer = null;
  try {
    const articleId = parseInt(req.params.id, 10);
    const { language = 'hi' } = req.body;

    const article = await prisma.article.findFirst({
      where: { id: articleId, artisanId: req.user.id },
      include: { images: true }
    });

    if (!article) {
      return res.status(404).json({ success: false, error: { message: 'Article not found' } });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, error: { message: 'No audio recording received' } });
    }

    audioBuffer = req.file.buffer;
    const audioMimeType = req.file.mimetype || 'audio/webm';

    // Update spoken language
    await prisma.article.update({
      where: { id: articleId },
      data: { spokenLanguage: language }
    });

    let extractedData = {
      transcript: 'ऑडियो सफलतापूर्वक प्राप्त हुआ (Audio received)',
      transcript_en: 'Audio received successfully',
      category: null,
      material: null,
      technique: null,
      dimensions: null,
      colors: null,
      time_to_make: null,
      uses: null,
      story: null,
      care: null,
      price_inr: null,
      missing_fields: ['material', 'price_inr'],
      follow_up_questions: ['कृपया इसकी सामग्री और मूल्य बताएं?'],
      image_mismatches: []
    };

    // If Gemini API is available, perform STT + attribute extraction
    if (process.env.GEMINI_API_KEY) {
      const model = getGenerativeModel(process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash');
      const prompt = buildExtractionPrompt(language);

      const parts = [
        prompt,
        {
          inlineData: {
            data: audioBuffer.toString('base64'),
            mimeType: audioMimeType
          }
        }
      ];

      // If hero image exists, add image to cross-check
      const heroImage = article.images.find(img => img.isHero) || article.images[0];
      if (heroImage && heroImage.enhancedUrl) {
        try {
          // If URL is inline data URI or external URL, extract or fetch
          if (heroImage.enhancedUrl.startsWith('data:')) {
            const [mimePrefix, b64Data] = heroImage.enhancedUrl.split(';base64,');
            const imgMime = mimePrefix.replace('data:', '');
            parts.push({
              inlineData: {
                data: b64Data,
                mimeType: imgMime
              }
            });
          }
        } catch (imgErr) {
          console.warn('Could not attach hero image inline:', imgErr.message);
        }
      }

      const aiResponseText = await callGeminiWithRetry(async () => {
        const response = await model.generateContent(parts);
        return response.response.text();
      }, 3, 25000);

      // Clean markdown code blocks if wrapped in ```json
      const cleanedJson = aiResponseText.replace(/^```json/m, '').replace(/^```/m, '').replace(/```$/m, '').trim();
      try {
        extractedData = JSON.parse(cleanedJson);
      } catch (parseErr) {
        console.warn('Failed to parse Gemini extraction JSON, returning raw text as transcript:', parseErr);
        extractedData.transcript = aiResponseText;
      }
    }

    // Save transcript to database (confirmed: false)
    if (extractedData.transcript) {
      await prisma.transcript.create({
        data: {
          articleId: article.id,
          language: language,
          text: extractedData.transcript,
          confirmed: false
        }
      });
    }

    // Return structured extraction result
    res.json({
      success: true,
      transcript: extractedData.transcript,
      transcript_en: extractedData.transcript_en,
      extracted: {
        category: extractedData.category,
        material: extractedData.material,
        technique: extractedData.technique,
        dimensions: extractedData.dimensions,
        colors: extractedData.colors,
        timeToMake: extractedData.time_to_make,
        uses: extractedData.uses,
        story: extractedData.story,
        care: extractedData.care,
        priceInr: extractedData.price_inr
      },
      missingFields: extractedData.missing_fields || [],
      followUpQuestions: extractedData.follow_up_questions || [],
      imageMismatchWarnings: extractedData.image_mismatches || []
    });
  } catch (error) {
    console.error('Error during audio processing:', error);
    next(error);
  } finally {
    // STRICT REQUIREMENT (PRD 10 & 19.6 Rule 5):
    // Permanently wipe audio buffer from memory
    audioBuffer = null;
    if (req.file) {
      req.file.buffer = null;
    }
  }
});

// PUT /api/articles/:id/details - Save user-confirmed fields
router.put('/:id/details', async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const {
      title,
      tagline,
      category,
      priceInr,
      material,
      technique,
      dimensions,
      colors,
      timeToMake,
      uses,
      story,
      care,
      tags
    } = req.body;

    const article = await prisma.article.findFirst({
      where: { id: articleId, artisanId: req.user.id }
    });

    if (!article) {
      return res.status(404).json({ success: false, error: { message: 'Article not found' } });
    }

    const updated = await prisma.article.update({
      where: { id: articleId },
      data: {
        ...(title !== undefined && { title }),
        ...(tagline !== undefined && { tagline }),
        ...(category !== undefined && { category }),
        ...(priceInr !== undefined && { priceInr: priceInr !== null && priceInr !== '' ? parseFloat(priceInr) : null }),
        ...(material !== undefined && { material }),
        ...(technique !== undefined && { technique }),
        ...(dimensions !== undefined && { dimensions }),
        ...(colors !== undefined && { colors }),
        ...(timeToMake !== undefined && { timeToMake }),
        ...(uses !== undefined && { uses }),
        ...(story !== undefined && { story }),
        ...(care !== undefined && { care }),
        ...(tags !== undefined && { tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []) })
      }
    });

    res.json({ success: true, article: updated });
  } catch (error) {
    next(error);
  }
});

// POST /api/articles/:id/describe - Generate descriptions in spoken lang, English, Hindi
router.post('/:id/describe', async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const { tone = 'traditional' } = req.body;

    const article = await prisma.article.findFirst({
      where: { id: articleId, artisanId: req.user.id },
      include: { images: true }
    });

    if (!article) {
      return res.status(404).json({ success: false, error: { message: 'Article not found' } });
    }

    const attributes = {
      category: article.category,
      material: article.material,
      technique: article.technique,
      dimensions: article.dimensions,
      colors: article.colors,
      timeToMake: article.timeToMake,
      uses: article.uses,
      story: article.story,
      care: article.care,
      priceInr: article.priceInr ? Number(article.priceInr) : null
    };

    let generatedList = [];

    if (process.env.GEMINI_API_KEY) {
      const model = getGenerativeModel(process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash');
      const prompt = buildDescriptionPrompt({
        attributes,
        spokenLanguage: article.spokenLanguage || 'hi',
        tone
      });

      const aiResponseText = await callGeminiWithRetry(async () => {
        const res = await model.generateContent(prompt);
        return res.response.text();
      }, 3, 25000);

      const cleanedJson = aiResponseText.replace(/^```json/m, '').replace(/^```/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanedJson);
      generatedList = parsed.descriptions || [];
    } else {
      // Fallback descriptions for offline local demo
      const baseTitle = `${article.material || 'हस्तशिल्प'} ${article.category || 'उत्पाद'}`;
      generatedList = [
        {
          language: article.spokenLanguage || 'hi',
          tone,
          title: baseTitle,
          tagline: 'परंपरा और कौशल से निर्मित अद्वितीय हस्तशिल्प।',
          body: `यह उत्कृष्ट कृति ${article.material || 'प्राकृतिक सामग्री'} से तैयार की गई है। इसमें प्रयुक्त पारंपरिक तकनीक कारीगर के वर्षों के अनुभव को दर्शाती है। इसका आकार ${article.dimensions || 'सटीक'} है। यह सजावट और दैनिक उपयोग के लिए अत्यंत उपयुक्त है।`,
          tags: ['हस्तशिल्प', 'भारतीयकला', 'कारीगर']
        },
        {
          language: 'en',
          tone,
          title: `Handcrafted ${article.material || 'Artisan'} ${article.category || 'Creation'}`,
          tagline: 'Authentic handmade heritage crafted with passion and skill.',
          body: `Handcrafted meticulously with ${article.material || 'authentic natural materials'}, this piece exemplifies traditional craft techniques. Featuring dimensions of ${article.dimensions || 'harmonious size'}, it brings timeless heritage and authentic charm to any living space.`,
          tags: ['handcrafted', 'artisan', 'heritage', 'sustainable']
        },
        {
          language: 'hi',
          tone,
          title: `प्रामाणिक हस्तनिर्मित ${article.category || 'शिल्प'}`,
          tagline: 'भारतीय परंपरा और सजीव कला का बेजोड़ संगम।',
          body: `यह उत्पाद शुद्ध ${article.material || 'पारंपरिक सामग्री'} से पूर्ण समर्पण के साथ तैयार किया गया है। इसकी कारीगरी और बारीकियां इसे अत्यंत विशेष बनाती हैं। घर की शोभा बढ़ाने और उपहार देने के लिए आदर्श।`,
          tags: ['हस्तनिर्मित', 'कला', 'स्वदेशी']
        }
      ];
    }

    // Upsert into descriptions table
    const savedDescriptions = [];
    for (const desc of generatedList) {
      const saved = await prisma.description.upsert({
        where: {
          articleId_language: {
            articleId: article.id,
            language: desc.language
          }
        },
        create: {
          articleId: article.id,
          language: desc.language,
          tone: desc.tone || tone,
          title: desc.title,
          tagline: desc.tagline,
          body: desc.body
        },
        update: {
          tone: desc.tone || tone,
          title: desc.title,
          tagline: desc.tagline,
          body: desc.body,
          version: { increment: 1 }
        }
      });
      savedDescriptions.push(saved);
    }

    // Set article title and tagline from primary language if unset
    const primaryDesc = savedDescriptions.find(d => d.language === article.spokenLanguage) || savedDescriptions[0];
    if (primaryDesc) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          title: primaryDesc.title,
          tagline: primaryDesc.tagline
        }
      });
    }

    res.json({ success: true, descriptions: savedDescriptions });
  } catch (error) {
    console.error('Error generating descriptions:', error);
    next(error);
  }
});

// PUT /api/articles/:id/descriptions/:lang - Edit single language description
router.put('/:id/descriptions/:lang', async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const lang = req.params.lang;
    const { title, tagline, body } = req.body;

    const desc = await prisma.description.upsert({
      where: {
        articleId_language: {
          articleId: articleId,
          language: lang
        }
      },
      create: {
        articleId,
        language: lang,
        title,
        tagline,
        body
      },
      update: {
        ...(title !== undefined && { title }),
        ...(tagline !== undefined && { tagline }),
        ...(body !== undefined && { body }),
        version: { increment: 1 }
      }
    });

    res.json({ success: true, description: desc });
  } catch (error) {
    next(error);
  }
});

// POST /api/articles/:id/publish - Publish listing
router.post('/:id/publish', async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const article = await prisma.article.findFirst({
      where: { id: articleId, artisanId: req.user.id },
      include: {
        images: true,
        descriptions: true,
        artisan: { include: { profile: true } }
      }
    });

    if (!article) {
      return res.status(404).json({ success: false, error: { message: 'Article not found' } });
    }

    // Validation checks per PRD Section 19.5 & 19.8:
    // 1. Price is required and must be > 0
    if (!article.priceInr || Number(article.priceInr) <= 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Price (in INR) is required to publish this article.', code: 'PRICE_REQUIRED' }
      });
    }

    // 2. Hero image is required
    if (article.images.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'At least one product photograph is required.', code: 'IMAGE_REQUIRED' }
      });
    }

    // 3. WhatsApp number verified and consented
    const profile = article.artisan.profile;
    if (!profile || !profile.whatsappVerified) {
      return res.status(400).json({
        success: false,
        error: { message: 'Artisan WhatsApp number must be verified before publishing.', code: 'WHATSAPP_UNVERIFIED' }
      });
    }

    if (!profile.whatsappPublicConsent) {
      return res.status(400).json({
        success: false,
        error: { message: 'Consent to share WhatsApp number with buyers is required.', code: 'WHATSAPP_CONSENT_REQUIRED' }
      });
    }

    const published = await prisma.article.update({
      where: { id: articleId },
      data: {
        status: 'published',
        publishedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Article published successfully!',
      article: published
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/articles/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    await prisma.article.deleteMany({
      where: { id: articleId, artisanId: req.user.id }
    });
    res.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
