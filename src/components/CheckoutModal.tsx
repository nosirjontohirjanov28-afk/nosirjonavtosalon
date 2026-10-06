import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Building2,
  ArrowRight,
  Phone,
  User,
  MapPin,
  Lock,
  Percent,
  Clock,
  Smartphone
} from 'lucide-react';
import { CartItem, OrderCustomerInfo, PaymentMethod, Order } from '../types';
import { UZBEKISTAN_REGIONS, USD_TO_UZS_RATE } from '../data/cars';
import { formatPriceDual, formatUzs, formatUsd } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: 'USD' | 'UZS';
  promoCode?: string;
  discountUsd: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  promoCode,
  discountUsd,
  onOrderSuccess
}) => {
  if (!isOpen || items.length === 0) return null;

  // Form states
  const [customer, setCustomer] = useState<OrderCustomerInfo>({
    fullName: '',
    phone: '+998 ',
    region: 'Toshkent shahri',
    district: '',
    address: '',
    deliveryMethod: 'courier',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('payme');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpire, setCardExpire] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Credit calculation params
  const [creditDownPaymentPercent, setCreditDownPaymentPercent] = useState<number>(30);
  const [creditPeriodMonths, setCreditPeriodMonths] = useState<number>(24);

  // Calculations
  const subtotalUsd = items.reduce((acc, item) => {
    const optionsCost = item.selectedOptions.reduce((oSum, opt) => oSum + opt.priceUsd, 0);
    const plateCost = item.selectedPlate?.priceUsd || 0;
    return acc + (item.car.priceUsd + optionsCost + plateCost) * item.quantity;
  }, 0);

  const totalUsd = Math.max(0, subtotalUsd - discountUsd);
  const totalUzs = totalUsd * USD_TO_UZS_RATE;

  // Credit details
  const downPaymentUsd = Math.round(totalUsd * (creditDownPaymentPercent / 100));
  const loanPrincipalUsd = totalUsd - downPaymentUsd;
  // 18% annual interest
  const monthlyRate = 0.18 / 12;
  const monthlyPaymentUsd = Math.round(
    (loanPrincipalUsd * (monthlyRate * Math.pow(1 + monthlyRate, creditPeriodMonths))) /
    (Math.pow(1 + monthlyRate, creditPeriodMonths) - 1)
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!customer.fullName.trim() || customer.fullName.trim().length < 3) {
      newErrors.fullName = 'Iltimos, to\'liq ism-familiyangizni kiriting';
    }
    if (!customer.phone.trim() || customer.phone.replace(/\D/g, '').length < 9) {
      newErrors.phone = 'Telefon raqamingizni to\'liq kiriting (masalan: +998 90 123 45 67)';
    }
    if (customer.deliveryMethod === 'courier' && (!customer.address.trim() || customer.address.trim().length < 5)) {
      newErrors.address = 'Yetkazib berish ko\'chasi va uy manzilini yozing';
    }
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = '16 xonali karta raqamini kiriting';
      }
      if (cardExpire.replace(/\D/g, '').length < 4) {
        newErrors.cardExpire = 'Muddati (MM/YY)';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormatCard = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : raw);
  };

  const handleFormatExpire = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setCardExpire(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpire(raw);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate realistic bank / payment system processing
    setTimeout(() => {
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      const contractNum = `UZ-AVTO-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const dateFormatted = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      let paymentStatus: Order['paymentStatus'] = 'To\'langan';
      if (paymentMethod === 'cash') {
        paymentStatus = 'Naqd to\'lanadi';
      } else if (paymentMethod === 'credit') {
        paymentStatus = 'Kredit tasdiqlandi';
      }

      const newOrder: Order = {
        id: orderId,
        orderNumber: contractNum,
        date: dateFormatted,
        customer,
        items,
        paymentMethod,
        paymentDetails: {
          cardNumber: cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : undefined,
          paidAmountUzs: totalUzs,
          initialPaymentUzs: paymentMethod === 'credit' ? downPaymentUsd * USD_TO_UZS_RATE : undefined,
          monthlyPaymentUzs: paymentMethod === 'credit' ? monthlyPaymentUsd * USD_TO_UZS_RATE : undefined,
          months: paymentMethod === 'credit' ? creditPeriodMonths : undefined
        },
        promoCode,
        discountUsd,
        totalUsd,
        totalUzs,
        status: 'Qabul qilindi',
        paymentStatus
      };

      setIsProcessing(false);
      onOrderSuccess(newOrder);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Xaridni rasmiylashtirish</h2>
              <span className="text-xs text-slate-400">Buyurtma va to'lov ma'lumotlari</span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Selected Cars Summary */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Buyurtma tarkibi ({items.length} ta mashina)
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/60 last:border-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: it.selectedColor.hex }}
                    />
                    <span className="font-semibold text-white truncate">{it.car.name}</span>
                    {it.selectedPlate && (
                      <span className="font-mono font-bold text-black bg-white px-1.5 py-0.5 rounded text-[10px] shrink-0">
                        {it.selectedPlate.fullPlate}
                      </span>
                    )}
                    <span className="text-slate-400">× {it.quantity}</span>
                  </div>
                  <span className="font-bold text-amber-400 tabular-nums shrink-0 ml-2">
                    {formatUsd(((it.car.priceUsd + it.selectedOptions.reduce((s, o) => s + o.priceUsd, 0) + (it.selectedPlate?.priceUsd || 0))) * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Customer Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">1</span>
              <span>Xaridor ma'lumotlari</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ism va familiyangiz (Passport bo'yicha) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  placeholder="Masalan: Jamshid Aliyev"
                  className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                    errors.fullName ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {errors.fullName && <p className="text-xs text-rose-400 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Telefon raqamingiz *</span>
                </label>
                <input
                  type="text"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="+998 (90) 123-45-67"
                  className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                    errors.phone ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Address & Method */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">2</span>
              <span>Yetkazib berish usuli va manzili</span>
            </div>

            {/* Delivery Method Choice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setCustomer({ ...customer, deliveryMethod: 'courier' })}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  customer.deliveryMethod === 'courier'
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Truck className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Evakuator orqali eshikkacha</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">Toshkent va viloyatlarga BEPUL</div>
                </div>
              </div>

              <div
                onClick={() => setCustomer({ ...customer, deliveryMethod: 'pickup' })}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  customer.deliveryMethod === 'pickup'
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Building2 className="w-6 h-6 text-sky-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Avtosalondan olib ketish</div>
                  <div className="text-[11px] text-slate-400">Toshkent sh., Amir Temur shox ko'chasi 45</div>
                </div>
              </div>
            </div>

            {/* Address fields */}
            {customer.deliveryMethod === 'courier' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> Viloyat / Shahar *
                  </label>
                  <select
                    value={customer.region}
                    onChange={(e) => setCustomer({ ...customer, region: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {UZBEKISTAN_REGIONS.map((reg) => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tuman yoki Shahar nomi *
                  </label>
                  <input
                    type="text"
                    value={customer.district}
                    onChange={(e) => setCustomer({ ...customer, district: e.target.value })}
                    placeholder="Masalan: Yunusobod tumani"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ko'cha, uy raqami / Mo'ljal *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="Masalan: Amir Temur ko'chasi 14-uy"
                    className={`w-full px-3 py-2 bg-slate-900 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 ${
                      errors.address ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                  {errors.address && <p className="text-xs text-rose-400 mt-1">{errors.address}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Payment Method */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">3</span>
              <span>To'lov usuli (Payme, Click, Bank kartalari, Naqd, Kredit)</span>
            </div>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Payme */}
              <button
                type="button"
                onClick={() => setPaymentMethod('payme')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'payme'
                    ? 'border-cyan-400 bg-cyan-950/20 ring-2 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-cyan-400 text-base tracking-wider">Payme</span>
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-[11px] text-slate-400">1 marta bosishda to'lov</div>
              </button>

              {/* Click */}
              <button
                type="button"
                onClick={() => setPaymentMethod('click')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'click'
                    ? 'border-blue-500 bg-blue-950/20 ring-2 ring-blue-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-blue-400 text-base tracking-wider">CLICK</span>
                  <Smartphone className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-[11px] text-slate-400">Click Evolution & USSD</div>
              </button>

              {/* Uzum Pay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('uzum')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'uzum'
                    ? 'border-violet-500 bg-violet-950/20 ring-2 ring-violet-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-violet-400 text-base tracking-wider">Uzum Pay</span>
                  <Smartphone className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-[11px] text-slate-400">Uzum Bank orqali 0%</div>
              </button>

              {/* Plastic Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">Plastik karta</span>
                  <CreditCard className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-[11px] text-slate-400">Uzcard, Humo, Visa, MC</div>
              </button>

              {/* Cash On Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">Naqd to'lash</span>
                  <Banknote className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-[11px] text-slate-400">Mashina yetganda naqd</div>
              </button>

              {/* Auto Loan / Installment */}
              <button
                type="button"
                onClick={() => setPaymentMethod('credit')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'credit'
                    ? 'border-purple-500 bg-purple-950/20 ring-2 ring-purple-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">Avtokredit</span>
                  <Percent className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-[11px] text-slate-400">12-36 oy muddatli to'lov</div>
              </button>
            </div>

            {/* Dynamic Payment Detail Form */}
            {paymentMethod === 'payme' && (
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-black">
                  P
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Payme orqali to'lov</div>
                  <div className="text-xs text-slate-300">
                    "Buyurtma berish" tugmasini bosganingizdan so'ng, Payme ilovangizga xavfsiz to'lov so'rovi yuboriladi.
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'click' && (
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 font-black">
                  C
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Click Evolution to'lovi</div>
                  <div className="text-xs text-slate-300">
                    Telefon raqamingizga bir martalik SMS tasdiqlash kodi yuboriladi.
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'uzum' && (
              <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-800/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 font-black">
                  U
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Uzum Bank / Uzum Nasiya</div>
                  <div className="text-xs text-slate-300">
                    Uzum ilovasi orqali to'g'ridan-to'g'ri yoki 12 oygacha bo'lib to'lash imkoniyati.
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Plastik karta ma'lumotlari:</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>256-bit SSL shifrlash</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Karta raqami (16 xonali) *</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => handleFormatCard(e.target.value)}
                    placeholder="8600 0000 0000 0000 yoki 9860..."
                    className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 ${
                      errors.cardNumber ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                  {errors.cardNumber && <p className="text-xs text-rose-400 mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Amal qilish muddati *</label>
                    <input
                      type="text"
                      value={cardExpire}
                      onChange={(e) => handleFormatExpire(e.target.value)}
                      placeholder="MM/YY"
                      className={`w-full px-3 py-2 bg-slate-900 border rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 ${
                        errors.cardExpire ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Karta egasining ismi</label>
                    <input
                      type="text"
                      placeholder="NOMI (Lotin harflarida)"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs uppercase text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Avtomobilni ko'rib naqd to'lash</div>
                  <div className="text-xs text-slate-300">
                    Avtomobil evakuatorda yetkazib berilganda yoki avtosalonga kelganingizda to'liq tekshirib, naqd so'm yoki AQSh dollarida to'lashingiz mumkin.
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'credit' && (
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/50 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Avtokredit shartlari (Yillik 18%):</span>
                  <span className="text-purple-400">Hamkor banklar orqali</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Boshlang'ich to'lov:</label>
                    <select
                      value={creditDownPaymentPercent}
                      onChange={(e) => setCreditDownPaymentPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                    >
                      <option value={20}>20% ({formatUsd(totalUsd * 0.2)})</option>
                      <option value={30}>30% ({formatUsd(totalUsd * 0.3)})</option>
                      <option value={40}>40% ({formatUsd(totalUsd * 0.4)})</option>
                      <option value={50}>50% ({formatUsd(totalUsd * 0.5)})</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Kredit muddati:</label>
                    <select
                      value={creditPeriodMonths}
                      onChange={(e) => setCreditPeriodMonths(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                    >
                      <option value={12}>12 oy (1 yil)</option>
                      <option value={24}>24 oy (2 yil)</option>
                      <option value={36}>36 oy (3 yil)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-purple-950/60 rounded-xl border border-purple-800/40 text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Boshlang'ich to'lov miqdori:</span>
                    <span className="font-bold text-white tabular-nums">{formatUsd(downPaymentUsd)} ({formatUzs(downPaymentUsd)})</span>
                  </div>
                  <div className="flex justify-between text-purple-300 font-bold">
                    <span>Taxminiy oylik to'lov:</span>
                    <span className="text-amber-400 tabular-nums">~{formatUsd(monthlyPaymentUsd)} / oyiga</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Total & Submit Button */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Jami to'lov miqdori:</span>
                <div className="text-2xl font-black text-amber-400 tabular-nums">
                  {formatPriceDual(totalUsd, currency).primary}
                </div>
                <div className="text-xs text-slate-400 tabular-nums">
                  {formatPriceDual(totalUsd, currency).secondary}
                </div>
              </div>

              <div className="text-right text-xs text-slate-400">
                <div>Yetkazish: <span className="text-emerald-400 font-bold">0 so'm</span></div>
                <div>Kafolat: <span className="text-slate-200">100% rasmiy</span></div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-2xl text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/25 active:scale-98 cursor-pointer ${
                isProcessing
                  ? 'bg-amber-600 opacity-80 cursor-wait'
                  : 'bg-amber-500 hover:bg-amber-400'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Buyurtma rasmiylashtirilmoqda va bank tekshiruvi...</span>
                </>
              ) : (
                <>
                  <span>Xaridni tasdiqlash & Buyurtma berish</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
