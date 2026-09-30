import React from 'react';
import { motion } from 'motion/react';
import { RecentConfig } from '../../../types/dashboard';
import { Clock, Droplet, Coffee, Sun, Moon, Check, AlertCircle, ShoppingBag, CreditCard, ArrowDownLeft, Activity, MapPin, Heart } from 'lucide-react';

interface RecentActivityCardProps {
  config: RecentConfig;
  reducedMotion?: boolean;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  config,
  reducedMotion = false,
}) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Droplet': return <Droplet className="w-4 h-4 text-sky-600" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'Sun': return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Moon': return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'ArrowDownLeft': return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
      case 'MapPin': return <MapPin className="w-4 h-4 text-emerald-600" />;
      case 'Heart': return <Heart className="w-4 h-4 text-rose-500" />;
      case 'AlertCircle': return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'Check': return <Check className="w-4 h-4 text-emerald-600" />;
      default: return <Activity className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.3 }}
      aria-label="Recent Activity"
      className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
          {config.title}
        </h3>
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          Last {config.entries.length} entries
        </span>
      </div>

      <div className="space-y-2">
        {config.entries.map((entry) => (
          <div
            key={entry.id}
            className="p-3 sm:p-3.5 rounded-2xl bg-purple-50/50 dark:bg-[#15112E]/50 border border-purple-100/70 dark:border-[#383068]/60 flex items-center justify-between gap-3 transition-colors hover:bg-purple-50 dark:hover:bg-[#15112E]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#1E1A3D] border border-purple-100 dark:border-[#383068] flex items-center justify-center shrink-0 shadow-2xs">
                {getIcon(entry.icon)}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-900 dark:text-white block truncate">
                  {entry.title}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate block">
                  {entry.subtitle} • {entry.timestamp}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              {entry.value && (
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  {entry.value}
                </span>
              )}
              {entry.status && (
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                    entry.badgeColor || 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {entry.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};
