import { Challenge, ChallengeMilestone, DayLog, DayPlan, HabitGoalItem, HabitRules, UserChallengeProgress } from '../types';

export const HABIT_CONTINUATION_MILESTONES: ChallengeMilestone[] = [
  {
    day: 21,
    badge: '🏆',
    title: 'Foundation Builder',
    subtitle: '21-Day Neural Solidification',
    xp: 200,
    desc: 'You built the foundation of your new habit. Neural pathways are now physically wired.',
    tier: 'bronze',
  },
  {
    day: 30,
    badge: '🥉',
    title: 'One Month Strong',
    subtitle: '30-Day Unbroken Momentum',
    xp: 300,
    desc: 'Crossed the first calendar month. The action is becoming second nature.',
    tier: 'bronze',
  },
  {
    day: 50,
    badge: '🔥',
    title: 'Consistency Champion',
    subtitle: '50-Day Habit Mastery',
    xp: 500,
    desc: '50 continuous days of execution. You have conquered self-resistance.',
    tier: 'silver',
  },
  {
    day: 75,
    badge: '💎',
    title: 'Discipline Builder',
    subtitle: '75-Day Unshakable Will',
    xp: 750,
    desc: 'Discipline is now your identity. You show up regardless of fleeting moods.',
    tier: 'diamond',
  },
  {
    day: 100,
    badge: '🏆',
    title: 'Century Habit',
    subtitle: '100-Day Elite Milestone',
    xp: 1000,
    desc: '100 days of showing up for yourself. You are in the top 1% of disciplined builders.',
    tier: 'gold',
  },
  {
    day: 180,
    badge: '🌟',
    title: 'Half-Year Master',
    subtitle: '6-Month Lifestyle Transformation',
    xp: 2000,
    desc: 'Half a year of continuous excellence. Your habit is now an ingrained lifestyle.',
    tier: 'elite',
  },
  {
    day: 365,
    badge: '👑',
    title: 'One Year Discipline',
    subtitle: '365-Day Master Transformation',
    xp: 5000,
    desc: 'A full year of daily triumph. Complete transformation achieved.',
    tier: 'legendary',
  },
  {
    day: 500,
    badge: '💜',
    title: 'Elite Consistency',
    subtitle: '500-Day Diamond Standard',
    xp: 7500,
    desc: '500 days of unbroken purpose. Blessikaa Diamond tier achieved.',
    tier: 'legendary',
  },
  {
    day: 1000,
    badge: '🏆',
    title: 'Legendary Habit',
    subtitle: '1,000-Day Infinite Mastery',
    xp: 15000,
    desc: '1,000 days of mastery. You have built a truly blessed, permanent life legacy.',
    tier: 'legendary',
  },
];

export const DEFAULT_HABIT_RULES: HabitRules = {
  frequency: 'Daily',
  preferredTime: '07:00 AM',
  minCompletionMinutes: 10,
  targetMinutes: 30,
  allowRestDays: true,
  graceDays: 1,
  missedDayBehavior: 'Flexible',
  reminderEnabled: true,
  reminderTime: '06:30 AM',
  motivationalNotification: true,
  streakProtection: '1 day/month',
  streakShields: 2,
};

export class HabitContinuationEngine {
  /**
   * Generates a DayPlan dynamically for any day number (1 to infinity).
   * For Days 1-21, returns predefined plan if available.
   * For Day 22+, dynamically synthesizes compounding habit plans.
   */
  public static getDayPlan(challenge: Challenge, day: number): DayPlan {
    if (day <= 21 && challenge.days && challenge.days[day - 1]) {
      return challenge.days[day - 1];
    }

    const titlePrefix = this.getCompoundingTitle(day);
    const estimatedMinutes = Math.min(45, 15 + Math.floor((day % 10) * 2));

    const defaultChecklists: string[] = [
      `Deliberate Focus: Practice ${challenge.title} with full presence.`,
      `Mindful Execution: Track your sensory and mental state during practice.`,
      `Compound Reflection: Notice how this habit feels increasingly natural.`,
    ];

    const psychologyTips = [
      'Habit automaticity peaks between days 66 and 100, where mental friction drops to near zero.',
      'Small daily compound repetitions outperform intense sporadic bursts by over 300%.',
      'Identity shift: You are no longer just practicing a habit—you ARE a practitioner of this discipline.',
      'On low motivation days, committing to just the 2-minute version preserves the neural loop.',
      'Celebrate tiny victories. Dopamine release upon task completion cements the habit circuit.',
    ];

    const tip = psychologyTips[(day - 1) % psychologyTips.length];

    return {
      day,
      title: `${titlePrefix}: Day ${day}`,
      description: `Maintain lifelong momentum in ${challenge.title}. Show up today with intention and consistency.`,
      tasks: [
        `Complete Day ${day} habit session (${estimatedMinutes} mins) for ${challenge.title}.`,
      ],
      tip: `Consistency over intensity: Day ${day} reinforces your permanent neural groove.`,
      estimatedMinutes,
      suggestedTimerMinutes: estimatedMinutes,
      actionChecklist: defaultChecklists,
      psychologyTip: tip,
      timer: estimatedMinutes,
    };
  }

  public static generateDayPlan(challenge: Challenge, day: number): DayPlan {
    return this.getDayPlan(challenge, day);
  }

  private static getCompoundingTitle(day: number): string {
    if (day === 22) return 'Habit Continuum Kickoff';
    if (day <= 30) return 'Neuroplastic Anchoring';
    if (day <= 50) return 'Subconscious Solidification';
    if (day <= 75) return 'Identity Alignment';
    if (day <= 100) return 'Centurion Habit Stacking';
    if (day <= 180) return 'Mastery Progression';
    if (day <= 365) return 'Lifetime Flow State';
    return 'Infinite Habit Continuum';
  }

  /**
   * Checks if a milestone was unlocked at the given day.
   */
  public static getMilestoneForDay(day: number): ChallengeMilestone | undefined {
    return HABIT_CONTINUATION_MILESTONES.find((m) => m.day === day);
  }

  public static checkMilestoneReached(day: number): ChallengeMilestone | undefined {
    return this.getMilestoneForDay(day);
  }

  /**
   * Returns all milestones up to a given max day or upcoming milestones.
   */
  public static getAllMilestones(): ChallengeMilestone[] {
    return HABIT_CONTINUATION_MILESTONES;
  }

  /**
   * Initializes or updates Habit Mode for a challenge progress.
   */
  public static transitionToHabitMode(progress: UserChallengeProgress): UserChallengeProgress {
    const currentDay = Math.max(progress.currentDay, 22);
    const unlocked = progress.unlockedMilestones || [];
    if (!unlocked.includes(21)) {
      unlocked.push(21);
    }

    return {
      ...progress,
      status: 'habit_mode',
      continuationEnabled: true,
      continuationStartedAt: progress.continuationStartedAt || new Date().toISOString(),
      currentDay,
      habitRules: progress.habitRules || { ...DEFAULT_HABIT_RULES },
      streakShields: progress.streakShields ?? 2,
      unlockedMilestones: unlocked,
    };
  }

  /**
   * Calculates comprehensive analytics and streak health.
   */
  public static calculateStats(progress: UserChallengeProgress, challenge: Challenge) {
    const logs = Object.entries(progress.dayLogs || {});
    let completedDays = 0;
    let restDays = 0;
    let missedDays = 0;
    let totalMinutes = 0;

    logs.forEach(([_, log]) => {
      if (log.completed) {
        completedDays++;
        totalMinutes += log.timeSpentMinutes || 20;
      } else if (log.isRestDay || log.status === 'REST_DAY') {
        restDays++;
      } else if (log.isMissed || log.status === 'MISSED') {
        missedDays++;
      }
    });

    const totalTrackedDays = Math.max(1, completedDays + restDays + missedDays);
    const completionRate = Math.round((completedDays / totalTrackedDays) * 100) || 100;
    const currentStreak = progress.streak || completedDays;
    const longestStreak = Math.max(currentStreak, progress.highestStreak || 0);

    // Milestones achieved
    const unlockedMilestones = HABIT_CONTINUATION_MILESTONES.filter((m) =>
      progress.unlockedMilestones?.includes(m.day) || completedDays >= m.day
    );

    const nextMilestone = HABIT_CONTINUATION_MILESTONES.find((m) => m.day > completedDays) ||
      HABIT_CONTINUATION_MILESTONES[HABIT_CONTINUATION_MILESTONES.length - 1];

    return {
      completedDays,
      restDays,
      missedDays,
      totalMinutes,
      totalTrackedDays,
      completionRate,
      currentStreak,
      longestStreak,
      unlockedMilestones,
      nextMilestone,
      isHabitMode: progress.status === 'habit_mode' || progress.currentDay > 21,
    };
  }

  /**
   * Mark a day as a Rest Day (preserves streak).
   */
  public static markAsRestDay(
    progress: UserChallengeProgress,
    day: number,
    note?: string
  ): UserChallengeProgress {
    const updatedDayLogs: Record<number, DayLog> = {
      ...progress.dayLogs,
      [day]: {
        completed: false,
        isRestDay: true,
        status: 'REST_DAY',
        completedAt: new Date().toISOString(),
        completedTasks: ['Rest & Regeneration Day'],
        reflectionNote: note || 'Taking a planned mindful rest day to consolidate neural growth.',
        scratched: true,
      },
    };

    const nextCurrentDay = Math.max(day + 1, progress.currentDay);

    return {
      ...progress,
      currentDay: nextCurrentDay,
      dayLogs: updatedDayLogs,
    };
  }

  /**
   * Use a Streak Shield to protect streak on a missed day.
   */
  public static useStreakShield(
    progress: UserChallengeProgress,
    day: number
  ): { success: boolean; updatedProgress: UserChallengeProgress; message: string } {
    const availableShields = progress.streakShields ?? 1;
    if (availableShields <= 0) {
      return {
        success: false,
        updatedProgress: progress,
        message: 'No Streak Shields available. Earn more via milestones or Daily Wheel!',
      };
    }

    const updatedDayLogs: Record<number, DayLog> = {
      ...progress.dayLogs,
      [day]: {
        completed: false,
        shieldUsed: true,
        status: 'EXCUSED',
        completedAt: new Date().toISOString(),
        completedTasks: ['Streak Shield Activated'],
        reflectionNote: 'Streak Shield applied to preserve unbroken consistency.',
        scratched: true,
      },
    };

    const nextCurrentDay = Math.max(day + 1, progress.currentDay);

    const updated: UserChallengeProgress = {
      ...progress,
      currentDay: nextCurrentDay,
      dayLogs: updatedDayLogs,
      streakShields: availableShields - 1,
    };

    return {
      success: true,
      updatedProgress: updated,
      message: `Streak Shield activated! 1 shield used (${availableShields - 1} remaining). Your streak is safe!`,
    };
  }

  /**
   * Generates calendar matrix data for any month/year for a challenge.
   */
  public static getCalendarMonthMatrix(
    progress: UserChallengeProgress,
    year: number,
    month: number // 0-indexed (0 = Jan, 11 = Dec)
  ) {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDate = new Date(progress.startedAt || Date.now());

    const days = [];
    // Prefix empty slots
    for (let i = 0; i < (firstDayIndex === 0 ? 6 : firstDayIndex - 1); i++) {
      days.push({ dayNumber: 0, dateStr: '', status: 'EMPTY' });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().slice(0, 10);
      
      // Approximate challenge day by diff from startedAt
      const diffTime = date.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      let status: 'COMPLETED' | 'REST' | 'MISSED' | 'AVAILABLE' | 'LOCKED' | 'FUTURE' = 'LOCKED';
      let dayIndex = diffDays > 0 ? diffDays : null;

      if (dayIndex && progress.dayLogs[dayIndex]) {
        const log = progress.dayLogs[dayIndex];
        if (log.completed) status = 'COMPLETED';
        else if (log.isRestDay) status = 'REST';
        else if (log.shieldUsed) status = 'REST';
        else if (log.isMissed) status = 'MISSED';
      } else if (dayIndex && dayIndex === progress.currentDay) {
        status = 'AVAILABLE';
      } else if (dayIndex && dayIndex < progress.currentDay) {
        status = 'MISSED';
      } else {
        status = 'FUTURE';
      }

      days.push({
        dayNumber: d,
        challengeDay: dayIndex,
        dateStr,
        status,
        isToday: new Date().toDateString() === date.toDateString(),
      });
    }

    return days;
  }
}
