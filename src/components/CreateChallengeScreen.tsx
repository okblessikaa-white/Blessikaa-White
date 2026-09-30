import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Sparkles, Check, Users, UserCheck, Share2 } from 'lucide-react';
import { Challenge, DayPlan } from '../types';
import { soundManager } from '../utils/audio';

interface CreateChallengeScreenProps {
  onSaveChallenge: (challenge: Challenge, targetScope: 'self' | 'others' | 'both') => void;
  onBack: () => void;
}

const AVAILABLE_ICONS = ['🌱', '⚡', '🔥', '🧘', '🎯', '💧', '📚', '💪', '✨', '🧠', '🌟', '🎨'];

export const CreateChallengeScreen: React.FC<CreateChallengeScreenProps> = ({
  onSaveChallenge,
  onBack,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<string>('🌱');
  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [days, setDays] = useState<string[]>(Array(21).fill(''));
  const [showApplyAllPrompt, setShowApplyAllPrompt] = useState<boolean>(false);
  const [hasPromptedApplyAll, setHasPromptedApplyAll] = useState<boolean>(false);
  const [showTargetAudienceModal, setShowTargetAudienceModal] = useState<boolean>(false);

  const handleDayFocus = (index: number) => {
    // If user typed day 1 and focuses on day 2 and hasn't been prompted yet
    if (index === 1 && days[0].trim().length > 0 && !hasPromptedApplyAll) {
      setShowApplyAllPrompt(true);
      setHasPromptedApplyAll(true);
    }
  };

  const handleApplyAllYes = () => {
    soundManager.playSuccess();
    const day1Text = days[0];
    setDays(Array(21).fill(day1Text));
    setShowApplyAllPrompt(false);
  };

  const handleApplyAllNo = () => {
    setShowApplyAllPrompt(false);
  };

  const handleDayChange = (index: number, text: string) => {
    const next = [...days];
    next[index] = text;
    setDays(next);
  };

  const handleAttemptCreate = () => {
    if (!title.trim()) {
      soundManager.playTick();
      return;
    }
    setShowTargetAudienceModal(true);
  };

  const handleFinalizeCreation = (targetScope: 'self' | 'others' | 'both') => {
    soundManager.playCelebration();
    const formattedDays: DayPlan[] = days.map((taskText, idx) => ({
      day: idx + 1,
      title: `Day ${idx + 1}: ${taskText || 'Daily Focus Action'}`,
      description: `Maintain consistency in ${title}`,
      tasks: [taskText || `Practice 15 minutes of ${title}`],
      tip: 'Repetition solidifies new neural habit circuits.',
      estimatedMinutes: 15,
    }));

    const newChallenge: Challenge = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'A personalized 21-day journey for self transformation.',
      category: 'personal_growth',
      intensity: 'medium',
      iconName: selectedIcon,
      tags: ['Custom', 'Personal'],
      milestone7: 'Week 1 Momentum',
      milestone14: 'Halfway Mastery',
      milestone21: '21-Day Habit Transformation',
      days: formattedDays,
      createdAt: new Date().toISOString(),
      isCustom: true,
      author: 'You',
    };

    onSaveChallenge(newChallenge, targetScope);
  };

  return (
    <div className="w-full max-w-md mx-auto py-2 px-3 sm:px-4 animate-fadeIn relative pb-28">
      {/* Top Bar (Matching Screenshot 4) */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2.5 rounded-2xl bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#F6F2FF] transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-bold text-[#17142B] dark:text-white">
          Create your own challenge
        </h1>

        <div className="w-10" />
      </div>

      {/* Icon Picker Circular Button */}
      <div className="flex flex-col items-center my-4">
        <button
          type="button"
          onClick={() => setShowIconPicker(!showIconPicker)}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6C3FE8] to-[#9B76F7] text-white flex items-center justify-center text-3xl shadow-lg shadow-[#6C3FE8]/25 cursor-pointer relative hover:scale-105 transition-transform"
        >
          <span>{selectedIcon}</span>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] rounded-full flex items-center justify-center text-xs shadow-md border border-[#E9E1FC]">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </button>
        <p className="text-xs text-[#7A7398] dark:text-[#A8A0C7] mt-2 font-medium">
          Choose an Icon
        </p>

        {/* Icon Picker Dropdown */}
        {showIconPicker && (
          <div className="flex items-center justify-center gap-2 flex-wrap max-w-xs bg-white dark:bg-[#1E1A3D] p-3 rounded-2xl border border-[#E9E1FC] dark:border-[#352F63] shadow-md mt-2">
            {AVAILABLE_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => {
                  setSelectedIcon(icon);
                  setShowIconPicker(false);
                }}
                className="w-9 h-9 rounded-xl hover:bg-[#F2ECFD] dark:hover:bg-[#2B2456] flex items-center justify-center text-xl cursor-pointer"
              >
                {icon}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Inputs Form */}
      <div className="space-y-4 mb-6">
        {/* Semi-transparent Title Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#6C3FE8] dark:text-[#A78BFA] mb-1.5">
            Challenge Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Challenge title"
            className="w-full p-3.5 bg-white dark:bg-[#1E1A3D] border border-[#E5DEFA] dark:border-[#38316B] focus:border-[#6C3FE8] rounded-2xl text-sm font-semibold text-[#17142B] dark:text-white placeholder-[#8F88A6]/60 shadow-xs focus:outline-hidden transition-all"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#6C3FE8] dark:text-[#A78BFA] mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you will achieve in these 21 days..."
            rows={2}
            className="w-full p-3.5 bg-white dark:bg-[#1E1A3D] border border-[#E5DEFA] dark:border-[#38316B] focus:border-[#6C3FE8] rounded-2xl text-xs sm:text-sm text-[#17142B] dark:text-white placeholder-[#8F88A6]/60 shadow-xs focus:outline-hidden transition-all resize-none"
          />
        </div>
      </div>

      {/* 21 Daily Boxes List (Matching Screenshot 4) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6C3FE8] dark:text-[#A78BFA]">
            21 Daily Action Steps
          </h3>
          <span className="text-[11px] text-[#7A7398] dark:text-[#A8A0C7]">
            {days.filter((d) => d.trim().length > 0).length}/21 filled
          </span>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {days.map((dayText, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white dark:bg-[#1E1A3D] border border-[#E9E1FC] dark:border-[#352F63] rounded-2xl p-2.5 shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#F2ECFD] dark:bg-[#2B2456] text-[#6C3FE8] dark:text-[#C4B5FD] font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <input
                type="text"
                value={dayText}
                onFocus={() => handleDayFocus(idx)}
                onChange={(e) => handleDayChange(idx, e.target.value)}
                placeholder={`Day ${idx + 1} specific task...`}
                className="w-full bg-transparent text-xs font-medium text-[#17142B] dark:text-white placeholder-[#8F88A6]/60 focus:outline-hidden"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Create Button */}
      <button
        type="button"
        onClick={handleAttemptCreate}
        disabled={!title.trim()}
        className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
          !title.trim()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#6C3FE8] to-[#8F67F5] text-white shadow-[#6C3FE8]/30 hover:scale-[1.01]'
        }`}
      >
        <Sparkles className="w-5 h-5 text-amber-300" />
        <span>Create Challenge</span>
      </button>

      {/* ================= APPLY ALL DAYS MODAL (Prompt from Screenshot 4 instructions) ================= */}
      <AnimatePresence>
        {showApplyAllPrompt && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-white dark:bg-[#1E1A3D] rounded-3xl p-6 text-center shadow-2xl border border-[#E9E1FC] dark:border-[#352F63] relative"
            >
              <div className="w-14 h-14 mx-auto bg-[#F2ECFD] dark:bg-[#2B2456] text-[#6C3FE8] dark:text-[#C4B5FD] rounded-full flex items-center justify-center text-2xl mb-3 shadow-inner">
                ✨
              </div>

              <h2 className="text-lg font-bold text-[#17142B] dark:text-white mb-2">
                Apply to All 21 Days?
              </h2>
              <p className="text-xs sm:text-sm text-[#6F678F] dark:text-[#B7AEDB] leading-relaxed mb-6">
                Do you want to apply the same challenge task for all 21 days?
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleApplyAllNo}
                  className="flex-1 py-3 bg-[#F2ECFD] dark:bg-[#2A2454] text-[#6C3FE8] dark:text-[#C4B5FD] text-xs font-bold rounded-2xl cursor-pointer"
                >
                  No, customize
                </button>
                <button
                  type="button"
                  onClick={handleApplyAllYes}
                  className="flex-1 py-3 bg-[#6C3FE8] text-white text-xs font-bold rounded-2xl shadow-md shadow-[#6C3FE8]/25 cursor-pointer hover:bg-[#5C32D4]"
                >
                  Yes, apply all
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= TARGET AUDIENCE PROMPT (Self / Others / Both) ================= */}
      <AnimatePresence>
        {showTargetAudienceModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-white dark:bg-[#1E1A3D] rounded-3xl p-6 text-center shadow-2xl border border-[#E9E1FC] dark:border-[#352F63] relative"
            >
              <h2 className="text-lg font-bold text-[#17142B] dark:text-white mb-2">
                Challenge Destination
              </h2>
              <p className="text-xs sm:text-sm text-[#6F678F] dark:text-[#B7AEDB] leading-relaxed mb-5">
                Do you want to create this challenge for yourself, others, or both?
              </p>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleFinalizeCreation('self')}
                  className="w-full py-3.5 px-4 bg-[#F8F5FF] dark:bg-[#282155] border border-[#E5DEFA] dark:border-[#3A336C] hover:border-[#6C3FE8] text-[#17142B] dark:text-white rounded-2xl text-xs font-bold flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#6C3FE8]" />
                    <span>For Myself Only</span>
                  </div>
                  <Check className="w-4 h-4 text-[#6C3FE8]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleFinalizeCreation('others')}
                  className="w-full py-3.5 px-4 bg-[#F8F5FF] dark:bg-[#282155] border border-[#E5DEFA] dark:border-[#3A336C] hover:border-[#6C3FE8] text-[#17142B] dark:text-white rounded-2xl text-xs font-bold flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>For Community Feed</span>
                  </div>
                  <Share2 className="w-4 h-4 text-emerald-500" />
                </button>

                <button
                  type="button"
                  onClick={() => handleFinalizeCreation('both')}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#6C3FE8] to-[#8F67F5] text-white rounded-2xl text-xs font-bold flex items-center justify-between shadow-md shadow-[#6C3FE8]/25 cursor-pointer hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Both (Self + Community)</span>
                  </div>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
