import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, Sparkles, RefreshCw } from 'lucide-react';

export const DescriptionEditor = ({
  descriptions = [],
  spokenLanguage = 'hi',
  onDescriptionChange,
  onRegenerate,
  selectedTone = 'traditional',
  onToneChange,
  isGenerating = false
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(spokenLanguage);
  const [isPlaying, setIsPlaying] = useState(false);

  const tones = [
    { id: 'traditional', label: t('wizard.tone_traditional') },
    { id: 'simple', label: t('wizard.tone_simple') },
    { id: 'premium', label: t('wizard.tone_premium') }
  ];

  // Available language tabs
  const tabLangs = Array.from(new Set([spokenLanguage, 'en', 'hi'])).filter(Boolean);

  const currentDesc = descriptions.find(d => d.language === activeTab) || {
    title: '',
    tagline: '',
    body: ''
  };

  const handleFieldChange = (field, val) => {
    onDescriptionChange(activeTab, {
      ...currentDesc,
      [field]: val
    });
  };

  // Text-To-Speech read aloud (FR-6.5)
  const speakText = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToRead = `${currentDesc.title || ''}. ${currentDesc.tagline || ''}. ${currentDesc.body || ''}`;
    if (!textToRead.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = activeTab === 'en' ? 'en-US' : 'hi-IN';
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {/* Tone Selection */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 shadow-xs">
        <label className="block text-xs font-bold text-amber-950 mb-2">
          {t('wizard.choose_tone')}:
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {tones.map((tone) => (
            <button
              key={tone.id}
              type="button"
              disabled={isGenerating}
              onClick={() => onToneChange(tone.id)}
              className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition border ${
                selectedTone === tone.id
                  ? 'bg-artify-terracotta text-white border-artify-terracotta shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {tone.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Language Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-1">
        <div className="flex gap-2">
          {tabLangs.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveTab(lang)}
              className={`pb-2 px-2 text-xs font-bold transition border-b-2 -mb-[6px] ${
                activeTab === lang
                  ? 'border-artify-terracotta text-artify-terracotta'
                  : 'border-transparent text-stone-600 hover:text-stone-700'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी (Hindi)' : lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Listen Button (FR-6.5) */}
        <button
          type="button"
          onClick={speakText}
          className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition shadow-xs ${
            isPlaying
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
          }`}
          title="सुनें (Listen)"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isPlaying ? 'रोकें' : 'सुनें'}</span>
        </button>
      </div>

      {/* Content Form */}
      <div className="space-y-3 bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            शीर्षक (Title)
          </label>
          <input
            type="text"
            value={currentDesc.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            टैगलाइन (Tagline)
          </label>
          <input
            type="text"
            value={currentDesc.tagline || ''}
            onChange={(e) => handleFieldChange('tagline', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            विस्तृत विवरण (Description Body)
          </label>
          <textarea
            rows="6"
            value={currentDesc.body || ''}
            onChange={(e) => handleFieldChange('body', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:bg-white leading-relaxed resize-none"
          />
        </div>

        {/* Regenerate with different tone button */}
        <button
          type="button"
          disabled={isGenerating}
          onClick={onRegenerate}
          className="flex items-center justify-center gap-1.5 w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>दोबारा तैयार करें (Regenerate with selected tone)</span>
        </button>
      </div>
    </div>
  );
};

export default DescriptionEditor;
