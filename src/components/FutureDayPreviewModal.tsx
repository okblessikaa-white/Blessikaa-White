import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  Zap,
  Lightbulb,
} from 'lucide-react';
import { Challenge } from '../types';
import { HabitContinuationEngine } from '../utils/habitContinuationEngine';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface FutureDayPreviewModalProps {
  dayNumber: number;
  currentDay: number;
  challenge: Challenge;
  onPracticeEarly?: (day: number) => void;
  onClose: () => void;
}

export const FutureDayPreviewModal: React.FC<FutureDayPreviewModalProps> = ({
  dayNumber,
  currentDay,
  challenge,
  onPracticeEarly,
  onClose,
}) => {
  const daysAhead = Math.max(1, dayNumber - currentDay);
  const plan = HabitContinuationEngine.getDayPlan(challenge, dayNumber);
  const isHabitMode = dayNumber > 21;

  const handleStartEarly = () => {
    soundManager.playSuccess();
    triggerHaptic('success');
    if (onPracticeEarly) {
      onPracticeEarly(dayNumber);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className="w-full max-w-md bg-white dark:bg-[#1E1A3D] rounded-3xl p-5 sm:p-6 shadow-2xl border border-purple-200 dark:border-[#352F63] relative space-y-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close Preview"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Tag & Proximity */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span>{isHabitMode ? 'Habit Continuum Preview' : 'Future Step Preview'}</span>
          </span>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {daysAhead} {daysAhead === 1 ? 'day' : 'days'} ahead of Day {currentDay}
          </span>
        </div>

        {/* Main Title & Day Badge */}
        <div className="space-y-1">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
            Day {dayNumber} Milestone Pathway
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
            {plan.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            {plan.description}
          </p>
        </div>

        {/* Quick Parameters */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-purple-50/70 dark:bg-[#251F4A] border border-purple-100 dark:border-purple-900/40 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Session Length</div>
              <div className="font-bold text-slate-800 dark:text-slate-100">
                {plan.estimatedMinutes || 20} minutes
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-purple-50/70 dark:bg-[#251F4A] border border-purple-100 dark:border-purple-900/40 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">XP Reward</div>
              <div className="font-bold text-slate-800 dark:text-slate-100">+100 XP Points</div>
            </div>
          </div>
        </div>

        {/* Action Checklist Preview */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Action Checklist (Day {dayNumber})</span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-normal">
              Pre-computed by Engine
            </span>
          </div>

          <div className="space-y-1.5">
            {(plan.actionChecklist || plan.tasks || []).map((t, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#251F49] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Neuroscience / Psychology Tip */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <span className="font-bold block mb-0.5">Neuroplastic Insight for this Step:</span>
            {plan.psychologyTip || plan.tip || 'Continuous daily execution creates permanent myelin sheathing on neural circuits.'}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 space-y-2">
          {onPracticeEarly && (
            <button
              type="button"
              onClick={handleStartEarly}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <span>Practice Day {dayNumber} Early Today</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              onClose();
            }}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close Roadmap Preview
          </button>
        </div>
      </motion.div>
    </div>
  );
};
