import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, Tag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';
import { PROMO_CODES } from '../data/cars';
import { formatPriceDual, formatUsd } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: 'USD' | 'UZS';
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: (appliedPromo: string | undefined, discountUsd: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Calculate items subtotal
  const subtotalUsd = items.reduce((acc, item) => {
    const optionsCost = item.selectedOptions.reduce((oSum, opt) => oSum + opt.priceUsd, 0);
    const plateCost = item.selectedPlate?.priceUsd || 0;
    return acc + (item.car.priceUsd + optionsCost + plateCost) * item.quantity;
  }, 0);

  // Calculate promo discount
  let discountUsd = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const info = PROMO_CODES[appliedPromo];
    if (info.discountPercent) {
      discountUsd = Math.round(subtotalUsd * (info.discountPercent / 100));
    } else if (info.discountUsd) {
      discountUsd = Math.min(info.discountUsd, subtotalUsd);
    }
  }

  const finalTotalUsd = Math.max(0, subtotalUsd - discountUsd);
  const finalPriceDual = formatPriceDual(finalTotalUsd, currency);
  const subtotalDual = formatPriceDual(subtotalUsd, currency);
  const discountDual = formatPriceDual(discountUsd, currency);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError('');
    } else {
      setPromoError("Bunday promokod topilmadi. Masalan: UZAVTO2025 yoki TOSHKENT");
    }
  };

  const handleCheckoutClick = () => {
    onProceedToCheckout(appliedPromo || undefined, discountUsd);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Xarid savatchasi</h3>
                <span className="text-xs text-slate-400">
                  {items.length === 0 ? "Bo'sh" : `${items.length} ta mashina tanlandi`}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-3xl mb-4">
                  🛒
                </div>
                <h4 className="text-base font-bold text-white mb-2">Savatchangiz hozircha bo'sh</h4>
                <p className="text-xs text-slate-400 mb-6 max-w-xs">
                  Katalogdagi istalgan avtomobilni tanlang, rang va qo'shimcha jihozlarni sozlang va savatga qo'shing.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Katalogga o'tish
                </button>
              </div>
            ) : (
              items.map((item) => {
                const optionsTotal = item.selectedOptions.reduce((s, o) => s + o.priceUsd, 0);
                const itemSingleUsd = item.car.priceUsd + optionsTotal;
                const itemTotalUsd = itemSingleUsd * item.quantity;
                const itemDual = formatPriceDual(itemTotalUsd, currency);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3 relative group"
                  >
                    <div className="flex gap-3">
                      <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        <img
                          src={item.car.image}
                          alt={item.car.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-amber-500 font-bold uppercase">
                          {item.car.brand}
                        </div>
                        <h4 className="text-sm font-bold text-white truncate">{item.car.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-600 inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span className="truncate">{item.selectedColor.name}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-400 p-1 transition-colors self-start cursor-pointer"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Selected Plate Badge */}
                    {item.selectedPlate && (
                      <div className="flex items-center justify-between text-xs bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">Avtoraqam:</span>
                          <span className="font-mono font-black text-black bg-white px-2 py-0.5 rounded text-xs border border-zinc-300">
                            {item.selectedPlate.fullPlate}
                          </span>
                        </div>
                        <span className="text-amber-400 font-bold tabular-nums text-xs">
                          {item.selectedPlate.priceUsd === 0 ? "Bepul" : `+$${item.selectedPlate.priceUsd}`}
                        </span>
                      </div>
                    )}

                    {/* Selected Options Summary */}
                    {item.selectedOptions.length > 0 && (
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                        <div className="font-semibold text-slate-400">Qo'shimcha o'rnatilgan jihozlar:</div>
                        {item.selectedOptions.map((opt) => (
                          <div key={opt.id} className="flex justify-between text-slate-300">
                            <span className="truncate mr-2">• {opt.name}</span>
                            <span className="tabular-nums text-amber-400/90 font-medium shrink-0">
                              +${opt.priceUsd}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quantity & Price Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-extrabold text-amber-400 tabular-nums">
                          {itemDual.primary}
                        </div>
                        <div className="text-[11px] text-slate-400 tabular-nums">
                          {itemDual.secondary}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Promo Code Box */}
            {items.length > 0 && (
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Promokod (Skitka):</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      setPromoError('');
                    }}
                    placeholder="UZAVTO2025 yoki TOSHKENT"
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white uppercase placeholder:normal-case placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Qo'llash
                  </button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {PROMO_CODES[appliedPromo].title}
                    </span>
                    <button
                      onClick={() => setAppliedPromo(null)}
                      className="text-slate-400 hover:text-rose-400 underline text-[11px]"
                    >
                      Bekor qilish
                    </button>
                  </div>
                )}
                {promoError && <p className="text-xs text-rose-400">{promoError}</p>}
                <div className="text-[11px] text-slate-400">
                  Sinab ko'ring: <button onClick={() => setPromoInput('UZAVTO2025')} className="text-amber-400 hover:underline">UZAVTO2025</button> yoki <button onClick={() => setPromoInput('TOSHKENT')} className="text-amber-400 hover:underline">TOSHKENT</button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Jami qiymat:</span>
                  <span className="tabular-nums font-semibold text-slate-200">{subtotalDual.primary}</span>
                </div>
                {discountUsd > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Chegirma (Skitka):</span>
                    <span className="tabular-nums">-{discountDual.primary}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Yetkazib berish (O'zbekiston bo'ylab):</span>
                  <span className="text-emerald-400 font-semibold">BEPUL</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white">To'lov uchun:</span>
                  <div className="text-right">
                    <div className="text-xl font-black text-amber-400 tabular-nums">
                      {finalPriceDual.primary}
                    </div>
                    <div className="text-xs text-slate-400 tabular-nums">
                      {finalPriceDual.secondary}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>Buyurtmani rasmiylashtirish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
