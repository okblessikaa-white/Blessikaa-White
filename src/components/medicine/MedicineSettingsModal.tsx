import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Settings,
  Bell,
  Volume2,
  Download,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MedicineSettingsModalProps {
  onClose: () => void;
}

export const MedicineSettingsModal: React.FC<MedicineSettingsModalProps> = ({ onClose }) => {
  const [doseAlerts, setDoseAlerts] = useState(true);
  const [missedDoseAlerts, setMissedDoseAlerts] = useState(true);
  const [refillAlerts, setRefillAlerts] = useState(true);
  const [advanceNotice, setAdvanceNotice] = useState(15);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');

  const handleExportData = () => {
    soundManager.playCelebration();
    triggerHaptic('heavy');
    alert('Exporting encrypted Blessikaa medication schedule and adherence history...');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1A3D] w-full max-w-lg rounded-3xl border border-purple-200/90 dark:border-[#382F6A] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 dark:border-[#2F2763] bg-purple-50/50 dark:bg-[#191535] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Medicine & Rx Settings
              </h3>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
                Alert preferences, audio chimes & export options
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

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Section: Reminders */}
          <div className="space-y-2">
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Dose & Adherence Alerts
            </h4>

            <div className="p-3 bg-purple-50/40 dark:bg-[#16122E] rounded-2xl border border-purple-100 dark:border-[#2F2763] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Scheduled Dose Alarms
                  </span>
                  <span className="text-[11px] text-slate-500">Play alert sound at exact dose time</span>
                </div>
                <input
                  type="checkbox"
                  checked={doseAlerts}
                  onChange={(e) => setDoseAlerts(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded-md cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-100 dark:border-[#2A2359]">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Missed Dose Reminder
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Follow-up alert 30 mins after scheduled time
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={missedDoseAlerts}
                  onChange={(e) => setMissedDoseAlerts(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded-md cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-100 dark:border-[#2A2359]">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Refill Low Stock Warnings
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Notify when cabinet drops below threshold
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={refillAlerts}
                  onChange={(e) => setRefillAlerts(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded-md cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section: Audio & Format */}
          <div className="space-y-2">
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Audio & Time Display
            </h4>

            <div className="p-3 bg-slate-50 dark:bg-[#16122E] rounded-2xl border border-slate-200 dark:border-[#2F2763] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Dose Reminder Chime</span>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-3 py-1 rounded-xl font-bold ${
                    soundEnabled ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {soundEnabled ? 'Enabled' : 'Muted'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#2A2359]">
                <span className="font-bold text-slate-900 dark:text-white">Clock Format</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setTimeFormat('12h')}
                    className={`px-2.5 py-1 rounded-lg font-bold ${
                      timeFormat === '12h'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-200 dark:bg-[#251E4E]'
                    }`}
                  >
                    12-Hour (AM/PM)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeFormat('24h')}
                    className={`px-2.5 py-1 rounded-lg font-bold ${
                      timeFormat === '24h'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-200 dark:bg-[#251E4E]'
                    }`}
                  >
                    24-Hour
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Export Audit Report */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleExportData}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#251E4E] text-slate-800 dark:text-slate-200 rounded-2xl font-black flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Adherence & Medication Audit (PDF)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-100 dark:border-[#2F2763] bg-purple-50/40 dark:bg-[#191535] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
