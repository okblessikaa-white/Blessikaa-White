import React, { useState } from 'react';
import { ServiceDashboard, DateRangeType } from '../../types/dashboard';
import { AVAILABLE_SERVICES_LIST } from '../../services/dashboardRegistry';
import { ChevronDown, Calendar, Filter, Share2, Download, RefreshCw, WifiOff, CheckCircle2, User, Tag } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface DashboardHeaderProps {
  currentDashboard: ServiceDashboard;
  onSelectService: (serviceId: string) => void;
  dateRange: DateRangeType;
  onSelectDateRange: (range: DateRangeType) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedProfile: string;
  onSelectProfile: (profile: string) => void;
  isOffline?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onOpenExport: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentDashboard,
  onSelectService,
  dateRange,
  onSelectDateRange,
  selectedCategory,
  onSelectCategory,
  selectedProfile,
  onSelectProfile,
  isOffline = false,
  isRefreshing = false,
  onRefresh,
  onOpenExport,
}) => {
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dateRanges: { id: DateRangeType; label: string }[] = [
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
    { id: '90d', label: '90d' },
    { id: 'custom', label: 'Custom' },
  ];

  return (
    <header className="space-y-4">
      {/* Offline Status Notice Banner (Section 6) */}
      {isOffline && (
        <div className="p-3 rounded-2xl bg-amber-500/15 border-2 border-amber-300 dark:border-amber-700/60 flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200 animate-fadeIn">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>You are offline. Showing cached local aggregates. Changes will sync on reconnect.</span>
          </div>
          <span className="text-[10px] bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded-full">
            Cached
          </span>
        </div>
      )}

      {/* Main Bar: Service Selector + Global Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#1E1A3D] p-4 sm:p-5 rounded-3xl border-2 border-purple-200/80 dark:border-[#383068] shadow-md">
        {/* Service Switcher Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              triggerHaptic('light');
              setIsServiceMenuOpen(!isServiceMenuOpen);
            }}
            className="group flex items-center gap-3 p-2 rounded-2xl hover:bg-purple-50 dark:hover:bg-[#251E4E] transition-all cursor-pointer text-left"
            aria-expanded={isServiceMenuOpen}
            aria-label="Select Service Dashboard"
          >
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentDashboard.accentGradient} text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform shrink-0`}
            >
              {currentDashboard.emoji}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {currentDashboard.serviceName}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-transform" />
              </div>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-bold truncate max-w-[220px] sm:max-w-xs">
                {currentDashboard.category} • Universal Dashboard
              </p>
            </div>
          </button>

          {/* Service Switcher Dropdown Popover */}
          {isServiceMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-[#1E1A3D] rounded-3xl border-2 border-purple-200/90 dark:border-[#383068] shadow-2xl p-2.5 z-50 animate-fadeIn space-y-1">
              <div className="px-3 py-1.5 border-b border-purple-100 dark:border-[#383068]">
                <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                  Switch Service Scope
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-1 pt-1 pr-1">
                {AVAILABLE_SERVICES_LIST.map((svc) => {
                  const isSelected = svc.id === currentDashboard.serviceId;
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => {
                        soundManager.playTick();
                        triggerHaptic('medium');
                        onSelectService(svc.id);
                        setIsServiceMenuOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white font-black shadow-sm'
                          : 'hover:bg-purple-50 dark:hover:bg-[#251E4E] text-slate-800 dark:text-slate-200 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{svc.emoji}</span>
                        <div className="min-w-0">
                          <span className="text-xs truncate block">{svc.name}</span>
                          <span
                            className={`text-[10px] truncate block ${
                              isSelected ? 'text-purple-100' : 'text-slate-500 dark:text-slate-400 font-normal'
                            }`}
                          >
                            {svc.category}
                          </span>
                        </div>
                      </div>

                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons: Refresh & Export */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={() => {
                soundManager.playTick();
                triggerHaptic('light');
                onRefresh();
              }}
              disabled={isRefreshing}
              className="p-2.5 rounded-2xl bg-purple-50 dark:bg-[#15112E] hover:bg-purple-100 dark:hover:bg-[#282154] text-purple-700 dark:text-purple-300 border-2 border-purple-200/80 dark:border-[#383068] transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Refresh Service Aggregates"
              aria-label="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              triggerHaptic('light');
              onOpenExport();
            }}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1E1A3D] hover:bg-purple-50 dark:hover:bg-[#282154] text-purple-700 dark:text-purple-300 border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Export & Share Dashboard"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector & Filter Bar Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Date Range Selector: 7d · 30d · 90d · custom */}
        <div
          role="group"
          aria-label="Date Range Filter"
          className="flex items-center gap-1 p-1 bg-white dark:bg-[#1E1A3D] rounded-2xl border-2 border-purple-200/80 dark:border-[#383068] shadow-xs"
        >
          {dateRanges.map((r) => {
            const isSelected = dateRange === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  onSelectDateRange(r.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50/70 dark:hover:bg-[#251E4E]'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Filters: Category, Profile, Tags */}
        <div className="flex items-center gap-2">
          {/* Profile Pill */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs">
            <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <select
              value={selectedProfile}
              onChange={(e) => onSelectProfile(e.target.value)}
              className="bg-transparent font-bold focus:outline-hidden cursor-pointer"
              aria-label="Select User Profile"
            >
              <option value="Me (Personal)">Me (Personal)</option>
              <option value="Family Hub">Family Hub</option>
              <option value="Caregiver Account">Caregiver Account</option>
            </select>
          </div>

          {/* Category Filter Pill */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs">
            <Filter className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="bg-transparent font-bold focus:outline-hidden cursor-pointer"
              aria-label="Filter Category"
            >
              <option value="all">All Metrics</option>
              <option value="primary">Primary Routine</option>
              <option value="secondary">Support Regimens</option>
              <option value="clinical">Clinical Data</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
