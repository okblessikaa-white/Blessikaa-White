import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TimelineConfig, TimelineEntry } from '../../../types/dashboard';

interface TimelineHeatmapCardProps {
  config: TimelineConfig;
  accent: string;
  reducedMotion?: boolean;
}

export const TimelineHeatmapCard: React.FC<TimelineHeatmapCardProps> = ({
  config,
  accent,
  reducedMotion = false,
}) => {
  const [activeHoverEntry, setActiveHoverEntry] = useState<TimelineEntry | null>(null);

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.2 }}
      aria-label="Timeline / Heatmap Card"
      className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            {config.title}
          </h3>
          {config.subtitle && (
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
              {config.subtitle}
            </p>
          )}
        </div>

        {/* Legend */}
        {config.legend && config.legend.length > 0 && (
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
            {config.legend.map((l, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Tooltip Callout */}
      {activeHoverEntry && (
        <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-[#15112E] border border-purple-200/80 dark:border-[#383068] text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center justify-between animate-fadeIn">
          <span>{activeHoverEntry.date}</span>
          <span>{activeHoverEntry.tooltip || `${activeHoverEntry.value} logged`}</span>
        </div>
      )}

      {/* View rendering based on config.type */}
      {config.type === 'dots' && (
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 sm:gap-2.5 py-1">
          {config.entries.map((entry, idx) => (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => setActiveHoverEntry(entry)}
              onMouseLeave={() => setActiveHoverEntry(null)}
              onClick={() => setActiveHoverEntry(entry)}
              className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-hidden"
              title={entry.tooltip || `${entry.date}: ${entry.value}`}
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-125 group-hover:shadow-md"
                style={{
                  backgroundColor: entry.color || accent,
                  opacity: Math.max(0.3, (entry.size || 100) / 100),
                }}
              >
                <span className="text-[9px] font-black text-white">{entry.date.replace(/[^0-9]/g, '')}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {config.type === 'heatmap' && (
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5 sm:gap-2 py-1">
          {config.entries.map((entry, idx) => (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => setActiveHoverEntry(entry)}
              onMouseLeave={() => setActiveHoverEntry(null)}
              onClick={() => setActiveHoverEntry(entry)}
              className="h-7 sm:h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 focus:outline-hidden"
              style={{ backgroundColor: entry.color || accent }}
              title={entry.tooltip || `${entry.date}: ${entry.value}`}
            >
              <span className="text-[9px] font-black text-white drop-shadow-xs">
                {entry.date.replace(/[^0-9]/g, '')}
              </span>
            </button>
          ))}
        </div>
      )}

      {config.type === 'bars' && (
        <div className="flex items-end justify-between gap-1 sm:gap-1.5 h-28 pt-4 border-b border-purple-100 dark:border-[#383068] pb-1">
          {config.entries.map((entry, idx) => {
            const heightPct = Math.min(100, Math.max(15, (entry.value / 10) * 100));
            return (
              <button
                key={idx}
                type="button"
                onMouseEnter={() => setActiveHoverEntry(entry)}
                onMouseLeave={() => setActiveHoverEntry(null)}
                onClick={() => setActiveHoverEntry(entry)}
                className="flex-1 flex flex-col items-center gap-1 group cursor-pointer focus:outline-hidden h-full justify-end"
                title={entry.tooltip || `${entry.date}: ${entry.value}`}
              >
                <div
                  className="w-full rounded-t-md transition-all group-hover:scale-105"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: entry.color || accent,
                  }}
                />
                <span className="text-[8px] font-bold text-slate-400 group-hover:text-purple-600 truncate">
                  {entry.date.replace(/[^0-9]/g, '')}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </motion.section>
  );
};
