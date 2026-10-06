import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sparkles, CheckCircle2, MapPin, Share2, Award, Heart } from 'lucide-react';
import { apiFetch } from '../lib/api.js';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

export const ProductPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();

  const isJustPublished = searchParams.get('published') === 'true';

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id, i18n.language]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/public/articles/${id}?lang=${i18n.language}`);
      if (res.success && res.article) {
        setArticle(res.article);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href.split('?')[0];
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title || 'Artify Craft',
          text: `Check out this handmade ${article?.title} on Artify!`,
          url: url
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-stone-600 gap-2">
        <div className="w-8 h-8 border-3 border-artify-terracotta border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">लोड हो रहा है...</span>
      </div>
    );
  }

  if (errorMsg || !article) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <p className="text-sm font-bold text-red-600 mb-4">{errorMsg || 'उत्पाद नहीं मिला'}</p>
        <Link to="/store" className="text-xs font-bold text-artify-terracotta underline">
          ← बाज़ार पर वापस जाएं (Back to Crafts)
        </Link>
      </div>
    );
  }

  const activeImage = article.images?.[activeImageIndex] || article.images?.[0];

  return (
    <div className="pb-32 pt-2 px-4 max-w-md mx-auto text-left">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-3">
        <Link to="/store" className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'कॉपी हो गया!' : 'शेयर करें'}</span>
        </button>
      </div>

      {/* Just Published Success Toast */}
      {isJustPublished && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3 text-emerald-900 shadow-sm animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs">बधाई हो! आपका उत्पाद लाइव हो गया है।</h4>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              यह लिंक अब खरीदारों के साथ व्हाट्सएप या सोशल मीडिया पर साझा किया जा सकता है।
            </p>
          </div>
        </div>
      )}

      {/* Image Gallery */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 shadow-md border border-stone-200 mb-3">
        {activeImage && (
          <img
            src={activeImage.enhancedUrl || activeImage.originalUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* AI-Enhanced Photography Tag */}
        {activeImage?.isAiEnhanced && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-xs font-bold text-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Enhanced Photography</span>
          </div>
        )}
      </div>

      {/* Title & Tagline & Price */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-black text-stone-900 leading-tight">
            {article.title}
          </h1>
          <div className="text-right shrink-0">
            <span className="text-xl font-black text-artify-terracotta">
              ₹{article.priceInr ? Number(article.priceInr).toLocaleString('en-IN') : '--'}
            </span>
          </div>
        </div>

        {article.tagline && (
          <p className="text-xs text-stone-600 font-medium">
            {article.tagline}
          </p>
        )}
      </div>

      {/* Artisan Identity Badge */}
      {article.artisan && (
        <Link
          to={`/artisan/${article.artisan.id}`}
          className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-2xl shadow-xs hover:border-amber-400 transition mb-4"
        >
          <div className="w-11 h-11 rounded-full bg-amber-100 overflow-hidden shrink-0">
            {article.artisan.photoUrl ? (
              <img src={article.artisan.photoUrl} alt={article.artisan.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-amber-800 text-sm">
                {article.artisan.name.slice(0, 1)}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs text-stone-900 truncate">{article.artisan.name}</span>
              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            </div>
            <div className="text-[11px] text-stone-600 truncate flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-stone-600 shrink-0" />
              <span>{article.artisan.location || 'भारत'}</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-artify-terracotta">
            प्रोफ़ाइल देखें →
          </span>
        </Link>
      )}

      {/* Detailed Description */}
      {article.descriptionBody && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
            उत्पाद की कहानी और विवरण (The Story)
          </h3>
          <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-line">
            {article.descriptionBody}
          </p>
        </div>
      )}

      {/* Specifications Table */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-2.5 mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 border-b pb-2">
          शिल्प विनिर्देश (Craft Details)
        </h3>

        {article.category && (
          <div className="flex justify-between text-xs py-1 border-b border-stone-100">
            <span className="text-stone-600 font-medium">श्रेणी (Category)</span>
            <span className="text-stone-900 font-bold">{article.category}</span>
          </div>
        )}
        {article.material && (
          <div className="flex justify-between text-xs py-1 border-b border-stone-100">
            <span className="text-stone-600 font-medium">सामग्री (Material)</span>
            <span className="text-stone-900 font-bold">{article.material}</span>
          </div>
        )}
        {article.technique && (
          <div className="flex justify-between text-xs py-1 border-b border-stone-100">
            <span className="text-stone-600 font-medium">तकनीक (Technique)</span>
            <span className="text-stone-900 font-bold">{article.technique}</span>
          </div>
        )}
        {article.dimensions && (
          <div className="flex justify-between text-xs py-1 border-b border-stone-100">
            <span className="text-stone-600 font-medium">आकार (Dimensions)</span>
            <span className="text-stone-900 font-bold">{article.dimensions}</span>
          </div>
        )}
        {article.timeToMake && (
          <div className="flex justify-between text-xs py-1 border-b border-stone-100">
            <span className="text-stone-600 font-medium">बनाने का समय</span>
            <span className="text-stone-900 font-bold">{article.timeToMake}</span>
          </div>
        )}
        {article.care && (
          <div className="flex justify-between text-xs py-1">
            <span className="text-stone-600 font-medium">देखभाल (Care)</span>
            <span className="text-stone-900 font-bold text-right max-w-[200px]">{article.care}</span>
          </div>
        )}
      </div>

      {/* Sticky Bottom "Chat on WhatsApp" Action */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 max-w-md mx-auto shadow-xl">
        <WhatsAppButton
          articleId={article.id}
          whatsappLink={article.whatsapp?.whatsappLink}
        />
      </div>
    </div>
  );
};

export default ProductPage;
