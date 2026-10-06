import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { apiFetch } from '../lib/api.js';

export const WhatsAppButton = ({ articleId, whatsappLink, className = '' }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!whatsappLink) return;

    setLoading(true);
    try {
      // Track click on backend (as per FR-7.2 & 19.5)
      await apiFetch(`/api/public/articles/${articleId}/whatsapp-click`, {
        method: 'POST'
      }).catch(() => {});
    } finally {
      setLoading(false);
      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (!whatsappLink) {
    return (
      <div className="w-full py-3 px-4 bg-stone-100 text-stone-600 rounded-2xl text-center text-xs font-semibold">
        कारीगर का संपर्क नंबर उपलब्ध नहीं है (WhatsApp not available)
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 transition ${className}`}
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span>कारीगर से व्हाट्सएप पर बात करें (Chat on WhatsApp)</span>
    </button>
  );
};

export default WhatsAppButton;
