import { Badge, Habit, HabitCheckIn, UserChallengeProgress } from '../types';
import { StorageManager } from './storage';

export const HABIT_MILESTONES: Record<number, { badge: string; title: string; xp: number; desc: string }> = {
  7: { badge: '🌱', title: 'Week 1 Warrior', xp: 50, desc: 'Completed 7 days of continuous habit reinforcement.' },
  14: { badge: '🔥', title: 'Two Week Champion', xp: 100, desc: 'Crossed the 14-day neural breakthrough threshold.' },
  21: { badge: '🏆', title: 'Habit Formed', xp: 200, desc: 'Achieved full 21-day neuroplasticity habit solidification!' },
  30: { badge: '⭐', title: 'One Month Master', xp: 300, desc: 'Mastered 30 days of unbroken self-discipline.' },
  60: { badge: '💎', title: 'Two Month Legend', xp: 500, desc: '60 days of consistent execution and lifestyle shift.' },
  90: { badge: '👑', title: '90 Day King', xp: 1000, desc: '90 days of absolute mastery. A truly permanent lifestyle.' },
  180: { badge: '🌟', title: 'Half Year Hero', xp: 2000, desc: 'Half a year of steadfast dedication and personal growth.' },
  365: { badge: '🎖️', title: 'One Year God', xp: 5000, desc: '365 days of relentless excellence and transformation.' },
};

const HABITS_STORAGE_KEY = 'blessikaa_habits_list_v1';

export class HabitFormationService {
  public static getHabits(): Habit[] {
    try {
      const data = localStorage.getItem(HABITS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [
      {
        id: 'habit_gratitude_seed',
        name: 'Morning Gratitude & Mindfulness',
        category: 'mindfulness',
        icon: '☀️',
        startedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        totalDays: 12,
        streak: 12,
        longestStreak: 12,
        lastPerformed: new Date(Date.now() - 86400000).toISOString(),
        isActive: true,
        checkIns: Array.from({ length: 12 }, (_, i) => {
          const d = new Date(Date.now() - (12 - i) * 86400000);
          return {
            date: d.toISOString().slice(0, 10),
            completedAt: d.toISOString(),
            status: 'completed',
            note: 'Focused on clarity, peace, and purposeful action.',
          };
        }),
        targetDays: 21,
      },
      {
        id: 'habit_deep_work_focus',
        name: 'Daily 45-Min Deep Work Sprint',
        category: 'productivity',
        icon: '⚡',
        startedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        totalDays: 8,
        streak: 8,
        longestStreak: 8,
        lastPerformed: new Date().toISOString(),
        isActive: true,
        checkIns: Array.from({ length: 8 }, (_, i) => {
          const d = new Date(Date.now() - (8 - i) * 86400000);
          return {
            date: d.toISOString().slice(0, 10),
            completedAt: d.toISOString(),
            status: 'completed',
            note: 'High cognitive flow with zero smartphone distractions.',
          };
        }),
        targetDays: 30,
      },
    ];
  }

  public static saveHabits(habits: Habit[]): void {
    try {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits', e);
    }
  }

  public static createHabitFromChallenge(challengeId: string, title: string, category: string, streak = 21): Habit {
    const habits = this.getHabits();
    const existing = habits.find((h) => h.challengeId === challengeId);
    if (existing) return existing;

    const newHabit: Habit = {
      id: `habit_${challengeId}_${Date.now()}`,
      challengeId,
      name: title,
      category,
      icon: '🏆',
      startedAt: new Date().toISOString(),
      totalDays: 21,
      streak: streak,
      longestStreak: streak,
      lastPerformed: new Date().toISOString(),
      isActive: true,
      checkIns: Array.from({ length: 21 }, (_, i) => {
        const d = new Date(Date.now() - (21 - i) * 86400000);
        return {
          date: d.toISOString().slice(0, 10),
          completedAt: d.toISOString(),
          status: 'completed',
        };
      }),
      targetDays: 90,
    };

    const updated = [newHabit, ...habits];
    this.saveHabits(updated);
    return newHabit;
  }

  public static addCustomHabit(name: string, category: string, icon = '🌱', targetDays = 21): Habit {
    const habits = this.getHabits();
    const newHabit: Habit = {
      id: `habit_custom_${Date.now()}`,
      name,
      category,
      icon,
      startedAt: new Date().toISOString(),
      totalDays: 0,
      streak: 0,
      longestStreak: 0,
      isActive: true,
      checkIns: [],
      targetDays,
    };
    const updated = [newHabit, ...habits];
    this.saveHabits(updated);
    return newHabit;
  }

  public static dailyCheckIn(habitId: string, note?: string): {
    success: boolean;
    habit?: Habit;
    xpEarned: number;
    milestoneUnlocked?: { badge: string; title: string; xp: number; desc: string };
    message: string;
  } {
    const habits = this.getHabits();
    const habitIndex = habits.findIndex((h) => h.id === habitId);
    if (habitIndex === -1) {
      return { success: false, xpEarned: 0, message: 'Habit not found' };
    }

    const habit = habits[habitIndex];
    const todayStr = new Date().toISOString().slice(0, 10);
    const alreadyChecked = habit.checkIns.some((c) => c.date === todayStr);

    if (alreadyChecked) {
      return { success: false, xpEarned: 0, message: 'Already checked in today!' };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const checkedYesterday = habit.checkIns.some((c) => c.date === yesterdayStr);

    const nextStreak = checkedYesterday ? habit.streak + 1 : 1;
    const nextTotalDays = habit.totalDays + 1;
    const nextLongest = Math.max(nextStreak, habit.longestStreak || 0);

    const newCheckIn: HabitCheckIn = {
      date: todayStr,
      completedAt: new Date().toISOString(),
      status: 'completed',
      note: note || 'Completed daily habit routine.',
    };

    const updatedHabit: Habit = {
      ...habit,
      totalDays: nextTotalDays,
      streak: nextStreak,
      longestStreak: nextLongest,
      lastPerformed: new Date().toISOString(),
      checkIns: [...habit.checkIns, newCheckIn],
    };

    habits[habitIndex] = updatedHabit;
    this.saveHabits(habits);

    // Check for milestones
    const milestone = HABIT_MILESTONES[nextTotalDays] || HABIT_MILESTONES[nextStreak];
    const xp = 50 + (milestone?.xp || 0);

    return {
      success: true,
      habit: updatedHabit,
      xpEarned: xp,
      milestoneUnlocked: milestone,
      message: `🔥 ${nextStreak} Day Streak! +${xp} XP`,
    };
  }

  public static getHabitStats(habit: Habit) {
    const total = habit.totalDays || habit.checkIns.length || 0;
    const completed = habit.checkIns.filter((c) => c.status === 'completed').length;
    const rate = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 100;
    return {
      totalDays: total,
      completedDays: completed,
      completionRate: rate,
      currentStreak: habit.streak,
      longestStreak: habit.longestStreak,
      isActive: habit.isActive,
    };
  }
}
