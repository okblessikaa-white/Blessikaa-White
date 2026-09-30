import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Info,
  Calendar as CalendarIcon,
  Sparkles,
} from 'lucide-react';
import {
  MenstrualCycleProfile,
  MenstrualDailyLog,
  CompletedPeriodRecord,
  CyclePrediction,
} from '../../types/menstrual';
import { MenstrualEngine } from '../../utils/menstrualEngine';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MenstrualCalendarViewProps {
  profile: MenstrualCycleProfile;
  logs: Record<string, MenstrualDailyLog>;
  periodHistory: CompletedPeriodRecord[];
  prediction: CyclePrediction;
  onSelectDate: (dateStr: string) => void;
  onOpenLogDate: (dateStr: string) => void;
  onBackToHome?: () => void;
}

export const MenstrualCalendarView: React.FC<MenstrualCalendarViewProps> = ({
  profile,
  logs,
  periodHistory,
  prediction,
  onSelectDate,
  onOpenLogDate,
  onBackToHome,
}) => {
  // Calendar month state (defaults to August 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-08-01'));

  const monthYearLabel = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const handlePrevMonth = () => {
    soundManager.playTick();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    soundManager.playTick();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-14">
      {/* Calendar Header Card */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{monthYearLabel}</h2>
            <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">
              Cycle markers & fertile windows
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-9 h-9 rounded-2xl bg-white dark:bg-[#15112E] hover:bg-purple-50 dark:hover:bg-[#282154] text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-[#383068] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-9 h-9 rounded-2xl bg-white dark:bg-[#15112E] hover:bg-purple-50 dark:hover:bg-[#282154] text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-[#383068] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 dark:text-slate-500">
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
          <span>Su</span>
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12 rounded-2xl bg-transparent" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum
              .toString()
              .padStart(2, '0')}`;

            const log = logs[dateStr];
            const isLoggedPeriod = log?.isPeriod;
            const isOvulationDay = prediction.estimatedOvulationDate === dateStr;
            const isFertileWindow =
              dateStr >= prediction.fertileWindowStart && dateStr <= prediction.fertileWindowEnd;
            const isPredictedPeriod =
              dateStr >= prediction.estimatedNextPeriodDate &&
              dateStr <=
                new Date(
                  new Date(prediction.estimatedNextPeriodDate).getTime() +
                    (profile.periodLengthDays - 1) * 86400000
                )
                  .toISOString()
                  .split('T')[0];

            const isToday = dateStr === '2026-08-30';

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  onSelectDate(dateStr);
                }}
                className={`h-12 sm:h-14 rounded-2xl p-1 relative flex flex-col items-center justify-between border transition-all cursor-pointer ${
                  isToday
                    ? 'border-2 border-purple-600 bg-purple-50/70 dark:bg-purple-900/50 font-black scale-102 text-purple-950 dark:text-purple-100'
                    : isLoggedPeriod
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 shadow-2xs'
                    : isPredictedPeriod
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-dashed border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                    : isOvulationDay
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 shadow-2xs'
                    : isFertileWindow
                    ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
                    : 'bg-white dark:bg-[#15112E] border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className="text-xs font-bold leading-none">{dayNum}</span>

                {/* Markers */}
                <div className="flex items-center gap-0.5 pb-0.5">
                  {isLoggedPeriod && <span className="text-xs">🩸</span>}
                  {!isLoggedPeriod && isPredictedPeriod && (
                    <span className="text-[10px] text-rose-400">🩸</span>
                  )}
                  {isOvulationDay && <span className="text-xs">⭐</span>}
                  {!isOvulationDay && isFertileWindow && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                  )}
                  {log && log.symptoms && log.symptoms.length > 0 && !isLoggedPeriod && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="p-3.5 rounded-2xl blessikaa-inner-embossed flex flex-wrap items-center justify-around gap-2 text-[11px] font-bold text-slate-700 dark:text-purple-200">
          <div className="flex items-center gap-1">
            <span>🩸</span>
            <span>Recorded Period</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            <span>Fertile Window</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>Estimated Ovulation</span>
          </div>
        </div>
      </div>

      {/* Floating or Direct + Log Date Button */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onOpenLogDate('2026-08-30')}
          className="w-full group rounded-3xl p-5 sm:p-6 blessikaa-section-embossed hover:bg-purple-50/50 dark:hover:bg-[#282154] hover:border-purple-500 dark:hover:border-purple-400 text-left hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight">
                + LOG TODAY (AUG 30)
              </span>
              <span className="text-xs text-purple-700 dark:text-purple-300 font-bold block mt-0.5">
                Period, symptoms, mood & energy
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/40 group-hover:bg-purple-600 group-hover:text-white text-purple-700 dark:text-purple-300 flex items-center justify-center transition-colors shrink-0">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
        </button>
      </div>
    </div>
  );
};
