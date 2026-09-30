/**
 * BLESSIKAA UNIVERSAL SERVICE-SCOPED DASHBOARD & ANALYTICS CONTRACT
 * Memory ID: BLK-DASHBOARD-CONTRACT-001
 * 
 * Rules:
 * - The frame is Core. The content is service-declared.
 * - Every service declares its own hero, secondary metrics, trend, breakdown,
 *   timeline, insights, recent activity, and actions.
 */

export type DateRangeType = '7d' | '30d' | '90d' | 'custom';

export type ChartType = 'line' | 'bar' | 'area';
export type BreakdownType = 'donut' | 'pie' | 'stacked-bar';
export type TimelineType = 'dots' | 'heatmap' | 'bars';
export type TrendDirection = 'up' | 'down' | 'neutral';

export interface HeroMetricConfig {
  label: string;
  value: string | number;
  unit?: string;
  target?: string | number;
  progressPercent?: number; // 0 to 100
  subtitle?: string;
  status?: 'positive' | 'neutral' | 'attention';
  icon?: string;
}

export interface SecondaryMetricConfig {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: TrendDirection;
  trendPercent?: string;
  subtitle?: string;
  icon?: string;
}

export interface TrendDataPoint {
  label: string;
  value: number;
  target?: number;
  secondaryValue?: number;
  date?: string;
}

export interface TrendChartConfig {
  title: string;
  subtitle?: string;
  chartType: ChartType;
  dataKey: string;
  xAxisKey?: string;
  unit?: string;
  color?: string;
  targetLine?: number;
  data: TrendDataPoint[];
}

export interface BreakdownDataPoint {
  name: string;
  value: number;
  color: string;
  unit?: string;
  percentage?: number;
}

export interface BreakdownChartConfig {
  title: string;
  subtitle?: string;
  chartType: BreakdownType;
  data: BreakdownDataPoint[];
}

export interface TimelineEntry {
  date: string;
  value: number; // For dots: size or intensity (0-100); For heatmap: 0-4 intensity
  status?: 'completed' | 'partial' | 'missed' | 'active';
  size?: number;
  color?: string;
  tooltip?: string;
}

export interface TimelineConfig {
  title: string;
  subtitle?: string;
  type: TimelineType;
  days: number;
  entries: TimelineEntry[];
  legend?: { label: string; color: string }[];
}

export interface InsightItem {
  id: string;
  text: string;
  type: 'pattern' | 'recommendation' | 'observation' | 'milestone';
  actionableSuggestion?: string;
  icon?: string;
}

export interface InsightsConfig {
  title?: string;
  insights: InsightItem[]; // Max 4, WARM voice
}

export interface RecentItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  value?: string;
  status?: string;
  badgeColor?: string;
  icon?: string;
}

export interface RecentConfig {
  title: string;
  entries: RecentItem[];
}

export interface DashboardAction {
  id: string;
  label: string;
  icon: string;
  variant: 'primary' | 'secondary' | 'accent';
  description?: string;
  actionType: string;
  payload?: any;
}

export interface ServiceDashboard {
  serviceId: string;
  serviceName: string;
  category: string;
  tagline: string;
  iconName: string;
  emoji: string;
  accent: string; // e.g. '#0284C7'
  accentGradient: string; // Tailwind gradient classes
  accentBg: string; // Light accent bg class
  hero: HeroMetricConfig;
  secondary: SecondaryMetricConfig[];
  trend: TrendChartConfig;
  breakdown: BreakdownChartConfig;
  timeline: TimelineConfig;
  insights: InsightsConfig;
  recent: RecentConfig;
  actions: DashboardAction[];
}
