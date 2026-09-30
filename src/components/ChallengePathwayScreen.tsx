import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  RotateCcw,
  Bell,
  EyeOff,
  X,
  Menu,
  AlertTriangle,
  Check,
  Lock,
  Sparkles,
  Volume2,
  Clock,
  Calendar,
  Flame,
  Shield,
  Moon,
  Infinity as InfinityIcon,
  TrendingUp,
  Award,
  Sliders,
  ChevronRight,
  HelpCircle,
  Play,
  Heart,
  ChevronLeft,
  Settings,
  Coins,
} from 'lucide-react';
import {
  Challenge,
  ChallengeMilestone,
  ChallengeNotificationConfig,
  DayLog,
  HabitRules,
  UserChallengeProgress,
} from '../types';
import {
  DEFAULT_HABIT_RULES,
  HABIT_CONTINUATION_MILESTONES,
  HabitContinuationEngine,
} from '../utils/habitContinuationEngine';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { DailyChallengeTaskScreen } from './DailyChallengeTaskScreen';
import { ChallengeLogo } from './ChallengeLogo';
import { MilestoneCelebrationModal } from './MilestoneCelebrationModal';
import { FutureDayPreviewModal } from './FutureDayPreviewModal';

export interface ContinuumCycle {
  id: string;
  label: string;
  badge: string;
  title: string;
  range: [number, number];
  milestone: { day: number; badge: string; title: string };
}

export const CONTINUUM_CYCLES: ContinuumCycle[] = [
  { id: 'cycle_1', label: 'Cycle 1', badge: '🌱', title: 'Foundation & Genesis', range: [1, 30], milestone: { day: 30, badge: '🥉', title: 'One Month Strong' } },
  { id: 'cycle_2', label: 'Cycle 2', badge: '⚡', title: 'Subconscious Solidification', range: [31, 60], milestone: { day: 50, badge: '🔥', title: 'Consistency Champion' } },
  { id: 'cycle_3', label: 'Cycle 3', badge: '💎', title: 'Discipline & Identity Shift', range: [61, 90], milestone: { day: 75, badge: '💎', title: 'Diamond Discipline' } },
  { id: 'cycle_4', label: 'Cycle 4', badge: '💯', title: 'Centurion Automaticity', range: [91, 120], milestone: { day: 100, badge: '💯', title: 'Centurion Master' } },
  { id: 'cycle_5', label: 'Cycle 5', badge: '🛡️', title: 'Habit Fortress & Half-Year', range: [121, 180], milestone: { day: 180, badge: '🛡️', title: 'Half-Year Fortress' } },
  { id: 'cycle_6', label: 'Cycle 6', badge: '👑', title: 'Annual Sovereign Flow', range: [181, 365], milestone: { day: 365, badge: '👑', title: 'Year of Sovereignty' } },
  { id: 'cycle_7', label: 'Cycle 7', badge: '🏛️', title: 'Lifelong Continuum Legacy', range: [366, 1000], milestone: { day: 1000, badge: '🏛️', title: 'Millennium Legend' } },
];

interface ChallengePathwayScreenProps {
  challenge: Challenge;
  progress: UserChallengeProgress;
  userCoins: number;
  onCompleteDay: (day: number, log: DayLog) => void;
  onUpdateReflection: (day: number, note: string) => void;
  onEarnCoins: (amount: number) => void;
  onRestartChallenge: (challengeId: string) => void;
  onHideChallenge: (challengeId: string) => void;
  onSaveNotificationConfig: (config: ChallengeNotificationConfig) => void;
  onTransitionToHabitMode?: (challengeId: string) => void;
  onUpdateHabitRules?: (challengeId: string, rules: HabitRules) => void;
  initialNotificationConfig?: ChallengeNotificationConfig;
  onOpenSettings?: () => void;
  onBack: () => void;
}

export const ChallengePathwayScreen: React.FC<ChallengePathwayScreenProps> = ({
  challenge,
  progress,
  userCoins,
  onCompleteDay,
  onUpdateReflection,
  onEarnCoins,
  onRestartChallenge,
  onHideChallenge,
  onSaveNotificationConfig,
  onTransitionToHabitMode,
  onUpdateHabitRules,
  initialNotificationConfig,
  onOpenSettings,
  onBack,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [futurePreviewDay, setFuturePreviewDay] = useState<number | null>(null);
  const [showRestartConfirm, setShowRestartConfirm] = useState<boolean>(false);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [showHabitRulesModal, setShowHabitRulesModal] = useState<boolean>(false);
  const [showMissedRecoveryModal, setShowMissedRecoveryModal] = useState<number | null>(null);
  const [selectedMilestoneToView, setSelectedMilestoneToView] = useState<ChallengeMilestone | null>(
    null
  );
  const [isArcOpen, setIsArcOpen] = useState<boolean>(false);

  // Tab mode when in Habit Mode
  const [habitViewTab, setHabitViewTab] = useState<'timeline' | 'calendar' | 'stats' | 'milestones'>(
    'timeline'
  );

  // Calendar month state
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth());

  // Habit Rules state
  const currentRules: HabitRules = progress.habitRules || { ...DEFAULT_HABIT_RULES };
  const [rulesState, setRulesState] = useState<HabitRules>(currentRules);

  // Notification state
  const [reminderTime, setReminderTime] = useState<string>(
    initialNotificationConfig?.time || currentRules.reminderTime || '09:00'
  );
  const [reminderSound, setReminderSound] = useState<'chime' | 'zen' | 'bell' | 'harp'>(
    initialNotificationConfig?.audioSound || 'chime'
  );
  const [frequency, setFrequency] = useState<'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'>(
    initialNotificationConfig?.frequency || 'daily'
  );
  const [mode, setMode] = useState<'fixed' | 'alternate'>(
    initialNotificationConfig?.mode || 'fixed'
  );

  // Check state and lifecycle
  const currentDay = progress.currentDay || 1;
  const is21Completed =
    progress.isCompleted ||
    (Object.values(progress.dayLogs || {}) as DayLog[]).filter((l) => l.completed).length >= 21;
  const isHabitMode = progress.status === 'habit_mode' || currentDay > 21;

  // Cycle navigation & horizon for Habit Continuum
  const [selectedCycleIndex, setSelectedCycleIndex] = useState<number>(() => {
    const foundIdx = CONTINUUM_CYCLES.findIndex(
      (c) => currentDay >= c.range[0] && currentDay <= c.range[1]
    );
    return foundIdx !== -1 ? foundIdx : 0;
  });
  const [timelineDisplayMode, setTimelineDisplayMode] = useState<'cycle' | 'stream'>('cycle');
  const [continuousHorizon, setContinuousHorizon] = useState<number>(() =>
    Math.max(currentDay + 30, 60)
  );

  // Compute stats
  const stats = HabitContinuationEngine.calculateStats(progress, challenge);

  // Determine active continuum cycle
  const activeCycle = CONTINUUM_CYCLES[selectedCycleIndex] || CONTINUUM_CYCLES[0];

  const handleDayClick = (dayNum: number) => {
    soundManager.playTick();
    const dayLog = progress.dayLogs[dayNum];
    const isDayCompleted = dayLog?.completed;
    const isRest = dayLog?.isRestDay || dayLog?.status === 'REST_DAY';

    if (dayNum <= currentDay || isDayCompleted || isRest) {
      setSelectedDay(dayNum);
    } else {
      // Future day: show FutureDayPreviewModal with full tasks & neuro insight
      setFuturePreviewDay(dayNum);
    }
  };

  const handleTriggerContinueHabit = () => {
    soundManager.playCelebration();
    triggerHaptic('success');
    if (onTransitionToHabitMode) {
      onTransitionToHabitMode(challenge.id);
    }
  };

  const handleConfirmRestart = () => {
    soundManager.playSuccess();
    onRestartChallenge(challenge.id);
    setShowRestartConfirm(false);
    setIsArcOpen(false);
  };

  const handleConfirmHide = () => {
    soundManager.playTick();
    onHideChallenge(challenge.id);
    setIsArcOpen(false);
    onBack();
  };

  const handleSaveNotifications = () => {
    soundManager.playSuccess();
    const config: ChallengeNotificationConfig = {
      challengeId: challenge.id,
      enabled: true,
      time: reminderTime,
      audioSound: reminderSound,
      frequency,
      mode,
    };
    onSaveNotificationConfig(config);
    setShowNotificationModal(false);
    setIsArcOpen(false);
  };

  const handleSaveHabitRules = () => {
    soundManager.playSuccess();
    if (onUpdateHabitRules) {
      onUpdateHabitRules(challenge.id, rulesState);
    }
    setShowHabitRulesModal(false);
  };

  // Recovery helpers
  const handleRecoverRestDay = (dayNum: number) => {
    soundManager.playSuccess();
    triggerHaptic('medium');
    const updated = HabitContinuationEngine.markAsRestDay(progress, dayNum);
    onCompleteDay(dayNum, updated.dayLogs[dayNum]);
    setShowMissedRecoveryModal(null);
  };

  const handleRecoverUseShield = (dayNum: number) => {
    const res = HabitContinuationEngine.useStreakShield(progress, dayNum);
    if (res.success) {
      soundManager.playCelebration();
      triggerHaptic('success');
      onCompleteDay(dayNum, res.updatedProgress.dayLogs[dayNum]);
      setShowMissedRecoveryModal(null);
    } else {
      alert(res.message);
    }
  };

  // If a specific day task screen is active
  if (selectedDay !== null) {
    return (
      <DailyChallengeTaskScreen
        key={selectedDay}
        challenge={challenge}
        day={selectedDay}
        progress={progress}
        userCoins={userCoins}
        onCompleteDay={(d, log) => {
          onCompleteDay(d, log);
        }}
        onUpdateReflection={onUpdateReflection}
        onEarnCoins={onEarnCoins}
        onBack={() => setSelectedDay(null)}
        onOpenSettings={onOpenSettings}
        onNavigateDay={(nextDay) => setSelectedDay(nextDay)}
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-2 px-3 sm:px-4 animate-fadeIn relative pb-28">
      {/* Top Header Bar: Icon and Text Label in ONE ROW */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <button
          type="button"
          onClick={onBack}
          className="p-2.5 rounded-2xl bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#F6F2FF] transition-all cursor-pointer shadow-xs shrink-0 active:scale-95"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2.5 min-w-0 flex-1 px-1">
          <ChallengeLogo
            challengeTitle={challenge.title}
            category={challenge.category}
            size="md"
          />
          <h1 className="text-base sm:text-lg font-black text-[#17142B] dark:text-white truncate">
            {challenge.title}
          </h1>
        </div>

        {/* Right spacing anchor to maintain title balance */}
        <div className="w-10 shrink-0" />
      </div>

      {/* Habit Mode Main Banner or Encouragement Quote */}
      {isHabitMode ? (
        <div className="mb-4 p-4.5 rounded-3xl bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 text-white shadow-lg shadow-purple-900/15 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>🌱 HABIT MODE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                DAY {currentDay} <span className="text-purple-300 text-base font-normal">of ∞</span>
              </h2>
            </div>

            <div className="text-right space-y-1">
              <div className="text-xs font-bold text-purple-200">
                Next: {stats.nextMilestone.badge} Day {stats.nextMilestone.day}
              </div>
              <button
                type="button"
                onClick={() => {
                  const targetDay = progress.dayLogs[currentDay]?.completed ? currentDay + 1 : currentDay;
                  handleDayClick(targetDay);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white text-purple-900 font-black text-xs shadow-sm hover:bg-purple-50 cursor-pointer active:scale-95 transition-all inline-flex items-center gap-1"
              >
                <span>{progress.dayLogs[currentDay]?.completed ? `ADVANCE TO DAY ${currentDay + 1} →` : 'COMPLETE TODAY'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-purple-700" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Encouragement Quote replacing old text */
        <div className="text-center my-3.5 px-3">
          <p className="text-xs sm:text-sm font-semibold text-[#6C648B] dark:text-[#B6ADDC] leading-relaxed max-w-sm mx-auto italic">
            "Small Steps Taken Daily Might Let You With Better Tomorrow."
            <span className="block mt-0.5 not-italic font-bold text-[#6C3FE8] dark:text-[#C4B5FD] text-[11px] sm:text-xs">
              - Blessikaa
            </span>
          </p>
        </div>
      )}

      {/* 21-Day Completion Banner if reached Day 21 but not yet in habit mode */}
      {is21Completed && !isHabitMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-4.5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 text-white shadow-xl shadow-amber-500/20 border border-amber-300/40 text-center space-y-2.5"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🏆</span>
            <span className="text-base font-black tracking-tight">21-Day Milestone Conquered!</span>
          </div>
          <p className="text-xs text-amber-100 max-w-xs mx-auto leading-relaxed">
            You have wired the foundation. Continue beyond Day 21 to lock in your permanent habit!
          </p>

          <button
            type="button"
            onClick={handleTriggerContinueHabit}
            className="w-full py-3 bg-white text-purple-900 font-black text-xs sm:text-sm rounded-2xl shadow-md hover:bg-purple-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <InfinityIcon className="w-4 h-4 text-purple-700" />
            <span>CONTINUE THE HABIT (DAY 22 → ∞)</span>
            <ChevronRight className="w-4 h-4 text-purple-700" />
          </button>
        </motion.div>
      )}

      {/* Habit Mode View Tabs */}
      {isHabitMode && (
        <div className="flex items-center gap-1 p-1 bg-[#F2ECFD] dark:bg-[#251F4A] rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setHabitViewTab('timeline')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              habitViewTab === 'timeline'
                ? 'bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] shadow-xs'
                : 'text-[#6F678F] dark:text-[#A79ECB]'
            }`}
          >
            <span>Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setHabitViewTab('calendar')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              habitViewTab === 'calendar'
                ? 'bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] shadow-xs'
                : 'text-[#6F678F] dark:text-[#A79ECB]'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => setHabitViewTab('stats')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              habitViewTab === 'stats'
                ? 'bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] shadow-xs'
                : 'text-[#6F678F] dark:text-[#A79ECB]'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>Stats</span>
          </button>

          <button
            type="button"
            onClick={() => setHabitViewTab('milestones')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              habitViewTab === 'milestones'
                ? 'bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] shadow-xs'
                : 'text-[#6F678F] dark:text-[#A79ECB]'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>Milestones</span>
          </button>
        </div>
      )}

      {/* ================= VIEW 1: TIMELINE / GRID ================= */}
      {(!isHabitMode || habitViewTab === 'timeline') && (
        <div className="bg-white dark:bg-[#1E1A3D] border border-[#E9E1FC] dark:border-[#352F63] rounded-3xl p-5 shadow-xs mb-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                {isHabitMode ? 'Habit Continuum Pathway' : '21-Day Foundation Pathway'}
              </span>
              {isHabitMode && (
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                  {timelineDisplayMode === 'cycle'
                    ? `${activeCycle.label}: Days ${activeCycle.range[0]} – ${activeCycle.range[1]}`
                    : `Continuous Stream (Days 1 – ${continuousHorizon})`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isHabitMode && (
                <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#251F4A] text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setTimelineDisplayMode('cycle');
                    }}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      timelineDisplayMode === 'cycle'
                        ? 'bg-white dark:bg-[#1E1A3D] text-purple-600 dark:text-purple-300 shadow-xs'
                        : 'text-slate-500 hover:text-purple-500'
                    }`}
                  >
                    Cycles
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setTimelineDisplayMode('stream');
                    }}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      timelineDisplayMode === 'stream'
                        ? 'bg-white dark:bg-[#1E1A3D] text-purple-600 dark:text-purple-300 shadow-xs'
                        : 'text-slate-500 hover:text-purple-500'
                    }`}
                  >
                    Stream
                  </button>
                </div>
              )}
              <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-300">
                {stats.completedDays} Completed
              </span>
            </div>
          </div>

          {/* Continuum Cycles Navigation (when in cycle mode) */}
          {isHabitMode && timelineDisplayMode === 'cycle' && (
            <div className="space-y-2.5 mb-4">
              {/* Cycle Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CONTINUUM_CYCLES.map((cycle, idx) => {
                  const isCurrentCycle = currentDay >= cycle.range[0] && currentDay <= cycle.range[1];
                  const isSelected = selectedCycleIndex === idx;
                  return (
                    <button
                      key={cycle.id}
                      type="button"
                      onClick={() => {
                        soundManager.playTick();
                        setSelectedCycleIndex(idx);
                      }}
                      className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 ring-2 ring-purple-400'
                          : isCurrentCycle
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                          : 'bg-slate-100 dark:bg-[#251F4A] text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-[#2A2357]'
                      }`}
                    >
                      <span>{cycle.badge}</span>
                      <span>{cycle.label}</span>
                      {isCurrentCycle && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Active Step Here" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Cycle Info Card */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-[#251F4A] dark:to-[#2B2357] border border-purple-100 dark:border-purple-900/40 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-black text-purple-950 dark:text-white flex items-center gap-1 truncate">
                    <span>{activeCycle.badge}</span>
                    <span>{activeCycle.title}</span>
                  </div>
                  <div className="text-[10px] text-purple-700 dark:text-purple-300 mt-0.5">
                    Days {activeCycle.range[0]} – {activeCycle.range[1]} • Target: {activeCycle.milestone.badge} Day {activeCycle.milestone.day} ({activeCycle.milestone.title})
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {selectedCycleIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playTick();
                        setSelectedCycleIndex(selectedCycleIndex - 1);
                      }}
                      className="p-1.5 rounded-lg bg-white dark:bg-[#1E1A3D] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 transition-colors cursor-pointer"
                      title="Previous Cycle"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {selectedCycleIndex < CONTINUUM_CYCLES.length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playTick();
                        setSelectedCycleIndex(selectedCycleIndex + 1);
                      }}
                      className="p-1.5 rounded-lg bg-white dark:bg-[#1E1A3D] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 transition-colors cursor-pointer"
                      title="Next Cycle"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Days Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {(isHabitMode
              ? timelineDisplayMode === 'cycle'
                ? Array.from(
                    { length: activeCycle.range[1] - activeCycle.range[0] + 1 },
                    (_, i) => activeCycle.range[0] + i
                  )
                : Array.from({ length: continuousHorizon }, (_, i) => i + 1)
              : Array.from({ length: 21 }, (_, i) => i + 1)
            ).map((dayNum) => {
              const log = progress.dayLogs[dayNum];
              const isCompleted = log?.completed;
              const isRest = log?.isRestDay || log?.status === 'REST_DAY';
              const isShielded = log?.shieldUsed;
              const isMissed = log?.isMissed || (dayNum < currentDay && !isCompleted && !isRest && !isShielded);
              const isAvailable = dayNum <= currentDay;
              const isCurrent = dayNum === currentDay && !isCompleted && !isRest;
              const isMilestoneDay = [21, 30, 50, 75, 100, 180, 365, 500, 1000].includes(dayNum);

              return (
                <motion.button
                  key={dayNum}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    if (isMissed) {
                      setShowMissedRecoveryModal(dayNum);
                    } else {
                      handleDayClick(dayNum);
                    }
                  }}
                  className={`aspect-square rounded-2xl font-bold text-xs sm:text-sm flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-[#22C55E] text-white shadow-md shadow-emerald-500/20'
                      : isRest || isShielded
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : isCurrent
                      ? 'bg-[#FAF7FF] dark:bg-[#2A2357] text-[#6C3FE8] dark:text-[#C4B5FD] border-2 border-[#6C3FE8] shadow-xs ring-2 ring-purple-400/30'
                      : isMissed
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                      : isAvailable
                      ? 'bg-[#F9F7FD] dark:bg-[#251F4A] text-[#484266] dark:text-[#C5BEDE] border border-[#E9E1FC] dark:border-[#373067]'
                      : 'bg-[#F3F0FA] dark:bg-[#1E1A38] text-[#8F88A8] dark:text-[#676088] border border-[#EBE5F7] dark:border-[#2D2754] opacity-85 hover:border-purple-300'
                  }`}
                >
                  <span className="leading-none">{dayNum}</span>

                  {isCompleted && (
                    <Check className="w-3.5 h-3.5 mt-0.5 text-white stroke-[3]" />
                  )}
                  {isRest && <Moon className="w-3 h-3 mt-0.5 text-amber-600 fill-amber-500" />}
                  {isShielded && <Shield className="w-3 h-3 mt-0.5 text-purple-600 fill-purple-500" />}
                  {isMissed && <span className="text-[10px] mt-0.5">⚠</span>}
                  {!isAvailable && !isCompleted && !isRest && (
                    <Lock className="w-2.5 h-2.5 mt-0.5 text-[#A59EBF] dark:text-[#787198]" />
                  )}

                  {/* Tiny milestone star on landmark days */}
                  {isMilestoneDay && (
                    <span className="absolute -top-1 -right-1 text-[10px]" title={`Milestone Day ${dayNum}`}>⭐</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Continuous Stream: Load More Ahead */}
          {isHabitMode && timelineDisplayMode === 'stream' && (
            <button
              type="button"
              onClick={() => {
                soundManager.playTick();
                setContinuousHorizon(prev => prev + 30);
              }}
              className="w-full mt-3.5 py-2.5 rounded-2xl bg-purple-50 dark:bg-[#251F4A] hover:bg-purple-100 dark:hover:bg-[#2F275E] text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <span>+ Load Next 30 Days Ahead (Expand to Day {continuousHorizon + 30})</span>
            </button>
          )}

          {/* Quick Legend */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap mt-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Completed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" /> Active Today
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Rest Day
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" /> Future / Preview
            </span>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: CALENDAR ================= */}
      {isHabitMode && habitViewTab === 'calendar' && (
        <div className="bg-white dark:bg-[#1E1A3D] border border-[#E9E1FC] dark:border-[#352F63] rounded-3xl p-5 shadow-xs mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {new Date(calendarYear, calendarMonth).toLocaleDateString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (calendarMonth === 0) {
                    setCalendarMonth(11);
                    setCalendarYear(calendarYear - 1);
                  } else {
                    setCalendarMonth(calendarMonth - 1);
                  }
                }}
                className="p-1 rounded-lg hover:bg-purple-50 dark:hover:bg-[#282153] text-purple-700 dark:text-purple-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (calendarMonth === 11) {
                    setCalendarMonth(0);
                    setCalendarYear(calendarYear + 1);
                  } else {
                    setCalendarMonth(calendarMonth + 1);
                  }
                }}
                className="p-1 rounded-lg hover:bg-purple-50 dark:hover:bg-[#282153] text-purple-700 dark:text-purple-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((dayName) => (
              <span key={dayName} className="text-[10px] font-bold text-slate-400">
                {dayName}
              </span>
            ))}

            {HabitContinuationEngine.getCalendarMonthMatrix(
              progress,
              calendarYear,
              calendarMonth
            ).map((cDay, idx) => {
              if (cDay.status === 'EMPTY') {
                return <div key={`empty_${idx}`} className="aspect-square" />;
              }

              const isCompleted = cDay.status === 'COMPLETED';
              const isRest = cDay.status === 'REST';
              const isMissed = cDay.status === 'MISSED';
              const isAvailable = cDay.status === 'AVAILABLE';

              return (
                <div
                  key={`day_${cDay.dayNumber}`}
                  onClick={() => {
                    if (cDay.challengeDay) {
                      handleDayClick(cDay.challengeDay);
                    }
                  }}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isRest
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : isMissed
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300'
                      : isAvailable
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 ring-2 ring-purple-400'
                      : 'bg-slate-50 dark:bg-[#26204C] text-slate-400'
                  }`}
                >
                  <span>{cDay.dayNumber}</span>
                  {isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  {isRest && <Moon className="w-2.5 h-2.5" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= VIEW 3: STATISTICS ================= */}
      {isHabitMode && habitViewTab === 'stats' && (
        <div className="bg-white dark:bg-[#1E1A3D] border border-[#E9E1FC] dark:border-[#352F63] rounded-3xl p-5 shadow-xs mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Habit Performance & Analytics
            </h3>
            <button
              type="button"
              onClick={() => setShowHabitRulesModal(true)}
              className="text-xs font-bold text-purple-600 dark:text-purple-300 hover:underline flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Habit Rules</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-[#282154] border border-purple-100 dark:border-purple-900/50">
              <div className="text-lg font-black text-purple-800 dark:text-purple-200">
                {stats.currentStreak} Days
              </div>
              <div className="text-[10px] text-purple-600 dark:text-purple-300 uppercase font-bold tracking-wider">
                Current Streak
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
              <div className="text-lg font-black text-amber-800 dark:text-amber-300">
                {stats.longestStreak} Days
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold tracking-wider">
                Longest Streak
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
              <div className="text-lg font-black text-emerald-800 dark:text-emerald-300">
                {stats.completionRate}%
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">
                Completion Rate
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <div className="text-lg font-black text-indigo-800 dark:text-indigo-300">
                {stats.totalMinutes} Mins
              </div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-300 uppercase font-bold tracking-wider">
                Total Time Invested
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 4: MILESTONES ================= */}
      {isHabitMode && habitViewTab === 'milestones' && (
        <div className="bg-white dark:bg-[#1E1A3D] border border-[#E9E1FC] dark:border-[#352F63] rounded-3xl p-5 shadow-xs mb-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Continuum Milestones (Day 21 → 1,000)
          </h3>

          <div className="space-y-2.5">
            {HABIT_CONTINUATION_MILESTONES.map((m) => {
              const isUnlocked = stats.completedDays >= m.day;
              return (
                <div
                  key={m.day}
                  onClick={() => setSelectedMilestoneToView(m)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isUnlocked
                      ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                      : 'bg-slate-50 dark:bg-[#251F49] border-slate-200 dark:border-slate-800 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E1A3D] flex items-center justify-center text-xl shadow-xs">
                      {m.badge}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Day {m.day}</span>
                        <span>•</span>
                        <span>{m.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {m.subtitle} (+{m.xp} XP)
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {isUnlocked ? 'Unlocked ✓' : 'Locked 🔒'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Fan/Arc Menu */}
      <div className="fixed bottom-24 sm:bottom-28 right-5 sm:right-8 z-40">
        <AnimatePresence>
          {isArcOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              className="absolute bottom-16 right-0 flex flex-col items-end gap-3 mb-2"
            >
              {/* Habit Rules */}
              {isHabitMode && (
                <button
                  type="button"
                  onClick={() => {
                    setShowHabitRulesModal(true);
                    setIsArcOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] text-xs font-bold rounded-2xl shadow-lg border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#FAF7FF] cursor-pointer whitespace-nowrap"
                >
                  <Sliders className="w-4 h-4 text-purple-600" />
                  <span>Habit Rules</span>
                </button>
              )}

              {/* Restart Action */}
              <button
                type="button"
                onClick={() => setShowRestartConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] text-xs font-bold rounded-2xl shadow-lg border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#FAF7FF] cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <span>Restart</span>
              </button>

              {/* Notifications Action */}
              <button
                type="button"
                onClick={() => setShowNotificationModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] text-xs font-bold rounded-2xl shadow-lg border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#FAF7FF] cursor-pointer whitespace-nowrap"
              >
                <Bell className="w-4 h-4 text-[#6C3FE8]" />
                <span>Notifications</span>
              </button>

              {/* Hide Action */}
              <button
                type="button"
                onClick={handleConfirmHide}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] text-xs font-bold rounded-2xl shadow-lg border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#FAF7FF] cursor-pointer whitespace-nowrap"
              >
                <EyeOff className="w-4 h-4 text-rose-500" />
                <span>Hide</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Arc Trigger Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            setIsArcOpen(!isArcOpen);
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer transition-all ${
            isArcOpen
              ? 'bg-rose-500 shadow-rose-500/30 rotate-90'
              : 'bg-gradient-to-tr from-[#6C3FE8] to-[#8F67F5] shadow-[#6C3FE8]/35 hover:scale-105'
          }`}
        >
          {isArcOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ================= FUTURE DAY PREVIEW MODAL ================= */}
      {futurePreviewDay !== null && (
        <FutureDayPreviewModal
          dayNumber={futurePreviewDay}
          currentDay={currentDay}
          challenge={challenge}
          onPracticeEarly={(day) => {
            setFuturePreviewDay(null);
            setSelectedDay(day);
          }}
          onClose={() => setFuturePreviewDay(null)}
        />
      )}

      {/* ================= MISSED DAY RECOVERY MODAL ================= */}
      <AnimatePresence>
        {showMissedRecoveryModal !== null && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-white dark:bg-[#1E1A3D] rounded-3xl p-6 text-center shadow-2xl border border-purple-200 dark:border-[#373068] relative space-y-4"
            >
              <div className="w-14 h-14 mx-auto bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-full flex items-center justify-center text-2xl">
                ❤️
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Missed Day {showMissedRecoveryModal}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Don't worry! Self-compassion is the secret to lifelong habits. How would you like to proceed?
                </p>
              </div>

              <div className="space-y-2 pt-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    const d = showMissedRecoveryModal;
                    setShowMissedRecoveryModal(null);
                    handleDayClick(d);
                  }}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Complete Missed Day Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRecoverRestDay(showMissedRecoveryModal)}
                  className="w-full py-3 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Moon className="w-4 h-4" />
                  <span>Mark as Rest Day (Keep Streak)</span>
                </button>

                {(progress.streakShields ?? 1) > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRecoverUseShield(showMissedRecoveryModal)}
                    className="w-full py-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Use 1 Streak Shield ({progress.streakShields ?? 2} left)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowMissedRecoveryModal(null)}
                  className="w-full py-2.5 text-slate-400 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= HABIT RULES MODAL ================= */}
      <AnimatePresence>
        {showHabitRulesModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-sm bg-white dark:bg-[#1E1A3D] rounded-3xl p-6 shadow-2xl border border-purple-200 dark:border-[#383069] relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#6C3FE8]" />
                  <h2 className="text-base font-bold text-[#17142B] dark:text-white">
                    Habit Continuum Rules
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHabitRulesModal(false)}
                  className="p-1 text-[#837B9F] hover:text-[#17142B] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Frequency */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={rulesState.frequency}
                    onChange={(e) => setRulesState({ ...rulesState, frequency: e.target.value as any })}
                    className="w-full p-2.5 bg-[#F9F7FD] dark:bg-[#26204E] border border-[#E5DEFA] dark:border-[#38316B] rounded-xl font-bold text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekdays">Weekdays (Mon-Fri)</option>
                    <option value="3x/week">3x per Week</option>
                  </select>
                </div>

                {/* Preferred Time */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    value={rulesState.preferredTime || '07:00'}
                    onChange={(e) => setRulesState({ ...rulesState, preferredTime: e.target.value })}
                    className="w-full p-2.5 bg-[#F9F7FD] dark:bg-[#26204E] border border-[#E5DEFA] dark:border-[#38316B] rounded-xl font-bold text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                {/* Target & Minimum minutes */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Min Time
                    </label>
                    <input
                      type="number"
                      value={rulesState.minCompletionMinutes}
                      onChange={(e) =>
                        setRulesState({ ...rulesState, minCompletionMinutes: parseInt(e.target.value) || 5 })
                      }
                      className="w-full p-2.5 bg-[#F9F7FD] dark:bg-[#26204E] border border-[#E5DEFA] dark:border-[#38316B] rounded-xl font-bold text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Target Time
                    </label>
                    <input
                      type="number"
                      value={rulesState.targetMinutes}
                      onChange={(e) =>
                        setRulesState({ ...rulesState, targetMinutes: parseInt(e.target.value) || 20 })
                      }
                      className="w-full p-2.5 bg-[#F9F7FD] dark:bg-[#26204E] border border-[#E5DEFA] dark:border-[#38316B] rounded-xl font-bold text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Missed-Day Behavior */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Missed-Day Behavior
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRulesState({ ...rulesState, missedDayBehavior: 'Flexible' })}
                      className={`py-2 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                        rulesState.missedDayBehavior === 'Flexible'
                          ? 'bg-[#6C3FE8] text-white'
                          : 'bg-[#F2ECFD] dark:bg-[#2B2456] text-[#554E75] dark:text-[#C5BEDE]'
                      }`}
                    >
                      Flexible (Grace Days)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRulesState({ ...rulesState, missedDayBehavior: 'Strict' })}
                      className={`py-2 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                        rulesState.missedDayBehavior === 'Strict'
                          ? 'bg-[#6C3FE8] text-white'
                          : 'bg-[#F2ECFD] dark:bg-[#2B2456] text-[#554E75] dark:text-[#C5BEDE]'
                      }`}
                    >
                      Strict
                    </button>
                  </div>
                </div>

                {/* Allow Rest Days Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Allow Rest Days</span>
                  <input
                    type="checkbox"
                    checked={rulesState.allowRestDays}
                    onChange={(e) => setRulesState({ ...rulesState, allowRestDays: e.target.checked })}
                    className="w-4 h-4 accent-purple-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveHabitRules}
                className="w-full mt-5 py-3 bg-[#6C3FE8] text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer"
              >
                Save Habit Rules
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= RESTART CONFIRM MODAL ================= */}
      <AnimatePresence>
        {showRestartConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-white dark:bg-[#1E1A3D] rounded-3xl p-6 text-center shadow-2xl border border-[#E9E1FC] dark:border-[#352F63] relative"
            >
              <div className="w-14 h-14 mx-auto bg-amber-100 dark:bg-amber-950/60 text-amber-500 rounded-full flex items-center justify-center text-2xl mb-3">
                <RotateCcw className="w-7 h-7" />
              </div>

              <h2 className="text-lg font-bold text-[#17142B] dark:text-white mb-1.5">
                Restart Challenge?
              </h2>
              <p className="text-xs text-[#736B92] dark:text-[#B2A8D6] mb-5 leading-relaxed">
                This will reset your current progress in "{challenge.title}" back to Day 1 so you can start fresh.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowRestartConfirm(false)}
                  className="flex-1 py-3 bg-[#F2ECFD] dark:bg-[#2A2454] text-[#6C3FE8] dark:text-[#C4B5FD] text-xs font-bold rounded-2xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRestart}
                  className="flex-1 py-3 bg-amber-500 text-white text-xs font-bold rounded-2xl shadow-md shadow-amber-500/25 cursor-pointer hover:bg-amber-600"
                >
                  Yes, Restart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= NOTIFICATIONS MODAL ================= */}
      <AnimatePresence>
        {showNotificationModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-sm bg-white dark:bg-[#1E1A3D] rounded-3xl p-6 shadow-2xl border border-[#E9E1FC] dark:border-[#352F63] relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#6C3FE8]" />
                  <h2 className="text-base font-bold text-[#17142B] dark:text-white">
                    Notifications & Reminders
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotificationModal(false)}
                  className="p-1 text-[#837B9F] hover:text-[#17142B] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Time picker */}
                <div>
                  <label className="block font-bold text-[#554E75] dark:text-[#C7BEE6] mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Reminder Time</span>
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full p-3 bg-[#F9F7FD] dark:bg-[#26204E] border border-[#E5DEFA] dark:border-[#38316B] rounded-2xl font-bold text-sm text-[#17142B] dark:text-white focus:outline-hidden"
                  />
                </div>

                {/* Sound Chime picker */}
                <div>
                  <label className="block font-bold text-[#554E75] dark:text-[#C7BEE6] mb-1.5 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Chime Sound Effect</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['chime', 'zen', 'bell', 'harp'] as const).map((snd) => (
                      <button
                        key={snd}
                        type="button"
                        onClick={() => {
                          setReminderSound(snd);
                          soundManager.playSuccess();
                        }}
                        className={`py-2 px-1 rounded-xl font-bold text-[11px] capitalize cursor-pointer transition-all ${
                          reminderSound === snd
                            ? 'bg-[#6C3FE8] text-white shadow-xs'
                            : 'bg-[#F2ECFD] dark:bg-[#2B2456] text-[#554E75] dark:text-[#C5BEDE]'
                        }`}
                      >
                        {snd}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block font-bold text-[#554E75] dark:text-[#C7BEE6] mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Frequency</span>
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full p-3 bg-[#F9F7FD] dark:bg-[#26204E] border border-[#E5DEFA] dark:border-[#38316B] rounded-2xl font-medium text-xs text-[#17142B] dark:text-white focus:outline-hidden"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveNotifications}
                className="w-full mt-5 py-3.5 bg-gradient-to-r from-[#6C3FE8] to-[#8F67F5] text-white text-xs font-bold rounded-2xl shadow-md shadow-[#6C3FE8]/25 cursor-pointer hover:scale-[1.01] transition-transform"
              >
                Save Notification Setup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MILESTONE DETAIL MODAL ================= */}
      {selectedMilestoneToView && (
        <MilestoneCelebrationModal
          milestone={selectedMilestoneToView}
          challenge={challenge}
          streak={stats.currentStreak}
          completionRate={stats.completionRate}
          totalCompletedDays={stats.completedDays}
          onContinue={() => setSelectedMilestoneToView(null)}
          onClose={() => setSelectedMilestoneToView(null)}
        />
      )}
    </div>
  );
};
