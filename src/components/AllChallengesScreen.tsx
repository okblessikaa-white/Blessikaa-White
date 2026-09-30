import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Sparkles,
  ArrowRight,
  Sprout,
  HeartPulse,
  GraduationCap,
  Sun,
  Target,
  Brain,
  Users,
  Heart,
  SmilePlus,
  Mountain,
} from 'lucide-react';
import { ALL_69_CHALLENGES, CatalogChallenge } from '../data/all69Challenges';
import { getChallengeLucideIcon } from './ChallengeLogo';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface AllChallengesScreenProps {
  onSelectChallenge: (challengeId: string) => void;
  onBack: () => void;
}

const CATEGORIES_DATA = [
  { name: 'All', icon: Sparkles },
  { name: 'Personal Growth', icon: Sprout },
  { name: 'Health', icon: HeartPulse },
  { name: 'Learning', icon: GraduationCap },
  { name: 'Lifestyle', icon: Sun },
  { name: 'Productivity', icon: Target },
  { name: 'Mental Health', icon: Brain },
  { name: 'Relationships', icon: Users },
  { name: 'Self Love', icon: Heart },
  { name: 'Positivity', icon: SmilePlus },
  { name: 'Adventure', icon: Mountain },
];

export const AllChallengesScreen: React.FC<AllChallengesScreenProps> = ({
  onSelectChallenge,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = ALL_69_CHALLENGES.filter((ch) => {
    const matchesCategory =
      selectedCategory === 'All' || ch.categoryLabel === selectedCategory;
    const matchesSearch =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStart = (ch: CatalogChallenge) => {
    soundManager.playCelebration();
    triggerHaptic('medium');
    onSelectChallenge(ch.id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-2 px-3 sm:px-6 animate-fadeIn pb-32">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2.5 rounded-2xl bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#F6F2FF] transition-all cursor-pointer shadow-xs active:scale-95"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-black text-[#17142B] dark:text-white flex items-center justify-center gap-1.5">
            <span>BLESSIKAA CHALLENGES</span>
            <Sparkles className="w-4 h-4 text-[#6C3FE8] dark:text-[#C4B5FD]" />
          </h1>
          <p className="text-xs text-[#787198] dark:text-[#B6ADDC]">
            69+ Master 21-Day Habit Pathways
          </p>
        </div>

        <div className="w-10" />
      </div>

      {/* Redesigned Top Search & Overview Card (Matching Challenge Buttons Language) */}
      <div className="mb-4 rounded-3xl p-4 sm:p-5 bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md flex items-center gap-4 transition-all focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-500/10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 shrink-0">
          <Search className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
              {selectedCategory === 'All' ? 'All 69 Master Pathways' : selectedCategory}
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-purple-300">
              {filtered.length} {filtered.length === 1 ? 'Habit' : 'Habits'} Available
            </span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search challenges (e.g. Yoga, Kindness, Focus, Morning Routine)..."
            className="w-full bg-transparent border-0 p-0 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0"
          />
        </div>

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-[#2C245C] hover:bg-purple-600 hover:text-white text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer shrink-0"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Scrollable Categories Bar with Purple Top Dash Indicator (Like Home Screen Bottom Tab Bar) */}
      <div className="relative mb-5 pt-2 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const CatIcon = cat.icon;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  setSelectedCategory(cat.name);
                }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50 dark:bg-[#2A2357] text-[#6C3FE8] dark:text-[#C4B5FD] border-2 border-purple-400 dark:border-purple-500 shadow-sm'
                    : 'bg-white dark:bg-[#1E1A3D] text-[#675F8A] dark:text-[#AEA5D2] border-2 border-[#EBE3FA] dark:border-[#352F63] hover:border-purple-300 hover:text-[#6C3FE8]'
                }`}
              >
                {/* Purple dash indicator on the head of active category button (matching bottom bar) */}
                {isSelected && (
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-[#6C3FE8] shadow-[0_0_8px_rgba(108,63,232,0.8)]" />
                )}
                <CatIcon
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-[#6C3FE8] dark:text-[#C4B5FD]' : 'text-purple-400'
                  }`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Challenges Grid: Button Style matching Home Screen Challenges & Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filtered.map((ch) => {
          const Icon = getChallengeLucideIcon(ch.title, ch.category);
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => handleStart(ch)}
              className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50/50 dark:hover:bg-[#282154] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 text-left shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer w-full"
            >
              <div className="flex items-center gap-4 min-w-0 pr-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
                    {ch.title}
                  </span>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
                    {ch.categoryLabel}
                  </span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-[#2C245C] group-hover:bg-purple-600 group-hover:text-white text-purple-700 dark:text-purple-300 flex items-center justify-center transition-colors shrink-0">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-[#1E1A3D] rounded-3xl border border-[#E9E1FC] dark:border-[#352F63] p-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-purple-50 text-[#6C3FE8] flex items-center justify-center text-2xl mb-3">
            🔍
          </div>
          <h3 className="text-base font-bold text-[#17142B] dark:text-white mb-1">
            No challenges match your search
          </h3>
          <p className="text-xs text-[#7A7398] dark:text-[#A8A0C7]">
            Try searching for another keyword or selecting "All" categories.
          </p>
        </div>
      )}
    </div>
  );
};
