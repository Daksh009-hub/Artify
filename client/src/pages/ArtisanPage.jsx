import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Award, Calendar, CheckCircle } from 'lucide-react';
import { apiFetch } from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';

export const ArtisanPage = () => {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchArtisan();
  }, [id]);

  const fetchArtisan = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/public/artisans/${id}`);
      if (res.success && res.artisan) {
        setArtisan(res.artisan);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Artisan not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-stone-600 gap-2">
        <div className="w-8 h-8 border-3 border-artify-terracotta border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">कारीगर प्रोफ़ाइल लोड हो रही है...</span>
      </div>
    );
  }

  if (errorMsg || !artisan) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <p className="text-sm font-bold text-red-600 mb-4">{errorMsg || 'Artisan not found'}</p>
        <Link to="/store" className="text-xs font-bold text-artify-terracotta underline">
          ← बाज़ार पर वापस जाएं
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto text-left">
      {/* Top Bar */}
      <div className="flex items-center mb-3">
        <Link to="/store" className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Profile Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs mb-6 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-100 overflow-hidden mx-auto mb-3 shadow-sm border-2 border-amber-300">
          {artisan.photoUrl ? (
            <img src={artisan.photoUrl} alt={artisan.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-2xl text-amber-800">
              {artisan.name.slice(0, 1)}
            </div>
          )}
        </div>

        <h1 className="text-lg font-black text-stone-900 flex items-center justify-center gap-1.5">
          <span>{artisan.name}</span>
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
        </h1>

        <p className="text-xs font-bold text-artify-terracotta mt-0.5">
          {artisan.craftType || 'पारंपरिक हस्तशिल्प'}
        </p>

        <div className="flex items-center justify-center gap-4 text-stone-600 text-xs mt-2.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{artisan.location || 'भारत'}</span>
          </span>
          {artisan.yearsExperience && (
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>{artisan.yearsExperience} वर्षों का अनुभव</span>
            </span>
          )}
        </div>

        {artisan.bio && (
          <p className="text-xs text-stone-700 mt-3 pt-3 border-t border-stone-100 leading-relaxed italic text-left">
            "{artisan.bio}"
          </p>
        )}
      </div>

      {/* Artisan's Collection */}
      <div className="mb-4">
        <h2 className="text-sm font-black text-stone-900 mb-3">
          कारीगर की कलाकृतियां ({artisan.articles?.length || 0})
        </h2>

        {(!artisan.articles || artisan.articles.length === 0) ? (
          <p className="text-xs text-stone-600 text-center py-6">
            वर्तमान में कोई लाइव उत्पाद उपलब्ध नहीं है।
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {artisan.articles.map((item) => (
              <ProductCard key={item.id} product={item} showArtisan={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanPage;
