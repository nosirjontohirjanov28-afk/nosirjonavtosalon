import React from 'react';
import { X, PackageCheck, Truck, Clock, Eye, Printer } from 'lucide-react';
import { Order } from '../types';
import { formatUsd } from '../utils/formatters';

interface OrdersListModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const OrdersListModal: React.FC<OrdersListModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Mening buyurtmalarim</h3>
              <span className="text-xs text-slate-400">Avtomobil xaridlari va yetkazish tarixi</span>
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
        <div className="p-6 overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-3xl mx-auto mb-3">
                📦
              </div>
              <h4 className="text-base font-bold text-white mb-1">Buyurtmalar mavjud emas</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Katalogdan o'zingizga yoqqan avtomobilni tanlang va xarid qiling.
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">{ord.orderNumber}</span>
                    <span className="text-xs text-slate-500 ml-2">· {ord.date}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    {ord.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {ord.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-slate-300">
                      <span>• {it.car.name} ({it.selectedColor.name}) × {it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-400">Summa: </span>
                    <span className="font-bold text-amber-400 tabular-nums">{formatUsd(ord.totalUsd)}</span>
                    <span className="text-slate-500 text-[11px] ml-1">({ord.paymentMethod.toUpperCase()})</span>
                  </div>
                  <button
                    onClick={() => {
                      onSelectOrder(ord);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Chekni ko'rish</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
