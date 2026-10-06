import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BeforeAfterSlider = ({ originalUrl, enhancedUrl, method, onChoose, chosen = 'enhanced' }) => {
  const { t } = useTranslation();
  const [sliderPos, setSliderPos] = useState(50);
  const [activeChoice, setActiveChoice] = useState(chosen);

  const handleChoice = (choice) => {
    setActiveChoice(choice);
    if (onChoose) {
      onChoose(choice);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Visual Comparison Area */}
      <div className="relative w-full aspect-square max-w-sm rounded-2xl overflow-hidden shadow-md border border-stone-200 select-none bg-stone-100">
        {/* Background / Original Image */}
        <img
          src={originalUrl}
          alt="Original Craft Photo"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Foreground / Enhanced Image with Clip-Path */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={enhancedUrl || originalUrl}
            alt="AI Enhanced Craft Photo"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-stone-300 text-stone-700 font-black text-xs">
            ⇄
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-xs font-bold text-artify-terracotta px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('wizard.enhanced')}</span>
        </div>
        <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-xs font-semibold text-white px-2.5 py-1 rounded-full shadow-sm">
          {t('wizard.original')}
        </div>

        {/* Range Slider Overlay */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          aria-label="Compare original and enhanced photo"
        />
      </div>

      <div className="text-xs text-stone-600 font-medium">
        ↔ स्लाइडर खिसकाकर फ़र्क देखें (Drag to compare)
      </div>

      {/* 1-Tap Choice Buttons */}
      <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm mt-1">
        <button
          type="button"
          onClick={() => handleChoice('enhanced')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-sm font-bold transition shadow-xs ${
            activeChoice === 'enhanced'
              ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-400'
              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('wizard.use_enhanced')}</span>
          {activeChoice === 'enhanced' && <Check className="w-4 h-4 ml-auto" />}
        </button>

        <button
          type="button"
          onClick={() => handleChoice('original')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-sm font-semibold transition shadow-xs ${
            activeChoice === 'original'
              ? 'bg-stone-800 text-white border-stone-800 ring-2 ring-stone-400'
              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{t('wizard.use_original')}</span>
          {activeChoice === 'original' && <Check className="w-4 h-4 ml-auto" />}
        </button>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
