import React from 'react';
import {
  Compass,
  Layers,
  Sparkles,
  ArrowRight,
  Target,
  Trophy,
  Flame,
  FerrisWheel,
  Gift,
  Sprout,
} from 'lucide-react';
import { Challenge, DayLog, UserChallengeProgress } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface HomeScreenProps {
  userName: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenNotifications?: () => void;
  onOpenSettings?: () => void;
  activeChallenge: Challenge | null;
  progress: UserChallengeProgress;
  streakCount: number;
  onNavigateTab: (tab: any) => void;
  onOpenChallengePathway?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName,
  activeChallenge,
  progress,
  streakCount,
  onNavigateTab,
  onOpenChallengePathway,
}) => {
  const currentActiveDay = Math.min(21, progress?.currentDay || 1);
  const isHabitMode = (progress?.currentDay || 1) > 21;
  const is21Complete =
    currentActiveDay === 21 && !!progress?.dayLogs?.[21]?.completed;

  const completedDaysCount = Object.values(progress?.dayLogs || {}).filter(
    (l: any) => l?.completed
  ).length;

  const progressPercent = Math.round((completedDaysCount / 21) * 100);

  // Today's task & tips
  const todayTask = activeChallenge?.days?.find((d) => d.day === currentActiveDay);
  const dailyAffirmation =
    todayTask?.taskDescription ||
    activeChallenge?.description ||
    'Define exactly 3 non-negotiable MITs (Most Important Tasks) for today';
  const psychologyTip =
    todayTask?.psychologyTip ||
    `Day ${currentActiveDay} reinforces habit automaticity. Repetition decreases cognitive load and ingrains neuroplastic mastery.`;

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4 animate-fadeIn pb-28 space-y-4">
      {/* 1. Main Welcome & Active Challenge Card (Matching User Screenshot) */}
      <div className="w-full rounded-[32px] p-5 sm:p-6 bg-gradient-to-br from-[#6C3FE8] via-[#7B4CF6] to-[#976EF9] text-white shadow-xl shadow-purple-600/20 relative overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-52 h-52 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          {/* Header Row: User Greeting & 21D Progress Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-semibold text-purple-200 block truncate">
                Welcome back, {userName || 'Rk'} ✨
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate mt-0.5">
                {activeChallenge?.title || '21-Day Pomodoro & Time Mastery'}
              </h2>
            </div>

            {/* 21D Progress Badge */}
            <div className="px-3.5 py-1.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 text-center shrink-0">
              <span className="text-base sm:text-lg font-black text-amber-300 leading-none block">
                {progressPercent}%
              </span>
              <span className="text-[9px] font-bold text-purple-100 tracking-wider uppercase block mt-0.5">
                21D PROGRESS
              </span>
            </div>
          </div>

          {/* 3 Metric Stat Boxes */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Box 1: Completed Days */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="text-base sm:text-lg font-black text-white block">
                {completedDaysCount}
              </span>
              <span className="text-[9px] font-bold text-purple-200 tracking-wider uppercase block mt-0.5">
                COMPLETED
              </span>
            </div>

            {/* Box 2: Active Step */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="text-base sm:text-lg font-black text-white block">
                Day {currentActiveDay}
              </span>
              <span className="text-[9px] font-bold text-purple-200 tracking-wider uppercase block mt-0.5">
                ACTIVE STEP
              </span>
            </div>

            {/* Box 3: Streak */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="text-base sm:text-lg font-black text-white flex items-center justify-center gap-1">
                <span>🔥</span>
                <span>{streakCount || 1}d</span>
              </span>
              <span className="text-[9px] font-bold text-purple-200 tracking-wider uppercase block mt-0.5">
                STREAK
              </span>
            </div>
          </div>

          {/* Daily Affirmation & Psychology Tip Card */}
          {is21Complete ? (
            <div className="bg-amber-400/20 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-amber-300/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-300 shrink-0" />
                <div>
                  <div className="text-xs font-black text-white">21 DAYS COMPLETE!</div>
                  <div className="text-[10px] text-amber-200">
                    Ready to transition into lifelong Habit Mode
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  soundManager.playCelebration();
                  if (onOpenChallengePathway) onOpenChallengePathway();
                  else onNavigateTab('today');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-purple-950 font-black text-xs hover:bg-amber-300 transition-colors shrink-0"
              >
                Continue Habit →
              </button>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/15 space-y-1.5">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-semibold text-white/95 leading-snug italic">
                  "{dailyAffirmation}"
                </p>
              </div>
              <p className="text-[10px] sm:text-xs text-purple-200 pl-6 leading-relaxed">
                💡 {psychologyTip}
              </p>
            </div>
          )}

          {/* Big White Action CTA Button */}
          <button
            onClick={() => {
              onNavigateTab('today');
              soundManager.playTick();
              triggerHaptic('light');
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-purple-50 text-purple-900 font-black text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <Target className="w-4 h-4 text-purple-700 shrink-0" />
            <span>
              {isHabitMode
                ? `COMPLETE TODAY (DAY ${currentActiveDay})`
                : `Open Day ${currentActiveDay} Mission`}
            </span>
            <ArrowRight className="w-4 h-4 text-purple-700 shrink-0" />
          </button>
        </div>
      </div>

      {/* 2. Two Prominent Action Buttons: Challenges & Services (Responsive Grid matching Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {/* Button 1: Challenges */}
        <button
          id="home-btn-challenges"
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('medium');
            onNavigateTab('challenges-hub');
          }}
          className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50/50 dark:hover:bg-[#282154] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 text-left shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer w-full"
        >
          <div className="flex items-center gap-4 min-w-0 pr-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
              <Compass className="w-7 h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
                Challenges
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
                Explore & Create Habit Pathways
              </span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/40 group-hover:bg-purple-600 group-hover:text-white text-purple-700 dark:text-purple-300 flex items-center justify-center transition-colors shrink-0">
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>

        {/* Button 2: Services */}
        <button
          id="home-btn-services"
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('medium');
            onNavigateTab('services-hub');
          }}
          className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50/50 dark:hover:bg-[#282154] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 text-left shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer w-full"
        >
          <div className="flex items-center gap-4 min-w-0 pr-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-700 text-white flex items-center justify-center text-2xl shadow-md shadow-indigo-600/20 group-hover:scale-110 transition-transform shrink-0">
              <Layers className="w-7 h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
                Services
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
                69+ Workspaces & Records
              </span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/40 group-hover:bg-purple-600 group-hover:text-white text-purple-700 dark:text-purple-300 flex items-center justify-center transition-colors shrink-0">
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* 3. Daily Lucky Wheel & Scratch Card in One Row (Two Equal Smaller Buttons matching Redesigned Style) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Button 3: Daily Lucky Wheel */}
        <button
          id="home-btn-wheel"
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('light');
            onNavigateTab('wheel');
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50/50 dark:hover:bg-[#282154] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 text-left shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer w-full gap-2"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
              <FerrisWheel className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
                Daily Wheel
              </span>
              <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
                Spin & Win
              </span>
            </div>
          </div>

          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 dark:bg-purple-900/40 group-hover:bg-purple-600 group-hover:text-white text-purple-700 dark:text-purple-300 flex items-center justify-center transition-colors shrink-0">
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </button>

        {/* Button 4: Day X Scratch Card / Daily Habit */}
        <button
          id="home-btn-scratch-card"
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('light');
            onNavigateTab('today');
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50/50 dark:hover:bg-[#282154] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 text-left shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer w-full gap-2"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-110 transition-transform shrink-0">
              {isHabitMode ? (
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
                Day {currentActiveDay} {isHabitMode ? 'Action' : 'Scratch'}
              </span>
              <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
                {isHabitMode ? 'Habit Mode' : "Today's Task"}
              </span>
            </div>
          </div>

          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 dark:bg-purple-900/40 group-hover:bg-purple-600 group-hover:text-white text-purple-700 dark:text-purple-300 flex items-center justify-center transition-colors shrink-0">
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};
