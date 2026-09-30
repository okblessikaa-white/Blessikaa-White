import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  PhoneCall,
  Activity,
  Plus,
} from 'lucide-react';
import { MedicineItem, SymptomNote } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface SideEffectModalProps {
  medicines: MedicineItem[];
  defaultMedicine?: MedicineItem | null;
  onSaveReport: (medicineId: string, symptom: SymptomNote) => void;
  onClose: () => void;
}

const COMMON_SYMPTOMS = [
  'Nausea',
  'Headache',
  'Dizziness',
  'Skin Rash / Itching',
  'Stomach Pain / Cramps',
  'Fatigue / Drowsiness',
  'Diarrhea',
  'Muscle Ache',
  'Dry Cough',
  'Loss of Appetite',
  'Heartburn',
];

export const SideEffectModal: React.FC<SideEffectModalProps> = ({
  medicines,
  defaultMedicine,
  onSaveReport,
  onClose,
}) => {
  const [selectedMedId, setSelectedMedId] = useState<string>(
    defaultMedicine?.id || (medicines.length > 0 ? medicines[0].id : '')
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [notes, setNotes] = useState('');

  const toggleSymptom = (sym: string) => {
    soundManager.playTick();
    triggerHaptic('light');
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSave = () => {
    if (!selectedMedId) return;
    soundManager.playSuccess();
    triggerHaptic('heavy');

    const fullDescription = [
      selectedSymptoms.join(', '),
      customSymptom ? `Other: ${customSymptom}` : '',
      notes ? `Notes: ${notes}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const newNote: SymptomNote = {
      date: new Date().toISOString().slice(0, 10),
      note: fullDescription || 'Adverse symptom recorded',
      severity,
    };

    onSaveReport(selectedMedId, newNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1A3D] w-full max-w-lg rounded-3xl border border-purple-200/90 dark:border-[#382F6A] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 dark:border-[#2F2763] bg-purple-50/50 dark:bg-[#191535] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Log Side Effect / Reaction
              </h3>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
                Clinical symptom tracking & safety evaluation
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
          {/* Emergency Warning Banner when SEVERE */}
          {severity === 'Severe' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20 space-y-1.5"
            >
              <div className="flex items-center gap-2 font-black text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>URGENT CLINICAL ATTENTION NOTICE</span>
              </div>
              <p className="text-[11px] leading-relaxed text-rose-100">
                If you are experiencing chest pain, severe shortness of breath, sudden facial/throat swelling, or loss of consciousness, please seek immediate emergency medical care or call 911/112 right now.
              </p>
            </motion.div>
          )}

          {/* Select Medicine */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Which Medication?
            </label>
            <select
              value={selectedMedId}
              onChange={(e) => setSelectedMedId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-black text-slate-900 dark:text-white"
            >
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.strength})
                </option>
              ))}
            </select>
          </div>

          {/* Severity Level */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Symptom Severity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => {
                const isSelected = severity === sev;
                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setSeverity(sev);
                    }}
                    className={`py-2 px-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                      isSelected
                        ? sev === 'Severe'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : sev === 'Moderate'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-[#14112B] border border-slate-200 dark:border-[#352F63] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Common Symptoms Checklist */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Symptoms Experienced
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 dark:bg-[#14112B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#352F63]'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Additional Details / Trigger Timing
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Started 45 minutes after breakfast dose..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-medium text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-100 dark:border-[#2F2763] bg-purple-50/40 dark:bg-[#191535] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-white dark:bg-[#251E4E] border border-slate-200 dark:border-[#352F63] text-xs font-black text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black rounded-2xl shadow-md shadow-purple-600/20 cursor-pointer active:scale-95 transition-all"
          >
            Save Symptom Report
          </button>
        </div>
      </div>
    </div>
  );
};
