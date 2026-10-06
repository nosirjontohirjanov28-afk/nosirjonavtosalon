import React from 'react';
import { ShoppingBag, Calculator, Sparkles, Heart } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenCreditModal: () => void;
  onOpenOrdersModal: () => void;
  currency: 'USD' | 'UZS';
  onToggleCurrency: () => void;
  activeFilter: string;
  onSelectCategory: (cat: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenCreditModal,
  onOpenOrdersModal,
  currency,
  onToggleCurrency,
  onSelectCategory,
  favoritesCount,
  onOpenFavorites
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-white hover:text-amber-400 transition-colors flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-pulse"></span>
          <span>AVTOBOZOR<span className="text-amber-500">.UZ</span></span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 480, behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Barcha mashinalar
          </button>
          <button
            onClick={() => {
              onSelectCategory('Damas');
              window.scrollTo({ top: 480, behavior: 'smooth' });
            }}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            🚐 Damas
          </button>
          <button
            onClick={() => {
              onSelectCategory('Qora Gentra');
              window.scrollTo({ top: 480, behavior: 'smooth' });
            }}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            🖤 Qora Gentra
          </button>
          <button
            onClick={() => {
              onSelectCategory('Uzbekistan');
              window.scrollTo({ top: 480, behavior: 'smooth' });
            }}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            UzAuto (Cobalt, Tracker)
          </button>
          <button
            onClick={() => {
              onSelectCategory('Xorijiy');
              window.scrollTo({ top: 480, behavior: 'smooth' });
            }}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Xorijiy (BMW, Mers, Supra)
          </button>
          <button
            onClick={onOpenCreditModal}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Kredit</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Toggle */}
          <button
            onClick={onToggleCurrency}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:border-amber-500/50 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            title="Valyutani o'zgartirish"
          >
            <span className={currency === 'USD' ? 'text-amber-400 font-bold' : 'text-slate-400'}>$ USD</span>
            <span className="text-slate-600">/</span>
            <span className={currency === 'UZS' ? 'text-amber-400 font-bold' : 'text-slate-400'}>SO'M</span>
          </button>

          {/* Favorites Button */}
          {favoritesCount > 0 && (
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
              title="Tanlanganlar"
            >
              <Heart className="w-5 h-5 fill-rose-500/20 text-rose-500" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {favoritesCount}
              </span>
            </button>
          )}

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Savatcha</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 text-xs font-black flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
