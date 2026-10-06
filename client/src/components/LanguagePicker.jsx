import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { languages } from '../i18n/index.js';

export const LanguagePicker = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/80 hover:bg-amber-200/80 text-amber-950 text-sm font-semibold transition border border-amber-300/60 shadow-sm"
        aria-label="Change Language"
      >
        <Globe className="w-4 h-4 text-artify-terracotta" />
        <span>{currentLang.label}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl ring-1 ring-black/10 py-2 z-50 animate-in fade-in zoom-in-95">
            <div className="px-3 py-1 text-xs font-bold text-stone-600 uppercase tracking-wider border-b border-stone-100">
              भाषा चुनें / Select Language
            </div>
            {languages.map((lang) => {
              const isSelected = i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium transition ${
                    isSelected ? 'bg-amber-50 text-artify-terracotta font-bold' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-sm">{lang.label}</span>
                    <span className="text-xs text-stone-600">{lang.scriptName}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-artify-terracotta" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguagePicker;
