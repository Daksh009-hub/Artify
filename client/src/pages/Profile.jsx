import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, ShieldCheck, Check, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../lib/authContext.jsx';

export const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();

  const [form, setForm] = useState({
    displayName: '',
    craftType: '',
    village: '',
    city: '',
    state: '',
    yearsExperience: '',
    bio: '',
    whatsappNumber: '',
    whatsappPublicConsent: true
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (user?.profile) {
      const p = user.profile;
      setForm({
        displayName: p.displayName || '',
        craftType: p.craftType || '',
        village: p.village || '',
        city: p.city || '',
        state: p.state || '',
        yearsExperience: p.yearsExperience ? String(p.yearsExperience) : '',
        bio: p.bio || '',
        whatsappNumber: p.whatsappNumber || user.phone || '',
        whatsappPublicConsent: Boolean(p.whatsappPublicConsent)
      });
    }
  }, [user]);

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await updateProfile(form);
      setSuccessMsg('प्रोफ़ाइल सफलतापूर्वक सहेजी गई! (Profile saved)');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert(err.message || 'सहेजने में विफलता');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="pb-28 pt-3 px-4 max-w-md mx-auto text-left">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-black text-stone-900">
          {t('profile.title')}
        </h1>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-2.5 py-1.5 rounded-xl transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>लॉगआउट</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-stone-200 rounded-3xl p-5 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {t('profile.name')} *
          </label>
          <input
            type="text"
            required
            value={form.displayName}
            onChange={(e) => handleChange('displayName', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {t('profile.craft_type')}
          </label>
          <input
            type="text"
            placeholder="उदा. ब्लॉक प्रिंटिंग / टेराकोटा"
            value={form.craftType}
            onChange={(e) => handleChange('craftType', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t('profile.village')}
            </label>
            <input
              type="text"
              value={form.village}
              onChange={(e) => handleChange('village', e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t('profile.city')}
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t('profile.state')}
            </label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t('profile.experience')}
            </label>
            <input
              type="number"
              value={form.yearsExperience}
              onChange={(e) => handleChange('yearsExperience', e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {t('profile.bio')}
          </label>
          <textarea
            rows="3"
            value={form.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white resize-none"
          />
        </div>

        <div className="pt-2 border-t border-stone-100">
          <label className="block text-xs font-bold text-amber-950 mb-1">
            {t('profile.whatsapp')} (खरीदारों के लिए)
          </label>
          <input
            type="tel"
            value={form.whatsappNumber}
            onChange={(e) => handleChange('whatsappNumber', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:bg-white"
          />
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold mt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>फोन OTP द्वारा सत्यापित (Verified Number)</span>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="consent"
            checked={form.whatsappPublicConsent}
            onChange={(e) => handleChange('whatsappPublicConsent', e.target.checked)}
            className="mt-0.5 rounded text-artify-terracotta focus:ring-amber-500"
          />
          <label htmlFor="consent" className="text-xs text-stone-700 leading-snug">
            {t('profile.consent')}
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 px-4 bg-artify-terracotta hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
        >
          {saving ? 'सहेज रहे हैं...' : t('profile.save')}
        </button>
      </form>
    </div>
  );
};

export default Profile;
