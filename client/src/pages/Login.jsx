import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, ShieldCheck, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../lib/authContext.jsx';
import LanguagePicker from '../components/LanguagePicker.jsx';

export const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { loginWithDemo, loginWithToken } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Demo artisans quick logins
  const demoAccounts = [
    { name: 'सुनीता देवी (Sunita Devi)', craft: 'Block Print (Rajasthan)', phone: '+919876543201', lang: 'hi' },
    { name: 'गुरप्रीत सिंह (Gurpreet Singh)', craft: 'Phulkari (Punjab)', phone: '+919876543203', lang: 'pa' },
    { name: 'महादेव कांबळे (Mahadev Kamble)', craft: 'Kolhapuri (Maharashtra)', phone: '+919876543204', lang: 'mr' },
    { name: 'முத்துவேல் (Muthuvel Sthapathi)', craft: 'Bronze (Tamil Nadu)', phone: '+919876543205', lang: 'ta' }
  ];

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg('कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें (Enter valid 10-digit phone)');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 600);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setErrorMsg('कृपया 6 अंकों का OTP दर्ज करें (Enter OTP)');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      // In demo/test environment, format token as test_token_<phone>
      const cleanPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      await loginWithDemo(cleanPhone);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'OTP सत्यापन असफल रहा (Verification failed)');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (account) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      i18n.changeLanguage(account.lang);
      await loginWithDemo(account.phone);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-stone-50 to-amber-100/40 flex flex-col justify-between p-4 max-w-md mx-auto">
      {/* Top Bar with Language Selector */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-artify-terracotta font-black text-xl">
          <Sparkles className="w-5 h-5" />
          <span>Artify</span>
        </div>
        <LanguagePicker />
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-200/80 my-auto text-left">
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-artify-terracotta mb-3">
            <Phone className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 leading-tight">
            {t('auth.title')}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {t('auth.subtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Phone / OTP Form */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t('auth.phone_label')}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 font-bold text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-base font-bold text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-artify-terracotta to-amber-600 hover:from-amber-600 hover:to-artify-terracotta text-white rounded-2xl font-bold text-sm shadow-md transition disabled:opacity-50"
            >
              <span>{t('auth.send_otp')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-stone-700">
                  {t('auth.otp_label')}
                </label>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-[11px] text-artify-terracotta underline font-semibold"
                >
                  नंबर बदलें
                </button>
              </div>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-center text-xl tracking-widest font-mono font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[10px] text-stone-600 mt-1">डेमो OTP: कोई भी 6 अंक डालें (e.g. 123456)</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('auth.verify_otp')}</span>
            </button>
          </form>
        )}

        {/* Quick Demo Logins for Hackathon Jurors / Testing */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900/80 mb-2.5">
            <UserCheck className="w-4 h-4 text-artify-terracotta" />
            <span>{t('auth.demo_hint')}</span>
          </div>

          <div className="space-y-1.5">
            {demoAccounts.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => handleQuickDemoLogin(acc)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/60 transition text-left text-xs"
              >
                <div>
                  <div className="font-bold text-stone-900">{acc.name}</div>
                  <div className="text-[10px] text-stone-600">{acc.craft}</div>
                </div>
                <span className="text-[11px] font-bold text-artify-terracotta">प्रवेश करें →</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-stone-600 pb-2">
        Artify • भारत के ग्रामीण कारीगरों का डिजिटल संबल
      </div>
    </div>
  );
};

export default Login;
