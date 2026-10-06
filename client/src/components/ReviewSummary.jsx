import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertTriangle, HelpCircle, IndianRupee } from 'lucide-react';

export const ReviewSummary = ({
  details,
  onChange,
  transcript,
  transcriptEn,
  followUpQuestions = [],
  imageMismatchWarnings = []
}) => {
  const { t } = useTranslation();

  const handleFieldChange = (key, val) => {
    onChange({
      ...details,
      [key]: val
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {/* Transcript Card */}
      {transcript && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-artify-terracotta mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>आपकी आवाज़ का ट्रांसक्रिप्ट (Transcript):</span>
          </div>
          <p className="text-xs text-stone-800 font-medium italic">"{transcript}"</p>
          {transcriptEn && transcriptEn !== transcript && (
            <p className="text-[11px] text-stone-600 mt-1 border-t border-amber-200/50 pt-1">
              English: "{transcriptEn}"
            </p>
          )}
        </div>
      )}

      {/* Warnings & Follow-ups */}
      {imageMismatchWarnings && imageMismatchWarnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-red-800 text-xs shadow-xs">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>चेतावनी: आवाज़ और फोटो में अंतर दिखा (Mismatch Warning):</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-red-700">
            {imageMismatchWarnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {followUpQuestions && followUpQuestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-blue-900 text-xs shadow-xs">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>सुझाए गए प्रश्न (Suggested Details to clarify):</span>
          </div>
          <ul className="space-y-1 text-blue-800">
            {followUpQuestions.map((q, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="font-bold text-blue-600">•</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price Field (Prominent & Required) */}
      <div className="bg-amber-100/60 border-2 border-amber-400/80 rounded-2xl p-3.5 shadow-xs">
        <label className="flex items-center justify-between text-xs font-bold text-amber-950 mb-1">
          <span className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-artify-terracotta" />
            <span>कीमत (Price in INR) *</span>
          </span>
          <span className="text-[10px] text-artify-terracotta font-semibold">पब्लिश करने के लिए अनिवार्य</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 font-bold">₹</span>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="उदा. 750"
            value={details.priceInr || ''}
            onChange={(e) => handleFieldChange('priceInr', e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 bg-white border border-amber-300 rounded-xl text-base font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-inner"
          />
        </div>
      </div>

      {/* Structured Details Form */}
      <div className="space-y-3 bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 border-b pb-2">
          उत्पाद विवरण (Product Attributes)
        </h4>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            {t('wizard.field_category')}
          </label>
          <input
            type="text"
            placeholder="उदा. टेराकोटा / वस्त्र / काष्ठकला"
            value={details.category || ''}
            onChange={(e) => handleFieldChange('category', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            {t('wizard.field_material')}
          </label>
          <input
            type="text"
            placeholder="उदा. प्राकृतिक लाल मिट्टी / शुद्ध सूत"
            value={details.material || ''}
            onChange={(e) => handleFieldChange('material', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            {t('wizard.field_technique')}
          </label>
          <input
            type="text"
            placeholder="उदा. हाथ का चाक / ब्लॉक प्रिंटिंग"
            value={details.technique || ''}
            onChange={(e) => handleFieldChange('technique', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('wizard.field_dimensions')}
            </label>
            <input
              type="text"
              placeholder="उदा. 12 इंच"
              value={details.dimensions || ''}
              onChange={(e) => handleFieldChange('dimensions', e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('wizard.field_time')}
            </label>
            <input
              type="text"
              placeholder="उदा. 3 दिन"
              value={details.timeToMake || ''}
              onChange={(e) => handleFieldChange('timeToMake', e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            {t('wizard.field_story')}
          </label>
          <textarea
            rows="2"
            placeholder="पारंपरिक या सांस्कृतिक महत्व"
            value={details.story || ''}
            onChange={(e) => handleFieldChange('story', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
