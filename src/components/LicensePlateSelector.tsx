import React, { useState } from 'react';
import { Sparkles, Check, Edit3, ShieldAlert } from 'lucide-react';
import { LicensePlate } from '../types';
import { PRESET_LICENSE_PLATES } from '../data/cars';
import { formatPriceDual } from '../utils/formatters';

interface LicensePlateSelectorProps {
  selectedPlate: LicensePlate;
  onSelectPlate: (plate: LicensePlate) => void;
  currency: 'USD' | 'UZS';
}

export const LicensePlateSelector: React.FC<LicensePlateSelectorProps> = ({
  selectedPlate,
  onSelectPlate,
  currency
}) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customRegion, setCustomRegion] = useState('01');
  const [customNumber, setCustomNumber] = useState('777');
  const [customSeries, setCustomSeries] = useState('UZB');

  const handleApplyCustom = () => {
    const num = customNumber.replace(/\D/g, '').slice(0, 3).padStart(3, '0');
    const ser = customSeries.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase().padEnd(3, 'A');
    const reg = customRegion.slice(0, 2);

    const isVipNum = num === '777' || num === '001' || num === '555' || num === '999';
    const priceUsd = isVipNum ? 750 : 350;

    const customPlate: LicensePlate = {
      id: `custom_${reg}_${num}_${ser}`,
      region: reg,
      number: num,
      series: ser,
      fullPlate: `${reg} ${num} ${ser}`,
      category: 'custom',
      priceUsd
    };

    onSelectPlate(customPlate);
  };

  return (
    <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Avtoraqam (Davlat raqamini tanlash)</span>
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">Avtomobilingiz uchun chiroyli davlat raqamini tanlang</h4>
        </div>
        <button
          type="button"
          onClick={() => setIsCustomMode(!isCustomMode)}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isCustomMode ? "Tayyor raqamlarga qaytish" : "O'zingiz xohlagan nomerni yozish"}</span>
        </button>
      </div>

      {/* Realistic 3D Uzbekistan License Plate Preview */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative inline-flex items-center bg-white text-black font-mono font-black border-2 border-zinc-800 rounded-lg shadow-xl px-4 py-2 sm:px-6 sm:py-3 tracking-wider select-none transform hover:scale-105 transition-transform duration-200">
          {/* Left UZ Flag band */}
          <div className="flex flex-col items-center justify-center border-r-2 border-zinc-300 pr-3 mr-3">
            <div className="w-5 h-3 bg-sky-500 border border-zinc-400 flex flex-col justify-between overflow-hidden rounded-xs">
              <div className="h-1 bg-sky-500"></div>
              <div className="h-0.5 bg-red-600"></div>
              <div className="h-1 bg-white"></div>
              <div className="h-0.5 bg-red-600"></div>
              <div className="h-1 bg-emerald-600"></div>
            </div>
            <span className="text-[10px] font-black text-blue-900 mt-0.5 tracking-tight font-sans">UZ</span>
          </div>

          {/* Region code */}
          <div className="text-xl sm:text-2xl font-black text-zinc-900 border-r-2 border-zinc-300 pr-3 mr-3">
            {selectedPlate.region}
          </div>

          {/* Plate Number & Series */}
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 flex items-center gap-2">
            <span>{selectedPlate.number}</span>
            <span>{selectedPlate.series}</span>
          </div>

          {/* Small Hologram Security Stamp */}
          <div className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-gradient-to-tr from-amber-400 to-sky-400 opacity-60"></div>
        </div>

        <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
          <span>Tanlangan raqam: <strong className="text-white font-mono">{selectedPlate.fullPlate}</strong></span>
          <span>•</span>
          <span className="font-bold text-amber-400 tabular-nums">
            {selectedPlate.priceUsd === 0 ? "Standart (BEPUL)" : `+${formatPriceDual(selectedPlate.priceUsd, currency).primary}`}
          </span>
        </div>
      </div>

      {/* Mode 1: Preset VIP & Lucky Plates */}
      {!isCustomMode ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_LICENSE_PLATES.map((plate) => {
            const isSelected = selectedPlate.id === plate.id;
            const priceDual = formatPriceDual(plate.priceUsd, currency);
            return (
              <div
                key={plate.id}
                onClick={() => onSelectPlate(plate)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/30'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-xs text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                    {plate.fullPlate}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 font-bold" />}
                </div>

                <div className="flex items-baseline justify-between text-[11px] pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400 capitalize">{plate.category}</span>
                  <span className={`font-bold tabular-nums ${plate.priceUsd === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {plate.priceUsd === 0 ? "Bepul" : priceDual.primary}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Mode 2: Custom Number Input */
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="text-xs text-slate-300 font-medium">
            O'zingiz istagan 3 xonali raqam va 3 ta harfni kiriting (Masalan: 777 UZB yoki 007 MRB):
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Hudud (Viloyat):</label>
              <select
                value={customRegion}
                onChange={(e) => setCustomRegion(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="01">01 - Toshkent sh.</option>
                <option value="10">10 - Toshkent vil.</option>
                <option value="30">30 - Samarqand</option>
                <option value="40">40 - Farg'ona</option>
                <option value="60">60 - Andijon</option>
                <option value="50">50 - Namangan</option>
                <option value="80">80 - Buxoro</option>
                <option value="90">90 - Xorazm</option>
                <option value="70">70 - Qashqadaryo</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">3 ta raqam:</label>
              <input
                type="text"
                maxLength={3}
                value={customNumber}
                onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="777"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono font-bold text-white text-center focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">3 ta harf:</label>
              <input
                type="text"
                maxLength={3}
                value={customSeries}
                onChange={(e) => setCustomSeries(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                placeholder="AAA"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono font-bold text-white text-center uppercase focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplyCustom}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            Ushbu raqamni biriktirish (+ $350 - $750)
          </button>
        </div>
      )}
    </div>
  );
};
