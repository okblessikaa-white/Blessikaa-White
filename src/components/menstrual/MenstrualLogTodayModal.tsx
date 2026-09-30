import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Check,
  Plus,
  Droplets,
  Smile,
  Zap,
  FileText,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  MenstrualDailyLog,
  FlowIntensity,
  MenstrualProduct,
  MoodType,
  EnergyLevel,
  MenstrualCycleProfile,
} from '../../types/menstrual';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MenstrualLogTodayModalProps {
  date: string;
  existingLog?: MenstrualDailyLog;
  profile: MenstrualCycleProfile;
  onSave: (log: MenstrualDailyLog) => void;
  onClose: () => void;
}

const COMMON_SYMPTOMS = [
  'Cramps',
  'Headache',
  'Bloating',
  'Acne',
  'Fatigue',
  'Back pain',
  'Nausea',
  'Breast tenderness',
];

const ADDITIONAL_SYMPTOMS = [
  'Dizziness',
  'Food cravings',
  'Insomnia',
  'Constipation',
  'Diarrhea',
  'Mood swings',
  'Pelvic pain',
  'Hot flashes',
  'Joint aches',
];

export const MenstrualLogTodayModal: React.FC<MenstrualLogTodayModalProps> = ({
  date,
  existingLog,
  profile,
  onSave,
  onClose,
}) => {
  // Form state initialized from existing log or defaults
  const [isPeriod, setIsPeriod] = useState<boolean>(existingLog?.isPeriod ?? false);
  const [periodStartAction, setPeriodStartAction] = useState<'start' | 'continue' | 'end' | 'none'>(
    existingLog?.isPeriodStart ? 'start' : existingLog?.isPeriodEnd ? 'end' : 'continue'
  );
  const [flow, setFlow] = useState<FlowIntensity>(existingLog?.flow ?? 'medium');
  const [product, setProduct] = useState<MenstrualProduct | undefined>(existingLog?.productUsed ?? 'pad');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(existingLog?.symptoms ?? []);
  const [customSymptomInput, setCustomSymptomInput] = useState('');
  const [showCustomSymptomInput, setShowCustomSymptomInput] = useState(false);
  const [mood, setMood] = useState<MoodType | undefined>(existingLog?.mood ?? 'good');
  const [energy, setEnergy] = useState<EnergyLevel | undefined>(existingLog?.energy ?? 'normal');
  const [cervicalMucus, setCervicalMucus] = useState<string | undefined>(existingLog?.cervicalMucus);
  const [notes, setNotes] = useState<string>(existingLog?.notes ?? '');

  const toggleSymptom = (sym: string) => {
    soundManager.playTick();
    triggerHaptic('light');
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleAddCustomSymptom = () => {
    if (customSymptomInput.trim()) {
      soundManager.playSuccess();
      setSelectedSymptoms([...selectedSymptoms, customSymptomInput.trim()]);
      setCustomSymptomInput('');
      setShowCustomSymptomInput(false);
    }
  };

  const handleSave = () => {
    soundManager.playSuccess();
    triggerHaptic('medium');

    const updatedLog: MenstrualDailyLog = {
      date,
      isPeriod,
      isPeriodStart: isPeriod && periodStartAction === 'start',
      isPeriodEnd: isPeriod && periodStartAction === 'end',
      flow: isPeriod ? flow : 'none',
      productUsed: isPeriod ? product : undefined,
      symptoms: selectedSymptoms,
      mood,
      energy,
      cervicalMucus,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedLog);
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-lg max-h-[90vh] bg-[#FAF8FD] dark:bg-[#15112E] rounded-3xl shadow-2xl border-2 border-purple-200/80 dark:border-[#383068] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#1E1A3D] border-b border-purple-100 dark:border-[#383068] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-purple-600/20">
              🌸
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Log Daily Entry</h3>
              <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">{formattedDate}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Section 1: Period Status */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <span>🩸</span>
              <span>Period Status</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsPeriod(false);
                  soundManager.playTick();
                }}
                className={`py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  !isPeriod
                    ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 border-2 border-purple-500 shadow-xs font-black'
                    : 'bg-slate-50 dark:bg-[#15112E] border border-slate-200 dark:border-[#383068] text-slate-600 dark:text-slate-400 hover:bg-purple-50'
                }`}
              >
                No Period Today
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPeriod(true);
                  soundManager.playTick();
                }}
                className={`py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isPeriod
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-black'
                    : 'bg-slate-50 dark:bg-[#15112E] border border-slate-200 dark:border-[#383068] text-slate-600 dark:text-slate-400 hover:bg-purple-50'
                }`}
              >
                🩸 Period Active
              </button>
            </div>

            {/* Period Transition Logic (Start vs Continue vs End) */}
            {isPeriod && (
              <div className="pt-2 border-t border-purple-100 dark:border-[#383068] space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Period Milestone:</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'start', label: 'Day 1 (Start)' },
                    { id: 'continue', label: 'Continuing' },
                    { id: 'end', label: 'Finished (End)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPeriodStartAction(item.id as any)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        periodStartAction === item.id
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 hover:bg-purple-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Flow Intensity & Product (if period is active) */}
          {isPeriod && (
            <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5" />
                <span>Today's Flow Intensity</span>
              </span>

              <div className="grid grid-cols-5 gap-1.5">
                {(['spotting', 'light', 'medium', 'heavy', 'very_heavy'] as FlowIntensity[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setFlow(f);
                      soundManager.playTick();
                    }}
                    className={`py-2.5 rounded-xl text-[11px] font-bold capitalize transition-all cursor-pointer ${
                      flow === f
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                        : 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 hover:bg-purple-100'
                    }`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Product Used */}
              <div className="pt-2 border-t border-purple-100 dark:border-[#383068]">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Product used:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['pad', 'tampon', 'cup', 'period_underwear'] as MenstrualProduct[]).map((prod) => (
                    <button
                      key={prod}
                      type="button"
                      onClick={() => setProduct(prod)}
                      className={`py-2 px-1 rounded-xl text-[11px] font-bold capitalize transition-all cursor-pointer ${
                        product === prod
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 hover:bg-purple-100'
                      }`}
                    >
                      {prod.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Symptoms */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                Physical Symptoms
              </span>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">
                {selectedSymptoms.length} logged
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs scale-102'
                        : 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 hover:bg-purple-100 border border-purple-100 dark:border-[#383068]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{sym}</span>
                  </button>
                );
              })}
            </div>

            {/* Additional Symptoms Collapsible */}
            <div className="pt-2 border-t border-purple-100 dark:border-[#383068] space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Additional:</span>
              <div className="flex flex-wrap gap-1.5">
                {ADDITIONAL_SYMPTOMS.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Symptom Adder */}
            {!showCustomSymptomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomSymptomInput(true)}
                className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 flex items-center gap-1 pt-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add custom symptom</span>
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="e.g. Lower back stiffness"
                  value={customSymptomInput}
                  onChange={(e) => setCustomSymptomInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs text-slate-900 dark:text-white font-bold"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSymptom}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs hover:bg-purple-700 cursor-pointer"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Mood & Emotions */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5" />
              <span>Mood & Emotions</span>
            </span>

            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { id: 'great', emoji: '😄', label: 'Great' },
                { id: 'good', emoji: '🙂', label: 'Good' },
                { id: 'neutral', emoji: '😐', label: 'Neutral' },
                { id: 'low', emoji: '😔', label: 'Low' },
                { id: 'stressed', emoji: '😣', label: 'Stressed' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMood(m.id as MoodType);
                    soundManager.playTick();
                  }}
                  className={`p-2.5 rounded-2xl transition-all cursor-pointer border-2 ${
                    mood === m.id
                      ? 'bg-purple-100 dark:bg-purple-900/60 border-purple-500 scale-105 shadow-xs'
                      : 'border-transparent hover:bg-purple-50 dark:hover:bg-purple-950/40'
                  }`}
                >
                  <span className="text-2xl block mb-1">{m.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Energy Level */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Energy Level</span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: '⚡ Low Energy' },
                { id: 'normal', label: '⚡⚡ Balanced' },
                { id: 'high', label: '⚡⚡⚡ High Energy' },
              ].map((en) => (
                <button
                  key={en.id}
                  type="button"
                  onClick={() => setEnergy(en.id as EnergyLevel)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    energy === en.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                      : 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 hover:bg-purple-100'
                  }`}
                >
                  {en.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 6: Cervical Mucus / Custom Fields */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
              🌿 Cervical Mucus (Fertility Indicator)
            </span>

            <div className="grid grid-cols-5 gap-1.5">
              {['Dry', 'Sticky', 'Creamy', 'Watery', 'Egg-white'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCervicalMucus(type)}
                  className={`py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                    cervicalMucus === type
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                      : 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 hover:bg-purple-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Section 7: Daily Notes */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Notes & Observations</span>
            </span>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record any personal feelings, medications taken, or body signals today..."
              rows={3}
              className="w-full p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] text-xs text-slate-900 dark:text-white font-medium placeholder:text-slate-400 shadow-xs focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-400/20 transition-colors"
            />
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 bg-white dark:bg-[#1E1A3D] border-t border-purple-100 dark:border-[#383068] flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-3.5 px-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-900 dark:text-purple-300 font-black text-xs border border-purple-200 dark:border-[#383068] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 group rounded-3xl p-3 sm:p-3.5 bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md hover:shadow-lg transition-all flex items-center justify-between cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30 shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <span className="block font-black text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight truncate">
                  SAVE TODAY'S ENTRY
                </span>
                <span className="block text-[10px] text-purple-600 dark:text-purple-300 font-medium truncate">
                  Log symptoms, flow & vitals
                </span>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-700/60 text-purple-700 dark:text-purple-300 font-black text-[10px] uppercase tracking-wider group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
              Save
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
