import React from 'react';
import {
  Calendar,
  Activity,
  Bell,
  Heart,
  Plus,
  ArrowRight,
  Sparkles,
  Droplets,
  Smile,
  ShieldCheck,
  ChevronRight,
  Info,
  FileText,
  Sliders,
} from 'lucide-react';
import {
  MenstrualCycleProfile,
  MenstrualDailyLog,
  CompletedPeriodRecord,
  CyclePrediction,
  CyclePhase,
} from '../../types/menstrual';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MenstrualHomeViewProps {
  profile: MenstrualCycleProfile;
  prediction: CyclePrediction;
  todayLog?: MenstrualDailyLog;
  onOpenLogToday: () => void;
  onNavigateTab: (tab: 'home' | 'calendar' | 'insights' | 'pregnancy' | 'doctor-report' | 'settings') => void;
  onOpenPhaseInfo: (phase: CyclePhase) => void;
}

export const MenstrualHomeView: React.FC<MenstrualHomeViewProps> = ({
  profile,
  prediction,
  todayLog,
  onOpenLogToday,
  onNavigateTab,
  onOpenPhaseInfo,
}) => {
  const getPhaseName = (phase: string) => {
    switch (phase) {
      case 'menstrual':
      case 'period':
        return 'Menstrual Phase';
      case 'follicular':
        return 'Follicular Phase';
      case 'ovulation':
        return 'Ovulation Window';
      case 'luteal':
        return 'Luteal Phase';
      default:
        return 'Cycle Phase';
    }
  };

  const normalizedCurrentPhase: CyclePhase =
    prediction.currentPhase === 'menstrual' ? 'period' : (prediction.currentPhase as CyclePhase);

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Current Cycle Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 p-5 sm:p-6 text-white shadow-xl shadow-purple-900/20 space-y-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              triggerHaptic('light');
              onOpenPhaseInfo(normalizedCurrentPhase);
            }}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-2xl transition-all cursor-pointer border border-white/20 active:scale-95 text-left"
            title="Click to view full phase information"
          >
            <span className="text-xl">🌸</span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 block">
                Current Phase (Tap for Info)
              </span>
              <span className="text-xs font-black text-white flex items-center gap-1">
                <span>{getPhaseName(prediction.currentPhase)}</span>
                <Info className="w-3.5 h-3.5 text-purple-200 inline" />
              </span>
            </div>
          </button>

          <div className="text-right">
            <span className="text-xs font-bold text-purple-200 block">Next Period</span>
            <span className="text-sm font-black text-white">
              in ~{prediction.daysUntilNextPeriod} days
            </span>
          </div>
        </div>

        {/* Big Cycle Day Counter */}
        <div className="text-center py-2 space-y-1">
          <div className="text-xs font-bold text-purple-200 uppercase tracking-widest">
            Cycle Day
          </div>
          <div className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-sm">
            {prediction.currentCycleDay}
            <span className="text-2xl font-bold text-purple-300 ml-1">
              / {profile.cycleLengthDays}
            </span>
          </div>
          <p className="text-xs text-purple-100 font-medium max-w-xs mx-auto">
            {prediction.currentPhase === 'menstrual' &&
              'Bleeding phase active. Prioritize rest, warmth, and hydration.'}
            {prediction.currentPhase === 'follicular' &&
              'Estrogen rising. Energy and creativity are naturally increasing.'}
            {prediction.currentPhase === 'ovulation' &&
              'Peak fertility window. High physical energy and glow.'}
            {prediction.currentPhase === 'luteal' &&
              'Progesterone dominant. Calm routines and nutrient-dense meals support balance.'}
          </p>
        </div>

        {/* Interactive 4-Phase Timeline Bar & Clickable Icons */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[10px] text-purple-200 font-black uppercase">
            <span>Cycle Phases</span>
            <span className="text-white/80 font-medium text-[9px]">Tap any phase for details</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'period' as CyclePhase, label: 'Period', emoji: '🩸', match: 'menstrual' },
              { id: 'follicular' as CyclePhase, label: 'Follicular', emoji: '💜', match: 'follicular' },
              { id: 'ovulation' as CyclePhase, label: 'Ovulation', emoji: '⭐', match: 'ovulation' },
              { id: 'luteal' as CyclePhase, label: 'Luteal', emoji: '🌙', match: 'luteal' },
            ].map((p) => {
              const isActive =
                prediction.currentPhase === p.match ||
                (p.id === 'period' && prediction.currentPhase === 'menstrual');
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    triggerHaptic('light');
                    onOpenPhaseInfo(p.id);
                  }}
                  className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-purple-950 font-black shadow-md scale-102 ring-2 ring-purple-300'
                      : 'bg-white/15 hover:bg-white/25 text-white/90 font-bold border border-white/10'
                  }`}
                >
                  <span className="text-base">{p.emoji}</span>
                  <span className="text-[10px] leading-tight truncate">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Primary Action: Log Today */}
      <button
        type="button"
        id="menstrual-btn-log-today"
        onClick={() => {
          soundManager.playTick();
          triggerHaptic('medium');
          onOpenLogToday();
        }}
        className="w-full group relative overflow-hidden rounded-3xl p-5 sm:p-6 blessikaa-section-embossed hover:bg-purple-50/50 dark:hover:bg-[#282154] hover:border-purple-500 dark:hover:border-purple-400 text-left hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform">
            🌸
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight">
              {todayLog ? "Today's Log Updated" : 'LOG TODAY'}
            </span>
            <span className="text-xs text-purple-700 dark:text-purple-300 font-bold">
              {todayLog
                ? `${todayLog.symptoms?.length || 0} symptoms • Mood: ${todayLog.mood || 'logged'}`
                : 'Period, symptoms, mood & energy'}
            </span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/40 group-hover:bg-purple-600 group-hover:text-white text-purple-700 dark:text-purple-300 flex items-center justify-center transition-colors">
          <Plus className="w-5 h-5" />
        </div>
      </button>

      {/* 4 Feature Sub-Services Grid (2-column row, text moved to right of icon as requested) */}
      <div className="grid grid-cols-2 gap-3">
        {/* 1. Cycle Calendar */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('light');
            onNavigateTab('calendar');
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 blessikaa-section-embossed hover:bg-purple-50/50 dark:hover:bg-[#282154] hover:border-purple-500 dark:hover:border-purple-400 text-left hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center gap-2.5 sm:gap-3 cursor-pointer w-full"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
              Cycle Calendar
            </span>
            <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
              Monthly view & markers
            </span>
          </div>
        </button>

        {/* 2. Cycle Insights & Trends */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('light');
            onNavigateTab('insights');
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 blessikaa-section-embossed hover:bg-purple-50/50 dark:hover:bg-[#282154] hover:border-purple-500 dark:hover:border-purple-400 text-left hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center gap-2.5 sm:gap-3 cursor-pointer w-full"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
              Cycle Insights
            </span>
            <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
              Regularity & trends
            </span>
          </div>
        </button>

        {/* 3. Pregnancy / TTC Mode */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('light');
            onNavigateTab('pregnancy');
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 blessikaa-section-embossed hover:bg-purple-50/50 dark:hover:bg-[#282154] hover:border-purple-500 dark:hover:border-purple-400 text-left hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center gap-2.5 sm:gap-3 cursor-pointer w-full"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
              Pregnancy & TTC
            </span>
            <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
              Weeks, due date & baby
            </span>
          </div>
        </button>

        {/* 4. Doctor & Clinical Report */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('light');
            onNavigateTab('doctor-report');
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 blessikaa-section-embossed hover:bg-purple-50/50 dark:hover:bg-[#282154] hover:border-purple-500 dark:hover:border-purple-400 text-left hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center gap-2.5 sm:gap-3 cursor-pointer w-full"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
              Doctor Report
            </span>
            <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
              Clinical PDF & export
            </span>
          </div>
        </button>
      </div>

      {/* Smart Reminders Summary Banner (Updated to standardized button/card look) */}
      <div className="group relative overflow-hidden rounded-3xl p-4 sm:p-5 blessikaa-section-embossed hover:bg-purple-50/50 dark:hover:bg-[#282154] hover:border-purple-500 dark:hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10 transition-all flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
              Smart Alerts Enabled
            </span>
            <span className="text-[11px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
              Period heads-up alert 2 days before
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('light');
            onNavigateTab('settings');
          }}
          className="px-3.5 py-2 rounded-xl sm:rounded-2xl bg-purple-50 dark:bg-purple-900/40 hover:bg-purple-600 hover:text-white text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200/80 dark:border-purple-700/60 shadow-2xs hover:shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};
