import React, { useState } from 'react';
import { Sparkles, Gift, Star, Award, Zap, RotateCw, X, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WheelReward } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface DailyWheelProps {
  onSpinReward?: (reward: WheelReward) => void;
  streakFreezes?: number;
  totalPoints?: number;
  theme?: 'dark' | 'light';
}

export const DailyWheel: React.FC<DailyWheelProps> = ({
  onSpinReward,
  streakFreezes = 1,
  totalPoints = 0,
  theme = 'dark',
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedReward, setSelectedReward] = useState<WheelReward | null>(null);
  const [showResult, setShowResult] = useState(false);

  const wheelRewards: WheelReward[] = [
    { id: 1, icon: '🌟', label: '50 XP', color: '#8b5cf6', type: 'xp', value: 50 },
    { id: 2, icon: '🔥', label: 'Streak Freeze', color: '#f59e0b', type: 'streak_freeze', value: 1 },
    { id: 3, icon: '🎁', label: 'Bonus Spin', color: '#10b981', type: 'spin', value: 1 },
    { id: 4, icon: '⭐', label: '100 XP', color: '#3b82f6', type: 'xp', value: 100 },
    { id: 5, icon: '🏆', label: 'Habit Trophy', color: '#ef4444', type: 'badge', value: 'badge_lucky_spinner' },
    { id: 6, icon: '💎', label: 'Premium Perk', color: '#6366f1', type: 'premium', value: 'AI Deep Advice' },
    { id: 7, icon: '🎯', label: '25 XP', color: '#06b6d4', type: 'xp', value: 25 },
    { id: 8, icon: '🌈', label: 'Double Focus Boost', color: '#ec4899', type: 'boost', value: '2x Focus Power' },
  ];

  const segmentAngle = 360 / wheelRewards.length;

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setShowResult(false);
    setSelectedReward(null);

    soundManager.playTick();
    triggerHaptic('medium');

    // 5-8 full rotations + target segment
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const targetIndex = Math.floor(Math.random() * wheelRewards.length);

    // In a clockwise wheel where 0 deg is at top, index 0 is at top.
    // To land on targetIndex, we calculate the angle offset
    const targetAngle = 360 - targetIndex * segmentAngle - segmentAngle / 2;
    const totalRotation = rotation + fullSpins * 360 + targetAngle;

    setRotation(totalRotation);

    // Periodic tick audio during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      if (tickCount < 18) {
        soundManager.playTick();
      }
    }, 200);

    setTimeout(() => {
      clearInterval(tickInterval);
      const reward = wheelRewards[targetIndex];
      setSelectedReward(reward);
      setShowResult(true);
      setIsSpinning(false);

      soundManager.playCelebration();
      triggerHaptic('success');
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#a855f7', '#fb923c', '#f43f5e', '#fde047'],
      });

      onSpinReward?.(reward);
    }, 4200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 p-5 sm:p-6 shadow-xl shadow-purple-900/10 border border-purple-400/20 text-white text-center relative overflow-hidden">
        <div className="relative z-10 max-w-lg mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Daily Lucky Wheel</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Spin to Win Habit Power-ups
          </h2>
          <p className="text-xs sm:text-sm text-purple-200">
            Spin daily for free bonus XP, streak shields, badges, and habit boosts!
          </p>

          {/* User Perks summary */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 text-xs text-white">
              <Star className="w-3.5 h-3.5 text-amber-300" />
              <span>{totalPoints} XP</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 text-xs text-white">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>{streakFreezes} Streak Freezes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wheel Stage */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80">
          {/* Glowing Background Ring */}
          <div className="absolute -inset-3 rounded-full bg-purple-300/30 blur-xl animate-pulse" />

          {/* Outer Decorative Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-purple-300 shadow-lg bg-white" />

          {/* SVG Wheel Disc */}
          <div
            className="w-full h-full rounded-full overflow-hidden transition-all ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? '4200ms' : '0ms',
              transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.32, 1)',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {wheelRewards.map((reward, index) => {
                const startAngle = index * segmentAngle;
                const endAngle = (index + 1) * segmentAngle;
                const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                const midAngle = startAngle + segmentAngle / 2;
                const textX = 50 + 32 * Math.cos((Math.PI * (midAngle - 90)) / 180);
                const textY = 50 + 32 * Math.sin((Math.PI * (midAngle - 90)) / 180);

                const isEven = index % 2 === 0;
                const fillColor = isEven ? '#7c3aed' : '#9333ea';

                return (
                  <g key={reward.id}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                      fill={fillColor}
                      stroke="#ffffff"
                      strokeWidth="0.8"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="#ffffff"
                      fontSize="5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                    >
                      {reward.icon}
                    </text>
                    <text
                      x={textX}
                      y={textY + 4}
                      fill="#f5f3ff"
                      fontSize="2.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle}, ${textX}, ${textY + 4})`}
                    >
                      {reward.label.slice(0, 10)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Top Indicator Arrow Needle */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 drop-shadow-md">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-purple-900" />
          </div>

          {/* Center Spin Trigger Button */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto">
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white text-purple-900 font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl border-4 border-purple-100 flex flex-col items-center justify-center transition-all transform active:scale-95 ${
                isSpinning ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:scale-105 hover:bg-purple-50'
              }`}
            >
              {isSpinning ? (
                <RotateCw className="w-6 h-6 animate-spin text-purple-700" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-600 mb-0.5" />
                  <span>SPIN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Spin Instruction Button */}
        <div className="mt-6 text-center">
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-md transition-all disabled:opacity-50"
          >
            {isSpinning ? 'Wheel is spinning...' : '🎰 Tap to Spin Daily Wheel'}
          </button>
          <p className="text-[11px] text-slate-500 mt-2">
            1 Free spin available every 24 hours. Keep your daily streak going!
          </p>
        </div>
      </div>

      {/* Reward Result Modal */}
      {showResult && selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-white border border-purple-100 p-6 text-center shadow-2xl space-y-4">
            <button
              onClick={() => setShowResult(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-6xl animate-bounce pt-2">{selectedReward.icon}</div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                🎉 Congratulations!
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                You Won {selectedReward.label}!
              </h3>
              <p className="text-xs text-slate-600">
                {selectedReward.type === 'xp'
                  ? `+${selectedReward.value} XP added to your habit level!`
                  : selectedReward.type === 'streak_freeze'
                  ? 'Your streak is protected in case you miss a day!'
                  : 'Power-up ready to boost your 21-day transformation!'}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowResult(false)}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all"
              >
                Awesome! Claim & Continue 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
