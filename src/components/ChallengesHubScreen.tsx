import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Sparkles,
  Users,
  PlusCircle,
  ArrowRight,
  Flame,
  CheckCircle2,
  Play,
  Compass,
  Layers,
  Crown,
  Trophy,
} from 'lucide-react';
import { Challenge, DayLog, UserChallengeProgress } from '../types';
import { ALL_69_CHALLENGES } from '../data/all69Challenges';
import { INITIAL_COMMUNITY_CHALLENGES } from '../data/communityChallengesData';
import { ChallengeLogo } from './ChallengeLogo';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface ChallengesHubScreenProps {
  userChallenges: Challenge[];
  activeChallengeId: string;
  progressMap: Record<string, UserChallengeProgress>;
  onSelectChallenge: (challengeId: string) => void;
  onOpenBlessikaChallenges: () => void;
  onOpenCommunityChallenges: () => void;
  onOpenCreateChallenge: () => void;
  onBack: () => void;
}

export const ChallengesHubScreen: React.FC<ChallengesHubScreenProps> = ({
  userChallenges,
  activeChallengeId,
  progressMap,
  onSelectChallenge,
  onOpenBlessikaChallenges,
  onOpenCommunityChallenges,
  onOpenCreateChallenge,
  onBack,
}) => {
  // Find currently active challenge and other ongoing challenges
  const activeChallenge = userChallenges.find((c) => c.id === activeChallengeId) || userChallenges[0];
  const activeProg = progressMap[activeChallenge?.id];
  const activeDay = activeProg?.currentDay || 1;
  const activeStreak = activeProg?.streak || 1;
  const completedDaysCount = ((activeProg?.dayLogs ? Object.values(activeProg.dayLogs) : []) as DayLog[]).filter(
    (l) => l.completed
  ).length;

  return (
    <div className="w-full max-w-4xl mx-auto py-2 px-3 sm:px-6 animate-fadeIn pb-32">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2.5 rounded-2xl bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#F6F2FF] transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-black text-[#17142B] dark:text-white">
            CHALLENGES DIRECTORY
          </h1>
          <p className="text-xs text-[#787198] dark:text-[#B6ADDC]">
            Choose or build your 21-day transformation pathway
          </p>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Hierarchy Buttons as requested */}
      <div className="space-y-3.5 mb-8">
        {/* 1. BIG BUTTON: BLESSIKAA CHALLENGES */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('medium');
            onOpenBlessikaChallenges();
          }}
          className="w-full relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-tr from-[#6C3FE8] via-[#7B4CF6] to-[#976EF9] text-white shadow-xl shadow-[#6C3FE8]/25 text-left border-2 border-white/20 hover:border-white/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          {/* Subtle Background Glow Accent */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            {/* Top/Center Row: Logo on left centered with text content */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-2xl shadow-inner border border-white/30 group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-7 h-7 text-amber-300 fill-amber-300/30" />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-purple-200 font-bold tracking-wide uppercase">
                  {ALL_69_CHALLENGES.length}+ Master Pathways
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  Blessika Challenges
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              Explore 69+ scientifically structured 21-day challenges across health, mindset, learning, fitness & personal growth.
            </p>
          </div>

          {/* Bottom Action Link (Clean without white background box) */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white group-hover:text-purple-100">
            <span>Explore Blessika Challenges</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>

        {/* 2 & 3. JUST BELOW: TWO EQUALLY SIZED BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Button 2: Community Challenges */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              soundManager.playTick();
              triggerHaptic('medium');
              onOpenCommunityChallenges();
            }}
            className="h-full relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1E1A3D] hover:bg-[#FAF7FF] dark:hover:bg-[#251E4E] border-2 border-[#E7E0F5] dark:border-[#352F63] hover:border-[#6C3FE8] dark:hover:border-[#6C3FE8] text-left shadow-md hover:shadow-lg hover:shadow-[#6C3FE8]/10 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Logo centered on the left side with header/title */}
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold mb-0.5">
                    {INITIAL_COMMUNITY_CHALLENGES.length}+ Trending
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#17142B] dark:text-white group-hover:text-[#6C3FE8] dark:group-hover:text-[#C4B5FD] transition-colors leading-tight truncate">
                    Community Challenges
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#70688F] dark:text-[#B2A8D6] leading-relaxed line-clamp-2">
                Peer-created 21-day pathways, ranked and posted by coaches and members worldwide.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F0EBF8] dark:border-[#332C60] flex items-center justify-between text-xs font-bold text-[#6C3FE8] dark:text-[#C4B5FD]">
              <span>Explore Community</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          {/* Button 3: Create Your Challenges */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              soundManager.playTick();
              triggerHaptic('medium');
              onOpenCreateChallenge();
            }}
            className="h-full relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1E1A3D] hover:bg-[#FAF7FF] dark:hover:bg-[#251E4E] border-2 border-[#E7E0F5] dark:border-[#352F63] hover:border-[#6C3FE8] dark:hover:border-[#6C3FE8] text-left shadow-md hover:shadow-lg hover:shadow-[#6C3FE8]/10 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Logo centered on the left side with header/title */}
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-500/20 shrink-0 group-hover:scale-105 transition-transform">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold mb-0.5">
                    Custom & AI
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#17142B] dark:text-white group-hover:text-[#6C3FE8] dark:group-hover:text-[#C4B5FD] transition-colors leading-tight truncate">
                    Create Your Challenge
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#70688F] dark:text-[#B2A8D6] leading-relaxed line-clamp-2">
                Design custom 21-day milestones manually or use the AI architect to generate personalized habits.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F0EBF8] dark:border-[#332C60] flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Start Building</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Quick Active Challenge Resume Section */}
      {activeChallenge && (
        <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-5 border border-[#E9E1FC] dark:border-[#352F63] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6C3FE8] dark:text-[#C4B5FD]">
                Your Current Active Pathway
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Flame className="w-4 h-4 fill-current" />
              <span>{activeStreak}d Streak</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ChallengeLogo challengeTitle={activeChallenge.title} category={activeChallenge.category} size="lg" />
              <div>
                <h4 className="text-base font-bold text-[#17142B] dark:text-white">
                  {activeChallenge.title}
                </h4>
                <p className="text-xs text-[#70688F] dark:text-[#B2A8D6]">
                  Day {activeDay} of 21 • {completedDaysCount}/21 Steps Completed
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundManager.playSuccess();
                triggerHaptic('medium');
                onSelectChallenge(activeChallenge.id);
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#6C3FE8] hover:bg-[#582CD1] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Continue Day {activeDay}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
