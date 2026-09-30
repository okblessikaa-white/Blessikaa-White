import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, X, Compass, Award, Gift, CheckCircle } from 'lucide-react';

interface HomeTutorialOverlayProps {
  onDismiss: () => void;
}

export const HomeTutorialOverlay: React.FC<HomeTutorialOverlayProps> = ({ onDismiss }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const tutorialSteps = [
    {
      title: 'Welcome to Blessikaa! ✨',
      desc: 'Let us take a quick 15-second interactive tour of your transformation ecosystem. Tap anywhere or click Next to explore!',
      icon: '🌟',
      badge: 'Step 1 of 5',
    },
    {
      title: 'Top Navigation & Day/Night Mode',
      desc: 'Access your categorized features drawer on the top left. Toggle daylight/night vision mode and watch your collected Reward Coins grow on the top right.',
      icon: '🧭',
      badge: 'Step 2 of 5',
    },
    {
      title: 'Timely Greeting & Daily Spin Wheel',
      desc: 'Receive personalized motivation adapted to your local morning/afternoon/night. Tap the daily wheel badge on the greeting card to spin for bonus rewards!',
      icon: '🎡',
      badge: 'Step 3 of 5',
    },
    {
      title: '4 Master Challenge Pathways',
      desc: 'Track your 21-day milestones with locked future gates, interactive daily scratch cards, and celebratory streaks.',
      icon: '🎯',
      badge: 'Step 4 of 5',
    },
    {
      title: 'Create, Community & Avatar Store',
      desc: 'Customize your 3D avatar, craft personal 21-day challenges, and connect with global achievers in the age-friendly feed.',
      icon: '🚀',
      badge: 'Step 5 of 5',
    },
  ];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onDismiss();
    }
  };

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer transition-all animate-fadeIn"
    >
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#1E1A3D] border-2 border-[#8F67F5]/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-[#17142B] dark:text-white cursor-default"
      >
        {/* Top bar with close */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-[#F2ECFD] dark:bg-[#2D2659] text-[#6C3FE8] dark:text-[#C4B5FD] text-xs font-bold rounded-full uppercase tracking-wider">
            {tutorialSteps[currentStep].badge}
          </span>
          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 text-[#8881A2] hover:text-[#17142B] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
            title="Skip tutorial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Visual & Content */}
        <div className="text-center py-3">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-[#6C3FE8] to-[#9B76F7] text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-[#6C3FE8]/25 mb-4">
            {tutorialSteps[currentStep].icon}
          </div>
          <h2 className="text-xl font-bold mb-2 text-[#17142B] dark:text-white">
            {tutorialSteps[currentStep].title}
          </h2>
          <p className="text-xs sm:text-sm text-[#665D85] dark:text-[#B9B0D8] leading-relaxed max-w-sm mx-auto">
            {tutorialSteps[currentStep].desc}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 my-5">
          {tutorialSteps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                currentStep === i
                  ? 'w-6 bg-[#6C3FE8]'
                  : 'w-2 bg-[#E1D8F6] dark:bg-[#3B3468]'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 py-3 text-xs font-semibold text-[#787194] dark:text-[#9F97BE] hover:text-[#17142B] dark:hover:text-white cursor-pointer"
          >
            Skip Tutorial
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3 bg-gradient-to-r from-[#6C3FE8] to-[#8F67F5] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C3FE8]/25 flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <span>{currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[10px] text-center text-[#9D96B8] dark:text-[#7A7398] mt-3">
          (Tip: You can tap anywhere outside to dismiss at any time)
        </p>
      </motion.div>
    </div>
  );
};
