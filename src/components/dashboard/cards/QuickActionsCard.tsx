import React from 'react';
import { motion } from 'motion/react';
import { DashboardAction } from '../../../types/dashboard';
import { Plus, Sliders, Bell, Camera, RefreshCw, Clock, Sparkles, CheckCircle2, Play, Send, Users, MapPin, Calendar, FileText } from 'lucide-react';
import { soundManager } from '../../../utils/audio';
import { triggerHaptic } from '../../../utils/haptics';

interface QuickActionsCardProps {
  actions: DashboardAction[];
  accent: string;
  accentGradient: string;
  onExecuteAction: (action: DashboardAction) => void;
  reducedMotion?: boolean;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  actions,
  accent,
  accentGradient,
  onExecuteAction,
  reducedMotion = false,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Plus': return <Plus className="w-5 h-5" />;
      case 'Sliders': return <Sliders className="w-5 h-5" />;
      case 'Bell': return <Bell className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5" />;
      case 'Clock': return <Clock className="w-5 h-5" />;
      case 'Play': return <Play className="w-5 h-5" />;
      case 'Send': return <Send className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'MapPin': return <MapPin className="w-5 h-5" />;
      case 'Calendar': return <Calendar className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.35 }}
      aria-label="Service Quick Actions"
      className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            Quick Actions
          </h3>
          <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
            Service-specific shortcuts & direct entries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((act) => {
          const isPrimary = act.variant === 'primary';
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => {
                soundManager.playTick();
                triggerHaptic(isPrimary ? 'medium' : 'light');
                onExecuteAction(act);
              }}
              className={`group relative overflow-hidden rounded-2xl p-3.5 sm:p-4 text-left border-2 transition-all transform active:scale-98 flex items-center gap-3 cursor-pointer w-full shadow-sm hover:shadow-md ${
                isPrimary
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 hover:border-purple-400 shadow-purple-600/20'
                  : 'bg-white dark:bg-[#15112E] hover:bg-purple-50/60 dark:hover:bg-[#282154] text-slate-900 dark:text-white border-purple-200/80 dark:border-[#383068] hover:border-purple-500'
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform ${
                  isPrimary
                    ? 'bg-white/20 text-white'
                    : `bg-gradient-to-tr ${accentGradient} text-white shadow-purple-600/20`
                }`}
              >
                {getIcon(act.icon)}
              </div>

              <div className="min-w-0 flex-1">
                <span
                  className={`text-xs sm:text-sm font-black block tracking-tight truncate ${
                    isPrimary ? 'text-white' : 'text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300'
                  }`}
                >
                  {act.label}
                </span>
                {act.description && (
                  <span
                    className={`text-[10px] sm:text-xs font-semibold truncate block mt-0.5 ${
                      isPrimary ? 'text-purple-100' : 'text-purple-600 dark:text-purple-400'
                    }`}
                  >
                    {act.description}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
};
