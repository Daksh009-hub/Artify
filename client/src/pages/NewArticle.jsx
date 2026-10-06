import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Check, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../lib/api.js';
import PhotoCapture from '../components/PhotoCapture.jsx';
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx';
import VoiceRecorder from '../components/VoiceRecorder.jsx';
import ReviewSummary from '../components/ReviewSummary.jsx';
import DescriptionEditor from '../components/DescriptionEditor.jsx';

export const NewArticle = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id: routeArticleId } = useParams();

  const [step, setStep] = useState(1);
  const [articleId, setArticleId] = useState(routeArticleId !== 'new' ? routeArticleId : null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Step 1: Image data
  const [imageData, setImageData] = useState(null);
  const [chosenImageVersion, setChosenImageVersion] = useState('enhanced');

  // Step 2 & 3: Audio & Extracted data
  const [transcript, setTranscript] = useState('');
  const [transcriptEn, setTranscriptEn] = useState('');
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [imageMismatchWarnings, setImageMismatchWarnings] = useState([]);
  const [details, setDetails] = useState({
    title: '',
    tagline: '',
    category: '',
    material: '',
    technique: '',
    dimensions: '',
    colors: '',
    timeToMake: '',
    uses: '',
    story: '',
    care: '',
    priceInr: ''
  });

  // Step 4: Descriptions
  const [descriptions, setDescriptions] = useState([]);
  const [selectedTone, setSelectedTone] = useState('traditional');
  const [isGenerating, setIsGenerating] = useState(false);

  // If editing existing draft, fetch it
  useEffect(() => {
    if (articleId && articleId !== 'new') {
      const loadArticle = async () => {
        try {
          const res = await apiFetch(`/api/articles/${articleId}`);
          if (res.success && res.article) {
            const art = res.article;
            setDetails({
              title: art.title || '',
              tagline: art.tagline || '',
              category: art.category || '',
              material: art.material || '',
              technique: art.technique || '',
              dimensions: art.dimensions || '',
              colors: art.colors || '',
              timeToMake: art.timeToMake || '',
              uses: art.uses || '',
              story: art.story || '',
              care: art.care || '',
              priceInr: art.priceInr ? String(art.priceInr) : ''
            });
            if (art.images && art.images.length > 0) {
              const img = art.images[0];
              setImageData({
                imageId: img.id,
                originalUrl: img.originalUrl,
                enhancedUrl: img.enhancedUrl,
                method: img.enhancementMethod
              });
            }
            if (art.descriptions) {
              setDescriptions(art.descriptions);
            }
          }
        } catch (err) {
          console.error('Error loading article:', err);
        }
      };
      loadArticle();
    }
  }, [articleId]);

  // Step 1: Photo Upload Handler
  const handlePhotoSelected = async (file, previewUrl) => {
    setErrorMsg(null);
    setLoading(true);

    try {
      let currentId = articleId;
      // 1. Create draft article if not already existing
      if (!currentId || currentId === 'new') {
        const draftRes = await apiFetch('/api/articles', {
          method: 'POST',
          body: JSON.stringify({ spokenLanguage: i18n.language })
        });
        currentId = draftRes.article.id;
        setArticleId(currentId);
      }

      // 2. Upload image & run AI enhancement
      const formData = new FormData();
      formData.append('image', file);

      const uploadRes = await apiFetch(`/api/articles/${currentId}/images`, {
        method: 'POST',
        body: formData
      });

      setImageData({
        imageId: uploadRes.image?.id,
        originalUrl: uploadRes.originalUrl,
        enhancedUrl: uploadRes.enhancedUrl,
        method: uploadRes.method
      });
    } catch (err) {
      console.error('Upload & enhance error:', err);
      setErrorMsg(err.message || 'फोटो प्रोसेस करने में समस्या हुई');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Choose original vs enhanced
  const handleChooseImageVersion = async (choice) => {
    setChosenImageVersion(choice);
    if (articleId && imageData?.imageId) {
      try {
        await apiFetch(`/api/articles/${articleId}/images/${imageData.imageId}/choose`, {
          method: 'POST',
          body: JSON.stringify({ use: choice })
        });
      } catch (err) {
        console.warn('Failed to save image choice:', err);
      }
    }
  };

  // Step 2: Voice Audio Handler
  const handleRecordingComplete = async (audioBlob) => {
    setErrorMsg(null);
    setLoading(true);

    try {
      if (!articleId) {
        throw new Error('Please upload a photo first');
      }

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', i18n.language);

      const res = await apiFetch(`/api/articles/${articleId}/audio`, {
        method: 'POST',
        body: formData
      });

      if (res.success) {
        setTranscript(res.transcript || '');
        setTranscriptEn(res.transcript_en || '');
        setFollowUpQuestions(res.followUpQuestions || []);
        setImageMismatchWarnings(res.imageMismatchWarnings || []);

        if (res.extracted) {
          setDetails(prev => ({
            ...prev,
            category: res.extracted.category || prev.category,
            material: res.extracted.material || prev.material,
            technique: res.extracted.technique || prev.technique,
            dimensions: res.extracted.dimensions || prev.dimensions,
            colors: res.extracted.colors || prev.colors,
            timeToMake: res.extracted.timeToMake || prev.timeToMake,
            uses: res.extracted.uses || prev.uses,
            story: res.extracted.story || prev.story,
            care: res.extracted.care || prev.care,
            priceInr: res.extracted.priceInr ? String(res.extracted.priceInr) : prev.priceInr
          }));
        }

        // Advance to review step
        setStep(3);
      }
    } catch (err) {
      console.error('Audio processing error:', err);
      setErrorMsg(err.message || 'आवाज़ को समझने में समस्या हुई');
    } finally {
      setLoading(false);
    }
  };

  // Step 3 -> 4: Save details & trigger description generation
  const handleProceedToDescriptions = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Save details
      await apiFetch(`/api/articles/${articleId}/details`, {
        method: 'PUT',
        body: JSON.stringify(details)
      });

      // 2. Generate descriptions
      setIsGenerating(true);
      const descRes = await apiFetch(`/api/articles/${articleId}/describe`, {
        method: 'POST',
        body: JSON.stringify({ tone: selectedTone })
      });

      if (descRes.success && descRes.descriptions) {
        setDescriptions(descRes.descriptions);
      }

      setStep(4);
    } catch (err) {
      console.error('Error generating descriptions:', err);
      setErrorMsg(err.message || 'विवरण तैयार करने में समस्या हुई');
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  // Step 4: Regenerate descriptions with new tone
  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const descRes = await apiFetch(`/api/articles/${articleId}/describe`, {
        method: 'POST',
        body: JSON.stringify({ tone: selectedTone })
      });
      if (descRes.success) {
        setDescriptions(descRes.descriptions);
      }
    } catch (err) {
      alert(err.message || 'Regeneration failed');
    } finally {
      setIsGenerating(false);
    }
  };

  // Step 4: Manual description edit
  const handleDescriptionChange = async (lang, updatedDesc) => {
    setDescriptions(prev =>
      prev.map(d => (d.language === lang ? { ...d, ...updatedDesc } : d))
    );

    try {
      await apiFetch(`/api/articles/${articleId}/descriptions/${lang}`, {
        method: 'PUT',
        body: JSON.stringify(updatedDesc)
      });
    } catch (err) {
      console.warn('Auto-save description failed:', err);
    }
  };

  // Publish listing
  const handlePublish = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await apiFetch(`/api/articles/${articleId}/publish`, {
        method: 'POST'
      });

      if (res.success) {
        navigate(`/p/${articleId}?published=true`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'उत्पाद पब्लिश नहीं हो सका');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto text-left">
      {/* Top Navigation & Step Indicator */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
          className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-7 bg-artify-terracotta'
                  : s < step
                  ? 'w-2 bg-emerald-600'
                  : 'w-2 bg-stone-300'
              }`}
            />
          ))}
        </div>

        <span className="text-xs font-bold text-stone-600">
          चरण {step}/4
        </span>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Step 1: Photo Capture */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="text-left">
            <h2 className="text-lg font-black text-stone-900">
              {t('wizard.step1_title')}
            </h2>
            <p className="text-xs text-stone-600">
              {t('wizard.upload_instruction')}
            </p>
          </div>

          {!imageData ? (
            <PhotoCapture onPhotoSelected={handlePhotoSelected} isUploading={loading} />
          ) : (
            <div className="space-y-4">
              <BeforeAfterSlider
                originalUrl={imageData.originalUrl}
                enhancedUrl={imageData.enhancedUrl}
                method={imageData.method}
                chosen={chosenImageVersion}
                onChoose={handleChooseImageVersion}
              />

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-4 bg-artify-terracotta hover:bg-amber-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition"
              >
                <span>आगे बढ़ें: बोलकर बताएं (Next: Voice)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Voice Description */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="text-left">
            <h2 className="text-lg font-black text-stone-900">
              {t('wizard.step2_title')}
            </h2>
            <p className="text-xs text-stone-600">
              {t('wizard.record_instruction')}
            </p>
          </div>

          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            isProcessing={loading}
          />

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-stone-600 font-semibold underline"
            >
              ← फोटो पर वापस जाएं
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs text-artify-terracotta font-bold underline"
            >
              बोलना छोड़ें और सीधे लिखें →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review Details */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="text-left">
            <h2 className="text-lg font-black text-stone-900">
              {t('wizard.step3_title')}
            </h2>
            <p className="text-xs text-stone-600">
              {t('wizard.review_sub')}
            </p>
          </div>

          <ReviewSummary
            details={details}
            onChange={setDetails}
            transcript={transcript}
            transcriptEn={transcriptEn}
            followUpQuestions={followUpQuestions}
            imageMismatchWarnings={imageMismatchWarnings}
          />

          <button
            type="button"
            disabled={loading || !details.priceInr}
            onClick={handleProceedToDescriptions}
            className="w-full py-3.5 px-4 bg-artify-terracotta hover:bg-amber-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <span>विवरण तैयार हो रहा है...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t('wizard.generate_btn')}</span>
              </>
            )}
          </button>

          {!details.priceInr && (
            <p className="text-center text-[11px] text-red-600 font-semibold">
              * कृपया आगे बढ़ने से पहले कीमत (Price) दर्ज करें
            </p>
          )}
        </div>
      )}

      {/* Step 4: Multi-Language Descriptions & Publish */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="text-left">
            <h2 className="text-lg font-black text-stone-900">
              {t('wizard.step4_title')}
            </h2>
            <p className="text-xs text-stone-600">
              3 भाषाओं में विवरण तैयार है। आप चाहें तो संपादित करें और पब्लिश करें।
            </p>
          </div>

          <DescriptionEditor
            descriptions={descriptions}
            spokenLanguage={i18n.language}
            onDescriptionChange={handleDescriptionChange}
            onRegenerate={handleRegenerate}
            selectedTone={selectedTone}
            onToneChange={setSelectedTone}
            isGenerating={isGenerating}
          />

          <button
            type="button"
            disabled={loading}
            onClick={handlePublish}
            className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <span>{t('wizard.publishing')}</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t('wizard.publish_btn')}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewArticle;
