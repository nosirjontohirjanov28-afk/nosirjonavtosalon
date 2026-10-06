import React, { useState } from 'react';
import { X, Volume2, ShoppingBag, Check, Shield, Wrench, Award, ChevronRight, PhoneCall, Calendar, Sparkles } from 'lucide-react';
import { Car, CarColor, CarOption, LicensePlate } from '../types';
import { AVAILABLE_OPTIONS, PRESET_LICENSE_PLATES } from '../data/cars';
import { formatPriceDual } from '../utils/formatters';
import { engineSound, getEngineSoundLabel } from '../utils/engineSound';
import { LicensePlateSelector } from './LicensePlateSelector';

interface CarDetailModalProps {
  car: Car | null;
  onClose: () => void;
  currency: 'USD' | 'UZS';
  onAddToCart: (car: Car, selectedColor: CarColor, selectedOptions: CarOption[], selectedPlate?: LicensePlate) => void;
  onOpenCreditModal: (car: Car) => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  currency,
  onAddToCart,
  onOpenCreditModal
}) => {
  if (!car) return null;

  const soundInfo = getEngineSoundLabel(car.engineSoundType);
  const [selectedColor, setSelectedColor] = useState<CarColor>(car.colors[0]);
  const [selectedOptions, setSelectedOptions] = useState<CarOption[]>([]);
  const [selectedPlate, setSelectedPlate] = useState<LicensePlate>(PRESET_LICENSE_PLATES[0]);
  const [isRevving, setIsRevving] = useState(false);
  const [testDriveBooked, setTestDriveBooked] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'options' | 'plate' | 'features'>('specs');

  // Compute total configured price
  const optionsTotalUsd = selectedOptions.reduce((sum, opt) => sum + opt.priceUsd, 0);
  const totalConfiguredUsd = car.priceUsd + optionsTotalUsd + selectedPlate.priceUsd;

  const priceDual = formatPriceDual(totalConfiguredUsd, currency);
  const baseDual = formatPriceDual(car.priceUsd, currency);

  const toggleOption = (option: CarOption) => {
    if (selectedOptions.some((o) => o.id === option.id)) {
      setSelectedOptions(selectedOptions.filter((o) => o.id !== option.id));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleRevSound = () => {
    setIsRevving(true);
    engineSound.playRev(car.engineSoundType);
    setTimeout(() => setIsRevving(false), 2600);
  };

  const handleAddToCart = () => {
    onAddToCart(car, selectedColor, selectedOptions, selectedPlate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close button */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
          <div>
            <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">
              {car.country === 'Uzbekistan' ? '🇺🇿 UzAuto Motors' : `🌍 ${car.country}`} • {car.bodyType}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">{car.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Visual & Color Presentation */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={car.image}
              alt={car.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

            {/* Floating Quick Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {car.discountPercent && (
                <span className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-black shadow-lg">
                  -{car.discountPercent}% CHEGIRMA
                </span>
              )}
              <span className="px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs font-semibold border border-slate-700">
                {car.year}-yil
              </span>
            </div>

            {/* License plate graphic on the car preview */}
            <div className="absolute bottom-4 left-4 bg-white/95 text-black px-3 py-1 rounded border border-zinc-800 shadow-xl flex items-center gap-1.5 font-mono text-xs font-extrabold">
              <span className="w-3.5 h-2 bg-sky-500 rounded-xs inline-block"></span>
              <span className="text-[10px] text-blue-900">UZ</span>
              <span className="border-l border-zinc-400 pl-1">{selectedPlate.fullPlate}</span>
            </div>

            {/* Engine Rev Sound Button */}
            <div className="absolute bottom-4 right-4 max-w-sm">
              <button
                onClick={handleRevSound}
                className={`px-4 py-2.5 rounded-xl backdrop-blur-md text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer shadow-lg ${
                  isRevving
                    ? 'bg-amber-500 text-slate-950 scale-105 shadow-xl shadow-amber-500/50 ring-2 ring-amber-400'
                    : 'bg-slate-950/85 border border-slate-700 text-white hover:border-amber-500 hover:text-amber-400'
                }`}
              >
                <Volume2 className={`w-4 h-4 shrink-0 ${isRevving ? 'animate-bounce text-slate-950' : 'text-amber-400'}`} />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span>{soundInfo.icon}</span>
                    <span>{isRevving ? soundInfo.title : "Ovozini eshitish"}</span>
                  </div>
                  {isRevving && (
                    <div className="text-[10px] text-slate-900 font-semibold truncate max-w-[200px]">
                      {soundInfo.subtitle}
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Color Selector */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-300">
                Mavjud ranglar: <span className="text-white font-bold">{selectedColor.name}</span>
              </span>
              <span className="text-xs text-slate-400">Tanlash uchun bosing</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {car.colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                    selectedColor.name === color.name
                      ? 'border-amber-500 bg-amber-500/10 text-white ring-2 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-600 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs font-medium">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              Texnik ko'rsatkichlar
            </button>
            <button
              onClick={() => setActiveTab('plate')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'plate'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-800/80 text-amber-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Avtoraqam tanlash ({selectedPlate.fullPlate})</span>
            </button>
            <button
              onClick={() => setActiveTab('options')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'options'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              Qo'shimcha jihozlar ({selectedOptions.length})
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'features'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              Qulayliklar & Kafolat
            </button>
          </div>

          {/* Tab 1: Specs */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Dvigatel</span>
                <p className="text-sm font-bold text-white mt-1">{car.specs.engine}</p>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Quvvati</span>
                <p className="text-sm font-bold text-amber-400 mt-1">{car.specs.powerHp} ot kuchi</p>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">0 dan 100 km/s gacha</span>
                <p className="text-sm font-bold text-sky-400 mt-1">{car.specs.acceleration0to100}</p>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Maksimal tezlik</span>
                <p className="text-sm font-bold text-white mt-1">{car.specs.topSpeed}</p>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Uzatmalar qutisi</span>
                <p className="text-sm font-bold text-white mt-1">{car.specs.transmission}</p>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Yoqilg'i turi</span>
                <p className="text-sm font-bold text-white mt-1">{car.specs.fuelType}</p>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Yoqilg'i sarfi</span>
                <p className="text-sm font-bold text-emerald-400 mt-1">{car.specs.fuelConsumption}</p>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Privod (Uzatma)</span>
                <p className="text-sm font-bold text-white mt-1">{car.specs.driveTrain}</p>
              </div>
            </div>
          )}

          {/* Tab 2: License Plate Selection */}
          {activeTab === 'plate' && (
            <LicensePlateSelector
              selectedPlate={selectedPlate}
              onSelectPlate={(pl) => setSelectedPlate(pl)}
              currency={currency}
            />
          )}

          {/* Tab 3: Additional Custom Options */}
          {activeTab === 'options' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Avtomobilingizga zavod yoki salon tomonidan o'rnatiladigan rasmiy qo'shimcha qulayliklarni tanlang:
              </p>
              <div className="space-y-2">
                {AVAILABLE_OPTIONS.map((opt) => {
                  const isChecked = selectedOptions.some((o) => o.id === opt.id);
                  const optPriceDual = formatPriceDual(opt.priceUsd, currency);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleOption(opt)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-slate-950'
                              : 'border-slate-600 bg-slate-900'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 font-bold" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{opt.name}</div>
                          <div className="text-xs text-slate-400">{opt.description}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-extrabold text-amber-400 tabular-nums">
                          +{optPriceDual.primary}
                        </div>
                        <div className="text-[11px] text-slate-400 tabular-nums">
                          {optPriceDual.secondary}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: Features & Warranty */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Avtomobil tavsifi</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{car.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Asosiy qulayliklar</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {car.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-emerald-300 text-xs">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{car.warranty}</span>
              </div>
            </div>
          )}

          {/* Test Drive Reservation Section */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Avtosalonda bepul test-drayv</h4>
                <p className="text-xs text-slate-400">Haydab ko'ring va avtomobil xususiyatlarini shaxsan sinab ko'ring</p>
              </div>
            </div>
            <button
              onClick={() => setTestDriveBooked(true)}
              disabled={testDriveBooked}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                testDriveBooked
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              {testDriveBooked ? "✓ Test-drayvga yozildingiz!" : "Test-drayvga yozilish"}
            </button>
          </div>
        </div>

        {/* Modal Sticky Bottom Purchase Bar */}
        <div className="sticky bottom-0 z-20 px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Davlat raqami: <strong className="text-white font-mono">{selectedPlate.fullPlate}</strong></span>
              {selectedPlate.priceUsd > 0 && <span className="text-amber-400">(+{formatPriceDual(selectedPlate.priceUsd, currency).primary})</span>}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400 tabular-nums">
                {priceDual.primary}
              </span>
              <span className="text-xs text-slate-400 tabular-nums">
                ({priceDual.secondary})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onOpenCreditModal(car)}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Kredit hisoblash
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Savatga qo'shish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
