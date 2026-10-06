import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Sparkles, Eye, Trash2, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../lib/authContext.jsx';
import { apiFetch } from '../lib/api.js';

export const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'published' | 'draft'

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/articles/mine');
      if (res.success) {
        setArticles(res.articles || []);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('क्या आप इस उत्पाद को हटाना चाहते हैं? (Delete article?)')) return;

    try {
      await apiFetch(`/api/articles/${id}`, { method: 'DELETE' });
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert(err.message || 'हटाने में विफलता हुई');
    }
  };

  const filteredArticles = articles.filter(a => {
    if (filterTab === 'published') return a.status === 'published';
    if (filterTab === 'draft') return a.status === 'draft';
    return true;
  });

  const displayName = user?.profile?.displayName || 'कारीगर साथी';

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto text-left">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-tr from-amber-700 via-amber-600 to-artify-terracotta rounded-3xl p-5 text-white shadow-lg relative overflow-hidden mb-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>डिजिटल शिल्प स्टूडियो</span>
          </div>
          <h1 className="text-xl font-black">
            {t('home.welcome')}, {displayName}
          </h1>
          <p className="text-xs text-amber-100 mt-0.5">
            {user?.profile?.craftType || 'पारंपरिक हस्तशिल्प'} • {user?.profile?.state || 'भारत'}
          </p>

          <Link
            to="/wizard/new"
            className="mt-4 inline-flex items-center gap-2 bg-white text-artify-terracotta hover:bg-amber-50 active:scale-95 font-black text-xs px-4 py-2.5 rounded-2xl shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('home.add_article_btn')}</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-4">
        <h2 className="text-sm font-black text-stone-900">
          {t('home.my_listings')} ({articles.length})
        </h2>

        <div className="flex gap-1 bg-stone-100 p-0.5 rounded-xl">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
              filterTab === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            सभी
          </button>
          <button
            onClick={() => setFilterTab('published')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
              filterTab === 'published' ? 'bg-white text-emerald-700 shadow-xs' : 'text-stone-600'
            }`}
          >
            लाइव
          </button>
          <button
            onClick={() => setFilterTab('draft')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
              filterTab === 'draft' ? 'bg-white text-amber-700 shadow-xs' : 'text-stone-600'
            }`}
          >
            ड्राफ्ट
          </button>
        </div>
      </div>

      {/* Articles List */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-stone-600 gap-2">
          <div className="w-6 h-6 border-2 border-artify-terracotta border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">लोड हो रहा है...</span>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-8 text-center my-6">
          <div className="w-14 h-14 bg-amber-50 text-artify-terracotta rounded-full flex items-center justify-center mx-auto mb-3">
            <PlusCircle className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-sm text-stone-800">
            {t('home.no_articles')}
          </h3>
          <Link
            to="/wizard/new"
            className="mt-4 inline-flex items-center gap-1.5 bg-artify-terracotta text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>पहला उत्पाद जोड़ें</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((art) => {
            const hero = art.images?.[0];
            const isLive = art.status === 'published';

            return (
              <div
                key={art.id}
                onClick={() => navigate(isLive ? `/p/${art.id}` : `/wizard/${art.id}`)}
                className="bg-white border border-stone-200 hover:border-amber-400 rounded-2xl p-3 flex gap-3 shadow-xs hover:shadow-md transition cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 relative">
                  {hero ? (
                    <img
                      src={hero.enhancedUrl || hero.originalUrl}
                      alt={art.title || 'Artisan product'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-600">
                      फोटो नहीं
                    </div>
                  )}

                  {/* Status Tag */}
                  <div className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                    isLive ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {isLive ? 'लाइव' : 'ड्राफ्ट'}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="font-bold text-xs text-stone-900 truncate">
                      {art.title || 'शीर्षक विहीन ड्राफ्ट'}
                    </h3>
                    <p className="text-[11px] text-stone-600 truncate mt-0.5">
                      {art.tagline || art.material || 'विवरण अधूरा है'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-xs font-extrabold text-stone-900">
                      ₹{art.priceInr ? Number(art.priceInr).toLocaleString('en-IN') : '--'}
                    </span>

                    <div className="flex items-center gap-2">
                      {isLive && (
                        <Link
                          to={`/p/${art.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-lg text-stone-600 hover:text-artify-terracotta transition"
                          title="पब्लिक पेज देखें"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleDelete(art.id, e)}
                        className="p-1 rounded-lg text-stone-600 hover:text-red-600 transition"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
