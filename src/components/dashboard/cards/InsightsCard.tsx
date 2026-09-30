import React from 'react';
import { motion } from 'motion/react';
import { InsightsConfig } from '../../../types/dashboard';
import { Sparkles, Clock, Flame, Award, Heart, CheckCircle2, Lightbulb, Sun, Moon, ArrowRight } from 'lucide-react';

interface InsightsCardProps {
  config: InsightsConfig;
  accent: string;
  reducedMotion?: boolean;
}

export const InsightsCard: React.FC<InsightsCardProps> = ({
  config,
  accent,
  reducedMotion = false,
}) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Clock': return <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-amber-500" />;
      case 'Award': return <Award className="w-4 h-4 text-emerald-600" />;
      case 'Heart': return <Heart className="w-4 h-4 text-rose-500" />;
      case 'Sun': return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Moon': return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'Check':
      case 'CheckCircle2': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default: return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.25 }}
      aria-label="AI Insights Card"
      className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-purple-50/60 via-white to-indigo-50/40 dark:from-[#1E1A3D] dark:via-[#191535] dark:to-[#171330] border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {config.title || 'Blessikaa AI Insights'}
            </h3>
            <p className="text-[11px] text-purple-700 dark:text-purple-300 font-bold">
              Warm, gentle intelligence tailored to your routines
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100/80 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 border border-purple-200/60">
          WARM Voice
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {config.insights.slice(0, 4).map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-4 rounded-2xl bg-white/90 dark:bg-[#15112E]/90 border border-purple-100 dark:border-[#383068] hover:border-purple-300 dark:hover:border-purple-600 shadow-2xs hover:shadow-xs transition-all space-y-2 flex flex-col justify-between"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(item.icon)}
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                {item.text}
              </p>
            </div>

            {item.actionableSuggestion && (
              <div className="pt-1.5 border-t border-purple-50 dark:border-purple-950/60 flex items-center gap-1.5 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-2">{item.actionableSuggestion}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
};
