import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, PlusCircle, Compass, User, Sparkles } from 'lucide-react';
import LanguagePicker from './LanguagePicker.jsx';

export const Navbar = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-900/10 px-4 py-3 flex items-center justify-between shadow-xs">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-artify-terracotta to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-amber-950 block leading-tight font-sans">
              Artify
            </span>
            <span className="text-[10px] font-semibold text-amber-900/60 uppercase tracking-widest block -mt-0.5">
              शिल्प स्टूडियो
            </span>
          </div>
        </NavLink>

        <div className="flex items-center gap-3">
          <LanguagePicker />
        </div>
      </header>

      {/* Bottom Navigation for Mobile (Sticky & Large Touch Targets) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-amber-900/10 px-2 py-2 flex items-center justify-around shadow-lg md:hidden">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-16 py-1 rounded-xl transition ${
              isActive ? 'text-artify-terracotta font-bold' : 'text-stone-600 hover:text-stone-700'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{t('nav.home')}</span>
        </NavLink>

        <NavLink
          to="/store"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-16 py-1 rounded-xl transition ${
              isActive ? 'text-artify-terracotta font-bold' : 'text-stone-600 hover:text-stone-700'
            }`
          }
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{t('nav.storefront')}</span>
        </NavLink>

        <NavLink
          to="/wizard/new"
          className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-artify-terracotta to-amber-500 text-white rounded-full w-14 h-14 shadow-lg shadow-amber-900/20 hover:scale-105 active:scale-95 transition"
        >
          <PlusCircle className="w-7 h-7" />
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-16 py-1 rounded-xl transition ${
              isActive ? 'text-artify-terracotta font-bold' : 'text-stone-600 hover:text-stone-700'
            }`
          }
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{t('nav.profile')}</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;
