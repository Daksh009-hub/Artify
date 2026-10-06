import express from 'express';
import prisma from '../db/prisma.js';

const router = express.Router();

// GET /api/public/articles - Storefront feed with search and filters
router.get('/articles', async (req, res, next) => {
  try {
    const {
      q = '',
      category,
      material,
      state,
      minPrice,
      maxPrice,
      lang = 'en',
      sort = 'newest',
      page = 1,
      pageSize = 12
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limit = Math.max(1, Math.min(50, parseInt(pageSize, 10)));
    const skip = (pageNum - 1) * limit;

    // Base filter: ONLY published items
    const where = {
      status: 'published'
    };

    if (category) {
      where.category = category;
    }

    if (material) {
      where.material = { contains: material };
    }

    if (state) {
      where.artisan = {
        profile: {
          state: state
        }
      };
    }

    if (minPrice || maxPrice) {
      where.priceInr = {};
      if (minPrice) where.priceInr.gte = parseFloat(minPrice);
      if (maxPrice) where.priceInr.lte = parseFloat(maxPrice);
    }

    if (q && q.trim()) {
      const searchTerm = q.trim();
      where.OR = [
        { title: { contains: searchTerm } },
        { tagline: { contains: searchTerm } },
        { material: { contains: searchTerm } },
        { technique: { contains: searchTerm } },
        { category: { contains: searchTerm } }
      ];
    }

    // Sorting
    let orderBy = { publishedAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { priceInr: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { priceInr: 'desc' };
    } else if (sort === 'newest') {
      orderBy = { publishedAt: 'desc' };
    }

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: [{ isHero: 'desc' }, { position: 'asc' }]
          },
          descriptions: true,
          artisan: {
            select: {
              id: true,
              profile: {
                select: {
                  displayName: true,
                  craftType: true,
                  village: true,
                  city: true,
                  state: true,
                  photoUrl: true
                }
              }
            }
          }
        }
      })
    ]);

    // Format articles for public storefront with localization fallback
    const items = articles.map(art => {
      // Find requested language description, fallback to English or first available
      const desc = art.descriptions.find(d => d.language === lang) ||
                   art.descriptions.find(d => d.language === 'en') ||
                   art.descriptions[0] || {};

      const heroImg = art.images.find(img => img.isHero) || art.images[0];

      return {
        id: art.id,
        title: desc.title || art.title || 'अनाम शिल्प (Handcrafted Article)',
        tagline: desc.tagline || art.tagline || '',
        category: art.category,
        material: art.material,
        technique: art.technique,
        priceInr: art.priceInr ? Number(art.priceInr) : null,
        heroImage: heroImg ? {
          originalUrl: heroImg.originalUrl,
          enhancedUrl: heroImg.enhancedUrl || heroImg.originalUrl,
          enhancementMethod: heroImg.enhancementMethod,
          isAiEnhanced: heroImg.enhancementMethod !== 'none'
        } : null,
        artisan: {
          id: art.artisan.id,
          name: art.artisan.profile?.displayName || 'कारीगर',
          craftType: art.artisan.profile?.craftType,
          location: [art.artisan.profile?.village, art.artisan.profile?.city, art.artisan.profile?.state].filter(Boolean).join(', ')
        },
        publishedAt: art.publishedAt
      };
    });

    res.json({
      success: true,
      data: items,
      pagination: {
        total,
        page: pageNum,
        pageSize: limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/articles/:id - Public product page
router.get('/articles/:id', async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const { lang = 'en' } = req.query;

    const article = await prisma.article.findFirst({
      where: { id: articleId, status: 'published' },
      include: {
        images: { orderBy: [{ isHero: 'desc' }, { position: 'asc' }] },
        descriptions: true,
        artisan: {
          select: {
            id: true,
            phone: true,
            profile: true
          }
        }
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: { message: 'Published article not found' }
      });
    }

    const profile = article.artisan.profile;
    const desc = article.descriptions.find(d => d.language === lang) ||
                 article.descriptions.find(d => d.language === 'en') ||
                 article.descriptions[0] || {};

    // Prepare WhatsApp wa.me redirect link if public consent is active
    let whatsappLink = null;
    let whatsappNumber = null;
    if (profile?.whatsappPublicConsent && profile?.whatsappNumber) {
      whatsappNumber = profile.whatsappNumber.replace(/[^0-9]/g, '');
      const productTitle = desc.title || article.title || 'this handmade article';
      const currentUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/p/${article.id}`;
      const prefilledText = encodeURIComponent(
        `नमस्ते! I saw "${productTitle}" on Artify (${currentUrl}) and would like to buy it.`
      );
      whatsappLink = `https://wa.me/${whatsappNumber}?text=${prefilledText}`;
    }

    res.json({
      success: true,
      article: {
        id: article.id,
        title: desc.title || article.title,
        tagline: desc.tagline || article.tagline,
        descriptionBody: desc.body || '',
        allDescriptions: article.descriptions,
        category: article.category,
        material: article.material,
        technique: article.technique,
        dimensions: article.dimensions,
        colors: article.colors,
        timeToMake: article.timeToMake,
        uses: article.uses,
        story: article.story,
        care: article.care,
        priceInr: article.priceInr ? Number(article.priceInr) : null,
        images: article.images.map(img => ({
          id: img.id,
          originalUrl: img.originalUrl,
          enhancedUrl: img.enhancedUrl || img.originalUrl,
          isHero: img.isHero,
          isAiEnhanced: img.enhancementMethod !== 'none',
          enhancementMethod: img.enhancementMethod
        })),
        artisan: {
          id: article.artisan.id,
          name: profile?.displayName || 'कारीगर',
          craftType: profile?.craftType,
          bio: profile?.bio,
          yearsExperience: profile?.yearsExperience,
          location: [profile?.village, profile?.city, profile?.state].filter(Boolean).join(', '),
          photoUrl: profile?.photoUrl
        },
        whatsapp: {
          canChat: Boolean(whatsappLink),
          whatsappLink: whatsappLink
        },
        publishedAt: article.publishedAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/artisans/:id - Public artisan profile and their listings
router.get('/artisans/:id', async (req, res, next) => {
  try {
    const artisanId = parseInt(req.params.id, 10);
    const user = await prisma.user.findFirst({
      where: { id: artisanId },
      include: {
        profile: true,
        articles: {
          where: { status: 'published' },
          include: {
            images: { orderBy: [{ isHero: 'desc' }, { position: 'asc' }] },
            descriptions: true
          },
          orderBy: { publishedAt: 'desc' }
        }
      }
    });

    if (!user || !user.profile) {
      return res.status(404).json({ success: false, error: { message: 'Artisan not found' } });
    }

    res.json({
      success: true,
      artisan: {
        id: user.id,
        name: user.profile.displayName,
        craftType: user.profile.craftType,
        bio: user.profile.bio,
        yearsExperience: user.profile.yearsExperience,
        location: [user.profile.village, user.profile.city, user.profile.state].filter(Boolean).join(', '),
        photoUrl: user.profile.photoUrl,
        whatsappConsent: user.profile.whatsappPublicConsent,
        articles: user.articles.map(art => ({
          id: art.id,
          title: art.title,
          tagline: art.tagline,
          priceInr: art.priceInr ? Number(art.priceInr) : null,
          category: art.category,
          heroImage: art.images.find(img => img.isHero) || art.images[0]
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/public/articles/:id/whatsapp-click - Track click
router.post('/articles/:id/whatsapp-click', async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    await prisma.whatsappClick.create({
      data: { articleId }
    });
    res.json({ success: true, message: 'Click tracked' });
  } catch (error) {
    next(error);
  }
});

export default router;
