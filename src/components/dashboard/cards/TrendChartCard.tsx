import React from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { TrendChartConfig } from '../../../types/dashboard';

interface TrendChartCardProps {
  config: TrendChartConfig;
  accent: string;
  reducedMotion?: boolean;
}

export const TrendChartCard: React.FC<TrendChartCardProps> = ({
  config,
  accent,
  reducedMotion = false,
}) => {
  const chartColor = config.color || accent || '#7C3AED';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-[#15112E]/95 backdrop-blur-md p-3 rounded-2xl border-2 border-purple-200/80 dark:border-[#383068] shadow-lg text-xs space-y-1">
          <p className="font-bold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="font-black text-slate-900 dark:text-white text-sm">
            {payload[0].value} {config.unit}
          </p>
          {data.target && (
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
              Target: {data.target} {config.unit}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (config.chartType) {
      case 'bar':
        return (
          <BarChart data={config.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <Tooltip content={<CustomTooltip />} />
            {config.targetLine && (
              <ReferenceLine y={config.targetLine} stroke="#94A3B8" strokeDasharray="3 3" />
            )}
            <Bar
              dataKey="value"
              fill={chartColor}
              radius={[8, 8, 0, 0]}
              animationDuration={reducedMotion ? 0 : 800}
            />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={config.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <Tooltip content={<CustomTooltip />} />
            {config.targetLine && (
              <ReferenceLine y={config.targetLine} stroke="#94A3B8" strokeDasharray="3 3" />
            )}
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={3}
              dot={{ r: 4, fill: chartColor, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
              animationDuration={reducedMotion ? 0 : 800}
            />
          </LineChart>
        );

      case 'area':
      default:
        return (
          <AreaChart data={config.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${config.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <Tooltip content={<CustomTooltip />} />
            {config.targetLine && (
              <ReferenceLine y={config.targetLine} stroke="#94A3B8" strokeDasharray="3 3" />
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#grad-${config.dataKey})`}
              animationDuration={reducedMotion ? 0 : 800}
            />
          </AreaChart>
        );
    }
  };

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      aria-label="Trend Chart"
      className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-4"
    >
      <div className="flex items-center justify-between">
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

        {config.targetLine && (
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-purple-50 dark:bg-[#15112E] px-2.5 py-1 rounded-xl border border-purple-100 dark:border-purple-800">
            Target: {config.targetLine} {config.unit}
          </span>
        )}
      </div>

      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};
