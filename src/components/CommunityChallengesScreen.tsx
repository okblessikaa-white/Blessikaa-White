import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Users,
  Star,
  Sparkles,
  Flame,
  CheckCircle2,
  Share2,
  Plus,
  Play,
  TrendingUp,
  Award,
  Heart,
} from 'lucide-react';
import { Challenge } from '../types';
import { INITIAL_COMMUNITY_CHALLENGES, CommunityChallengeItem } from '../data/communityChallengesData';
import { ChallengeLogo } from './ChallengeLogo';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface CommunityChallengesScreenProps {
  customCommunityChallenges?: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
  onOpenCreateChallenge: () => void;
  onBack: () => void;
}

const CATEGORIES = [
  'All',
  'Trending',
  'Top Rated',
  'Mental Health',
  'Health & Fitness',
  'Productivity',
  'Self Love',
  'Lifestyle & Finance',
];

export const CommunityChallengesScreen: React.FC<CommunityChallengesScreenProps> = ({
  customCommunityChallenges = [],
  onSelectChallenge,
  onOpenCreateChallenge,
  onBack,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  // Merge default community challenges with user-created public challenges
  const allCommunityChallenges: CommunityChallengeItem[] = [
    ...customCommunityChallenges.map((c) => ({
      ...c,
      creatorName: c.author || 'Blessikaa Member',
      creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      creatorRole: 'Community Creator',
      isVerifiedCreator: false,
      participantCount: 142,
      rating: 4.9,
      reviewsCount: 18,
      trendingBadge: '🆕 Member Created',
      communityLikes: 45,
    })),
    ...INITIAL_COMMUNITY_CHALLENGES,
  ];

  const filteredChallenges = allCommunityChallenges.filter((ch) => {
    const matchesSearch =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ch.tags && ch.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Trending') return !!ch.trendingBadge;
    if (selectedFilter === 'Top Rated') return ch.rating >= 4.9;
    if (selectedFilter === 'Mental Health') return ch.category === 'mental_health' || ch.category === 'positivity';
    if (selectedFilter === 'Health & Fitness') return ch.category === 'health' || ch.category === 'fitness';
    if (selectedFilter === 'Productivity') return ch.category === 'productivity' || ch.category === 'learning';
    if (selectedFilter === 'Self Love') return ch.category === 'self_love' || ch.category === 'personal_growth';
    if (selectedFilter === 'Lifestyle & Finance') return ch.category === 'lifestyle' || ch.category === 'finance';

    return true;
  });

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playTick();
    triggerHaptic('light');
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleJoinChallenge = (ch: CommunityChallengeItem) => {
    soundManager.playCelebration();
    triggerHaptic('medium');
    onSelectChallenge(ch);
  };

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
          <h1 className="text-lg sm:text-xl font-black text-[#17142B] dark:text-white flex items-center justify-center gap-1.5">
            <span>COMMUNITY CHALLENGES</span>
            <Users className="w-5 h-5 text-[#6C3FE8] dark:text-[#C4B5FD]" />
          </h1>
          <p className="text-xs text-[#787198] dark:text-[#B6ADDC]">
            Created and posted by the Blessikaa global community
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            onOpenCreateChallenge();
          }}
          className="p-2.5 rounded-2xl bg-[#6C3FE8] text-white hover:bg-[#582CD1] transition-all cursor-pointer shadow-md shadow-[#6C3FE8]/25"
          title="Post a Challenge"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Community Banner & CTA */}
      <div className="mb-5 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#6C3FE8] via-[#7F4DF5] to-[#9867F8] text-white shadow-lg shadow-[#6C3FE8]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
              Peer Empowered
            </span>
            <span className="text-xs text-purple-200">21,000+ active participants</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold">Have an inspiring habit idea?</h2>
          <p className="text-xs text-purple-100/90 max-w-md">
            Design your own 21-day challenge and inspire thousands of peers worldwide.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            onOpenCreateChallenge();
          }}
          className="shrink-0 px-4 py-2.5 bg-white text-[#6C3FE8] hover:bg-purple-50 font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Post Your Challenge</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#867F9E]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search community challenges (e.g. Cold Shower, Dopamine, Focus)..."
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1E1A3D] border border-[#E7E0F5] dark:border-[#352F63] rounded-2xl text-xs sm:text-sm text-[#17142B] dark:text-white placeholder-[#8F88A6]/60 focus:border-[#6C3FE8] focus:outline-hidden shadow-xs"
        />
      </div>

      {/* Category Filter Bar with Top Purple Dash Indicator */}
      <div className="relative mb-5 pt-2 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  setSelectedFilter(cat);
                }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50 dark:bg-[#2A2357] text-[#6C3FE8] dark:text-[#C4B5FD] border-2 border-purple-400 dark:border-purple-500 shadow-sm'
                    : 'bg-white dark:bg-[#1E1A3D] text-[#675F8A] dark:text-[#AEA5D2] border-2 border-[#EBE3FA] dark:border-[#352F63] hover:border-purple-300 hover:text-[#6C3FE8]'
                }`}
              >
                {/* Purple dash indicator on the head of active category button */}
                {isSelected && (
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-[#6C3FE8] shadow-[0_0_8px_rgba(108,63,232,0.8)]" />
                )}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Community Challenges List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChallenges.map((ch) => {
          const isLiked = likedIds[ch.id];
          const totalLikes = (ch.communityLikes || 0) + (isLiked ? 1 : 0);

          return (
            <motion.div
              key={ch.id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-[#1E1A3D] border border-[#E9E1FC] dark:border-[#352F63] rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-[#6C3FE8]/60 transition-all group relative overflow-hidden"
            >
              {/* Top Row: Creator Info & Badges */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ch.creatorAvatar}
                      alt={ch.creatorName}
                      className="w-9 h-9 rounded-full object-cover border border-[#E9E1FC] dark:border-[#352F63]"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#17142B] dark:text-white">
                          {ch.creatorName}
                        </span>
                        {ch.isVerifiedCreator && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#6C3FE8] dark:text-[#C4B5FD] fill-current" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#7A7398] dark:text-[#A8A0C7]">
                        {ch.creatorRole}
                      </span>
                    </div>
                  </div>

                  {ch.trendingBadge && (
                    <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 text-[10px] font-bold rounded-full">
                      {ch.trendingBadge}
                    </span>
                  )}
                </div>

                {/* Challenge Title & Logo */}
                <div className="flex items-center gap-3 mb-2.5">
                  <ChallengeLogo challengeTitle={ch.title} category={ch.category} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#17142B] dark:text-white group-hover:text-[#6C3FE8] dark:group-hover:text-[#C4B5FD] transition-colors leading-snug">
                      {ch.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-[#787198] dark:text-[#B6ADDC] mt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {ch.rating.toFixed(2)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {ch.participantCount.toLocaleString()} peers
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#625983] dark:text-[#B8AFDC] line-clamp-2 leading-relaxed mb-3">
                  {ch.description}
                </p>

                {/* Milestones Preview */}
                <div className="bg-[#FAF7FF] dark:bg-[#26204F] rounded-2xl p-2.5 mb-4 border border-[#EBE3FA] dark:border-[#383069] space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#6C3FE8] dark:text-[#C4B5FD] flex items-center justify-between">
                    <span>21-Day Milestones</span>
                    <span className="text-[9px] font-normal text-[#8E87AA]">3 Phases</span>
                  </div>
                  <div className="text-[11px] text-[#4A4269] dark:text-[#D5CEF3] truncate">
                    🌱 <strong>Day 7:</strong> {ch.milestone7}
                  </div>
                  <div className="text-[11px] text-[#4A4269] dark:text-[#D5CEF3] truncate">
                    🏆 <strong>Day 21:</strong> {ch.milestone21}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#F0EBF8] dark:border-[#332C60]">
                <button
                  type="button"
                  onClick={(e) => toggleLike(ch.id, e)}
                  className={`px-3 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-200 dark:border-rose-800'
                      : 'bg-white dark:bg-[#1E1A3D] text-[#696187] dark:text-[#B5ACD8] border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#FAF7FF]'
                  }`}
                  title="Applaud challenge"
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                  <span>{totalLikes}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleJoinChallenge(ch)}
                  className="flex-1 py-2.5 bg-[#6C3FE8] hover:bg-[#582CD1] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#6C3FE8]/20 active:scale-98"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start 21-Day Pathway</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-[#1E1A3D] rounded-3xl border border-[#E9E1FC] dark:border-[#352F63] p-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-purple-50 text-[#6C3FE8] flex items-center justify-center text-2xl mb-3">
            🔍
          </div>
          <h3 className="text-base font-bold text-[#17142B] dark:text-white mb-1">
            No community challenges found
          </h3>
          <p className="text-xs text-[#7A7398] dark:text-[#A8A0C7] max-w-xs mx-auto mb-4">
            Try a different search query or be the first to create a challenge for this topic!
          </p>
          <button
            type="button"
            onClick={onOpenCreateChallenge}
            className="px-4 py-2.5 bg-[#6C3FE8] text-white text-xs font-bold rounded-2xl hover:bg-[#582CD1] transition-all cursor-pointer"
          >
            Create Challenge Now
          </button>
        </div>
      )}
    </div>
  );
};
