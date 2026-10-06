import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, IndianRupee } from 'lucide-react';

export const ProductCard = ({ product, showArtisan = true }) => {
  const heroUrl = product.heroImage?.enhancedUrl || product.heroImage?.originalUrl || product.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800';
  const isAiEnhanced = product.heroImage?.isAiEnhanced ?? true;

  return (
    <Link
      to={`/p/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-amber-300 shadow-xs hover:shadow-md transition duration-200"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <img
          src={heroUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
          loading="lazy"
        />

        {/* AI-Enhanced Badge (FR-3.5 & 19.6 Rule 6) */}
        {isAiEnhanced && (
          <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>AI-Enhanced</span>
          </div>
        )}

        {/* Category Pill */}
        {product.category && (
          <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-stone-800 px-2 py-0.5 rounded-md shadow-xs">
            {product.category}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between text-left">
        <div>
          <h3 className="font-bold text-sm text-stone-900 line-clamp-1 group-hover:text-artify-terracotta transition">
            {product.title}
          </h3>
          {product.tagline && (
            <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
              {product.tagline}
            </p>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline text-stone-900 font-extrabold text-base">
            <span className="text-xs mr-0.5 text-stone-600 font-bold">₹</span>
            <span>{product.priceInr ? Number(product.priceInr).toLocaleString('en-IN') : '--'}</span>
          </div>

          {showArtisan && product.artisan && (
            <div className="text-[11px] text-stone-600 text-right line-clamp-1 max-w-[140px]">
              <span className="font-semibold text-stone-700">{product.artisan.name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
