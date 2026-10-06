import React, { useState } from 'react';
import { Volume2, Heart, ShoppingBag, Eye, Gauge, Zap, Cog } from 'lucide-react';
import { Car } from '../types';
import { formatPriceDual } from '../utils/formatters';
import { engineSound, getEngineSoundLabel } from '../utils/engineSound';

interface CarCardProps {
  car: Car;
  currency: 'USD' | 'UZS';
  onSelect: (car: Car) => void;
  onAddToCart: (car: Car) => void;
  isFavorite: boolean;
  onToggleFavorite: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  currency,
  onSelect,
  onAddToCart,
  isFavorite,
  onToggleFavorite
}) => {
  const [imgError, setImgError] = useState(false);
  const [isRevving, setIsRevving] = useState(false);
  const priceDual = formatPriceDual(car.priceUsd, currency);
  const originalPriceDual = car.originalPriceUsd ? formatPriceDual(car.originalPriceUsd, currency) : null;
  const soundInfo = getEngineSoundLabel(car.engineSoundType);

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRevving(true);
    engineSound.playRev(car.engineSoundType);
    setTimeout(() => setIsRevving(false), 2600);
  };

  return (
    <div
      onClick={() => onSelect(car)}
      className="group bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 flex flex-col cursor-pointer"
    >
      {/* Image Area with 4:3 Ratio */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
        {!imgError ? (
          <img
            src={car.image}
            alt={car.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 text-center">
            <span className="text-3xl mb-2">🚗</span>
            <span className="text-sm font-semibold text-slate-300">{car.name}</span>
            <span className="text-xs text-slate-500 mt-1">{car.brand} • {car.year}</span>
          </div>
        )}

        {/* Gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none"></div>

        {/* Top Floating Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Discount Pill / Stock */}
          <div className="flex items-center gap-1.5">
            {car.discountPercent && (
              <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-black tracking-wide shadow-md">
                -{car.discountPercent}% SKITKA
              </span>
            )}
            {car.inStock <= 3 && (
              <span className="px-2 py-1 rounded-md bg-amber-500/90 text-slate-950 text-[11px] font-bold">
                Qoldi: {car.inStock} dona
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Rev Engine Sound Button */}
            <button
              onClick={handlePlaySound}
              title="Dvigatel ovozini eshitish"
              className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                isRevving
                  ? 'bg-amber-500 text-slate-950 scale-110 shadow-lg shadow-amber-500/50'
                  : 'bg-slate-950/70 text-slate-200 hover:text-amber-400 hover:bg-slate-900/90'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isRevving ? 'animate-bounce' : ''}`} />
            </button>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(car);
              }}
              title="Sevimlilarga qo'shish"
              className="p-2 rounded-xl bg-slate-950/70 text-slate-200 hover:text-rose-400 hover:bg-slate-900/90 backdrop-blur-md transition-all"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Rev Sound Active Overlay */}
        {isRevving && (
          <div className="absolute inset-x-3 bottom-10 z-10 p-2.5 rounded-xl bg-slate-950/95 border border-amber-500/80 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center gap-2">
              <span className="text-base">{soundInfo.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-amber-400 truncate">{soundInfo.title}</div>
                <div className="text-[10px] text-slate-300 truncate">{soundInfo.subtitle}</div>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce"></span>
                <span className="w-1 h-5 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Image Metadata */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <span className="bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur-sm font-medium">
            {car.country === 'Uzbekistan' ? '🇺🇿 UzAuto' : `🌍 ${car.country}`}
          </span>
          <span className="bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur-sm text-slate-400">
            {car.year}-yil
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="mb-2">
            <div className="text-xs text-amber-500/90 font-bold uppercase tracking-wider mb-1">
              {car.brand} • {car.bodyType}
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
              {car.name}
            </h3>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 my-3 text-xs">
            <div className="flex flex-col">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Quvvat
              </span>
              <span className="font-bold text-slate-100 tabular-nums mt-0.5">
                {car.specs.powerHp} ot kuchi
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-sky-400" /> 0-100 km
              </span>
              <span className="font-bold text-slate-100 tabular-nums mt-0.5 truncate">
                {car.specs.acceleration0to100}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 flex items-center gap-1">
                <Cog className="w-3 h-3 text-emerald-400" /> Korobka
              </span>
              <span className="font-bold text-slate-100 mt-0.5 truncate">
                {car.specs.transmission.includes('avtomat') || car.specs.transmission.includes('AT') || car.specs.transmission.includes('Steptronic') ? 'Avtomat' : 'Mexanika'}
              </span>
            </div>
          </div>

          {/* Available Colors Row */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] text-slate-400">Ranglar:</span>
            <div className="flex items-center gap-1.5">
              {car.colors.map((c, i) => (
                <span
                  key={i}
                  title={c.name}
                  className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-sm inline-block"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & CTA footer */}
        <div className="pt-2">
          <div className="mb-3">
            {originalPriceDual && (
              <div className="text-xs text-slate-500 line-through tabular-nums">
                {originalPriceDual.primary}
              </div>
            )}
            <div className="text-xl font-extrabold text-amber-400 tabular-nums">
              {priceDual.primary}
            </div>
            <div className="text-xs text-slate-400 tabular-nums">
              {priceDual.secondary}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(car);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Tafsilotlar</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(car);
              }}
              className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Savatga</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
