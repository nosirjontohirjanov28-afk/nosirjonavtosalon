import React from 'react';
import { CheckCircle, Printer, X, Download, Truck, ShieldCheck, MapPin, Calendar, Smartphone, Banknote } from 'lucide-react';
import { Order } from '../types';
import { formatUsd, formatUzs } from '../utils/formatters';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in zoom-in-95 duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Muvaffaqiyatli qabul qilindi!
              </span>
              <h2 className="text-xl font-black text-white">Buyurtma va Shartnoma Cheki</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="p-6 overflow-y-auto space-y-6 print:p-0 print:bg-white print:text-black">
          {/* Status Tracker */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Yetkazib berish holati:</span>
              <span className="text-amber-400 font-bold">Jarayonda (1-2 kun)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="h-1.5 rounded-full bg-emerald-500"></div>
              <div className="h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="h-1.5 rounded-full bg-slate-800"></div>
              <div className="h-1.5 rounded-full bg-slate-800"></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="text-emerald-400 font-medium">1. Rasmiylashtirildi</span>
              <span className="text-emerald-400 font-medium">2. Texnik ko'rik</span>
              <span>3. Evakuatorga yuklash</span>
              <span>4. Manzilga topshirish</span>
            </div>
          </div>

          {/* Receipt Info Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-500">Shartnoma raqami:</span>
                <div className="text-sm font-mono font-bold text-amber-400">{order.orderNumber}</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Sana va vaqt:</span>
                <div className="text-xs font-semibold text-slate-300">{order.date}</div>
              </div>
            </div>

            {/* Customer & Delivery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Xaridor:</span>
                <div className="font-bold text-white text-sm mt-0.5">{order.customer.fullName}</div>
                <div className="text-slate-300 mt-1">{order.customer.phone}</div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Yetkazish manzili:</span>
                <div className="font-bold text-white mt-0.5">
                  {order.customer.deliveryMethod === 'courier'
                    ? `${order.customer.region}, ${order.customer.district || ''} ${order.customer.address}`
                    : 'Toshkent sh., Markaziy Avtosalon (Olib ketish)'}
                </div>
                <div className="text-emerald-400 mt-1">
                  {order.customer.deliveryMethod === 'courier' ? 'Maxsus evakuator orqali' : 'Mijoz o\'zi olib ketadi'}
                </div>
              </div>
            </div>

            {/* Purchased Items */}
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Xarid qilingan avtomobillar:</span>
              {order.items.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{item.car.name} × {item.quantity}</span>
                      {item.selectedPlate && (
                        <span className="font-mono font-black text-black bg-white px-2 py-0.5 rounded text-[11px] border border-zinc-400">
                          {item.selectedPlate.fullPlate}
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.selectedColor.hex }} />
                      <span>{item.selectedColor.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-400 tabular-nums">
                      {formatUsd(((item.car.priceUsd + item.selectedOptions.reduce((s, o) => s + o.priceUsd, 0) + (item.selectedPlate?.priceUsd || 0))) * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Summary */}
            <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>To'lov usuli:</span>
                <span className="font-bold text-white uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>To'lov holati:</span>
                <span className="font-bold text-emerald-400">{order.paymentStatus}</span>
              </div>
              {order.discountUsd > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Qo'llanilgan chegirma:</span>
                  <span className="font-bold">-{formatUsd(order.discountUsd)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
                <span className="text-sm font-bold text-white">To'langan umumiy summa:</span>
                <div className="text-right">
                  <div className="text-lg font-black text-amber-400 tabular-nums">
                    {formatUsd(order.totalUsd)}
                  </div>
                  <div className="text-xs text-slate-400 tabular-nums">
                    {formatUzs(order.totalUsd)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Chekni chop etish</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Tushundim, rahmat!
          </button>
        </div>
      </div>
    </div>
  );
};
