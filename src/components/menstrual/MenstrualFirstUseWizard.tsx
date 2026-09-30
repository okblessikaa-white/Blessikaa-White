import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  Shield,
  Bell,
  Sparkles,
  Lock,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { MenstrualCycleProfile } from '../../types/menstrual';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MenstrualFirstUseWizardProps {
  onComplete: (profile: MenstrualCycleProfile) => void;
  onSkip: () => void;
}

export const MenstrualFirstUseWizard: React.FC<MenstrualFirstUseWizardProps> = ({
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<number>(0); // 0 = Intro, 1 = Last Period, 2 = Period Length, 3 = Cycle Length, 4 = Irregular (conditional), 5 = Preferences, 6 = Reminders, 7 = Privacy

  // Form State
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('2026-08-18');
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [isIrregular, setIsIrregular] = useState<boolean>(false);
  const [shortestCycle, setShortestCycle] = useState<number>(24);
  const [longestCycle, setLongestCycle] = useState<number>(35);

  const [trackPeriod, setTrackPeriod] = useState(true);
  const [trackFlow, setTrackFlow] = useState(true);
  const [trackSymptoms, setTrackSymptoms] = useState(true);
  const [trackMood, setTrackMood] = useState(true);
  const [trackEnergy, setTrackEnergy] = useState(true);
  const [trackSleep, setTrackSleep] = useState(true);
  const [trackCervicalMucus, setTrackCervicalMucus] = useState(false);
  const [trackBBT, setTrackBBT] = useState(false);
  const [trackSex, setTrackSex] = useState(false);
  const [trackMeds, setTrackMeds] = useState(false);
  const [trackNotes, setTrackNotes] = useState(true);

  const [remindApproaching, setRemindApproaching] = useState(true);
  const [approachingDaysBefore, setApproachingDaysBefore] = useState(2);
  const [remindFertile, setRemindFertile] = useState(true);
  const [remindOvulation, setRemindOvulation] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [dailyReminderTime, setDailyReminderTime] = useState('20:00');

  const [keepPrivate, setKeepPrivate] = useState(true);
  const [requireAppLock, setRequireAppLock] = useState(false);
  const [sharedWith, setSharedWith] = useState<'nobody' | 'partner' | 'family' | 'caregiver' | 'doctor' | 'custom'>('nobody');

  // Calendar month state for step 1
  const [calendarMonth, setCalendarMonth] = useState<number>(7); // August (0-indexed = 7)
  const [calendarYear, setCalendarYear] = useState<number>(2026);

  const handleNext = () => {
    soundManager.playTick();
    triggerHaptic('light');
    if (step === 3 && isIrregular) {
      setStep(4); // Go to irregular config
    } else if (step === 3 && !isIrregular) {
      setStep(5); // Skip to preferences
    } else if (step === 7) {
      // Finish
      const finalProfile: MenstrualCycleProfile = {
        isConfigured: true,
        trackingMode: 'cycle_tracking',
        lastPeriodStartDate: lastPeriodDate,
        periodLengthDays: periodLength,
        cycleLengthDays: cycleLength,
        isIrregular,
        shortestCycleDays: shortestCycle,
        longestCycleDays: longestCycle,
        trackActualVariations: true,
        enabledTrackers: {
          period: trackPeriod,
          flow: trackFlow,
          symptoms: trackSymptoms,
          mood: trackMood,
          energy: trackEnergy,
          sleep: trackSleep,
          cervicalMucus: trackCervicalMucus,
          basalTemperature: trackBBT,
          sexualActivity: trackSex,
          medication: trackMeds,
          notes: trackNotes,
        },
        reminders: {
          periodApproaching: remindApproaching,
          periodApproachingDaysBefore: approachingDaysBefore,
          fertileWindow: remindFertile,
          ovulationEstimate: remindOvulation,
          dailyReminder,
          dailyReminderTime,
        },
        privacy: {
          keepPrivate,
          requireAppLock,
          sharedWith,
        },
        customFields: [
          {
            id: 'field_cervical_mucus',
            name: 'Cervical Mucus',
            type: 'selection',
            options: ['Dry', 'Sticky', 'Creamy', 'Watery', 'Egg-white'],
            showOnDailyLog: trackCervicalMucus,
          },
        ],
      };
      onComplete(finalProfile);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    soundManager.playTick();
    triggerHaptic('light');
    if (step === 5 && !isIrregular) {
      setStep(3);
    } else {
      setStep(Math.max(0, step - 1));
    }
  };

  // Step 0: Welcome / Intro
  if (step === 0) {
    return (
      <div className="w-full max-w-md mx-auto min-h-[80vh] flex flex-col justify-between py-6 px-4 sm:px-6 animate-fadeIn">
        <div className="text-center space-y-6 pt-8">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-5xl shadow-xl shadow-purple-500/20 animate-bounce">
            🌸
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Understand Your Cycle
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
              Track your periods, symptoms, moods and cycle patterns in one private place.
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md text-left space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs font-bold text-purple-900 dark:text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>Smart Predictions & Phase Tracking</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-purple-900 dark:text-purple-300">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>100% Private, Offline-First & Encrypted</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-purple-900 dark:text-purple-300">
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>Gentle Reminders Before Your Period</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-8 pb-4">
          <button
            type="button"
            onClick={() => {
              soundManager.playSuccess();
              triggerHaptic('medium');
              setStep(1);
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-base shadow-lg shadow-purple-600/30 transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>SET UP MY CYCLE</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              onSkip();
            }}
            className="w-full py-3 text-center text-sm font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 transition-colors cursor-pointer"
          >
            Set up later
          </button>
        </div>
      </div>
    );
  }

  // Days in August 2026
  const daysInMonth = 31;
  const startDayOfWeek = 5; // August 1 2026 was Saturday (5 with Mon=0)

  return (
    <div className="w-full max-w-md mx-auto min-h-[85vh] flex flex-col justify-between py-4 px-4 sm:px-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4">
          <button
            type="button"
            onClick={handleBack}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 5, 6, 7].map((sIndex, i) => (
              <div
                key={sIndex}
                className={`h-1.5 rounded-full transition-all ${
                  step >= sIndex ? 'w-5 bg-purple-600' : 'w-2 bg-purple-200 dark:bg-purple-900/50'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer"
          >
            Skip
          </button>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-2"
            >
              <div className="text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Step 1 of 6
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  When did your last period start?
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Select the first day of your most recent period.
                </p>
              </div>

              {/* Month Navigation */}
              <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3">
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    August 2026
                  </span>
                  <div className="flex gap-1">
                    <button className="p-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-600 dark:text-slate-300">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="p-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-600 dark:text-slate-300">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 pb-1">
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                  <span>Su</span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `2026-08-${dayNum.toString().padStart(2, '0')}`;
                    const isSelected = lastPeriodDate === dateStr;

                    return (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() => {
                          setLastPeriodDate(dateStr);
                          soundManager.playTick();
                          triggerHaptic('light');
                        }}
                        className={`h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md scale-105'
                            : 'hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-purple-100 dark:border-[#383068] text-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Selected: </span>
                  <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                    {new Date(lastPeriodDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pt-2 text-center"
            >
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Step 2 of 6
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  How many days does your period usually last?
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">Average bleeding duration</p>
              </div>

              {/* Stepper Display */}
              <div className="flex items-center justify-center gap-6 py-4">
                <button
                  type="button"
                  onClick={() => setPeriodLength(Math.max(1, periodLength - 1))}
                  className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 text-purple-700 dark:text-purple-300 text-2xl font-bold flex items-center justify-center shadow-md cursor-pointer active:scale-95"
                >
                  −
                </button>
                <div className="text-5xl font-black text-purple-900 dark:text-purple-200 tracking-tight w-20">
                  {periodLength}
                </div>
                <button
                  type="button"
                  onClick={() => setPeriodLength(Math.min(14, periodLength + 1))}
                  className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 text-purple-700 dark:text-purple-300 text-2xl font-bold flex items-center justify-center shadow-md cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>

              {/* Quick Pills */}
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 5, 6, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setPeriodLength(num);
                      soundManager.playTick();
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                      periodLength === num
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-white dark:bg-[#1E1A3D] border-purple-200/80 dark:border-[#383068] text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                    }`}
                  >
                    {num} Days
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pt-2 text-center"
            >
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Step 3 of 6
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  How long is your typical cycle?
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  From day 1 of one period to day 1 of the next
                </p>
              </div>

              {/* Stepper */}
              <div className="flex items-center justify-center gap-6 py-2">
                <button
                  type="button"
                  onClick={() => setCycleLength(Math.max(18, cycleLength - 1))}
                  className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 text-purple-700 dark:text-purple-300 text-2xl font-bold flex items-center justify-center shadow-md cursor-pointer active:scale-95"
                >
                  −
                </button>
                <div className="text-5xl font-black text-purple-900 dark:text-purple-200 tracking-tight w-24">
                  {cycleLength}
                </div>
                <button
                  type="button"
                  onClick={() => setCycleLength(Math.min(60, cycleLength + 1))}
                  className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 text-purple-700 dark:text-purple-300 text-2xl font-bold flex items-center justify-center shadow-md cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[21, 24, 28, 30, 35].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setCycleLength(num);
                      setIsIrregular(false);
                      soundManager.playTick();
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                      cycleLength === num && !isIrregular
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-white dark:bg-[#1E1A3D] border-purple-200/80 dark:border-[#383068] text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                    }`}
                  >
                    {num} Days
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setIsIrregular(true);
                    soundManager.playTick();
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                    isIrregular
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                      : 'bg-white dark:bg-[#1E1A3D] border-purple-200/80 dark:border-[#383068] text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                  }`}
                >
                  Irregular
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-2"
            >
              <div className="text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Irregular Cycle Tuning
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Your cycle varies?
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Set your approximate minimum and maximum range
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Shortest cycle (days)
                  </label>
                  <input
                    type="number"
                    value={shortestCycle}
                    onChange={(e) => setShortestCycle(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-purple-50/60 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Longest cycle (days)
                  </label>
                  <input
                    type="number"
                    value={longestCycle}
                    onChange={(e) => setLongestCycle(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-purple-50/60 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-purple-100 dark:border-[#383068]">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Track actual variations over time
                  </span>
                  <span className="text-xs font-black text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2.5 py-1 rounded-lg">
                    ON
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-2"
            >
              <div className="text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Step 4 of 6
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  What would you like to track?
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Select what you need — you can adjust this anytime
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-[48vh] overflow-y-auto pr-1">
                {[
                  { label: '🩸 Period & Start/End', state: trackPeriod, setter: setTrackPeriod },
                  { label: '💧 Flow & Products', state: trackFlow, setter: setTrackFlow },
                  { label: '🌸 Physical Symptoms', state: trackSymptoms, setter: setTrackSymptoms },
                  { label: '😊 Mood & Emotions', state: trackMood, setter: setTrackMood },
                  { label: '⚡ Energy Levels', state: trackEnergy, setter: setTrackEnergy },
                  { label: '😴 Sleep Quality', state: trackSleep, setter: setTrackSleep },
                  { label: '🌿 Cervical Mucus', state: trackCervicalMucus, setter: setTrackCervicalMucus },
                  { label: '🌡️ Basal Temp (BBT)', state: trackBBT, setter: setTrackBBT },
                  { label: '❤️ Sexual Activity', state: trackSex, setter: setTrackSex },
                  { label: '💊 Medication', state: trackMeds, setter: setTrackMeds },
                  { label: '📝 Daily Notes', state: trackNotes, setter: setTrackNotes },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => item.setter(!item.state)}
                    className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
                      item.state
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-600 text-purple-900 dark:text-purple-200 shadow-md'
                        : 'bg-white dark:bg-[#1E1A3D] border-purple-200/80 dark:border-[#383068] text-slate-600 dark:text-slate-300 hover:bg-purple-50/50 dark:hover:bg-purple-950/20'
                    }`}
                  >
                    <span className="text-xs font-bold">{item.label}</span>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                        item.state ? 'bg-purple-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {item.state && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-2"
            >
              <div className="text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Step 5 of 6
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Cycle Reminders
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Gentle heads-up alerts before key cycle transitions
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Period approaching</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">2 days before expected start</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRemindApproaching(!remindApproaching)}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      remindApproaching ? 'bg-purple-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Fertile window estimate</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Notification at window start</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRemindFertile(!remindFertile)}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      remindFertile ? 'bg-purple-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Ovulation day estimate</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Estimated peak ovulation</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRemindOvulation(!remindOvulation)}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      remindOvulation ? 'bg-purple-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Daily tracking nudge</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Evening reminder at 8:00 PM</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDailyReminder(!dailyReminder)}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      dailyReminder ? 'bg-purple-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-2"
            >
              <div className="text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Step 6 of 6
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Your Privacy & Security
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your health information stays on your device by default
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3.5">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 border border-purple-100 dark:border-[#383068]">
                  <Lock className="w-5 h-5 text-purple-700 dark:text-purple-400 shrink-0" />
                  <div className="text-xs font-bold">
                    Encrypted local records. Nobody sees your data unless explicitly invited.
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Share with:
                  </label>
                  <select
                    value={sharedWith}
                    onChange={(e: any) => setSharedWith(e.target.value)}
                    className="w-full p-3 rounded-xl bg-purple-50/60 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-slate-900 dark:text-white font-bold text-xs"
                  >
                    <option value="nobody">Nobody (Private only)</option>
                    <option value="partner">Partner (View only)</option>
                    <option value="family">Family Member</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="doctor">Doctor / Specialist</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={requireAppLock}
                    onChange={(e) => setRequireAppLock(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                  <span>Require app lock to open menstrual health</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Continue Button */}
      <div className="pt-6">
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-purple-600/30 transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{step === 7 ? 'SAVE & ENTER SERVICE 🌸' : 'CONTINUE'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
