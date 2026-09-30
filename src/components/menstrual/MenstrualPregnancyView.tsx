import React, { useState } from 'react';
import {
  Heart,
  Baby,
  Sparkles,
  Calendar,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileText,
  Save,
  Check,
  ChevronLeft,
} from 'lucide-react';
import { MenstrualCycleProfile } from '../../types/menstrual';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MenstrualPregnancyViewProps {
  profile: MenstrualCycleProfile;
  onUpdateProfile: (updated: MenstrualCycleProfile) => void;
  onBackToHome?: () => void;
}

export const MenstrualPregnancyView: React.FC<MenstrualPregnancyViewProps> = ({
  profile,
  onUpdateProfile,
  onBackToHome,
}) => {
  const [dueDate, setDueDate] = useState<string>(
    profile.pregnancyConfig?.dueDate || '2027-01-25'
  );
  const [lastLMP, setLastLMP] = useState<string>(
    profile.pregnancyConfig?.lastMenstrualPeriodDate || '2026-04-20'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculate current gestational weeks and days
  const lmpTime = new Date(lastLMP).getTime();
  const nowTime = new Date('2026-08-30').getTime();
  const diffDays = Math.max(0, Math.floor((nowTime - lmpTime) / (1000 * 60 * 60 * 24)));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  const progressPercent = Math.min(100, Math.round((diffDays / 280) * 100));

  const handleSavePregnancy = () => {
    soundManager.playSuccess();
    triggerHaptic('heavy');
    onUpdateProfile({
      ...profile,
      trackingMode: 'pregnancy',
      pregnancyConfig: {
        dueDate,
        lastMenstrualPeriodDate: lastLMP,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-14">
      {/* Mode Switch Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-3xl p-5 text-white shadow-lg shadow-purple-600/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤰</span>
            <span className="text-xs font-black uppercase tracking-wider text-purple-200">
              Pregnancy & Gestational Mode
            </span>
          </div>
          <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">
            Week {weeks}
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-black tracking-tight">
            Week {weeks}, Day {days}
          </div>
          <p className="text-xs text-purple-100 font-medium">
            Estimated Due Date: {new Date(dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Gestational Progress */}
        <div className="space-y-1 pt-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-purple-200">
            <span>Trimester 2 (Weeks 13–27)</span>
            <span>{progressPercent}% of 40 Weeks</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Date Configuration Card with Explicit Save */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
            Pregnancy Timeline Settings
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">LMP & Estimated Due Date</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-black text-slate-800 dark:text-slate-200 block mb-1.5">
              Last Menstrual Period (LMP)
            </label>
            <input
              type="date"
              value={lastLMP}
              onChange={(e) => setLastLMP(e.target.value)}
              className="w-full p-3 sm:p-3.5 rounded-2xl blessikaa-inner-embossed text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-400/20"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-800 dark:text-slate-200 block mb-1.5">
              Estimated Due Date (EDD)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 sm:p-3.5 rounded-2xl blessikaa-inner-embossed text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-400/20"
            />
          </div>
        </div>

        {/* Explicit Android Save Button */}
        <button
          type="button"
          onClick={handleSavePregnancy}
          className="w-full group rounded-3xl p-5 sm:p-6 blessikaa-inner-embossed hover:bg-purple-50/50 dark:hover:bg-[#282154] hover:border-purple-500 dark:hover:border-purple-400 text-left hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
              {savedSuccess ? (
                <Check className="w-7 h-7 text-emerald-200 stroke-[2.5]" />
              ) : (
                <Save className="w-7 h-7 stroke-[2.5]" />
              )}
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight">
                {savedSuccess ? 'PREGNANCY SETTINGS SAVED' : 'SAVE PREGNANCY DATES & VITALS'}
              </span>
              <span className="text-xs text-purple-700 dark:text-purple-300 font-bold block mt-0.5">
                {savedSuccess ? 'Synchronized to device' : 'Save gestational age & expected due date'}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/40 group-hover:bg-purple-600 group-hover:text-white text-purple-700 dark:text-purple-300 flex items-center justify-center transition-colors shrink-0">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
        </button>
      </div>

      {/* Baby Development Highlight */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xl shadow-2xs">
            🥑
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Baby Size: Avocado (~19 cm)</h3>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Week 18 Developmental Milestone</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Your baby can now hear muffled sounds from the outside world! Vocal cords and facial
          muscles are active. You may feel gentle fluttering kicks ("quickening").
        </p>
      </div>

      {/* Prenatal Checklist & Vitals */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white">Prenatal Care Checklist</h3>

        <div className="space-y-2">
          {[
            { title: 'Prenatal Vitamins & Folic Acid', done: true },
            { title: 'Mid-Pregnancy Ultrasound (Anomaly Scan)', done: false, date: 'Sept 5' },
            { title: 'Hydration Target (2.5L Daily)', done: true },
            { title: 'Gentle Pelvic Floor & Yoga Routine', done: true },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl blessikaa-inner-embossed flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    item.done ? 'text-purple-600 dark:text-purple-400' : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
              </div>
              {item.date && (
                <span className="text-[10px] font-black text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/50 border border-purple-200 px-2 py-0.5 rounded-lg">
                  {item.date}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Medical Safety Disclaimer */}
      <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200/80 dark:border-amber-900 shadow-sm flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
          Note: This tracker provides informational guidance and estimated dates only. Consult your
          obstetrician or healthcare provider for clinical medical care and ultrasound-confirmed dates.
        </p>
      </div>
    </div>
  );
};
