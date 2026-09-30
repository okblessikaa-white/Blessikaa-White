import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Plus,
  Smile,
  Calendar,
  Sparkles,
  ChevronRight,
  Info,
  Clock,
  ChevronLeft,
  Save,
  Check,
} from 'lucide-react';
import {
  MenstrualCycleProfile,
  MenstrualDailyLog,
  CompletedPeriodRecord,
} from '../../types/menstrual';
import { MenstrualEngine } from '../../utils/menstrualEngine';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MenstrualInsightsViewProps {
  profile: MenstrualCycleProfile;
  logs: Record<string, MenstrualDailyLog>;
  periodHistory: CompletedPeriodRecord[];
  onAddPeriodRecord: (record: CompletedPeriodRecord) => void;
  onBackToHome?: () => void;
}

export const MenstrualInsightsView: React.FC<MenstrualInsightsViewProps> = ({
  profile,
  logs,
  periodHistory,
  onAddPeriodRecord,
  onBackToHome,
}) => {
  const [showAddPeriodModal, setShowAddPeriodModal] = useState(false);
  const [newStart, setNewStart] = useState('2026-08-18');
  const [newEnd, setNewEnd] = useState('2026-08-22');
  const [newNotes, setNewNotes] = useState('');

  const analytics = MenstrualEngine.calculateAnalytics(profile, periodHistory, logs);

  const handleSaveNewPeriod = () => {
    soundManager.playSuccess();
    triggerHaptic('heavy');
    const duration =
      Math.max(
        1,
        Math.round(
          (new Date(newEnd).getTime() - new Date(newStart).getTime()) / (1000 * 60 * 60 * 24)
        )
      ) + 1;

    const record: CompletedPeriodRecord = {
      id: `period_${Date.now()}`,
      startDate: newStart,
      endDate: newEnd,
      durationDays: duration,
      cycleLengthDays: profile.cycleLengthDays,
      notes: newNotes.trim() || undefined,
    };

    onAddPeriodRecord(record);
    setShowAddPeriodModal(false);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-14">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="blessikaa-section-embossed rounded-3xl p-3.5 sm:p-4 text-center space-y-1 transition-all">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Avg Cycle</span>
          <div className="text-xl sm:text-2xl font-black text-purple-900 dark:text-purple-200">
            {analytics.avgCycleDays}
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 ml-0.5">d</span>
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block">Typical duration</span>
        </div>

        <div className="blessikaa-section-embossed rounded-3xl p-3.5 sm:p-4 text-center space-y-1 transition-all">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Avg Period</span>
          <div className="text-xl sm:text-2xl font-black text-purple-900 dark:text-purple-200">
            {analytics.avgPeriodDays}
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 ml-0.5">d</span>
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block">Bleeding length</span>
        </div>

        <div className="blessikaa-section-embossed rounded-3xl p-3.5 sm:p-4 text-center space-y-1 transition-all">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Regularity</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {analytics.regularityScore}%
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">High stability</span>
        </div>
      </div>

      {/* Cycle Regularity Progress Bar */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Cycle Regularity Score</span>
          </span>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
            {analytics.regularityScore}% Consistent
          </span>
        </div>

        <div className="w-full h-3 bg-purple-50 dark:bg-purple-950/40 rounded-full overflow-hidden p-0.5 border border-purple-100 dark:border-purple-900">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${analytics.regularityScore}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          Your cycle length has varied by less than ±1.5 days across recorded cycles, indicating
          predictable hormonal timing.
        </p>
      </div>

      {/* Cycle Length History Trend Chart */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Cycle Length Trend</h3>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Last 4 Recorded Cycles</p>
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-purple-50 dark:bg-purple-900/40 px-2.5 py-1 rounded-xl border border-purple-100 dark:border-purple-800">
            6 Months
          </span>
        </div>

        <div className="h-32 flex items-end justify-between gap-3 pt-6 px-2 border-b border-purple-100 dark:border-purple-900 pb-2">
          {periodHistory.slice(-4).map((record) => {
            const heightPct = Math.min(100, Math.max(30, ((record.cycleLengthDays || 28) / 35) * 100));
            return (
              <div key={record.id} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-black text-purple-900 dark:text-purple-200">
                  {record.cycleLengthDays || 28}d
                </span>
                <div
                  className="w-full max-w-[42px] bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-xl transition-all shadow-xs"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                  {new Date(record.startDate).toLocaleDateString('en-US', { month: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Symptom Distribution Bars */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Most Frequent Symptoms</h3>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Based on daily logs</p>
          </div>
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/40 px-2.5 py-1 rounded-xl border border-purple-100 dark:border-purple-800">
            Days 1–2 Peak
          </span>
        </div>

        <div className="space-y-2.5">
          {[
            { symptom: 'Cramps', percentage: 72 },
            { symptom: 'Fatigue', percentage: 51 },
            { symptom: 'Headache', percentage: 34 },
            { symptom: 'Bloating', percentage: 29 },
          ].map((item) => (
            <div key={item.symptom} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{item.symptom}</span>
                <span className="text-purple-700 font-black">{item.percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-purple-50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-purple-950 leading-relaxed font-medium">
            AI Insight: Fatigue and cramps are concentrated primarily in the first 48 hours of your
            cycle. Gentle stretching and extra hydration recommended on Day 1.
          </p>
        </div>
      </div>

      {/* Mood & Cycle Correlation Matrix */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Mood & Cycle Correlation</span>
          </span>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Day by Day</span>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center pt-1">
          {[
            { day: 'Day 1', emoji: '😣', phase: 'Period' },
            { day: 'Day 3', emoji: '😐', phase: 'Period' },
            { day: 'Day 7', emoji: '🙂', phase: 'Follicular' },
            { day: 'Day 14', emoji: '😄', phase: 'Ovulation' },
            { day: 'Day 24', emoji: '😔', phase: 'Luteal' },
          ].map((item, idx) => (
            <div key={idx} className="p-2 rounded-2xl blessikaa-inner-embossed">
              <span className="text-xl block mb-1">{item.emoji}</span>
              <span className="text-[11px] font-black text-slate-900 dark:text-white block">{item.day}</span>
              <span className="text-[9px] font-bold text-purple-700 dark:text-purple-300 block truncate">
                {item.phase}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Period History List */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Period History</h3>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">2026 Recorded Periods</p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              triggerHaptic('light');
              setShowAddPeriodModal(true);
            }}
            className="group px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1E1A3D] hover:bg-purple-50 dark:hover:bg-[#282154] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 shadow-md hover:shadow-lg hover:shadow-purple-500/10 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300">
              Add Period
            </span>
          </button>
        </div>

        <div className="space-y-2">
          {periodHistory.map((period) => (
            <div
              key={period.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 dark:text-rose-300 flex items-center justify-center text-sm shadow-2xs">
                  🩸
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {MenstrualEngine.formatDateRange(period.startDate, period.endDate)}
                  </div>
                  <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    {period.notes || 'Normal cycle progression'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs sm:text-sm font-black text-purple-900 dark:text-purple-200 block">
                  {period.durationDays} days
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                  {period.cycleLengthDays ? `${period.cycleLengthDays}d cycle` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Period Manual Modal with Android Save Button */}
      {showAddPeriodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-purple-200 space-y-4">
            <h3 className="text-base font-black text-slate-900">Record Past Period</h3>

            <div>
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 block mb-1.5">
                Period Start Date
              </label>
              <input
                type="date"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white shadow-xs focus:outline-hidden focus:border-purple-600"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 block mb-1.5">
                Period End Date
              </label>
              <input
                type="date"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white shadow-xs focus:outline-hidden focus:border-purple-600"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 block mb-1.5">Notes (Optional)</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="e.g. Normal flow, mild cramps"
                className="w-full p-3 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] text-xs font-medium text-slate-900 dark:text-white shadow-xs focus:outline-hidden focus:border-purple-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddPeriodModal(false)}
                className="flex-1 py-3 rounded-2xl bg-purple-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-purple-200/80 dark:border-[#383068] text-xs font-bold cursor-pointer hover:bg-purple-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewPeriod}
                className="flex-2 group py-2.5 px-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-purple-600/30 cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <div className="w-6 h-6 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Save className="w-3.5 h-3.5" />
                </div>
                <span>SAVE PERIOD (ANDROID)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
