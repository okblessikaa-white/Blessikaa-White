import React from 'react';
import { Lock, Sparkles, ArrowRight, Lightbulb, X } from 'lucide-react';
import { Challenge } from '../types';
import { HabitContinuationEngine } from '../utils/habitContinuationEngine';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface LockedDayModalProps {
  dayNumber: number;
  currentDay: number;
  challenge?: Challenge;
  onPracticeEarly?: (day: number) => void;
  onClose: () => void;
}

export const LockedDayModal: React.FC<LockedDayModalProps> = ({
  dayNumber,
  currentDay,
  challenge,
  onPracticeEarly,
  onClose,
}) => {
  const daysRemaining = Math.max(1, dayNumber - currentDay);
  const plan = challenge ? HabitContinuationEngine.getDayPlan(challenge, dayNumber) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#1E1A3D] border border-purple-100 dark:border-[#352F63] shadow-2xl p-5 sm:p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Future Step Indicator */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center text-2xl font-bold shadow-inner">
            🌱
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Roadmap Step • Day {dayNumber}
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {plan ? plan.title : `Day ${dayNumber} Ahead`}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {plan?.description || `This session is scheduled ${daysRemaining} days ahead of your current active step (Day ${currentDay}).`}
          </p>
        </div>

        {/* Psychology Note */}
        <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-[#251F4A] border border-purple-100 dark:border-purple-900/40 text-left flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
            <span className="font-bold text-purple-900 dark:text-purple-200 block mb-0.5">
              Neuroscience Principle:
            </span>
            {plan?.psychologyTip || 'Consistency over intensity creates permanent neural circuits. Complete each day with focus!'}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-1 space-y-2">
          {onPracticeEarly && (
            <button
              onClick={() => {
                soundManager.playSuccess();
                triggerHaptic('success');
                onPracticeEarly(dayNumber);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Practice Day {dayNumber} Early Today</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playTick();
              triggerHaptic('light');
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
