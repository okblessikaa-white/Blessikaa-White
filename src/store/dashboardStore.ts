import { create } from 'zustand';
import { DateRangeType } from '../types/dashboard';

interface DashboardState {
  selectedServiceId: string;
  dateRange: DateRangeType;
  customStartDate: string | null;
  customEndDate: string | null;
  selectedCategory: string;
  selectedProfile: string;
  selectedTag: string;
  reducedMotion: boolean;
  isOffline: boolean;
  isRefreshing: boolean;
  lastSyncedAt: string;

  // Actions
  setSelectedServiceId: (serviceId: string) => void;
  setDateRange: (range: DateRangeType) => void;
  setCustomDateRange: (start: string, end: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedProfile: (profile: string) => void;
  setSelectedTag: (tag: string) => void;
  setReducedMotion: (enabled: boolean) => void;
  setIsOffline: (offline: boolean) => void;
  triggerRefresh: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  selectedServiceId: 'water',
  dateRange: '7d',
  customStartDate: null,
  customEndDate: null,
  selectedCategory: 'all',
  selectedProfile: 'Me (Personal)',
  selectedTag: 'all',
  reducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  isRefreshing: false,
  lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),

  setSelectedServiceId: (serviceId: string) => {
    set({ selectedServiceId: serviceId });
    try {
      localStorage.setItem('blessikaa_active_dashboard_service', serviceId);
    } catch {}
  },

  setDateRange: (range: DateRangeType) => {
    set({ dateRange: range });
  },

  setCustomDateRange: (start: string, end: string) => {
    set({
      dateRange: 'custom',
      customStartDate: start,
      customEndDate: end,
    });
  },

  setSelectedCategory: (cat: string) => {
    set({ selectedCategory: cat });
  },

  setSelectedProfile: (profile: string) => {
    set({ selectedProfile: profile });
  },

  setSelectedTag: (tag: string) => {
    set({ selectedTag: tag });
  },

  setReducedMotion: (enabled: boolean) => {
    set({ reducedMotion: enabled });
  },

  setIsOffline: (offline: boolean) => {
    set({ isOffline: offline });
  },

  triggerRefresh: async () => {
    set({ isRefreshing: true });
    // Simulate high-performance local aggregate hydration
    await new Promise((resolve) => setTimeout(resolve, 600));
    set({
      isRefreshing: false,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  },
}));
