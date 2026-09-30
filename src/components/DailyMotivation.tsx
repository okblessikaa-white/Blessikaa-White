import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Quote, Heart, Zap, MessageSquareQuote } from 'lucide-react';
import { Challenge, UserChallengeProgress } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface DailyMotivationProps {
  challenge?: Challenge;
  progress?: UserChallengeProgress;
  onOpenCoach?: () => void;
}

interface MotivationData {
  quote: string;
  message: string;
  actionableNudge: string;
  affirmation: string;
}

const FALLBACK_AFFIRMATIONS: MotivationData[] = [
  {
    quote: 'Small daily disciplines repeated with consistency lead to monumental transformations.',
    message: 'Every positive action you take today rewires your neural pathways for lifelong excellence.',
    actionableNudge: 'Take 3 deep centering breaths and dedicate your first 15 minutes of uninterrupted focus.',
    affirmation: 'I am deliberate, consistent, and capable of achieving true mastery.',
  },
  {
    quote: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    message: 'Focus on today’s micro-step. Momentum builds not from giant leaps, but steadfast habits.',
    actionableNudge: 'Set up your immediate cue and eliminate one key distraction right now.',
    affirmation: 'Today I choose progress over perfection, showing up with purpose.',
  },
  {
    quote: 'The secret of change is to focus all of your energy not on fighting the old, but on building the new.',
    message: 'Your 21-day journey is actively forging an unstoppable version of you.',
    actionableNudge: 'Celebrate the small victory of starting today’s mission early.',
    affirmation: 'I am worthy of growth and committed to my highest potential.',
  },
  {
    quote: 'Consistency is what transforms average into excellence. Day by day, brick by brick.',
    message: 'Keep your streak unbroken. Each tick on your matrix is proof of your dedication.',
    actionableNudge: 'Visualize completing today’s task and feeling the pride of achievement.',
    affirmation: 'I conquer resistance with grace, energy, and unwavering focus.',
  },
];

export const DailyMotivation: React.FC<DailyMotivationProps> = ({
  challenge,
  progress,
  onOpenCoach,
}) => {
  const currentDay = progress?.currentDay || 1;
  const streak = progress?.streak || 0;

  const [motivation, setMotivation] = useState<MotivationData>(() => {
    return FALLBACK_AFFIRMATIONS[(currentDay - 1) % FALLBACK_AFFIRMATIONS.length];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchAIMotivation = async () => {
    setIsLoading(true);
    triggerHaptic('light');
    soundManager.playTick();

    try {
      const response = await fetch('/api/ai/daily-motivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeTitle: challenge?.title || 'Habit Transformation',
          currentDay,
          streak,
          completedTasksCount: progress?.dayLogs[currentDay]?.completedTasks?.length || 0,
          mood: progress?.dayLogs[currentDay]?.mood || 'Determined',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMotivation(data);
        triggerHaptic('success');
      } else {
        // Pick next random fallback
        const nextIndex = Math.floor(Math.random() * FALLBACK_AFFIRMATIONS.length);
        setMotivation(FALLBACK_AFFIRMATIONS[nextIndex]);
      }
    } catch {
      const nextIndex = Math.floor(Math.random() * FALLBACK_AFFIRMATIONS.length);
      setMotivation(FALLBACK_AFFIRMATIONS[nextIndex]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only attempt fetch once on mount or day change
    fetchAIMotivation();
  }, [currentDay, challenge?.id]);

  const handleCopyAffirmation = () => {
    try {
      navigator.clipboard.writeText(`"${motivation.affirmation}" — Daily Blessing & Affirmation`);
      setCopied(true);
      triggerHaptic('light');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-100/90 via-purple-50/80 to-purple-100/60 border border-purple-200/90 p-5 sm:p-6 shadow-md transition-all">
      {/* Decorative background glow & icon */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-purple-300/20 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-6 w-32 h-32 rounded-full bg-purple-400/10 blur-xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header with pill and refresh action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-purple-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 block">
                Daily Motivation & Affirmation
              </span>
              <span className="text-xs text-purple-950 font-bold">
                {challenge ? `Empowerment for "${challenge.title}"` : 'Empowerment for Your Blessed Day'}
              </span>
            </div>
          </div>

          <button
            onClick={fetchAIMotivation}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white/80 hover:bg-white border border-purple-200 text-purple-700 hover:text-purple-900 transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 text-xs font-semibold"
            title="Generate fresh affirmation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-600' : ''}`} />
            <span className="hidden sm:inline">New Insight</span>
          </button>
        </div>

        {/* Affirmation quote card */}
        <div className="p-4 rounded-2xl bg-white/90 border border-purple-200/80 shadow-xs space-y-2.5">
          <div className="flex items-start gap-2.5">
            <Quote className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base font-semibold text-slate-800 italic leading-relaxed">
              "{motivation.quote}"
            </p>
          </div>

          {/* Empowering Affirmation Callout */}
          <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-purple-600 fill-purple-200 shrink-0" />
              <div className="text-xs text-purple-950 font-bold">
                <span className="text-purple-700 font-extrabold mr-1">Affirmation:</span>
                "{motivation.affirmation}"
              </div>
            </div>

            <button
              onClick={handleCopyAffirmation}
              className="self-end sm:self-auto text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-800 hover:bg-purple-50 transition-colors shrink-0 shadow-2xs"
            >
              {copied ? '✓ Copied!' : 'Copy Affirmation'}
            </button>
          </div>
        </div>

        {/* Coach Nudge & Quick Tip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-purple-900 bg-white/50 p-3 rounded-2xl border border-purple-100">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="leading-snug">
              <strong>Action Nudge:</strong> {motivation.actionableNudge}
            </span>
          </div>

          {onOpenCoach && (
            <button
              onClick={() => {
                soundManager.playTick();
                triggerHaptic('light');
                onOpenCoach();
              }}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 underline whitespace-nowrap self-end sm:self-auto"
            >
              Chat with AI Habit Coach →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
