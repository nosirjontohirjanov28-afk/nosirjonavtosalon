import React from 'react';
import { Search, ShieldCheck, Truck, Zap, Percent, SlidersHorizontal } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onlyDiscounts: boolean;
  onToggleOnlyDiscounts: () => void;
  onOpenCreditModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onlyDiscounts,
  onToggleOnlyDiscounts,
  onOpenCreditModal
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80">
      {/* Background Hero with soft overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_dealership_showroom_1791206256371.jpg"
          alt="Avtosalon ko'rgazmasi"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-3xl">
          {/* Subtle announcement kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-4 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            <Percent className="w-3.5 h-3.5" />
            <span>Mavsumiy chegirmalar: 12% gacha arzon narxlar & Avtokredit 18%</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4 text-balance">
            O'zbekiston va Jahon <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">
              Eng Sara Avtomobillari
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-2xl leading-relaxed">
            Lacetti, Cobalt, Gentra, Tracker, shuningdek BMW M5, Mercedes-Benz, Supra va Nissan superkarlari.
            Rasmiy kafolat, yetkazib berish, Payme, Click va naqd to'lov imkoniyati bilan.
          </p>

          {/* Search Bar Input */}
          <div className="bg-slate-900/90 border border-slate-700/80 p-2 rounded-2xl backdrop-blur-md shadow-2xl mb-6">
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Model qidirish: masalan Gentra, Cobalt, Tracker, BMW, Supra..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 text-white placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-slate-800"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 rounded"
                  >
                    Tozalash
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleOnlyDiscounts}
                  className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    onlyDiscounts
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Percent className="w-4 h-4" />
                  <span>Chegirmadagilar</span>
                </button>

                <button
                  onClick={onOpenCreditModal}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                >
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Kredit hisoblash</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Tag Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-3 px-1 border-t border-slate-800/80 mt-2 text-xs">
              <span className="text-slate-400 font-medium mr-1">Tezkor tanlov:</span>
              {[
                { id: 'all', label: 'Barcha modellar' },
                { id: 'Damas', label: '🚐 Damas' },
                { id: 'Qora Gentra', label: '🖤 Qora Gentra' },
                { id: 'Uzbekistan', label: '🇺🇿 UzAuto (Cobalt, Tracker)' },
                { id: 'BMW', label: 'BMW M5' },
                { id: 'Mercedes-Benz', label: 'Mers G63' },
                { id: 'Toyota', label: 'Supra' },
                { id: 'Nissan', label: 'Nissan GT-R' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectCategory(item.id)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === item.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Value Badges (Adjacent Proof) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>O'zbekiston bo'ylab tezkor yetkazib berish</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3-6 yil to'liq rasmiy kafolat</span>
            </div>
            <div className="hidden sm:flex items-center gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <Zap className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Payme, Click va naqd to'lov</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
