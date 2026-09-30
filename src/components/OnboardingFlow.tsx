import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ArrowRight, Sparkles, Check, Crown, Shield, Zap, X, ChevronRight } from 'lucide-react';
import { GenderType } from '../types';

interface OnboardingFlowProps {
  onComplete: (name: string, gender: GenderType) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<GenderType>('Female');
  const [welcomeSlide, setWelcomeSlide] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');

  const welcomeCards = [
    {
      title: '21 Days of Neuroplastic Transformation',
      desc: 'Scientific habit formation designed to rewire your neural pathways one day at a time with 69+ curated challenges.',
      icon: '🧠',
      tag: 'Proven Science',
    },
    {
      title: 'Gamified Rewards & Daily Wheel',
      desc: 'Earn coins, unlock streak protection, and spin daily for rewards that keep your motivation soaring.',
      icon: '🎡',
      tag: 'Gamification',
    },
    {
      title: 'Supportive Community Feed',
      desc: 'Connect with kindred spirits, exchange encouragement, and celebrate daily breakthroughs together.',
      icon: '✨',
      tag: 'Togetherness',
    },
  ];

  const handleNextStep1 = () => {
    if (!name.trim()) {
      setName('Blessica Friend');
    }
    setStep(2);
  };

  const handleSkipWelcome = () => {
    setStep(3);
  };

  const handleNextWelcome = () => {
    if (welcomeSlide < welcomeCards.length - 1) {
      setWelcomeSlide(welcomeSlide + 1);
    } else {
      setStep(3);
    }
  };

  const handleFinishOnboarding = () => {
    onComplete(name.trim() || 'Achiever', gender);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFBF7] dark:bg-[#111126] text-[#1E1B4B] dark:text-white flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Ambient Master Purple Glow */}
      <div className="fixed top-0 right-1/4 w-80 h-80 bg-[#6C3FE8]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-80 h-80 bg-[#FFD1DC]/30 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* ================= SCREEN 1: NICE TO MEET YOU ================= */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white/90 dark:bg-[#1A1836]/90 backdrop-blur-xl border border-[#EDE7F6] dark:border-[#2E285A] rounded-3xl p-6 sm:p-8 shadow-2xl relative"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-[#6C3FE8] to-[#9A74F8] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#6C3FE8]/25 mb-4">
                <Sparkles className="w-8 h-8 text-amber-200" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#17142B] dark:text-white">
                Nice To Meet You
              </h1>
              <p className="text-sm text-[#736B8E] dark:text-[#A79FC4] mt-1.5">
                Let's personalize your 21-day transformation journey
              </p>
            </div>

            <div className="space-y-6">
              {/* Box 1: Detail Fillers Box (Name) */}
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C3FE8] dark:text-[#A78BFA] mb-2">
                  First Step
                </label>
                <div className="relative flex items-center bg-[#F7F4FD] dark:bg-[#232048] border-2 border-[#E5DEFA] dark:border-[#383369] focus-within:border-[#6C3FE8] dark:focus-within:border-[#8F67F5] rounded-2xl p-3.5 transition-all">
                  <div className="p-2 bg-white dark:bg-[#2E2A5D] rounded-xl text-[#6C3FE8] dark:text-[#A78BFA] shadow-xs mr-3">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="what's your Name?"
                    className="w-full bg-transparent text-base font-medium text-[#17142B] dark:text-white placeholder-[#8F88A6]/60 dark:placeholder-[#8F88A6]/40 focus:outline-hidden"
                    autoFocus
                  />
                </div>
              </div>

              {/* Box 2: Gender Selection Choices */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C3FE8] dark:text-[#A78BFA] mb-2">
                  Select Gender
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Female', 'Male', 'Other'] as GenderType[]).map((g) => {
                    const isSelected = gender === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`py-3.5 px-3 rounded-2xl font-medium text-sm transition-all border-2 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#6C3FE8] text-white border-[#6C3FE8] shadow-md shadow-[#6C3FE8]/25 scale-[1.02]'
                            : 'bg-[#F7F4FD] dark:bg-[#232048] text-[#474163] dark:text-[#C5BDE0] border-[#E5DEFA] dark:border-[#383369] hover:border-[#6C3FE8]/50'
                        }`}
                      >
                        <span className="text-lg">
                          {g === 'Female' ? '👩' : g === 'Male' ? '👨' : '✨'}
                        </span>
                        <span>{g}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Arrow Button */}
              <button
                type="button"
                onClick={handleNextStep1}
                className="w-full py-4 bg-gradient-to-r from-[#6C3FE8] to-[#8F67F5] hover:from-[#5C32D4] hover:to-[#7E54E8] text-white font-semibold rounded-2xl shadow-lg shadow-[#6C3FE8]/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] mt-4"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= SCREEN 2: WELCOME SCREEN ================= */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white/90 dark:bg-[#1A1836]/90 backdrop-blur-xl border border-[#EDE7F6] dark:border-[#2E285A] rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col min-h-[520px] justify-between"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#F0EAFE] dark:bg-[#2F295B] text-[#6C3FE8] dark:text-[#C4B5FD] text-xs font-semibold rounded-full">
                  {welcomeCards[welcomeSlide].tag}
                </span>
                <button
                  type="button"
                  onClick={handleSkipWelcome}
                  className="text-xs font-medium text-[#736B8E] hover:text-[#6C3FE8] dark:text-[#A79FC4] dark:hover:text-white cursor-pointer px-2 py-1"
                >
                  Skip
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#17142B] dark:text-white tracking-tight">
                Welcome {name || 'Friend'}! ✨
              </h1>
              <p className="text-sm text-[#736B8E] dark:text-[#A79FC4] mt-1">
                Your journey towards self-mastery begins today.
              </p>
            </div>

            {/* Motivational Carousel Card */}
            <div className="my-6 bg-gradient-to-br from-[#F6F2FF] to-[#FAF7FF] dark:from-[#231F46] dark:to-[#2B2655] border border-[#E9E1FC] dark:border-[#3B346E] rounded-2xl p-6 text-center shadow-inner relative overflow-hidden">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-[#1E1940] rounded-2xl shadow-md flex items-center justify-center text-3xl mb-4">
                {welcomeCards[welcomeSlide].icon}
              </div>
              <h3 className="text-lg font-bold text-[#17142B] dark:text-white mb-2">
                {welcomeCards[welcomeSlide].title}
              </h3>
              <p className="text-xs sm:text-sm text-[#675F85] dark:text-[#B6ADDC] leading-relaxed">
                {welcomeCards[welcomeSlide].desc}
              </p>
            </div>

            {/* Carousel Dots & Controls */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-6">
                {welcomeCards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWelcomeSlide(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      welcomeSlide === i
                        ? 'w-7 bg-[#6C3FE8]'
                        : 'w-2 bg-[#DED6F5] dark:bg-[#3D356A]'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSkipWelcome}
                  className="flex-1 py-3.5 bg-[#F2ECFD] dark:bg-[#2B2556] text-[#6C3FE8] dark:text-[#D8B4FE] font-semibold text-sm rounded-2xl hover:bg-[#EAE1FB] transition-all cursor-pointer"
                >
                  Skip to Perks
                </button>
                <button
                  type="button"
                  onClick={handleNextWelcome}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#6C3FE8] to-[#8F67F5] text-white font-semibold text-sm rounded-2xl shadow-md shadow-[#6C3FE8]/25 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] transition-all"
                >
                  <span>{welcomeSlide === welcomeCards.length - 1 ? 'Start Journey' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= SCREEN 3: SUBSCRIPTION SCREEN ================= */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white/95 dark:bg-[#1A1836]/95 backdrop-blur-xl border border-[#EDE7F6] dark:border-[#2E285A] rounded-3xl p-6 sm:p-7 shadow-2xl relative"
          >
            {/* Top Right Skip / Limited version button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold border border-amber-200 dark:border-amber-800/40">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Blessikaa Pro</span>
              </div>
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="text-xs font-semibold text-[#6C3FE8] dark:text-[#A78BFA] hover:underline cursor-pointer px-2 py-1 bg-[#F5F0FF] dark:bg-[#2B2458] rounded-xl"
              >
                Skip / Continue with limited version
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#17142B] dark:text-white">
                Unlock Full Potential
              </h2>
              <p className="text-xs text-[#736B8E] dark:text-[#A79FC4] mt-1">
                Access all 69+ master challenges, unlimited wheel spins, and audio reflection journals
              </p>
            </div>

            {/* Perks list */}
            <div className="space-y-2.5 mb-6">
              {[
                'Access to all 69+ 21-Day Challenges',
                'Unlimited Daily Wheel Spins & Bonus Freezes',
                'Unlock all Avatar Customizations & Themes',
                'AI Habit Coach & Personalized Reflections',
              ].map((perk, i) => (
                <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[#453E65] dark:text-[#D1C9EB]">
                  <div className="w-5 h-5 rounded-full bg-[#EDE7F6] dark:bg-[#342D66] text-[#6C3FE8] dark:text-[#A78BFA] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            {/* Pricing Options */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { id: 'monthly', title: 'Monthly', price: '$4.99', sub: '/month' },
                { id: 'yearly', title: 'Yearly', price: '$2.49', sub: '/month (Save 50%)', best: true },
                { id: 'lifetime', title: 'Lifetime', price: '$49', sub: 'one-time' },
              ].map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`p-3 rounded-2xl text-center border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#6C3FE8] bg-[#FAF7FF] dark:bg-[#272152] shadow-sm'
                        : 'border-[#EBE4F7] dark:border-[#352F64] bg-white dark:bg-[#1E1A3D] opacity-80'
                    }`}
                  >
                    {plan.best && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Popular
                      </span>
                    )}
                    <p className="text-xs font-semibold text-[#3B345D] dark:text-[#C8C0E6]">{plan.title}</p>
                    <p className="text-base font-bold text-[#6C3FE8] dark:text-[#C4B5FD] mt-0.5">{plan.price}</p>
                    <p className="text-[9px] text-[#867F9E] dark:text-[#8E86AD]">{plan.sub}</p>
                  </button>
                );
              })}
            </div>

            {/* Subscribe / Start Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full py-4 bg-gradient-to-r from-[#6C3FE8] to-[#8F67F5] text-white font-bold rounded-2xl shadow-lg shadow-[#6C3FE8]/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Start 7-Day Free Trial</span>
              </button>

              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full py-2.5 text-xs text-[#736B8E] dark:text-[#A79FC4] hover:text-[#17142B] dark:hover:text-white text-center cursor-pointer"
              >
                No commitment. Cancel anytime in settings.
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
