import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  SkipForward,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { MedicineItem } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MissedDoseModalProps {
  medicine: MedicineItem;
  scheduledTime?: string;
  onTakeDose: (medicineId: string) => void;
  onSkipDose: (medicineId: string) => void;
  onSnooze: (medicineId: string) => void;
  onClose: () => void;
}

export const MissedDoseModal: React.FC<MissedDoseModalProps> = ({
  medicine,
  scheduledTime = '08:00 AM',
  onTakeDose,
  onSkipDose,
  onSnooze,
  onClose,
}) => {
  const [showGuidance, setShowGuidance] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1A3D] w-full max-w-md rounded-3xl border border-amber-300 dark:border-amber-700/60 shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-100 dark:border-[#382F6A] bg-amber-50/70 dark:bg-[#2A2145] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Missed Dose Alert
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {medicine.name} ({medicine.strength})
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="p-3.5 bg-purple-50/40 dark:bg-[#181333] rounded-2xl border border-purple-100 dark:border-[#31295D] text-xs">
            <p className="text-slate-700 dark:text-slate-200 font-bold">
              Your scheduled dose for <span className="text-purple-600">{scheduledTime}</span> was not logged.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Instructions: {medicine.dosageQuantity} {medicine.dosageUnit} • {medicine.mealTiming}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playSuccess();
                triggerHaptic('heavy');
                onTakeDose(medicine.id);
                onClose();
              }}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ I Took It (Log as Taken)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('medium');
                  onSnooze(medicine.id);
                  onClose();
                }}
                className="py-2.5 px-3 bg-purple-50 hover:bg-purple-100 dark:bg-[#251E4E] text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Remind in 15m</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('medium');
                  onSkipDose(medicine.id);
                  onClose();
                }}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#251E4E] text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Skip Dose</span>
              </button>
            </div>
          </div>

          {/* Clinical Guidance Trigger */}
          <div className="pt-2 border-t border-purple-100 dark:border-[#2E275E]">
            <button
              type="button"
              onClick={() => setShowGuidance(!showGuidance)}
              className="w-full py-1.5 text-xs font-black text-purple-700 dark:text-purple-300 hover:underline flex items-center justify-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showGuidance ? 'Hide Guidance' : 'What should I do if I missed a dose?'}</span>
            </button>

            {showGuidance && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2.5 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1.5"
              >
                <div className="font-black flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Clinical Missed Dose Protocol</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Take the missed dose as soon as you remember. However, if it is almost time for your next regular dose, <strong>skip the missed dose and return to your normal schedule.</strong> Never take a double dose to make up for a missed one.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
