import React, { useState } from 'react';
import {
  Search,
  Plus,
  Sparkles,
  Flame,
  CheckCircle2,
  Tag,
  Clock,
  Layers,
  Award,
  Zap,
  Heart,
  Sun,
  Apple,
  DollarSign,
  BookOpen,
  X,
  ArrowRight,
} from 'lucide-react';
import { Challenge, ChallengeCategory, ChallengeIntensity } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { getChallengeLucideIcon } from './ChallengeLogo';

interface ExploreChallengesProps {
  challenges: Challenge[];
  activeChallengeId: string;
  onSelectChallenge: (id: string) => void;
  onCreateCustomChallenge: (challenge: Challenge) => void;
  onOpenAIArchitect: () => void;
  onOpenAllChallenges?: () => void;
}

export const ExploreChallenges: React.FC<ExploreChallengesProps> = ({
  challenges,
  activeChallengeId,
  onSelectChallenge,
  onCreateCustomChallenge,
  onOpenAIArchitect,
  onOpenAllChallenges,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIntensity, setSelectedIntensity] = useState<string>('all');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom Challenge Form State
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customCategory, setCustomCategory] = useState<ChallengeCategory>('personal-growth');
  const [customIntensity, setCustomIntensity] = useState<ChallengeIntensity>('medium');
  const [customMilestone7, setCustomMilestone7] = useState('First 7-day consistency spark');
  const [customMilestone14, setCustomMilestone14] = useState('Midway transformation breakthrough');
  const [customMilestone21, setCustomMilestone21] = useState('Full habit mastery unlocked');

  const categories = [
    { id: 'all', label: 'All Challenges' },
    { id: 'mindfulness', label: 'Mindfulness & Zen' },
    { id: 'productivity', label: 'Productivity & Focus' },
    { id: 'fitness', label: 'Fitness & Stamina' },
    { id: 'health', label: 'Clean Gut & Health' },
    { id: 'finance', label: 'Wealth & Finance' },
    { id: 'personal-growth', label: 'Gratitude & Mindset' },
    { id: 'creativity', label: 'Learning & Skills' },
  ];

  const getCategoryIcon = (cat: ChallengeCategory | string) => {
    switch (cat) {
      case 'mindfulness':
        return Heart;
      case 'fitness':
        return Flame;
      case 'productivity':
        return Zap;
      case 'health':
        return Apple;
      case 'finance':
        return DollarSign;
      case 'creativity':
        return BookOpen;
      case 'personal-growth':
        return Sparkles;
      default:
        return Sun;
    }
  };

  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesIntensity = selectedIntensity === 'all' || c.intensity === selectedIntensity;

    return matchesSearch && matchesCategory && matchesIntensity;
  });

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const days = Array.from({ length: 21 }, (_, i) => {
      const dNum = i + 1;
      return {
        day: dNum,
        title: `Day ${dNum}: ${customTitle} Execution`,
        description: `Perform your daily focus action for ${customTitle}. Track consistency and overcome friction.`,
        tasks: [
          `Execute primary daily task for ${customTitle}`,
          `Reflect on progress & prepare tomorrow's cue`,
        ],
        tip: 'Small daily repetitions build indestructible neural pathways by Day 21.',
        estimatedMinutes: 20,
      };
    });

    const newChallenge: Challenge = {
      id: 'custom_' + Date.now(),
      title: customTitle,
      description: customDescription || `A personalized 21-day challenge to master ${customTitle}.`,
      category: customCategory,
      intensity: customIntensity,
      iconName: 'Sparkles',
      tags: ['Custom', customCategory],
      isCustom: true,
      milestone7: customMilestone7,
      milestone14: customMilestone14,
      milestone21: customMilestone21,
      days,
      createdAt: new Date().toISOString(),
    };

    onCreateCustomChallenge(newChallenge);
    setShowCustomModal(false);
    setCustomTitle('');
    setCustomDescription('');
    soundManager.playCelebration();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner with Quick Actions */}
      <div className="rounded-3xl bg-purple-600 p-5 sm:p-6 text-white shadow-lg shadow-purple-900/10 border border-purple-500 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Curated Habit Vault
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Explore 21-Day Challenges
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
              Choose from evidence-based 21-day transformations across wellness, focus, fitness, finance, and learning.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenAllChallenges && (
              <button
                onClick={() => {
                  onOpenAllChallenges();
                  soundManager.playTick();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 text-xs font-bold shadow-sm transition-all transform active:scale-95 cursor-pointer"
              >
                <span>🌟 All 69+ Challenges</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenAIArchitect();
                soundManager.playTick();
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white text-purple-800 hover:bg-purple-50 text-xs font-bold shadow-sm transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI Architect</span>
            </button>

            <button
              onClick={() => {
                setShowCustomModal(true);
                soundManager.playTick();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-700/80 hover:bg-purple-700 border border-purple-400/40 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-purple-200" />
              <span>Custom Challenge</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-purple-500/50">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-purple-200" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges (e.g., dopamine, morning, fitness, finance)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-purple-700/60 border border-purple-400/50 text-white placeholder-purple-200 focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          <select
            value={selectedIntensity}
            onChange={(e) => setSelectedIntensity(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-purple-700/60 border border-purple-400/50 text-white focus:outline-none focus:ring-1 focus:ring-white"
          >
            <option value="all" className="text-slate-900 bg-white">All Intensities</option>
            <option value="gentle" className="text-slate-900 bg-white">Gentle Pace</option>
            <option value="medium" className="text-slate-900 bg-white">Medium Focus</option>
            <option value="intense" className="text-slate-900 bg-white">Intense Beast</option>
          </select>
        </div>

        {/* Category Pills with Top Indicator Dash */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  soundManager.playTick();
                  triggerHaptic('light');
                }}
                className={`relative shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'bg-purple-700/60 border border-purple-500/50 text-purple-100 hover:bg-purple-700'
                }`}
              >
                {isSelected && (
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-purple-300 shadow-[0_0_8px_rgba(216,180,254,0.9)]" />
                )}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Challenge Buttons Grid matching HomeScreen style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredChallenges.map((challenge) => {
          const isActive = challenge.id === activeChallengeId;
          const Icon = getChallengeLucideIcon(challenge.title, challenge.category);

          return (
            <button
              key={challenge.id}
              onClick={() => {
                onSelectChallenge(challenge.id);
                soundManager.playTick();
              }}
              className={`group relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-white hover:bg-purple-50/50 border-2 text-left shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer w-full ${
                isActive
                  ? 'border-purple-600 ring-2 ring-purple-400'
                  : 'border-purple-200/80 hover:border-purple-500'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0 pr-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-purple-900 block tracking-tight truncate">
                    {challenge.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-purple-600 font-semibold truncate capitalize">
                      {challenge.category.replace('-', ' ')}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-purple-50 group-hover:bg-purple-600 group-hover:text-white text-purple-700 flex items-center justify-center transition-colors shrink-0">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Challenge Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-purple-100 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCustomModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                Custom Blueprint
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Create Your 21-Day Challenge
              </h3>
              <p className="text-xs text-slate-600">
                Define your personalized 21-day habit transformation goal. We will generate the 21 daily step progression for you.
              </p>
            </div>

            <form onSubmit={handleSaveCustom} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 21 Days of Daily Spanish Practice"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/30 border border-purple-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Description / Transformation Goal
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what success looks like by Day 21..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/30 border border-purple-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as ChallengeCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/30 border border-purple-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="personal-growth">Personal Growth</option>
                    <option value="productivity">Productivity</option>
                    <option value="fitness">Fitness</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="health">Health & Nutrition</option>
                    <option value="finance">Finance</option>
                    <option value="creativity">Creativity & Skills</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Intensity</label>
                  <select
                    value={customIntensity}
                    onChange={(e) => setCustomIntensity(e.target.value as ChallengeIntensity)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/30 border border-purple-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="gentle">Gentle (10-15m / day)</option>
                    <option value="medium">Medium (20-30m / day)</option>
                    <option value="intense">Intense (45m+ / day)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-purple-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  Key Milestones
                </h4>
                <div className="space-y-2">
                  <div className="space-y-0.5">
                    <label className="text-[11px] text-slate-600">Day 7 Milestone</label>
                    <input
                      type="text"
                      value={customMilestone7}
                      onChange={(e) => setCustomMilestone7(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-purple-50/30 border border-purple-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[11px] text-slate-600">Day 21 Final Mastery</label>
                    <input
                      type="text"
                      value={customMilestone21}
                      onChange={(e) => setCustomMilestone21(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-purple-50/30 border border-purple-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
                >
                  Create & Launch 21-Day Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
