import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Flame, Sparkles, Check, Share2, ArrowRight, X, Shield, Star, Crown, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Challenge, ChallengeMilestone } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface MilestoneCelebrationModalProps {
  milestone: ChallengeMilestone;
  challenge: Challenge;
  streak: number;
  completionRate: number;
  totalCompletedDays: number;
  onContinue: () => void;
  onClose: () => void;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  milestone,
  challenge,
  streak,
  completionRate,
  totalCompletedDays,
  onContinue,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    soundManager.playCelebration();
    triggerHaptic('success');
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#8B5CF6', '#F59E0B', '#10B981', '#EC4899', '#3B82F6'],
    });
  }, [milestone]);

  const handleShare = async () => {
    soundManager.playTick();
    triggerHaptic('light');
    const shareText = `✨ MILESTONE ACHIEVED: DAY ${milestone.day} in ${challenge.title}!
${milestone.badge} ${milestone.title} - ${milestone.subtitle}
🔥 Current Streak: ${streak} Days | 🏆 Rate: ${completionRate}%
"${milestone.desc}"
Transformed daily with BLESSIKAA Habit Engine!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Day ${milestone.day} Milestone - ${milestone.title}`,
          text: shareText,
          url: window.location.href,
        });
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
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 20 }}
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#1E1A3D] border border-purple-200 dark:border-[#3B346B] shadow-2xl p-6 sm:p-8 text-center space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Milestone Badge Crown */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-amber-400 to-pink-500 blur-md opacity-60 animate-pulse" />
          <div className="relative w-22 h-22 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-700 p-1 flex items-center justify-center shadow-xl border-2 border-amber-300">
            <span className="text-4xl filter drop-shadow-md">{milestone.badge}</span>
          </div>
        </div>

        {/* Header Titles */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>✨ MILESTONE ACHIEVED ✨</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
            DAY {milestone.day}
          </h3>
          <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
            {milestone.title} • {milestone.subtitle}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed pt-1">
            {milestone.desc}
          </p>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-black">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{streak}d</span>
            </div>
            <div className="text-[9px] text-purple-700 dark:text-purple-300 uppercase font-bold tracking-wider mt-0.5">
              Streak
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-black">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{completionRate}%</span>
            </div>
            <div className="text-[9px] text-emerald-700 dark:text-emerald-300 uppercase font-bold tracking-wider mt-0.5">
              Completion
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-black">
              <Trophy className="w-3.5 h-3.5" />
              <span>+{milestone.xp}</span>
            </div>
            <div className="text-[9px] text-amber-700 dark:text-amber-300 uppercase font-bold tracking-wider mt-0.5">
              Reward XP
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 space-y-2.5">
          <button
            onClick={handleShare}
            className="w-full py-3 px-5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-300">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Share Achievement</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              triggerHaptic('light');
              onContinue();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
          >
            <span>Continue the Journey →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
