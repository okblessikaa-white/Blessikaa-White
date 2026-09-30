import { CustomWheelConfig, WheelTriangleItem } from '../types';

export const WHEEL_COLOR_PALETTE = [
  '#6C3FE8', // Purple
  '#F59E0B', // Amber
  '#38BDF8', // Sky Blue
  '#10B981', // Emerald
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#3B82F6', // Blue
  '#F43F5E', // Rose
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
];

export const POPULAR_WHEEL_ICONS = [
  '🪙', '⭐', '🎁', '🔥', '⚡', '❄️', '💪', '💧', '📵', '📖', '🧹', '🚿', '🥗', '🧘', '🏃', '☕', '🛡️', '👑', '💎', '✨'
];

export const PRESET_POSITIVE_POOL: WheelTriangleItem[] = [
  { id: 1, label: '+100 XP', icon: '⭐', color: '#6C3FE8', type: 'xp', value: 100 },
  { id: 2, label: '+1 Coin 🪙', icon: '🪙', color: '#F59E0B', type: 'coins', value: 1 },
  { id: 3, label: 'Streak Freeze', icon: '❄️', color: '#38BDF8', type: 'streak_freeze', value: 1 },
  { id: 4, label: '+250 XP Boost', icon: '⚡', color: '#10B981', type: 'xp', value: 250 },
  { id: 5, label: '+2 Coins 🪙', icon: '🪙', color: '#EC4899', type: 'coins', value: 2 },
  { id: 6, label: 'Super Spark', icon: '🔥', color: '#8B5CF6', type: 'xp', value: 50 },
  { id: 7, label: '+50 XP', icon: '✨', color: '#3B82F6', type: 'xp', value: 50 },
  { id: 8, label: 'Mystery Gift', icon: '🎁', color: '#F43F5E', type: 'xp', value: 150 },
  { id: 9, label: '+3 Coins 🪙', icon: '🪙', color: '#06B6D4', type: 'coins', value: 3 },
  { id: 10, label: 'Streak Shield', icon: '🛡️', color: '#F97316', type: 'streak_freeze', value: 1 },
  { id: 11, label: '+500 XP Surge', icon: '💎', color: '#6366F1', type: 'xp', value: 500 },
  { id: 12, label: 'Blessed Perk', icon: '👑', color: '#14B8A6', type: 'custom', value: 1 },
];

export const PRESET_PENALTY_POOL: WheelTriangleItem[] = [
  { id: 1, label: '10 Pushups Now', icon: '💪', color: '#EF4444', type: 'penalty', penaltyIntensity: 'moderate' },
  { id: 2, label: 'No Social Media 2h', icon: '📵', color: '#F97316', type: 'penalty', penaltyIntensity: 'strict' },
  { id: 3, label: 'Drink 500ml Water', icon: '💧', color: '#06B6D4', type: 'penalty', penaltyIntensity: 'light' },
  { id: 4, label: 'Cold Water Splash', icon: '❄️', color: '#3B82F6', type: 'penalty', penaltyIntensity: 'light' },
  { id: 5, label: 'Read 10 Book Pages', icon: '📖', color: '#8B5CF6', type: 'penalty', penaltyIntensity: 'light' },
  { id: 6, label: 'No Sugar Today', icon: '🚫', color: '#EC4899', type: 'penalty', penaltyIntensity: 'strict' },
  { id: 7, label: '1-Min Cold Shower', icon: '🚿', color: '#6366F1', type: 'penalty', penaltyIntensity: 'strict' },
  { id: 8, label: 'Clean Your Desk', icon: '🧹', color: '#10B981', type: 'penalty', penaltyIntensity: 'light' },
  { id: 9, label: '15 Jumping Jacks', icon: '🏃', color: '#F59E0B', type: 'penalty', penaltyIntensity: 'light' },
  { id: 10, label: 'No Snacks Till Eve', icon: '🥗', color: '#14B8A6', type: 'penalty', penaltyIntensity: 'moderate' },
  { id: 11, label: '5-Min Deep Silence', icon: '🧘', color: '#8B5CF6', type: 'penalty', penaltyIntensity: 'light' },
  { id: 12, label: 'Walk 1,000 Steps', icon: '🚶', color: '#38BDF8', type: 'penalty', penaltyIntensity: 'moderate' },
];

export const DEFAULT_POSITIVE_WHEEL_CONFIG: CustomWheelConfig = {
  segmentCount: 8,
  triangles: PRESET_POSITIVE_POOL.slice(0, 8),
};

export const DEFAULT_PENALTY_WHEEL_CONFIG: CustomWheelConfig = {
  segmentCount: 8,
  triangles: PRESET_PENALTY_POOL.slice(0, 8),
};

/**
 * Builds or adapts a wheel's triangles to match the requested triangle count (4 to 12).
 * Preserves user customizations when possible, while filling or trimming to target count.
 */
export function buildAdjustedWheelTriangles(
  mode: 'positive' | 'penalty',
  targetCount: number,
  existingTriangles: WheelTriangleItem[] = []
): WheelTriangleItem[] {
  const safeCount = Math.max(4, Math.min(12, targetCount));
  const pool = mode === 'positive' ? PRESET_POSITIVE_POOL : PRESET_PENALTY_POOL;

  const result: WheelTriangleItem[] = [];

  for (let i = 0; i < safeCount; i++) {
    if (existingTriangles[i]) {
      result.push({
        ...existingTriangles[i],
        id: i + 1,
        color: existingTriangles[i].color || WHEEL_COLOR_PALETTE[i % WHEEL_COLOR_PALETTE.length],
      });
    } else {
      const fallback = pool[i % pool.length];
      result.push({
        ...fallback,
        id: i + 1,
        color: WHEEL_COLOR_PALETTE[i % WHEEL_COLOR_PALETTE.length],
      });
    }
  }

  return result;
}
