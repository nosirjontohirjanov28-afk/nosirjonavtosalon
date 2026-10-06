import React from 'react';
import { Home, Percent, Calculator, ShoppingBag, ClipboardList } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  cartCount: number;
  onSelectTab: (tab: string) => void;
  onOpenCart: () => void;
  onOpenCredit: () => void;
  onOpenOrders: () => void;
  onToggleDiscounts: () => void;
  onlyDiscounts: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  cartCount,
  onSelectTab,
  onOpenCart,
  onOpenCredit,
  onOpenOrders,
  onToggleDiscounts,
  onlyDiscounts
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 flex items-center justify-around">
      <button
        onClick={() => {
          onSelectTab('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer ${
          activeTab === 'all' && !onlyDiscounts ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Katalog</span>
      </button>

      <button
        onClick={onToggleDiscounts}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer ${
          onlyDiscounts ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Percent className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Skitkalar</span>
      </button>

      <button
        onClick={onOpenCredit}
        className="flex flex-col items-center gap-1 p-1.5 text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
      >
        <Calculator className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Kredit</span>
      </button>

      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center gap-1 p-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Savatcha</span>
        {cartCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center tabular-nums">
            {cartCount}
          </span>
        )}
      </button>

      <button
        onClick={onOpenOrders}
        className="flex flex-col items-center gap-1 p-1.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
      >
        <ClipboardList className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Buyurtma</span>
      </button>
    </nav>
  );
};
