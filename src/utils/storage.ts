import { AppSettings, Badge, Challenge, NotificationItem, UserChallengeProgress } from '../types';
import { DEFAULT_CHALLENGES } from '../data/defaultChallenges';
import { DEFAULT_PENALTY_WHEEL_CONFIG, DEFAULT_POSITIVE_WHEEL_CONFIG } from './wheelDefaults';

const STORAGE_KEYS = {
  SETTINGS: 'twentyone_days_settings_v1',
  CHALLENGES: 'twentyone_days_challenges_v1',
  ACTIVE_CHALLENGE_ID: 'twentyone_days_active_id_v1',
  PROGRESS_MAP: 'twentyone_days_progress_map_v1',
  BADGES: 'twentyone_days_badges_v1',
  NOTIFICATIONS: 'twentyone_days_notifications_v1',
};

export const INITIAL_SETTINGS: AppSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  reminderEnabled: false,
  reminderTime: '08:30',
  userName: 'Anonymous',
  userGender: 'Other',
  theme: 'peach',
  themeMode: 'light',
  notificationSound: true,
  streakFreezes: 1,
  userLevel: 1,
  coins: 2,
  onboardingCompleted: false,
  tutorialCompleted: false,
  ageVerified: false,
  avatar: {
    gender: 'Other',
    skinColor: '#F5D0A9',
    hairStyle: 'short',
    hairColor: '#3D2314',
    eyeType: 'friendly',
    eyeColor: '#2D3748',
    faceShape: 'oval',
    noseType: 'normal',
    earType: 'small',
    clothesType: 'casual',
    clothesColor: '#38BDF8',
    facialHair: 'none',
    accessory: 'none',
  },
  hiddenChallengeIds: [],
  activeChallengeIds: ['challenge_productivity', 'challenge_no_junk_food', 'challenge_happiness'],
  gamificationMode: 'scratch',
  alternateDayCount: 1,
  purchasedThemes: ['purple', 'peach'],
  purchasedAvatarItems: ['item_default'],
  challengeNotificationConfigs: {},
  customPositiveWheel: DEFAULT_POSITIVE_WHEEL_CONFIG,
  customPenaltyWheel: DEFAULT_PENALTY_WHEEL_CONFIG,
};

export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'badge_first_step',
    name: 'First Step Spark',
    description: 'Complete Day 1 of any 21-day challenge.',
    icon: 'Sparkles',
    category: 'milestone',
    requirement: 'Complete Day 1',
  },
  {
    id: 'badge_streak_3',
    name: '3-Day Fire',
    description: 'Maintain a 3-day continuous habit streak.',
    icon: 'Flame',
    category: 'streak',
    requirement: '3-Day Streak',
  },
  {
    id: 'badge_milestone_7',
    name: '7-Day Neural Seed',
    description: 'Conquer the critical first week milestone (Day 7).',
    icon: 'Award',
    category: 'milestone',
    requirement: 'Reach Day 7',
  },
  {
    id: 'badge_streak_10',
    name: '10-Day Unstoppable',
    description: 'Maintain an unbroken 10-day streak.',
    icon: 'Zap',
    category: 'streak',
    requirement: '10-Day Streak',
  },
  {
    id: 'badge_milestone_14',
    name: '14-Day Transformation',
    description: 'Cross the midway threshold of habit solidification.',
    icon: 'ShieldCheck',
    category: 'milestone',
    requirement: 'Reach Day 14',
  },
  {
    id: 'badge_mastery_21',
    name: '21-Day Habit Master',
    description: 'Graduate all 21 days of a transformation challenge!',
    icon: 'Crown',
    category: 'completion',
    requirement: 'Complete full 21 Days',
  },
  {
    id: 'badge_journaler',
    name: 'Reflective Mind',
    description: 'Log 5 detailed daily reflection notes.',
    icon: 'BookOpen',
    category: 'special',
    requirement: 'Write 5 Reflections',
  },
  {
    id: 'badge_multi_challenger',
    name: 'Renaissance Spirit',
    description: 'Participate in 2 or more diverse challenges.',
    icon: 'Layers',
    category: 'special',
    requirement: 'Try 2 Challenges',
  },
];

export class StorageManager {
  public static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          customPositiveWheel: parsed.customPositiveWheel?.triangles?.length
            ? parsed.customPositiveWheel
            : DEFAULT_POSITIVE_WHEEL_CONFIG,
          customPenaltyWheel: parsed.customPenaltyWheel?.triangles?.length
            ? parsed.customPenaltyWheel
            : DEFAULT_PENALTY_WHEEL_CONFIG,
        };
      }
    } catch {
      // fallback
    }
    return INITIAL_SETTINGS;
  }

  public static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }

  public static getChallenges(): Challenge[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      if (stored) {
        const parsed: Challenge[] = JSON.parse(stored);
        // Merge with default challenges if missing
        const customOnly = parsed.filter((c) => c.isCustom || c.isAiGenerated);
        return [...DEFAULT_CHALLENGES, ...customOnly];
      }
    } catch {
      // ignore
    }
    return DEFAULT_CHALLENGES;
  }

  public static saveCustomChallenge(challenge: Challenge): Challenge[] {
    try {
      const current = this.getChallenges();
      const existsIndex = current.findIndex((c) => c.id === challenge.id);
      let updated: Challenge[];
      if (existsIndex >= 0) {
        updated = [...current];
        updated[existsIndex] = challenge;
      } else {
        updated = [challenge, ...current];
      }
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save challenge', e);
      return this.getChallenges();
    }
  }

  public static getActiveChallengeId(): string {
    try {
      const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHALLENGE_ID);
      if (id) return id;
    } catch {
      // ignore
    }
    return DEFAULT_CHALLENGES[0].id;
  }

  public static setActiveChallengeId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CHALLENGE_ID, id);
    } catch (e) {
      console.error('Failed to set active challenge id', e);
    }
  }

  public static getProgressMap(): Record<string, UserChallengeProgress> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS_MAP);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    // Initialize default progress for default challenges
    const initial: Record<string, UserChallengeProgress> = {};
    DEFAULT_CHALLENGES.forEach((c) => {
      initial[c.id] = {
        challengeId: c.id,
        startedAt: new Date().toISOString(),
        currentDay: 1,
        dayLogs: {},
        isCompleted: false,
        streak: 0,
        highestStreak: 0,
        totalPoints: 0,
      };
    });
    return initial;
  }

  public static saveProgressMap(progressMap: Record<string, UserChallengeProgress>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS_MAP, JSON.stringify(progressMap));
    } catch (e) {
      console.error('Failed to save progress map', e);
    }
  }

  public static getBadges(): Badge[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BADGES);
      if (stored) {
        const parsed: Badge[] = JSON.parse(stored);
        // Ensure all default badges exist
        const map = new Map(parsed.map((b) => [b.id, b]));
        return DEFAULT_BADGES.map((b) => map.get(b.id) || b);
      }
    } catch {
      // ignore
    }
    return DEFAULT_BADGES;
  }

  public static saveBadges(badges: Badge[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
    } catch (e) {
      console.error('Failed to save badges', e);
    }
  }

  public static getNotifications(): NotificationItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      {
        id: 'welcome_notif',
        title: 'Welcome to 21 Days Challenge! ✨',
        body: 'Neuroplasticity studies show 21 days of focused repetition rewires habits. Start Day 1 today!',
        timestamp: new Date().toISOString(),
        read: false,
        type: 'motivation',
      },
    ];
  }

  public static saveNotifications(notifications: NotificationItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications.slice(0, 50)));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  }

  public static exportAllData(): string {
    const data = {
      settings: this.getSettings(),
      challenges: this.getChallenges().filter((c) => c.isCustom || c.isAiGenerated),
      activeChallengeId: this.getActiveChallengeId(),
      progressMap: this.getProgressMap(),
      badges: this.getBadges(),
      notifications: this.getNotifications(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  }

  public static importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings) this.saveSettings(parsed.settings);
      if (parsed.challenges && Array.isArray(parsed.challenges)) {
        localStorage.setItem(
          STORAGE_KEYS.CHALLENGES,
          JSON.stringify([...DEFAULT_CHALLENGES, ...parsed.challenges])
        );
      }
      if (parsed.activeChallengeId) this.setActiveChallengeId(parsed.activeChallengeId);
      if (parsed.progressMap) this.saveProgressMap(parsed.progressMap);
      if (parsed.badges) this.saveBadges(parsed.badges);
      if (parsed.notifications) this.saveNotifications(parsed.notifications);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
}
