import React from 'react';
import { motion } from 'motion/react';
import { HeroMetricConfig } from '../../../types/dashboard';
import { Sparkles, TrendingUp, CheckCircle2, ShieldCheck, Flame, Moon, Droplet, Heart, Shield } from 'lucide-react';

interface HeroMetricCardProps {
  config: HeroMetricConfig;
  accent: string;
  accentGradient: string;
  reducedMotion?: boolean;
}

export const HeroMetricCard: React.FC<HeroMetricCardProps> = ({
  config,
  accent,
  accentGradient,
  reducedMotion = false,
}) => {
  const progress = Math.min(100, Math.max(0, config.progressPercent ?? 0));

  const renderIcon = () => {
    switch (config.icon) {
      case 'Droplet': return <Droplet className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6" />;
      case 'Moon': return <Moon className="w-6 h-6" />;
      case 'Heart': return <Heart className="w-6 h-6" />;
      case 'Shield': return <Shield className="w-6 h-6" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      aria-label="Hero Metric Card"
      className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500/80 dark:hover:border-purple-400 shadow-md hover:shadow-lg transition-all"
    >
      {/* Background Accent Glow */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: accent }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Metric Value & Label */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {config.label}
            </span>
            {config.status === 'positive' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                On Target
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {config.value}
            </h2>
            {config.unit && (
              <span className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400">
                {config.unit}
              </span>
            )}
          </div>

          {config.subtitle && (
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 max-w-md pt-0.5">
              {config.subtitle}
            </p>
          )}
        </div>

        {/* Circular / Badge Metric Icon */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${accentGradient} text-white flex items-center justify-center shadow-lg shadow-purple-600/20 group-hover:scale-105 transition-transform`}
          >
            {renderIcon()}
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      {config.progressPercent !== undefined && (
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Progress: {progress}%</span>
            {config.target && <span>Target: {config.target}</span>}
          </div>
          <div className="w-full h-3 bg-purple-50 dark:bg-[#15112E] rounded-full overflow-hidden p-0.5 border border-purple-100 dark:border-purple-900/60">
            <motion.div
              initial={reducedMotion ? { width: `${progress}%` } : { width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${accentGradient} shadow-sm`}
            />
          </div>
        </div>
      )}
    </motion.section>
  );
};
