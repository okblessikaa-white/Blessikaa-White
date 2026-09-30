import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RefreshCw,
  ShoppingCart,
  PhoneCall,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Package,
  Clock,
} from 'lucide-react';
import { MedicineItem } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface RefillModalProps {
  medicines: MedicineItem[];
  defaultMedicine?: MedicineItem | null;
  onUpdateStock: (medicineId: string, addedStock: number) => void;
  onClose: () => void;
}

export const RefillModal: React.FC<RefillModalProps> = ({
  medicines,
  defaultMedicine,
  onUpdateStock,
  onClose,
}) => {
  const [selectedMedId, setSelectedMedId] = useState<string>(
    defaultMedicine?.id || (medicines.length > 0 ? medicines[0].id : '')
  );
  const [refillSent, setRefillSent] = useState(false);
  const [refillQuantity, setRefillQuantity] = useState(30);

  const currentMed = medicines.find((m) => m.id === selectedMedId) || medicines[0];

  const daysRemaining = currentMed
    ? Math.max(0, Math.floor(currentMed.currentStock / Math.max(1, currentMed.timesPerDay)))
    : 0;

  const isLowStock = currentMed ? currentMed.currentStock <= currentMed.reorderLevel : false;

  const handleRequestRefill = () => {
    soundManager.playSuccess();
    triggerHaptic('heavy');
    setRefillSent(true);
    setTimeout(() => {
      onUpdateStock(currentMed.id, refillQuantity);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1A3D] w-full max-w-lg rounded-3xl border border-purple-200/90 dark:border-[#382F6A] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 dark:border-[#2F2763] bg-purple-50/50 dark:bg-[#191535] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Refill & Stock Manager
              </h3>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
                Monitor supply & trigger pharmacy auto-orders
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2B2358] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Select Medicine */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Select Medication
            </label>
            <select
              value={selectedMedId}
              onChange={(e) => {
                setSelectedMedId(e.target.value);
                setRefillSent(false);
              }}
              className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-black text-slate-900 dark:text-white"
            >
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.strength}) • {m.currentStock} left
                </option>
              ))}
            </select>
          </div>

          {/* Stock Health Card with Visual Progress */}
          {currentMed && (
            <div className="p-4 bg-purple-50/50 dark:bg-[#251E4E] rounded-3xl border border-purple-200/80 dark:border-[#382F6A] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {currentMed.name}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {currentMed.strength} • {currentMed.form}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-black block ${isLowStock ? 'text-rose-500' : 'text-purple-600 dark:text-purple-300'}`}>
                    {daysRemaining} Days
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Supply Left</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-2.5 w-full bg-purple-200/60 dark:bg-[#16122E] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLowStock ? 'bg-rose-500' : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                    }`}
                    style={{
                      width: `${Math.min(100, (currentMed.currentStock / 30) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Current: {currentMed.currentStock} units</span>
                  <span>Alert threshold: {currentMed.reorderLevel} units</span>
                </div>
              </div>

              {isLowStock && (
                <div className="p-2.5 bg-rose-100/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Stock is running low! Order your refill now to prevent missed doses.</span>
                </div>
              )}
            </div>
          )}

          {/* Refill Quantity Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Refill Order Quantity
            </label>
            <div className="flex items-center gap-2">
              {[30, 60, 90].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setRefillQuantity(qty)}
                  className={`flex-1 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    refillQuantity === qty
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-[#14112B] border border-slate-200 dark:border-[#352F63] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {qty} Units ({Math.round(qty / (currentMed?.timesPerDay || 1))} days)
                </button>
              ))}
            </div>
          </div>

          {/* Refill Confirmation Banner */}
          {refillSent && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Refill request transmitted to Walgreens Pharmacy (#4401). Stock updated!
              </span>
            </motion.div>
          )}

          {/* Pharmacy Info & Direct Call */}
          <div className="p-3.5 bg-slate-50 dark:bg-[#16122E] rounded-2xl border border-slate-200 dark:border-[#2F2763] flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
                Preferred Pharmacy
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                Walgreens Pharmacy • 4th & Market St
              </p>
              <span className="text-[11px] text-slate-500">Open until 9:00 PM • Rx #2026-9941</span>
            </div>
            <a
              href="tel:+18005550199"
              className="p-2.5 bg-purple-100 dark:bg-[#2B2358] text-purple-700 dark:text-purple-200 rounded-xl flex items-center gap-1 font-bold text-xs hover:bg-purple-200 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-100 dark:border-[#2F2763] bg-purple-50/40 dark:bg-[#191535] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-white dark:bg-[#251E4E] border border-slate-200 dark:border-[#352F63] text-xs font-black text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            disabled={refillSent}
            onClick={handleRequestRefill}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black rounded-2xl shadow-md shadow-purple-600/20 flex items-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{refillSent ? 'Refill Ordered' : 'Request Pharmacy Refill'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
