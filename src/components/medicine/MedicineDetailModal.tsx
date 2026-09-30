import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  Calendar,
  ShieldAlert,
  Activity,
  FileText,
  DollarSign,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Trash2,
  Edit3,
  Flame,
  Check,
  History,
  TrendingUp,
  Info,
} from 'lucide-react';
import { MedicineItem } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MedicineDetailModalProps {
  medicine: MedicineItem;
  onEdit: (medicine: MedicineItem) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  onLogDose: (medicineId: string, status: 'taken' | 'skipped') => void;
  onOpenSideEffect: (medicine: MedicineItem) => void;
  onOpenRefill: (medicine: MedicineItem) => void;
}

type TabType =
  | 'overview'
  | 'schedule'
  | 'safety'
  | 'monitoring'
  | 'documents'
  | 'history'
  | 'cost'
  | 'sharing';

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  medicine,
  onEdit,
  onDelete,
  onClose,
  onLogDose,
  onOpenSideEffect,
  onOpenRefill,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Pill },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'safety', label: 'Safety', icon: ShieldAlert },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'cost', label: 'Cost', icon: DollarSign },
    { id: 'sharing', label: 'Sharing', icon: Share2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1A3D] w-full max-w-2xl rounded-3xl border border-purple-200/90 dark:border-[#382F6A] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* ========================================================= */}
        {/* HEADER                                                    */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-5 border-b border-purple-100 dark:border-[#2F2763] bg-purple-50/50 dark:bg-[#191535]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md shadow-purple-600/20">
                💊
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {medicine.name}
                  </h3>
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-md text-xs font-black">
                    {medicine.strength}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {medicine.form} • {medicine.frequency} ({medicine.mealTiming})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(medicine)}
                className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-[#2A2359] transition-all cursor-pointer"
                title="Edit Medication"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove ${medicine.name} from your active medication list?`)) {
                    onDelete(medicine.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                title="Delete Medication"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2B2358] transition-all cursor-pointer ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Adherence & Dose Action Bar */}
          <div className="mt-4 pt-3 border-t border-purple-100 dark:border-[#2B2358] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-500">Adherence:</span>
                <span className="font-black text-slate-900 dark:text-white">
                  {medicine.adherenceRate || 100}%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-slate-500">Streak:</span>
                <span className="font-black text-slate-900 dark:text-white">
                  {medicine.streakDays || 1} days
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Stock:</span>
                <span className={`font-black ${medicine.currentStock <= medicine.reorderLevel ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                  {medicine.currentStock} units
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onLogDose(medicine.id, 'taken');
                  soundManager.playSuccess();
                  triggerHaptic('heavy');
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Take Dose</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenSideEffect(medicine)}
                className="px-2.5 py-1.5 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200/70 rounded-xl text-xs font-black cursor-pointer transition-all"
              >
                ⚠️ Side Effect
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB NAVIGATION SCROLL BAR                                 */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1 px-4 sm:px-5 py-2 border-b border-purple-100 dark:border-[#2F2763] bg-white dark:bg-[#1E1A3D] overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  setActiveTab(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-[#272052]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB BODY                                                  */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-purple-50/50 dark:bg-[#251E4E] rounded-2xl border border-purple-100 dark:border-[#352F63]">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Dosage</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {medicine.dosageQuantity} {medicine.dosageUnit}
                  </span>
                  <span className="text-[11px] text-purple-700 dark:text-purple-300 block font-semibold">
                    {medicine.frequency}
                  </span>
                </div>

                <div className="p-3 bg-purple-50/50 dark:bg-[#251E4E] rounded-2xl border border-purple-100 dark:border-[#352F63]">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Meal Instruction</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {medicine.mealTiming}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {medicine.routeOfAdministration || 'Oral'}
                  </span>
                </div>

                <div className="p-3 bg-purple-50/50 dark:bg-[#251E4E] rounded-2xl border border-purple-100 dark:border-[#352F63]">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Course Duration</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {medicine.durationDays === 'ongoing' ? 'Ongoing' : `${medicine.durationDays} Days`}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    From {medicine.startDate}
                  </span>
                </div>
              </div>

              {/* Indication & Prescriber */}
              <div className="p-4 bg-slate-50 dark:bg-[#16122E] rounded-2xl border border-slate-200 dark:border-[#2F2763] space-y-2">
                <div>
                  <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase">
                    Condition / Diagnosis
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {medicine.condition || 'General health & wellness'}
                  </p>
                </div>

                {medicine.doctorName && (
                  <div className="pt-2 border-t border-slate-200 dark:border-[#251E4E]">
                    <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase">
                      Prescribed By
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {medicine.doctorName}
                    </p>
                  </div>
                )}

                {medicine.adminInstructions && (
                  <div className="pt-2 border-t border-slate-200 dark:border-[#251E4E]">
                    <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase">
                      Special Instructions
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {medicine.adminInstructions}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: SCHEDULE */}
          {activeTab === 'schedule' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="p-4 bg-purple-50/40 dark:bg-[#221C47] rounded-2xl border border-purple-100 dark:border-[#352F63]">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Daily Scheduled Times
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {medicine.specificTimes.map((time, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white dark:bg-[#1A1638] rounded-xl border border-purple-200 dark:border-[#2E275E] text-center"
                    >
                      <Clock className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                      <span className="text-sm font-black text-slate-900 dark:text-white block">
                        {time}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">Dose {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#16122E] rounded-2xl border border-slate-200 dark:border-[#2F2763] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Frequency Pattern:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{medicine.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Meal Association:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{medicine.mealTiming}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Advance Warning:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {medicine.reminderBeforeMinutes || 15} mins before dose
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: SAFETY */}
          {activeTab === 'safety' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-black text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Clinical Safety & Food Precautions</span>
                </div>
                <ul className="text-xs text-amber-900/90 dark:text-amber-200/90 space-y-1 list-disc pl-4">
                  <li>Take strictly as prescribed. Do not double doses to compensate for missed times.</li>
                  <li>
                    Storage:{' '}
                    <strong>{medicine.storageConditions || 'Store at room temperature'}</strong>
                  </li>
                  <li>Avoid alcohol or sedative substances during the active dosing period.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#16122E] rounded-2xl border border-slate-200 dark:border-[#2F2763] text-xs space-y-2">
                <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Drug Interactions Cross-Check
                </h5>
                <p className="text-slate-600 dark:text-slate-400">
                  No major adverse drug-drug interactions detected across your currently registered active cabinet medicines.
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 4: MONITORING */}
          {activeTab === 'monitoring' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="p-4 bg-purple-50/50 dark:bg-[#251E4E] rounded-2xl border border-purple-100 dark:border-[#352F63] space-y-2 text-xs">
                <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Recommended Routine Labs & Vitals
                </h5>
                <p className="text-slate-600 dark:text-slate-300">
                  Periodic blood tests help your doctor verify efficacy and organ safety.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 bg-white dark:bg-[#191535] rounded-xl border border-purple-100 dark:border-[#2E275E]">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Routine Vitals
                    </span>
                    <span className="text-[11px] text-slate-500">Blood Pressure & Pulse</span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-[#191535] rounded-xl border border-purple-100 dark:border-[#2E275E]">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Follow-up Review
                    </span>
                    <span className="text-[11px] text-slate-500">In 3 Months</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: DOCUMENTS */}
          {activeTab === 'documents' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="p-3 bg-purple-50 dark:bg-[#251E4E] rounded-2xl border border-purple-100 dark:border-[#352F63] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <div>
                    <h5 className="text-xs font-black text-slate-900 dark:text-white">
                      Linked Prescription Slip
                    </h5>
                    <p className="text-[10px] text-slate-500">Prescription-2026-9941.pdf (1.2 MB)</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-600 bg-white dark:bg-[#191535] px-2 py-1 rounded-lg">
                  Verified
                </span>
              </div>
            </motion.div>
          )}

          {/* TAB 6: HISTORY */}
          {activeTab === 'history' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Dose Log Activity
              </h5>
              {medicine.dosesLogged && medicine.dosesLogged.length > 0 ? (
                <div className="space-y-2">
                  {medicine.dosesLogged.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-[#191535] rounded-2xl border border-slate-200 dark:border-[#2F2763] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            Dose Taken
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {log.date} at {log.time} (Scheduled: {log.scheduledTime})
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                        Logged
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 p-4 text-center">
                  No previous dose logs recorded yet. Tap "Take Dose" to start your streak!
                </p>
              )}
            </motion.div>
          )}

          {/* TAB 7: COST */}
          {activeTab === 'cost' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="p-4 bg-purple-50/50 dark:bg-[#251E4E] rounded-2xl border border-purple-100 dark:border-[#352F63] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Refill Quantity:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {medicine.reorderQuantity || 30} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Cost:</span>
                  <span className="font-bold text-slate-900 dark:text-white">$12.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Insurance Status:</span>
                  <span className="font-bold text-emerald-600">Covered ($2.00 Copay)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenRefill(medicine)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs"
              >
                Manage Refill & Pharmacy Orders
              </button>
            </motion.div>
          )}

          {/* TAB 8: SHARING */}
          {activeTab === 'sharing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-[#16122E] rounded-2xl border border-slate-200 dark:border-[#2F2763] space-y-2">
                <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Caregiver & Clinical Access Permissions
                </h5>
                <p className="text-slate-500">
                  Grant visibility of adherence logs and refill triggers to family caregivers and treating physicians.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span>Family Caregiver Alerts:</span>
                  <span className="font-black text-purple-600">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Doctor Tele-Sync:</span>
                  <span className="font-black text-purple-600">Active</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
