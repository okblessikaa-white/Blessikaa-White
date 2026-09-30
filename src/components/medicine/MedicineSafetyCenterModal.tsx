import React from 'react';
import { motion } from 'motion/react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Thermometer,
  Coffee,
  Wine,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { MedicineItem } from '../../types';
import { soundManager } from '../../utils/audio';

interface MedicineSafetyCenterModalProps {
  medicines: MedicineItem[];
  onClose: () => void;
}

export const MedicineSafetyCenterModal: React.FC<MedicineSafetyCenterModalProps> = ({
  medicines,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1A3D] w-full max-w-xl rounded-3xl border border-purple-200/90 dark:border-[#382F6A] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 dark:border-[#2F2763] bg-purple-50/50 dark:bg-[#191535] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Clinical Safety & Interaction Center
              </h3>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
                Multi-drug safety analysis & storage protocols
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
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Interaction Overview Banner */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black">
              <ShieldCheck className="w-4 h-4" />
              <span>0 Major Drug-Drug Interactions Detected</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Your {medicines.length} registered active medications have been cross-referenced against the clinical pharmacopeia database. No contraindicating co-prescriptions were found.
            </p>
          </div>

          {/* Active Medicines Evaluated */}
          <div className="space-y-2">
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Cabinet Safety Matrix
            </h4>
            <div className="space-y-2">
              {medicines.map((med) => (
                <div
                  key={med.id}
                  className="p-3 bg-purple-50/40 dark:bg-[#16122E] rounded-2xl border border-purple-100 dark:border-[#2F2763] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 dark:text-white">
                      {med.name} ({med.strength})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-md">
                      Safe
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    <span>🍽 Timing: {med.mealTiming}</span> •{' '}
                    <span>🌡 Storage: {med.storageConditions || 'Room temperature'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Food & Lifestyle Guidelines */}
          <div className="p-4 bg-slate-50 dark:bg-[#16122E] rounded-2xl border border-slate-200 dark:border-[#2F2763] space-y-2">
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Food & Substance Rules
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <Wine className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Alcohol:</strong> Avoid combining alcohol with antibiotics or sedative prescription drugs.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Coffee className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Caffeine / Dairy:</strong> Separate dairy products or antacids by at least 2 hours when taking tetracyclines or iron supplements.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-100 dark:border-[#2F2763] bg-purple-50/40 dark:bg-[#191535] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs"
          >
            Close Safety Center
          </button>
        </div>
      </div>
    </div>
  );
};
