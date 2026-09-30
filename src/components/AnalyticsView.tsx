import React, { useState } from 'react';
import {
  Flame,
  Award,
  Trophy,
  Calendar,
  CheckCircle2,
  Lock,
  Download,
  Share2,
  Sparkles,
  BarChart2,
  Crown,
  BookOpen,
  Layers,
  Zap,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { Badge, Challenge, DayLog, UserChallengeProgress } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface AnalyticsViewProps {
  activeChallenge: Challenge;
  progress: UserChallengeProgress;
  allProgress: Record<string, UserChallengeProgress>;
  badges: Badge[];
  userName: string;
  onOpenCertificate: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  activeChallenge,
  progress,
  allProgress,
  badges,
  userName,
  onOpenCertificate,
}) => {
  const [chartMetric, setChartMetric] = useState<'momentum' | 'minutes'>('momentum');

  // Aggregate stats
  const totalCompletedDaysAll = (
    Object.values(allProgress) as UserChallengeProgress[]
  ).reduce(
    (acc: number, p: UserChallengeProgress) =>
      acc +
      (Object.values(p.dayLogs || {}) as DayLog[]).filter((l) => l.completed).length,
    0
  );

  const activeCompletedDays = (
    Object.values(progress.dayLogs || {}) as DayLog[]
  ).filter((l) => l.completed).length;
  const activePercent = Math.round((activeCompletedDays / 21) * 100);

  const unlockedBadgesCount = badges.filter((b) => b.unlockedAt).length;

  // Build 21-Day trend chart data
  const chartData = Array.from({ length: 21 }, (_, i) => {
    const dNum = i + 1;
    const log = progress.dayLogs[dNum];
    const isCompleted = !!log?.completed;
    const tasksDone = log?.completedTasks?.length || 0;
    const timeSpent = log?.timeSpentMinutes || (isCompleted ? 15 : 0);

    let cumulativeDays = 0;
    for (let j = 1; j <= dNum; j++) {
      if (progress.dayLogs[j]?.completed) cumulativeDays++;
    }

    return {
      day: `D${dNum}`,
      dayNum: dNum,
      completed: isCompleted ? 1 : 0,
      tasks: tasksDone,
      minutes: timeSpent,
      cumulativeXP: cumulativeDays * 100,
      streakTrend: isCompleted ? Math.min(dNum, cumulativeDays) : 0,
    };
  });

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return Sparkles;
      case 'Flame':
        return Flame;
      case 'Award':
        return Award;
      case 'Zap':
        return Zap;
      case 'Crown':
        return Crown;
      case 'BookOpen':
        return BookOpen;
      case 'Layers':
        return Layers;
      default:
        return Trophy;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 p-5 sm:p-6 text-white shadow-xl shadow-purple-900/10 border border-purple-400/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                Performance & Analytics
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Habit Consistency Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
              Track neuroplasticity progress, unbroken daily streaks, and unlocked achievement badges.
            </p>
          </div>

          {activeCompletedDays >= 21 && (
            <button
              onClick={() => {
                onOpenCertificate();
                soundManager.playCelebration();
                triggerHaptic('success');
              }}
              className="px-4 py-2.5 rounded-xl bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold shadow-md flex items-center gap-2 shrink-0 animate-bounce"
            >
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Claim Official 21D Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Streak */}
        <div className="rounded-3xl bg-white border border-purple-100 p-4 sm:p-5 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Current Streak</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {progress.streak}{' '}
            <span className="text-xs font-normal text-purple-600">days</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Highest: {progress.highestStreak} continuous days
          </div>
        </div>

        {/* Completion % */}
        <div className="rounded-3xl bg-white border border-purple-100 p-4 sm:p-5 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Challenge Completion</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {activePercent}%
          </div>
          <div className="text-[10px] text-slate-500">
            {activeCompletedDays} of 21 days logged
          </div>
        </div>

        {/* Total Points / XP */}
        <div className="rounded-3xl bg-white border border-purple-100 p-4 sm:p-5 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Total Habit XP</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {progress.totalPoints}
          </div>
          <div className="text-[10px] text-slate-500">
            +100 XP per completed day
          </div>
        </div>

        {/* Lifetime Days */}
        <div className="rounded-3xl bg-white border border-purple-100 p-4 sm:p-5 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Lifetime Habits</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalCompletedDaysAll}
          </div>
          <div className="text-[10px] text-slate-500">
            Total days conquered overall
          </div>
        </div>
      </div>

      {/* Progress Visualization using Recharts */}
      <div className="rounded-3xl bg-white border border-purple-100 p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-purple-100 text-purple-700">
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                21-Day Habit Streak & Momentum Trends
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Trajectory and habit execution curve across the 21-day formation timeline
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-purple-50 rounded-2xl border border-purple-200 self-start sm:self-auto">
            <button
              onClick={() => {
                setChartMetric('momentum');
                soundManager.playTick();
                triggerHaptic('light');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                chartMetric === 'momentum'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-800 hover:bg-purple-100'
              }`}
            >
              XP & Streak Growth
            </button>
            <button
              onClick={() => {
                setChartMetric('minutes');
                soundManager.playTick();
                triggerHaptic('light');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                chartMetric === 'minutes'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-800 hover:bg-purple-100'
              }`}
            >
              Sprint Minutes
            </button>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartMetric === 'momentum' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#a855f7"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e9d5ff' }}
                />
                <YAxis
                  stroke="#a855f7"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-2xl bg-white border border-purple-200 p-3 shadow-xl text-xs space-y-1">
                          <p className="font-extrabold text-purple-900">
                            Day {data.dayNum} of 21
                          </p>
                          <p className="text-slate-600">
                            Cumulative XP:{' '}
                            <span className="font-bold text-amber-600">{data.cumulativeXP} XP</span>
                          </p>
                          <p className="text-slate-600">
                            Status:{' '}
                            <span
                              className={`font-bold ${
                                data.completed ? 'text-emerald-600' : 'text-slate-400'
                              }`}
                            >
                              {data.completed ? 'Conquered ✓' : 'Pending'}
                            </span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeXP"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#purpleGradient)"
                  activeDot={{ r: 5, fill: '#7c3aed', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#a855f7"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e9d5ff' }}
                />
                <YAxis
                  stroke="#a855f7"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-2xl bg-white border border-purple-200 p-3 shadow-xl text-xs space-y-1">
                          <p className="font-extrabold text-purple-900">
                            Day {data.dayNum} Focus Sprint
                          </p>
                          <p className="text-slate-600">
                            Dedicated Time:{' '}
                            <span className="font-bold text-purple-700">{data.minutes} mins</span>
                          </p>
                          <p className="text-slate-600">
                            Tasks Checked:{' '}
                            <span className="font-bold text-purple-700">{data.tasks} items</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="minutes"
                  fill="#9333ea"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-purple-100">
          <span>Target baseline: 15–30 daily minutes to wire 21-day neuroplasticity</span>
          <span className="font-semibold text-purple-700">
            {activeCompletedDays * 100} Total Challenge XP
          </span>
        </div>
      </div>

      {/* 21-Day Consistency Matrix Heatmap */}
      <div className="rounded-3xl bg-white border border-purple-100 p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              21-Day Consistency Matrix: "{activeChallenge.title}"
            </h3>
            <p className="text-xs text-slate-500">
              Visual map of all 21 days for your active transformation challenge
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700">
            {activeCompletedDays}/21 Done
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {Array.from({ length: 21 }, (_, i) => {
            const dayNum = i + 1;
            const log = progress.dayLogs[dayNum];
            const isDone = log?.completed;
            const isCurrent = progress.currentDay === dayNum;

            return (
              <div
                key={dayNum}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  isDone
                    ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-purple-50 border-purple-400 text-purple-800 ring-1 ring-purple-400'
                    : 'bg-purple-50/40 border-purple-100 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-bold">D{dayNum}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white mt-1 fill-white/20" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-purple-100">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-purple-600" /> Completed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-purple-50 border border-purple-200" /> Pending
            </span>
          </div>
          <span>Neuroplasticity standard: 21 continuous repetitions</span>
        </div>
      </div>

      {/* Milestone Badges Gallery */}
      <div className="rounded-3xl bg-white border border-purple-100 p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Milestone Achievement Badges</span>
            </h3>
            <p className="text-xs text-slate-500">
              Unlocked: {unlockedBadgesCount} / {badges.length} Badges
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {badges.map((badge) => {
            const isUnlocked = !!badge.unlockedAt;
            const Icon = getBadgeIcon(badge.icon);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-purple-50/60 border-purple-200 shadow-xs'
                    : 'bg-slate-50/70 border-slate-100 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2 rounded-xl ${
                        isUnlocked
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-purple-100 text-purple-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {isUnlocked ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                        UNLOCKED
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {badge.name}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-purple-100 text-[10px] text-purple-700 font-semibold">
                  {badge.requirement}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
