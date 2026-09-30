import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Award,
  Flame,
  Calendar,
  Sparkles,
  ArrowRight,
  X,
  Crown,
  ChevronLeft,
  ChevronRight,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { Challenge, DayLog, UserChallengeProgress } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { LockedDayModal } from './LockedDayModal';
import { HabitContinuationEngine } from '../utils/habitContinuationEngine';
import { CONTINUUM_CYCLES } from './ChallengePathwayScreen';

interface MatrixJourneyProps {
  challenge: Challenge;
  progress: UserChallengeProgress;
  onSelectDayToView: (day: number) => void;
}

export const MatrixJourney: React.FC<MatrixJourneyProps> = ({
  challenge,
  progress,
  onSelectDayToView,
}) => {
  const currentActiveDay = progress.currentDay || 1;
  const isHabitMode = progress.status === 'habit_mode' || currentActiveDay > 21;
  const stats = HabitContinuationEngine.calculateStats(progress, challenge);

  const [inspectDay, setInspectDay] = useState<number | null>(null);
  const [lockedModalDay, setLockedModalDay] = useState<number | null>(null);

  const [selectedCycleIndex, setSelectedCycleIndex] = useState<number>(() => {
    const idx = CONTINUUM_CYCLES.findIndex(
      (c) => currentActiveDay >= c.range[0] && currentActiveDay <= c.range[1]
    );
    return idx !== -1 ? idx : 0;
  });

  const activeCycle = CONTINUUM_CYCLES[selectedCycleIndex] || CONTINUUM_CYCLES[0];

  const completedCount = (Object.values(progress.dayLogs) as DayLog[]).filter(
    (l) => l.completed
  ).length;

  const inspectedPlan = inspectDay
    ? challenge.days.find((d) => d.day === inspectDay) ||
      HabitContinuationEngine.getDayPlan(challenge, inspectDay)
    : null;
  const inspectedLog = inspectDay ? progress.dayLogs[inspectDay] : null;

  const handleNodeClick = (dayNum: number) => {
    soundManager.playTick();
    if (dayNum > currentActiveDay) {
      triggerHaptic('heavy');
      setLockedModalDay(dayNum);
      return;
    }
    triggerHaptic('light');
    setInspectDay(dayNum);
  };

  // Helper to generate phase partitions for any cycle range
  const getPhasesForCycle = (startDay: number, endDay: number) => {
    const totalDays = endDay - startDay + 1;
    const third = Math.ceil(totalDays / 3);
    const p1End = startDay + third - 1;
    const p2End = Math.min(startDay + third * 2 - 1, endDay - 1);

    const makeRange = (s: number, e: number) =>
      Array.from({ length: e - s + 1 }, (_, i) => s + i);

    return [
      {
        phaseNum: 1,
        title: `Phase 1: Activation & Ignition (Days ${startDay}–${p1End})`,
        description: 'Establish rhythmic consistency and anchor micro-habits without friction.',
        range: makeRange(startDay, p1End),
        badgeText: `Sprint 1`,
      },
      {
        phaseNum: 2,
        title: `Phase 2: Momentum & Fortification (Days ${p1End + 1}–${p2End})`,
        description: 'Deepen automaticity, dissolve mental friction, and protect the continuum.',
        range: makeRange(p1End + 1, p2End),
        badgeText: `Sprint 2`,
      },
      {
        phaseNum: 3,
        title: `Phase 3: Integration & Mastery (Days ${p2End + 1}–${endDay})`,
        description: 'Solidify conscious action into effortless subconscious identity.',
        range: makeRange(p2End + 1, endDay),
        badgeText: `Target Day ${endDay}`,
      },
    ];
  };

  const displayedPhases = isHabitMode
    ? getPhasesForCycle(activeCycle.range[0], activeCycle.range[1])
    : [
        {
          phaseNum: 1,
          title: 'Phase 1: Neural Awakening & Micro-Habits (Days 1–7)',
          description: 'Focus on low-friction daily consistency. Break initial inertia.',
          range: [1, 2, 3, 4, 5, 6, 7],
          badgeText: 'Milestone 1: Neural Spark',
        },
        {
          phaseNum: 2,
          title: 'Phase 2: Overcoming Resistance & Building Momentum (Days 8–14)',
          description: 'Overcome internal friction, deepen commitment, and withstand cheat day triggers.',
          range: [8, 9, 10, 11, 12, 13, 14],
          badgeText: 'Milestone 2: Momentum Builder',
        },
        {
          phaseNum: 3,
          title: 'Phase 3: Habit Solidification & Full Mastery (Days 15–21)',
          description: 'Automate the routine into your identity. Transform effort into instinct.',
          range: [15, 16, 17, 18, 19, 20, 21],
          badgeText: 'Milestone 3: Habit Master',
        },
      ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 p-5 sm:p-6 text-white shadow-xl shadow-purple-900/15 border border-purple-400/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-1">
                {isHabitMode ? (
                  <>
                    <InfinityIcon className="w-3.5 h-3.5" />
                    <span>Habit Continuum Matrix (Lifelong)</span>
                  </>
                ) : (
                  <span>21-Day Neural Path</span>
                )}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isHabitMode ? `Habit Journey Matrix: Day ${currentActiveDay}` : 'Habit Journey Matrix'}
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
              {isHabitMode
                ? `You have evolved beyond the initial 21-day threshold. Your neural wiring is advancing into permanent automaticity. Target: Day ${stats.nextMilestone.day} (${stats.nextMilestone.title}).`
                : 'Neuroscience confirms 21 days of continuous practice rewires subconscious automaticity. Track your step-by-step progress across the 3 critical phases.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 px-4 py-2.5 rounded-2xl border border-white/20 shrink-0">
            <Flame className="w-5 h-5 text-amber-300" />
            <div>
              <div className="text-xs font-bold text-white">
                {completedCount} Days Conquered
              </div>
              <div className="text-[10px] text-purple-200 font-medium">
                {isHabitMode
                  ? `${stats.nextMilestone.day - currentActiveDay}d to ${stats.nextMilestone.badge} Day ${stats.nextMilestone.day}`
                  : `${Math.max(21 - completedCount, 0)} days to 21-day mastery`}
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Milestones Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/20">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/10 border border-white/15">
            <Award className="w-4 h-4 text-purple-200 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white">Day 7: Neural Seed</span>
              <p className="text-purple-200 text-[11px] leading-tight mt-0.5">{challenge.milestone7}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/10 border border-white/15">
            <Award className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-amber-300">Day 14: Momentum Pivot</span>
              <p className="text-purple-200 text-[11px] leading-tight mt-0.5">{challenge.milestone14}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/10 border border-white/15">
            <Crown className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white">
                {isHabitMode ? `Next: Day ${stats.nextMilestone.day}` : 'Day 21: Full Mastery'}
              </span>
              <p className="text-purple-200 text-[11px] leading-tight mt-0.5">
                {isHabitMode ? stats.nextMilestone.title : challenge.milestone21}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Habit Continuum Cycle Selector */}
      {isHabitMode && (
        <div className="rounded-3xl bg-white border border-purple-100 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Select Progression Horizon (30-Day Cycles)
            </span>
            <span className="text-[11px] text-purple-600 font-semibold">
              Viewing Days {activeCycle.range[0]} – {activeCycle.range[1]}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CONTINUUM_CYCLES.map((cycle, idx) => {
              const isCurrentCycle = currentActiveDay >= cycle.range[0] && currentActiveDay <= cycle.range[1];
              const isSelected = selectedCycleIndex === idx;
              return (
                <button
                  key={cycle.id}
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setSelectedCycleIndex(idx);
                  }}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 ring-2 ring-purple-400'
                      : isCurrentCycle
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-purple-50'
                  }`}
                >
                  <span>{cycle.badge}</span>
                  <span>{cycle.label}</span>
                  {isCurrentCycle && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-black text-purple-950 flex items-center gap-1 truncate">
                <span>{activeCycle.badge}</span>
                <span>{activeCycle.title}</span>
              </div>
              <div className="text-[10px] text-purple-700 mt-0.5">
                Target Landmark: {activeCycle.milestone.badge} Day {activeCycle.milestone.day} ({activeCycle.milestone.title})
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
                  className="p-1.5 rounded-lg bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 transition-colors"
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
                  className="p-1.5 rounded-lg bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Visual Grid categorized by Phase */}
      <div className="space-y-6">
        {displayedPhases.map((phase) => (
          <div
            key={phase.phaseNum}
            className="rounded-3xl bg-white border border-purple-100 p-5 shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold flex items-center justify-center">
                    {phase.phaseNum}
                  </span>
                  {phase.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{phase.description}</p>
              </div>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
                {phase.badgeText}
              </span>
            </div>

            {/* Nodes Grid */}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
              {phase.range.map((dayNum) => {
                const plan =
                  challenge.days.find((d) => d.day === dayNum) ||
                  HabitContinuationEngine.getDayPlan(challenge, dayNum);
                const log = progress.dayLogs[dayNum];
                const isCompleted = log?.completed;
                const isCurrent = progress.currentDay === dayNum;
                const isFutureLocked = dayNum > currentActiveDay;
                const isMilestone = [7, 14, 21, 30, 50, 75, 100, 180, 365, 500, 1000].includes(dayNum);

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleNodeClick(dayNum)}
                    className={`relative p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[96px] group cursor-pointer ${
                      isCompleted
                        ? 'bg-purple-50/80 border-purple-200 shadow-sm hover:scale-[1.02]'
                        : isCurrent
                        ? 'bg-purple-100/60 border-purple-600 ring-2 ring-purple-600/30 shadow-md scale-[1.02]'
                        : isFutureLocked
                        ? 'bg-slate-50/70 border-slate-200/80 hover:bg-purple-50/20'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-purple-50/40 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          isCompleted
                            ? 'bg-purple-200 text-purple-900'
                            : isCurrent
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        D{dayNum}
                      </span>

                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-purple-600 fill-purple-100" />
                      ) : isMilestone ? (
                        <Award className="w-4 h-4 text-amber-500" />
                      ) : isCurrent ? (
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                      ) : isFutureLocked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </div>

                    <div className="mt-2">
                      <div className="text-[11px] font-semibold text-slate-800 line-clamp-2 leading-tight group-hover:text-purple-700 transition-colors">
                        {plan?.title.replace(/^Day \d+:\s*/, '') || `Step ${dayNum}`}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        ~{plan?.estimatedMinutes || 15}m
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Day Modal */}
      {inspectDay && inspectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-purple-100 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setInspectDay(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                  DAY {inspectedPlan.day} {isHabitMode ? 'OF ∞ (CONTINUUM)' : 'OF 21'}
                </span>
                {inspectedLog?.completed && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {inspectedPlan.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {inspectedPlan.description}
              </p>
            </div>

            {/* Tasks list */}
            <div className="space-y-2 pt-2 border-t border-purple-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Actionable Checklist
              </h4>
              <div className="space-y-1.5">
                {inspectedPlan.tasks.map((task, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-800 p-2.5 rounded-xl bg-purple-50/30 border border-purple-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setInspectDay(null);
                  onSelectDayToView(inspectedPlan.day);
                }}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>Launch Day {inspectedPlan.day} Mission Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locked Day Modal with Full Future Roadmap & Early Practice */}
      {lockedModalDay && (
        <LockedDayModal
          dayNumber={lockedModalDay}
          currentDay={currentActiveDay}
          challenge={challenge}
          onPracticeEarly={(day) => {
            setLockedModalDay(null);
            onSelectDayToView(day);
          }}
          onClose={() => setLockedModalDay(null)}
        />
      )}
    </div>
  );
};
