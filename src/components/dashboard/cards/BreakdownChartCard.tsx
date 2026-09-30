import React from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { BreakdownChartConfig } from '../../../types/dashboard';

interface BreakdownChartCardProps {
  config: BreakdownChartConfig;
  reducedMotion?: boolean;
}

export const BreakdownChartCard: React.FC<BreakdownChartCardProps> = ({
  config,
  reducedMotion = false,
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-[#15112E]/95 backdrop-blur-md p-3 rounded-2xl border-2 border-purple-200/80 dark:border-[#383068] shadow-lg text-xs space-y-1">
          <p className="font-bold text-slate-500 dark:text-slate-400">{data.name}</p>
          <p className="font-black text-slate-900 dark:text-white text-sm">
            {data.value} {data.unit || ''} {data.percentage ? `(${data.percentage}%)` : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.15 }}
      aria-label="Breakdown Chart"
      className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-4"
    >
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

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
        {/* Recharts Donut Pie */}
        <div className="h-48 sm:h-52 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={config.data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                animationDuration={reducedMotion ? 0 : 800}
              >
                {config.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Breakdown List */}
        <div className="space-y-2">
          {config.data.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-purple-50/50 dark:bg-[#15112E]/50 border border-purple-100/70 dark:border-[#383068]/60 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                  {item.name}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-black text-slate-900 dark:text-white">
                  {item.value} {item.unit || ''}
                </span>
                {item.percentage && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1">
                    ({item.percentage}%)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
