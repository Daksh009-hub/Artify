import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import { apiFetch } from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';

export const Storefront = () => {
  const { t, i18n } = useTranslation();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'सभी (All)',
    'Textiles',
    'Pottery',
    'Metalcraft',
    'Woodwork & Fibre',
    'Footwear & Leather',
    'Jewellery'
  ];

  const states = [
    'सभी राज्य (All States)',
    'Rajasthan',
    'Punjab',
    'Maharashtra',
    'Tamil Nadu',
    'West Bengal',
    'Gujarat',
    'Jammu & Kashmir',
    'Uttar Pradesh'
  ];

  useEffect(() => {
    fetchStorefrontItems();
  }, [category, stateFilter, sort, i18n.language]);

  const fetchStorefrontItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append('q', query.trim());
      if (category && !category.startsWith('सभी')) params.append('category', category);
      if (stateFilter && !stateFilter.startsWith('सभी')) params.append('state', stateFilter);
      if (sort) params.append('sort', sort);
      params.append('lang', i18n.language);

      const res = await apiFetch(`/api/public/articles?${params.toString()}`);
      if (res.success) {
        setArticles(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching storefront:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStorefrontItems();
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-4xl mx-auto text-left">
      {/* Search Header */}
      <div className="mb-4">
        <h1 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <span>{t('storefront.title')}</span>
          <span className="text-xs bg-amber-100 text-artify-terracotta px-2 py-0.5 rounded-full font-bold">
            हस्तनिर्मित
          </span>
        </h1>
        <p className="text-xs text-stone-600 mt-0.5">
          सीधे भारत के ग्रामीण कारीगरों से खरीदें • 0% बिचौलिया
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-3 relative flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600" />
            <input
              type="text"
              placeholder={t('storefront.search_placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-stone-300 rounded-2xl text-xs font-semibold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-2xl border transition flex items-center justify-center ${
              showFilters
                ? 'bg-artify-terracotta text-white border-artify-terracotta'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
            aria-label="Toggle Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Filter Options Drawer */}
      {showFilters && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 mb-4 space-y-3 animate-in fade-in">
          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1">
              श्रेणी (Category)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat === 'सभी (All)' ? '' : cat)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition border ${
                    (category === cat || (!category && cat.startsWith('सभी')))
                      ? 'bg-artify-terracotta text-white border-artify-terracotta'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">
                {t('storefront.filter_state')}
              </label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-stone-300 rounded-xl px-2.5 py-1.5"
              >
                {states.map((st) => (
                  <option key={st} value={st.startsWith('सभी') ? '' : st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">
                {t('storefront.filter_sort')}
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-stone-300 rounded-xl px-2.5 py-1.5"
              >
                <option value="newest">{t('storefront.sort_newest')}</option>
                <option value="price_asc">{t('storefront.sort_price_low')}</option>
                <option value="price_desc">{t('storefront.sort_price_high')}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-stone-600 gap-2">
          <div className="w-8 h-8 border-3 border-artify-terracotta border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium">कलाकृतियां खोजी जा रही हैं...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-10 text-center my-6">
          <p className="text-stone-600 text-xs font-bold">
            कोई उत्पाद नहीं मिला (No craft items found matching filters)
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory('');
              setStateFilter('');
              setQuery('');
            }}
            className="mt-3 text-xs text-artify-terracotta font-bold underline"
          >
            फ़िल्टर हटाएं (Reset Filters)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {articles.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Storefront;
