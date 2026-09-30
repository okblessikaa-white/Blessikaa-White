import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  Calendar,
  Award,
  Plus,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Zap,
  Star,
  Crown,
  Heart,
  BookOpen,
  Apple,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Habit } from '../types';
import { HABIT_MILESTONES, HabitFormationService } from '../utils/habitService';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface HabitModeScreenProps {
  onEarnXP: (xp: number, reason: string) => void;
  theme?: 'dark' | 'light';
}

export const HabitModeScreen: React.FC<HabitModeScreenProps> = ({ onEarnXP, theme = 'dark' }) => {
  const [habits, setHabits] = useState<Habit[]>(() => HabitFormationService.getHabits());
  const [selectedHabitId, setSelectedHabitId] = useState<string>(habits[0]?.id || '');
  const [checkInNote, setCheckInNote] = useState('');
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);

  // New habit state
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('mindfulness');
  const [newHabitIcon, setNewHabitIcon] = useState('🌱');
  const [newHabitTargetDays, setNewHabitTargetDays] = useState(30);

  const selectedHabit = habits.find((h) => h.id === selectedHabitId) || habits[0];
  const todayStr = new Date().toISOString().slice(0, 10);
  const isCheckedToday = selectedHabit?.checkIns.some((c) => c.date === todayStr);

  const handleDailyCheckIn = () => {
    if (!selectedHabit) return;
    const res = HabitFormationService.dailyCheckIn(selectedHabit.id, checkInNote);

    if (res.success && res.habit) {
      soundManager.playCelebration();
      triggerHaptic('success');
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#fb923c', '#f43f5e', '#fde047'],
      });

      const updated = habits.map((h) => (h.id === res.habit!.id ? res.habit! : h));
      setHabits(updated);
      setCheckInNote('');
      onEarnXP(res.xpEarned, `Habit Check-in: ${selectedHabit.name}`);
    } else {
      alert(res.message);
    }
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit = HabitFormationService.addCustomHabit(
      newHabitName,
      newHabitCategory,
      newHabitIcon,
      newHabitTargetDays
    );

    soundManager.playCelebration();
    triggerHaptic('success');
    const updated = [newHabit, ...habits];
    setHabits(updated);
    setSelectedHabitId(newHabit.id);
    setShowAddHabitModal(false);
    setNewHabitName('');
    onEarnXP(50, `Created New Habit: ${newHabit.name}`);
  };

  const habitStats = selectedHabit ? HabitFormationService.getHabitStats(selectedHabit) : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 p-5 sm:p-6 shadow-xl shadow-purple-900/10 border border-purple-400/20 text-white space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Post-21 Day Continuum</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Habit Formation Mode
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
              Maintain lifelong momentum. Continue daily check-ins after Day 21 and unlock higher mastery milestones up to 365 days!
            </p>
          </div>

          <button
            onClick={() => {
              setShowAddHabitModal(true);
              soundManager.playTick();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold shadow-md transition-all transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-purple-700" />
            <span>Add Ongoing Habit</span>
          </button>
        </div>

        {/* Habit Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-white/20 pb-1 scrollbar-none">
          {habits.map((h) => {
            const isSelected = h.id === selectedHabitId;
            return (
              <button
                key={h.id}
                onClick={() => {
                  setSelectedHabitId(h.id);
                  soundManager.playTick();
                }}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white text-purple-900 shadow-md ring-2 ring-purple-300'
                    : 'bg-white/15 border border-white/10 text-purple-100 hover:bg-white/25'
                }`}
              >
                <span>{h.icon}</span>
                <span className="truncate max-w-[150px]">{h.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-purple-100 text-purple-800' : 'bg-purple-950/40 text-amber-300'}`}>
                  🔥 {h.streak}d
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedHabit && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Daily Check-in & Calendar Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Check-in Card */}
            <div className="rounded-3xl bg-white border border-purple-100 p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedHabit.icon}</span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      {selectedHabit.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Active streak: <span className="text-purple-700 font-bold">{selectedHabit.streak} days</span> • Total check-ins: {selectedHabit.totalDays}
                  </p>
                </div>

                {isCheckedToday ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Checked-in Today!</span>
                  </div>
                ) : (
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-bold shrink-0">
                    Ready for Check-in
                  </span>
                )}
              </div>

              {/* Check-in input & action */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">
                  Today's Execution Note / Reflection:
                </label>
                <textarea
                  value={checkInNote}
                  onChange={(e) => setCheckInNote(e.target.value)}
                  disabled={isCheckedToday}
                  placeholder={
                    isCheckedToday
                      ? 'You have already checked in for today! Fantastic consistency.'
                      : 'Log how you executed your habit today, any wins, or mindfulness takeaways...'
                  }
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none disabled:opacity-50"
                />

                <button
                  onClick={handleDailyCheckIn}
                  disabled={isCheckedToday}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>
                    {isCheckedToday ? 'Check-in Completed Today' : 'Perform Daily Check-in & Claim +50 XP'}
                  </span>
                </button>
              </div>

              {/* 30-Day Check-in Heatmap Grid */}
              <div className="space-y-2 pt-2 border-t border-purple-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Recent 30 Days Check-in Grid</span>
                  <span className="text-purple-700 font-semibold">{habitStats?.completionRate}% Consistency</span>
                </div>

                <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5 pt-1">
                  {Array.from({ length: 30 }, (_, i) => {
                    const d = new Date(Date.now() - (29 - i) * 86400000);
                    const dStr = d.toISOString().slice(0, 10);
                    const isDone = selectedHabit.checkIns.some((c) => c.date === dStr);

                    return (
                      <div
                        key={i}
                        className={`h-6 rounded-md flex items-center justify-center text-[9px] font-bold transition-all ${
                          isDone
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-purple-50 border border-purple-100 text-slate-400'
                        }`}
                        title={`${dStr}: ${isDone ? 'Completed' : 'Missed'}`}
                      >
                        {d.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Milestone Badges Progression */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-purple-100 p-5 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Mastery Milestones
                </h4>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {Object.entries(HABIT_MILESTONES).map(([days, m]) => {
                  const daysNum = parseInt(days);
                  const isUnlocked = (selectedHabit.totalDays || 0) >= daysNum;

                  return (
                    <div
                      key={days}
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                        isUnlocked
                          ? 'bg-purple-50/60 border-purple-200 shadow-xs'
                          : 'bg-slate-50 border-slate-100 opacity-60'
                      }`}
                    >
                      <div className="text-2xl">{m.badge}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {m.title}
                          </span>
                          <span className="text-[10px] text-purple-700 font-bold shrink-0">
                            +{m.xp} XP
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {m.desc} ({days} Days)
                        </p>
                      </div>
                      {isUnlocked && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Habit Modal */}
      {showAddHabitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-purple-100 shadow-2xl p-6 space-y-4">
            <button
              onClick={() => setShowAddHabitModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                Habit Continuum
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Add New Habit to Track
              </h3>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Habit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily 2L Water & Hydration"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/30 border border-purple-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/30 border border-purple-200 text-slate-800 focus:outline-none"
                  >
                    <option value="mindfulness">Mindfulness</option>
                    <option value="health">Health & Fitness</option>
                    <option value="productivity">Productivity</option>
                    <option value="learning">Learning</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Icon</label>
                  <select
                    value={newHabitIcon}
                    onChange={(e) => setNewHabitIcon(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/30 border border-purple-200 text-slate-800 focus:outline-none"
                  >
                    <option value="🌱">🌱 Seed / Growth</option>
                    <option value="💧">💧 Water / Health</option>
                    <option value="⚡">⚡ Focus / Lightning</option>
                    <option value="☀️">☀️ Morning / Sun</option>
                    <option value="🧘">🧘 Zen / Meditation</option>
                    <option value="💪">💪 Fitness / Strength</option>
                    <option value="📚">📚 Book / Learning</option>
                    <option value="💰">💰 Wealth / Finance</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddHabitModal(false)}
                  className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
                >
                  Add Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
