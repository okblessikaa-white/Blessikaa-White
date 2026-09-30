import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  ArrowRight,
  X,
  Share2,
  Check,
  Award,
  Infinity as InfinityIcon,
  Star,
  FileCheck2,
} from 'lucide-react';
import { Challenge, DayLog } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface CompletionModalProps {
  day: number;
  challenge: Challenge;
  log: DayLog;
  streak: number;
  onClose: () => void;
  onNextDay: () => void;
  onContinueHabit?: () => void;
  onViewCertificate?: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  day,
  challenge,
  log,
  streak,
  onClose,
  onNextDay,
  onContinueHabit,
  onViewCertificate,
}) => {
  const isFinalDay = day >= 21;
  const [copied, setCopied] = useState(false);

  const handleShareAchievement = async () => {
    soundManager.playTick();
    triggerHaptic('light');

    const shareText = isFinalDay
      ? `🏆 21 DAYS COMPLETE in "${challenge.title}"!
🔥 21 Day Streak | ✓ 21 Days Completed | ⭐ Challenge Master
I just laid the foundation of a permanent habit and transitioned into ∞ Habit Mode!
Built with BLESSIKAA Habit Engine ✨`
      : `🏆 Day ${day} Conquered in "${challenge.title}"!
🔥 Current Streak: ${streak} Days | +100 XP
${log.reflectionNote ? `💭 Reflection: "${log.reflectionNote}"\n` : ''}🚀 Building lifelong habits with BLESSIKAA!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: isFinalDay ? `21 Days Complete: ${challenge.title}` : `Day ${day} Conquered: ${challenge.title}`,
          text: shareText,
          url: window.location.href,
        });
        triggerHaptic('success');
      } catch {
        await copyToClipboard(shareText);
      }
    } else {
      await copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      triggerHaptic('success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#1E1A3D] border border-purple-100 dark:border-[#373068] shadow-2xl p-6 sm:p-8 text-center space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebratory Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 p-1 flex items-center justify-center shadow-xl shadow-purple-600/30">
            <div className="w-full h-full bg-purple-700 dark:bg-[#251E4E] rounded-full flex items-center justify-center">
              {isFinalDay ? (
                <Trophy className="w-10 h-10 text-amber-300 animate-bounce" />
              ) : (
                <CheckCircle2 className="w-10 h-10 text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Day 21 Completion Format vs Standard Day */}
        {isFinalDay ? (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FOUNDATION COMPLETED</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              21 DAYS COMPLETE!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
              You built the foundation of your new habit in{' '}
              <span className="font-bold text-purple-600 dark:text-purple-300">
                "{challenge.title}"
              </span>
              . 21 days is your first milestone—now let's make it permanent!
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 dark:text-purple-300">
              DAY {day} CONQUERED!
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Victory Logged!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
              Day {day} is in the books for "{challenge.title}". Every repetition builds unstoppable momentum.
            </p>
          </div>
        )}

        {/* Stats Grid: Day 21 Master Specs */}
        {isFinalDay ? (
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-300 text-xs font-black">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{streak || 21}d</span>
              </div>
              <div className="text-[9px] text-amber-700 dark:text-amber-300 uppercase font-bold tracking-wider mt-0.5">
                Streak
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-300 text-xs font-black">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>21 Days</span>
              </div>
              <div className="text-[9px] text-emerald-700 dark:text-emerald-300 uppercase font-bold tracking-wider mt-0.5">
                Completed
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-700 dark:text-purple-300 text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>Master</span>
              </div>
              <div className="text-[9px] text-purple-700 dark:text-purple-300 uppercase font-bold tracking-wider mt-0.5">
                Status
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <div className="text-left">
                <div className="text-[10px] text-amber-800 dark:text-amber-300 uppercase font-semibold">Reward</div>
                <div className="text-xs font-black text-amber-700 dark:text-amber-400">+100 XP</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center gap-2">
              <Flame className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <div className="text-left">
                <div className="text-[10px] text-purple-700 dark:text-purple-300 uppercase font-semibold">Streak</div>
                <div className="text-xs font-black text-purple-800 dark:text-purple-300">{streak} Days</div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Reflection preview if available */}
        {log.reflectionNote && (
          <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 text-left space-y-1">
            <div className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">
              Your Daily Reflection:
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic">
              "{log.reflectionNote}"
            </p>
          </div>
        )}

        {/* Actions Container */}
        <div className="pt-2 space-y-2.5">
          {isFinalDay ? (
            <>
              {/* PRIMARY CTA: CONTINUE THE HABIT → */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playCelebration();
                  triggerHaptic('success');
                  if (onContinueHabit) {
                    onContinueHabit();
                  } else {
                    onClose();
                  }
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#6C3FE8] via-[#7E4DF2] to-[#9333EA] hover:from-[#5B2ED5] hover:to-[#7E22CE] text-white font-black text-sm sm:text-base shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer ring-2 ring-purple-300 dark:ring-purple-500/50"
              >
                <InfinityIcon className="w-5 h-5 animate-pulse" />
                <span>CONTINUE THE HABIT →</span>
              </button>

              {/* SECONDARY CTA: View Certificate / Progress */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    if (onViewCertificate) {
                      onViewCertificate();
                    } else {
                      onClose();
                    }
                  }}
                  className="py-2.5 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-800 dark:text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-purple-200 dark:border-purple-800"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>View Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareAchievement}
                  className="py-2.5 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-800 dark:text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-purple-200 dark:border-purple-800"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Share Victory</span>
                    </>
                  )}
                </button>
              </div>

              {/* TERTIARY / CLOSE */}
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white pt-1 transition-colors cursor-pointer"
              >
                Finish & Close for now
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleShareAchievement}
                className="w-full py-3 px-5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-800 dark:text-purple-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer border border-purple-200 dark:border-purple-800"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-300">Achievement Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Share Achievement with Friends</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  onNextDay();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
              >
                <span>Continue to Day {day + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
