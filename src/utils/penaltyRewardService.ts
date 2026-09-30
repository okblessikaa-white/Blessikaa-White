import { CustomPenalty, CustomReward } from '../types';

const PENALTIES_STORAGE_KEY = 'blessikaa_custom_penalties_v1';
const REWARDS_STORAGE_KEY = 'blessikaa_custom_rewards_v1';

export const DEFAULT_PENALTIES: CustomPenalty[] = [
  {
    id: 'penalty_pushups',
    title: '30 Daily Push-ups / Burpees',
    category: 'physical',
    description: 'Perform 30 push-ups or burpees in a single set before bedtime.',
    icon: '💪',
    intensity: 'moderate',
    isAutoApplied: true,
    timesEnforced: 0,
  },
  {
    id: 'penalty_social_media',
    title: '24-Hour Social Media Blackout',
    category: 'digital',
    description: 'Delete/block Instagram, TikTok, and YouTube apps for a full 24 hours.',
    icon: '📵',
    intensity: 'strict',
    isAutoApplied: true,
    timesEnforced: 0,
  },
  {
    id: 'penalty_cold_shower',
    title: '5-Minute Ice Cold Shower',
    category: 'discipline',
    description: 'Turn the faucet completely cold and endure 5 full minutes of breathwork.',
    icon: '🚿',
    intensity: 'strict',
    isAutoApplied: false,
    timesEnforced: 0,
  },
  {
    id: 'penalty_charity_jar',
    title: '$5 / ₹500 Charity Donation Fine',
    category: 'financial',
    description: 'Transfer penalty amount into your designated charity jar or cause.',
    icon: '💸',
    intensity: 'moderate',
    isAutoApplied: false,
    timesEnforced: 0,
  },
  {
    id: 'penalty_early_wake',
    title: '45-Min Early Morning Alarm',
    category: 'discipline',
    description: 'Wake up 45 minutes earlier tomorrow to read and journal in silence.',
    icon: '⏰',
    intensity: 'mild',
    isAutoApplied: true,
    timesEnforced: 0,
  },
];

export const DEFAULT_REWARDS: CustomReward[] = [
  {
    id: 'reward_favorite_meal',
    title: 'Favorite Guilt-Free Cheat Meal',
    category: 'treat',
    description: 'Enjoy your favorite dessert, coffee latte, or dining experience.',
    icon: '🍕',
    costXp: 200,
    timesClaimed: 0,
    isUnlocked: true,
  },
  {
    id: 'reward_movie_night',
    title: 'Uninterrupted 2-Hour Movie Night',
    category: 'entertainment',
    description: 'Watch a trending movie or binge 2 episodes of your favorite show.',
    icon: '🍿',
    costXp: 150,
    timesClaimed: 0,
    isUnlocked: true,
  },
  {
    id: 'reward_spa_session',
    title: 'Relaxing Bubble Bath & Spa Care',
    category: 'leisure',
    description: 'Light candles, play soothing ambient frequencies, and do a face mask.',
    icon: '🛁',
    costXp: 100,
    timesClaimed: 0,
    isUnlocked: true,
  },
  {
    id: 'reward_new_book',
    title: 'Purchase a New Book / Course',
    category: 'purchase',
    description: 'Invest in a hardcover bestseller or an educational audio masterclass.',
    icon: '📚',
    costXp: 300,
    timesClaimed: 0,
    isUnlocked: true,
  },
  {
    id: 'reward_nature_walk',
    title: 'Scenic Nature Hike / Solo Date',
    category: 'experience',
    description: 'Spend an afternoon exploring a botanical park, beach, or quiet sanctuary.',
    icon: '🌲',
    costXp: 100,
    timesClaimed: 0,
    isUnlocked: true,
  },
];

export const PenaltyRewardService = {
  getPenalties(): CustomPenalty[] {
    try {
      const data = localStorage.getItem(PENALTIES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse custom penalties', e);
    }
    this.savePenalties(DEFAULT_PENALTIES);
    return DEFAULT_PENALTIES;
  },

  savePenalties(penalties: CustomPenalty[]) {
    try {
      localStorage.setItem(PENALTIES_STORAGE_KEY, JSON.stringify(penalties));
    } catch (e) {
      console.error('Failed to save penalties', e);
    }
  },

  addPenalty(penalty: Omit<CustomPenalty, 'id' | 'timesEnforced'>): CustomPenalty {
    const penalties = this.getPenalties();
    const newPenalty: CustomPenalty = {
      ...penalty,
      id: 'penalty_' + Date.now(),
      timesEnforced: 0,
    };
    const updated = [newPenalty, ...penalties];
    this.savePenalties(updated);
    return newPenalty;
  },

  enforcePenalty(id: string): CustomPenalty[] {
    const penalties = this.getPenalties();
    const updated = penalties.map((p) =>
      p.id === id
        ? {
            ...p,
            timesEnforced: (p.timesEnforced || 0) + 1,
            lastEnforced: new Date().toISOString(),
          }
        : p
    );
    this.savePenalties(updated);
    return updated;
  },

  deletePenalty(id: string): CustomPenalty[] {
    const penalties = this.getPenalties();
    const updated = penalties.filter((p) => p.id !== id);
    this.savePenalties(updated);
    return updated;
  },

  getRewards(): CustomReward[] {
    try {
      const data = localStorage.getItem(REWARDS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse custom rewards', e);
    }
    this.saveRewards(DEFAULT_REWARDS);
    return DEFAULT_REWARDS;
  },

  saveRewards(rewards: CustomReward[]) {
    try {
      localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(rewards));
    } catch (e) {
      console.error('Failed to save rewards', e);
    }
  },

  addReward(reward: Omit<CustomReward, 'id' | 'timesClaimed' | 'isUnlocked'>): CustomReward {
    const rewards = this.getRewards();
    const newReward: CustomReward = {
      ...reward,
      id: 'reward_' + Date.now(),
      timesClaimed: 0,
      isUnlocked: true,
    };
    const updated = [newReward, ...rewards];
    this.saveRewards(updated);
    return newReward;
  },

  claimReward(id: string): CustomReward[] {
    const rewards = this.getRewards();
    const updated = rewards.map((r) =>
      r.id === id
        ? {
            ...r,
            timesClaimed: (r.timesClaimed || 0) + 1,
            lastClaimed: new Date().toISOString(),
          }
        : r
    );
    this.saveRewards(updated);
    return updated;
  },

  deleteReward(id: string): CustomReward[] {
    const rewards = this.getRewards();
    const updated = rewards.filter((r) => r.id !== id);
    this.saveRewards(updated);
    return updated;
  },
};
