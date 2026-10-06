import React, { useState } from 'react';
import { X, Calculator, Percent, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { Car } from '../types';
import { CARS_DATA, USD_TO_UZS_RATE } from '../data/cars';
import { formatUsd, formatUzs } from '../utils/formatters';

interface CreditCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCar?: Car | null;
  onSelectCarForPurchase?: (car: Car) => void;
}

export const CreditCalculatorModal: React.FC<CreditCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialCar,
  onSelectCarForPurchase
}) => {
  if (!isOpen) return null;

  const [selectedCarId, setSelectedCarId] = useState<string>(initialCar?.id || CARS_DATA[0].id);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [loanPeriodMonths, setLoanPeriodMonths] = useState<number>(24);
  const [annualRatePercent] = useState<number>(18); // 18% standard bank auto-loan in UZ
  const [isSubmitted, setIsSubmitted] = useState(false);

  const car = CARS_DATA.find((c) => c.id === selectedCarId) || CARS_DATA[0];

  const totalCarPriceUsd = car.priceUsd;
  const downPaymentUsd = Math.round(totalCarPriceUsd * (downPaymentPercent / 100));
  const principalUsd = totalCarPriceUsd - downPaymentUsd;

  const monthlyRate = (annualRatePercent / 100) / 12;
  const monthlyPaymentUsd = Math.round(
    (principalUsd * (monthlyRate * Math.pow(1 + monthlyRate, loanPeriodMonths))) /
    (Math.pow(1 + monthlyRate, loanPeriodMonths) - 1)
  );

  const totalPaidOverPeriodUsd = downPaymentUsd + (monthlyPaymentUsd * loanPeriodMonths);
  const overpaymentUsd = totalPaidOverPeriodUsd - totalCarPriceUsd;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Avtokredit va Muddatli to'lov kalkulyatori</h3>
              <span className="text-xs text-slate-400">Oylik to'lov va shartlarni aniq hisoblash</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Car Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Avtomobil modelini tanlang:
            </label>
            <select
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
            >
              {CARS_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {formatUsd(c.priceUsd)} ({formatUzs(c.priceUsd)})
                </option>
              ))}
            </select>
          </div>

          {/* Car preview row */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
            <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
              <img
                src={car.image}
                alt={car.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-amber-500 font-bold uppercase">{car.brand}</div>
              <h4 className="text-sm font-bold text-white truncate">{car.name}</h4>
              <div className="text-xs text-slate-400">Narxi: <span className="font-bold text-white tabular-nums">{formatUsd(car.priceUsd)}</span></div>
            </div>
          </div>

          {/* Down Payment Buttons */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Boshlang'ich to'lov foizi:
              </label>
              <span className="text-sm font-bold text-amber-400">{downPaymentPercent}%</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[20, 30, 40, 50].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDownPaymentPercent(pct)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    downPaymentPercent === pct
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
              <span>Boshlang'ich to'lov summasi:</span>
              <span className="font-bold text-white tabular-nums">
                {formatUsd(downPaymentUsd)} ({formatUzs(downPaymentUsd)})
              </span>
            </div>
          </div>

          {/* Loan Period Buttons */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Kredit muddati:
              </label>
              <span className="text-sm font-bold text-purple-400">{loanPeriodMonths} oy ({loanPeriodMonths / 12} yil)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[12, 24, 36].map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => setLoanPeriodMonths(months)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    loanPeriodMonths === months
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {months} oy ({months / 12} yil)
                </button>
              ))}
            </div>
          </div>

          {/* Results Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-950 border border-purple-800/40 space-y-4">
            <div className="text-center pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400">Oylik to'lov miqdori:</span>
              <div className="text-3xl font-black text-amber-400 tabular-nums my-1">
                ~{formatUsd(monthlyPaymentUsd)} <span className="text-sm text-slate-400 font-medium">/ oyiga</span>
              </div>
              <div className="text-xs text-slate-300 tabular-nums">
                ~{formatUzs(monthlyPaymentUsd)} / oyiga
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Kredit summasi:</span>
                <p className="font-bold text-white tabular-nums mt-0.5">{formatUsd(principalUsd)}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Yillik stavka:</span>
                <p className="font-bold text-emerald-400 mt-0.5">{annualRatePercent}% (yillik)</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed">
              * Hamkor banklar: Ipoteka Bank, SQB, Kapitalbank, Hamkorbank. Shartnoma rasmiylashtirish uchun faqat pasport va daromadlar to'g'risida ma'lumotnoma talab qilinadi.
            </div>
          </div>

          {isSubmitted ? (
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Arizangiz qabul qilindi! Bank menejerimiz 15 daqiqa ichida siz bilan bog'lanadi.</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsSubmitted(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Kreditga ariza yuborish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {onSelectCarForPurchase && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectCarForPurchase(car);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                >
                  Ushbu mashinani tanlash
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
