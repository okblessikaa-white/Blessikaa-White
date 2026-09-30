import React from 'react';
import { motion } from 'motion/react';
import { SecondaryMetricConfig } from '../../../types/dashboard';
import { TrendingUp, TrendingDown, Minus, Activity, Layers, Flame, Award, Clock, Calendar, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, Heart, Sun, MapPin, UserCheck, Shield } from 'lucide-react';

interface SecondaryMetricsRowProps {
  metrics: SecondaryMetricConfig[];
  reducedMotion?: boolean;
}

export const SecondaryMetricsRow: React.FC<SecondaryMetricsRowProps> = ({
  metrics,
  reducedMotion = false,
}) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Award': return <Award className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      case 'Calendar': return <Calendar className="w-4 h-4" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-4 h-4" />;
      case 'AlertTriangle': return <AlertTriangle className="w-4 h-4" />;
      case 'RefreshCw': return <RefreshCw className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Heart': return <Heart className="w-4 h-4" />;
      case 'Sun': return <Sun className="w-4 h-4" />;
      case 'MapPin': return <MapPin className="w-4 h-4" />;
      case 'UserCheck': return <UserCheck className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div
      aria-label="Secondary Metrics Row"
      className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
    >
      {metrics.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: reducedMotion ? 0 : idx * 0.05 }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500/80 dark:hover:border-purple-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
              {item.label}
            </span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-[#15112E] text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
              {getIcon(item.icon)}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {item.value}
              </span>
              {item.unit && (
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {item.unit}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 pt-0.5">
              {item.trend && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                    item.trend === 'up'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : item.trend === 'down'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {item.trend === 'up' && <TrendingUp className="w-2.5 h-2.5" />}
                  {item.trend === 'down' && <TrendingDown className="w-2.5 h-2.5" />}
                  {item.trend === 'neutral' && <Minus className="w-2.5 h-2.5" />}
                  {item.trendPercent}
                </span>
              )}

              {item.subtitle && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  {item.subtitle}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
