import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Lightbulb,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Clock,
  Send,
  Edit3,
  Gift,
  Check,
  Lock,
  ShieldAlert,
  Disc,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Challenge, DayLog, UserChallengeProgress } from '../types';
import { HabitContinuationEngine } from '../utils/habitContinuationEngine';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { ScratchCard } from './ScratchCard';
import { LockedDayModal } from './LockedDayModal';
import { PenaltyRewardModal } from './PenaltyRewardModal';

interface TodayMissionProps {
  challenge: Challenge;
  progress: UserChallengeProgress;
  onUpdateDayLog: (day: number, log: DayLog) => void;
  onCompleteDay: (day: number, log: DayLog) => void;
  onOpenCoach: () => void;
  onOpenWheel?: () => void;
  theme?: 'dark' | 'light';
}

export const TodayMission: React.FC<TodayMissionProps> = ({
  challenge,
  progress,
  onUpdateDayLog,
  onCompleteDay,
  onOpenCoach,
  onOpenWheel,
  theme = 'light',
}) => {
  const currentActiveDay = progress.currentDay || 1;
  const [selectedDay, setSelectedDay] = useState<number>(currentActiveDay);
  const [lockedModalDay, setLockedModalDay] = useState<number | null>(null);
  const [showPenaltyRewardModal, setShowPenaltyRewardModal] = useState(false);

  // Sync selected day when challenge or progress changes
  useEffect(() => {
    setSelectedDay(progress.currentDay || 1);
  }, [progress.currentDay, challenge.id]);

  const isHabitMode = progress.status === 'habit_mode' || currentActiveDay > 21;
  const currentPlan = HabitContinuationEngine.getDayPlan(challenge, selectedDay);
  const existingLog = progress.dayLogs[selectedDay] || {
    completed: false,
    completedTasks: [],
    reflectionNote: '',
    scratched: false,
  };

  const [checkedTasks, setCheckedTasks] = useState<string[]>(existingLog.completedTasks || []);
  const [reflectionText, setReflectionText] = useState<string>(existingLog.reflectionNote || '');
  const [selectedMood, setSelectedMood] = useState<string | undefined>(existingLog.mood);
  const [isScratched, setIsScratched] = useState<boolean>(
    existingLog.scratched || existingLog.completed || false
  );

  // Sync local states on day switch
  useEffect(() => {
    const log = progress.dayLogs[selectedDay];
    setCheckedTasks(log?.completedTasks || []);
    setReflectionText(log?.reflectionNote || '');
    setSelectedMood(log?.mood);
    setIsScratched(log?.scratched || log?.completed || false);
  }, [selectedDay, progress.dayLogs]);

  // Focus Timer state
  const defaultTimerSecs = (currentPlan?.timer || currentPlan?.suggestedTimerMinutes || 15) * 60;
  const [timerSeconds, setTimerSeconds] = useState<number>(defaultTimerSecs);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  useEffect(() => {
    setTimerSeconds((currentPlan?.timer || currentPlan?.suggestedTimerMinutes || 15) * 60);
    setTimerActive(false);
  }, [selectedDay, currentPlan]);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            soundManager.playTimerDone();
            triggerHaptic('success');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const handleSelectDay = (dayNum: number) => {
    soundManager.playTick();
    // Check if day is locked (future day beyond current active day)
    if (dayNum > currentActiveDay) {
      triggerHaptic('heavy');
      setLockedModalDay(dayNum);
      return;
    }

    triggerHaptic('light');
    setSelectedDay(dayNum);
  };

  const handleRevealScratch = () => {
    setIsScratched(true);
    soundManager.playCelebration();
    triggerHaptic('success');
    onUpdateDayLog(selectedDay, {
      ...existingLog,
      scratched: true,
    });
  };

  const toggleTask = (taskText: string) => {
    soundManager.playTick();
    triggerHaptic('light');
    let updated: string[];
    if (checkedTasks.includes(taskText)) {
      updated = checkedTasks.filter((t) => t !== taskText);
    } else {
      updated = [...checkedTasks, taskText];
    }
    setCheckedTasks(updated);

    // Save partial update
    onUpdateDayLog(selectedDay, {
      ...existingLog,
      completedTasks: updated,
      reflectionNote: reflectionText,
      mood: selectedMood,
      scratched: true,
    });
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    soundManager.playTick();
    triggerHaptic('light');
    onUpdateDayLog(selectedDay, {
      ...existingLog,
      completedTasks: checkedTasks,
      reflectionNote: reflectionText,
      mood,
      scratched: true,
    });
  };

  const handleSaveReflection = () => {
    soundManager.playTick();
    triggerHaptic('medium');
    onUpdateDayLog(selectedDay, {
      ...existingLog,
      completedTasks: checkedTasks,
      reflectionNote: reflectionText,
      mood: selectedMood,
      scratched: true,
    });
  };

  const handleFinishDay = () => {
    soundManager.playCelebration();
    triggerHaptic('success');

    // Confetti explosion
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#fb923c', '#f43f5e', '#fde047'],
    });

    const newLog: DayLog = {
      completed: true,
      completedAt: new Date().toISOString(),
      completedTasks: checkedTasks.length > 0 ? checkedTasks : currentPlan.tasks,
      reflectionNote: reflectionText,
      mood: selectedMood || '☀️ Unstoppable',
      timeSpentMinutes: currentPlan.estimatedMinutes || 15,
      scratched: true,
    };

    onCompleteDay(selectedDay, newLog);
  };

  // Phase computation
  const phaseTitle =
    selectedDay <= 7
      ? 'Phase 1: Neural Foundation & Micro-Habits'
      : selectedDay <= 14
      ? 'Phase 2: Momentum Breakthrough'
      : 'Phase 3: Solidification & Mastery';

  const completedDaysCount = (
    Object.values(progress.dayLogs) as DayLog[]
  ).filter((l) => l.completed).length;
  const progressPercent = Math.round((completedDaysCount / 21) * 100);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const actionList = currentPlan.actionChecklist || currentPlan.tasks || [
    'Execute core focus task for today',
    'Review mental cues and friction triggers',
    'Log reflection & plan tomorrow’s routine',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 p-5 sm:p-6 text-white shadow-xl shadow-purple-900/10 border border-purple-400/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-purple-300/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-300/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/20 text-white border border-white/30">
                {phaseTitle}
              </span>
              <span className="text-xs text-purple-200 font-medium">
                Day {selectedDay} of 21
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {challenge.title}
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 line-clamp-1 max-w-xl">
              {challenge.description}
            </p>
          </div>

          {/* Progress Pill & Quick Actions */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-purple-100">
                <span>Transformation</span>
                <span className="text-amber-300 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-32 h-2 rounded-full bg-purple-950/40 overflow-hidden border border-white/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-200 via-amber-200 to-amber-300 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[10px] text-purple-200 font-medium">
                {completedDaysCount}/21 Days Completed
              </div>
            </div>
          </div>
        </div>

        {/* 21-Day Step Carousel with Locked Logic */}
        <div className="mt-5 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-200">
                21-Day Journey
              </span>
              <span className="text-[10px] text-purple-300 bg-white/10 px-2 py-0.5 rounded-full font-medium">
                Active: Day {currentActiveDay}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (selectedDay > 1) {
                    handleSelectDay(selectedDay - 1);
                  }
                }}
                disabled={selectedDay <= 1}
                className="p-1 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (selectedDay < 21) {
                    handleSelectDay(selectedDay + 1);
                  }
                }}
                disabled={selectedDay >= 21}
                className="p-1 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Days Grid / Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {Array.from({ length: isHabitMode ? Math.max(currentActiveDay + 14, 35) : 21 }, (_, i) => {
              const dNum = i + 1;
              const isSelected = selectedDay === dNum;
              const isDone = progress.dayLogs[dNum]?.completed;
              const isFutureLocked = dNum > currentActiveDay;
              const isToday = dNum === currentActiveDay;

              return (
                <button
                  key={dNum}
                  onClick={() => handleSelectDay(dNum)}
                  className={`shrink-0 w-10 h-11 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                    isSelected
                      ? 'bg-white text-purple-900 font-black ring-2 ring-purple-300 shadow-md scale-105'
                      : isDone
                      ? 'bg-white/25 border border-emerald-300/60 text-white font-semibold'
                      : isToday
                      ? 'bg-white/20 border-2 border-amber-300 text-white font-bold animate-pulse'
                      : isFutureLocked
                      ? 'bg-white/5 border border-white/10 text-purple-300/60 cursor-pointer hover:bg-white/15'
                      : 'bg-white/10 border border-white/10 text-purple-200 hover:bg-white/20'
                  }`}
                  title={isFutureLocked ? `Day ${dNum} (Ahead - Preview or Practice)` : `Day ${dNum}`}
                >
                  <span className="text-[11px] leading-none">{dNum}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-300 mt-0.5 fill-emerald-400/20" />
                  ) : isFutureLocked ? (
                    <Lock className="w-2.5 h-2.5 text-purple-300/80 mt-0.5" />
                  ) : isToday ? (
                    <Sparkles className="w-2.5 h-2.5 text-amber-300 mt-0.5" />
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-white/40 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Action Hub Bars for Penalties, Rewards & Spin Wheel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Penalty & Reward Quick Bar */}
        <button
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('light');
            setShowPenaltyRewardModal(true);
          }}
          className="p-3.5 rounded-2xl bg-white hover:bg-purple-50/70 border border-purple-100 hover:border-purple-300 text-slate-800 shadow-xs flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg">
              ⚖️
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700">
                Custom Penalties & Rewards
              </span>
              <span className="text-[10px] text-slate-500">
                Set Miss Fines & Victory Incentives
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 font-bold text-[11px] border border-purple-200">
            Setup
          </span>
        </button>

        {/* Daily Wheel Shortcut */}
        {onOpenWheel && (
          <button
            onClick={() => {
              soundManager.playTick();
              triggerHaptic('light');
              onOpenWheel();
            }}
            className="p-3.5 rounded-2xl bg-white hover:bg-purple-50/70 border border-purple-100 hover:border-purple-300 text-slate-800 shadow-xs flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
                🎡
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700">
                  Daily Lucky Spin Wheel
                </span>
                <span className="text-[10px] text-slate-500">
                  Win Bonus XP & Streak Freezes
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200">
              Spin
            </span>
          </button>
        )}
      </div>

      {/* Main Day Content Area */}
      {!isScratched ? (
        /* Scratch Card to Reveal Day's Mission */
        <div className="rounded-3xl bg-white border border-purple-100 p-6 text-center space-y-4 shadow-md">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
              <Sparkles className="text-purple-600" size={20} />
              Day {selectedDay} Mystery Mission
            </h3>
            <p className="text-xs text-slate-500">
              Scratch below with your finger or cursor to reveal today's habit mission, checklist, and psychology tip!
            </p>
          </div>

          <div className="flex justify-center py-2">
            <ScratchCard
              reward={{
                icon: '🎁',
                title: `Day ${selectedDay}: ${currentPlan.title}`,
                description: currentPlan.description,
                xp: 100,
              }}
              onReveal={handleRevealScratch}
              size="medium"
              theme="light"
            />
          </div>

          <button
            onClick={handleRevealScratch}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all"
          >
            🎁 Open Day {selectedDay} Mission Directly
          </button>
        </div>
      ) : (
        /* Main Day Mission Tasks & Controls */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Mission Tasks & Execution */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl bg-white border border-purple-100 p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold">
                      DAY {selectedDay} MISSION
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3 text-purple-600" />
                      ~{currentPlan.estimatedMinutes || 15} mins
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    {currentPlan.title}
                  </h3>
                </div>

                {existingLog.completed ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-semibold shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Completed
                  </div>
                ) : (
                  <button
                    onClick={onOpenCoach}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition-all shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Ask AI Coach
                  </button>
                )}
              </div>

              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 text-sm text-slate-700 leading-relaxed">
                {currentPlan.description}
              </div>

              {/* Action Checklist */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    ACTION CHECKLIST ({checkedTasks.length}/{actionList.length})
                  </h4>
                  {checkedTasks.length === actionList.length && (
                    <span className="text-[11px] font-semibold text-emerald-600">
                      All tasks completed!
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {actionList.map((taskText, idx) => {
                    const isChecked = checkedTasks.includes(taskText);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleTask(taskText)}
                        className={`group flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-purple-50/30 border-purple-200 text-slate-400 line-through'
                            : 'bg-white hover:bg-purple-50/50 border-purple-100 hover:border-purple-300 text-slate-800 shadow-xs'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 text-purple-600 group-hover:scale-110 transition-transform"
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-5 h-5 text-purple-600 fill-purple-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                        </button>
                        <span className="text-xs sm:text-sm font-semibold leading-tight">
                          {taskText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Habit Psychology Tip */}
              {(currentPlan.psychologyTip || currentPlan.tip) && (
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-xs">
                    <span className="font-bold text-purple-900">Habit Psychology Tip:</span>
                    <p className="text-slate-700 leading-snug">
                      {currentPlan.psychologyTip || currentPlan.tip}
                    </p>
                  </div>
                </div>
              )}

              {/* Complete Day CTA */}
              <div className="pt-3 border-t border-purple-100">
                <button
                  id="complete-day-cta"
                  onClick={handleFinishDay}
                  className="w-full py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-600/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 text-white" />
                  <span>
                    {existingLog.completed
                      ? `Update Day ${selectedDay} Status 🏆`
                      : `Complete Day ${selectedDay} & Claim +100 XP 🏆`}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Col: Timer & Reflection Note */}
          <div className="space-y-6">
            {/* 15-Minute Action Habit Timer Widget */}
            <div className="rounded-3xl bg-white border border-purple-100 p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    ACTION HABIT TIMER
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500">
                  {currentPlan.timer || currentPlan.suggestedTimerMinutes || 15}m sprint
                </span>
              </div>

              {/* Big Digital Mono Countdown */}
              <div className="text-center py-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                <div className="text-4xl sm:text-5xl font-mono text-purple-950 font-black tracking-wider">
                  {formatTimer(timerSeconds)}
                </div>
                <span className="text-[10px] text-purple-700 font-semibold mt-1 block">
                  {timerActive ? '⚡ Deep Focus In Progress' : 'Ready to Start Sprint'}
                </span>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setTimerActive(!timerActive);
                    soundManager.playTick();
                    triggerHaptic('medium');
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    timerActive
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {timerActive ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Habit Timer</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setTimerActive(false);
                    setTimerSeconds(defaultTimerSecs);
                    soundManager.playTick();
                    triggerHaptic('light');
                  }}
                  className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Daily Reflection & Mood Logger */}
            <div className="rounded-3xl bg-white border border-purple-100 p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    DAILY REFLECTION & MOOD
                  </h4>
                </div>
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Mood selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">
                  How do you feel today?
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {['☀️ Unstoppable', '🌙 Energized', '💚 Steady', '🦋 Calm'].map((mood) => {
                    const isSelected = selectedMood === mood;
                    return (
                      <button
                        key={mood}
                        onClick={() => handleMoodSelect(mood)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200'
                        }`}
                      >
                        {mood}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reflection Textarea */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">
                  Write your reflection:
                </label>
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="What went well today? What resistance did you overcome? Write a note..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/40 border border-purple-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveReflection}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Locked Day Modal */}
      {lockedModalDay && (
        <LockedDayModal
          dayNumber={lockedModalDay}
          currentDay={currentActiveDay}
          challenge={challenge}
          onPracticeEarly={(day) => setSelectedDay(day)}
          onClose={() => setLockedModalDay(null)}
        />
      )}

      {/* Penalty & Reward Modal */}
      {showPenaltyRewardModal && (
        <PenaltyRewardModal
          totalPoints={progress.totalPoints || 0}
          onClose={() => setShowPenaltyRewardModal(false)}
        />
      )}
    </div>
  );
};
