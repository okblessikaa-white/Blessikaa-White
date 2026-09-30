import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Coins, Sparkles, AlertCircle, Play, X, RefreshCw, Trophy, Flame, Settings } from 'lucide-react';
import { WheelReward, CustomWheelConfig, WheelTriangleItem } from '../types';
import { soundManager } from '../utils/audio';

interface DailyWheelScreenProps {
  onSpinReward: (reward: WheelReward) => void;
  onEarnCoins: (amount: number) => void;
  userCoins: number;
  onBack: () => void;
  customPositiveWheel?: CustomWheelConfig;
  customPenaltyWheel?: CustomWheelConfig;
  onOpenSettings?: () => void;
}

const POSITIVE_REWARDS: WheelReward[] = [
  { id: 1, label: '+100 XP', icon: '⭐', color: '#6C3FE8', type: 'xp', value: 100 },
  { id: 2, label: '+1 Coin 🪙', icon: '🪙', color: '#F59E0B', type: 'coins', value: 1 },
  { id: 3, label: 'Streak Freeze', icon: '❄️', color: '#38BDF8', type: 'streak_freeze', value: 1 },
  { id: 4, label: '+250 XP Boost', icon: '⚡', color: '#10B981', type: 'xp', value: 250 },
  { id: 5, label: '+2 Coins 🪙', icon: '🪙', color: '#EC4899', type: 'coins', value: 2 },
  { id: 6, label: 'Super Spark', icon: '🔥', color: '#8B5CF6', type: 'xp', value: 50 },
  { id: 7, label: '+50 XP', icon: '✨', color: '#3B82F6', type: 'xp', value: 50 },
  { id: 8, label: 'Mystery Gift', icon: '🎁', color: '#F43F5E', type: 'xp', value: 150 },
];

const PENALTY_ITEMS = [
  { id: 1, label: '10 Pushups Now', icon: '💪', color: '#EF4444' },
  { id: 2, label: 'No Social Media 2h', icon: '📵', color: '#F97316' },
  { id: 3, label: 'Drink 500ml Water', icon: '💧', color: '#06B6D4' },
  { id: 4, label: 'Cold Water Splash', icon: '❄️', color: '#3B82F6' },
  { id: 5, label: 'Read 10 Book Pages', icon: '📖', color: '#8B5CF6' },
  { id: 6, label: 'No Sugar Today', icon: '🚫', color: '#EC4899' },
  { id: 7, label: '1-Min Cold Shower', icon: '🚿', color: '#6366F1' },
  { id: 8, label: 'Clean Your Desk', icon: '🧹', color: '#10B981' },
];

export const DailyWheelScreen: React.FC<DailyWheelScreenProps> = ({
  onSpinReward,
  onEarnCoins,
  userCoins,
  onBack,
  customPositiveWheel,
  customPenaltyWheel,
  onOpenSettings,
}) => {
  const [wheelMode, setWheelMode] = useState<'positive' | 'penalty'>('positive');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [resultItem, setResultItem] = useState<any | null>(null);
  const [showBonusAdModal, setShowBonusAdModal] = useState<boolean>(false);
  const [adWatchedCount, setAdWatchedCount] = useState<number>(0);

  const positiveTriangles = customPositiveWheel?.triangles?.length
    ? customPositiveWheel.triangles
    : POSITIVE_REWARDS;

  const penaltyTriangles = customPenaltyWheel?.triangles?.length
    ? customPenaltyWheel.triangles
    : PENALTY_ITEMS;

  const items = wheelMode === 'positive' ? positiveTriangles : penaltyTriangles;
  const numSlices = items.length;
  const sliceAngle = 360 / numSlices;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResultItem(null);

    soundManager.playWheelTick();

    const selectedIdx = Math.floor(Math.random() * numSlices);
    // Add multiple full 360 rotations plus target offset
    const extraRotations = 5 * 360;
    const targetOffset = 360 - selectedIdx * sliceAngle - sliceAngle / 2;
    const newRotation = rotation + extraRotations + targetOffset;

    setRotation(newRotation);

    // Audio tick loop
    const tickInterval = setInterval(() => {
      soundManager.playWheelTick();
    }, 180);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      const selected = items[selectedIdx];
      setResultItem(selected);

      if (wheelMode === 'positive') {
        soundManager.playCelebration();
        const positiveReward = selected as WheelReward;
        onSpinReward(positiveReward);
        if (positiveReward.type === 'coins') {
          onEarnCoins(Number(positiveReward.value) || 1);
        }
      } else {
        soundManager.playSuccess();
      }
    }, 3200);
  };

  const handleWatchBonusAd = () => {
    soundManager.playSuccess();
    onEarnCoins(1);
    setAdWatchedCount((c) => c + 1);
    setShowBonusAdModal(false);
  };

  const handleAttemptBack = () => {
    if (adWatchedCount === 0 && !showBonusAdModal) {
      setShowBonusAdModal(true);
    } else {
      onBack();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-2 px-3 sm:px-4 animate-fadeIn relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handleAttemptBack}
          className="p-2.5 rounded-2xl bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#F6F2FF] transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-[#17142B] dark:text-white">
          {wheelMode === 'positive' ? 'Daily Lucky Wheel' : 'Discipline Penalty Wheel'}
        </h1>

        <div className="flex items-center gap-1.5">
          {/* Settings Button ahead/beside coins */}
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-[#251F4E] border border-purple-200/80 dark:border-[#382F66] text-purple-700 dark:text-purple-300 transition-colors shadow-2xs cursor-pointer"
              title="Wheel Settings & Triangles Setup"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF9E6] dark:bg-[#2A2412] text-amber-600 dark:text-amber-300 rounded-2xl text-xs font-bold border border-amber-200 dark:border-amber-800/50 shadow-xs">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>{userCoins}</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Pills */}
      <div className="flex items-center justify-center p-1 bg-[#F2ECFD] dark:bg-[#241F48] rounded-2xl mb-5 max-w-xs mx-auto border border-[#E5DBFB] dark:border-[#362E67]">
        <button
          type="button"
          onClick={() => {
            if (!isSpinning) setWheelMode('positive');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            wheelMode === 'positive'
              ? 'bg-[#6C3FE8] text-white shadow-sm'
              : 'text-[#696187] dark:text-[#B3A9D6]'
          }`}
        >
          <span>🎡 Positive Wheel</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isSpinning) setWheelMode('penalty');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            wheelMode === 'penalty'
              ? 'bg-[#F43F5E] text-white shadow-sm'
              : 'text-[#696187] dark:text-[#B3A9D6]'
          }`}
        >
          <span>⚡ Penalty Wheel</span>
        </button>
      </div>

      {/* Wheel Stage Container */}
      <div className="bg-white dark:bg-[#1E1A3D] border border-[#E9E1FC] dark:border-[#352F63] rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden mb-6">
        {/* Pointer Arrow */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-[#F59E0B] drop-shadow-md" />

        {/* The Rotating Wheel */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-3">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-lg transition-transform"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 3.2s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
            }}
          >
            {items.map((item, idx) => {
              const startAngle = (idx * sliceAngle * Math.PI) / 180;
              const endAngle = ((idx + 1) * sliceAngle * Math.PI) / 180;
              const x1 = 100 + 95 * Math.cos(startAngle);
              const y1 = 100 + 95 * Math.sin(startAngle);
              const x2 = 100 + 95 * Math.cos(endAngle);
              const y2 = 100 + 95 * Math.sin(endAngle);

              const path = `M 100 100 L ${x1} ${y1} A 95 95 0 0 1 ${x2} ${y2} Z`;
              const midAngle = ((idx + 0.5) * sliceAngle * Math.PI) / 180;
              const textX = 100 + 62 * Math.cos(midAngle);
              const textY = 100 + 62 * Math.sin(midAngle);
              const rotationDeg = (idx + 0.5) * sliceAngle + 90;

              return (
                <g key={item.id}>
                  <path d={path} fill={item.color} stroke="#FFFFFF" strokeWidth="1.5" />
                  <g transform={`rotate(${rotationDeg}, ${textX}, ${textY})`}>
                    <text
                      x={textX}
                      y={textY}
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {item.icon} {item.label.length > 12 ? item.label.slice(0, 10) + '..' : item.label}
                    </text>
                  </g>
                </g>
              );
            })}
            {/* Center Cap */}
            <circle cx="100" cy="100" r="22" fill="#FFFFFF" stroke="#6C3FE8" strokeWidth="4" />
            <circle cx="100" cy="100" r="14" fill="#6C3FE8" />
          </svg>
        </div>

        {/* Spin Button */}
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          className={`w-full max-w-xs py-4 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isSpinning
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : wheelMode === 'positive'
              ? 'bg-gradient-to-r from-[#6C3FE8] to-[#8F67F5] text-white shadow-[#6C3FE8]/30 hover:scale-[1.02]'
              : 'bg-gradient-to-r from-[#F43F5E] to-[#FB7185] text-white shadow-[#F43F5E]/30 hover:scale-[1.02]'
          }`}
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>{isSpinning ? 'Spinning...' : 'Spin the Wheel!'}</span>
        </button>

        {/* Result Callout */}
        {resultItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-5 p-4 rounded-2xl bg-[#FAF7FF] dark:bg-[#251F4A] border-2 border-[#6C3FE8] text-center w-full max-w-xs"
          >
            <span className="text-2xl">{resultItem.icon}</span>
            <h3 className="text-base font-bold text-[#17142B] dark:text-white mt-1">
              {wheelMode === 'positive' ? 'You Won:' : 'Discipline Challenge:'}
            </h3>
            <p className="text-sm font-semibold text-[#6C3FE8] dark:text-[#C4B5FD] mt-0.5">
              {resultItem.label}
            </p>
          </motion.div>
        )}
      </div>

      {/* Bonus Spin Button trigger */}
      <button
        type="button"
        onClick={() => setShowBonusAdModal(true)}
        className="w-full py-3 bg-[#FFF8E6] dark:bg-[#2A2312] border border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-amber-100 transition-colors"
      >
        <span>🎁 Watch short ad for Bonus Spin (+1 🪙)</span>
      </button>

      {/* ================= SCREEN 5 BONUS SPIN MODAL ================= */}
      <AnimatePresence>
        {showBonusAdModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-white dark:bg-[#1E1A3D] rounded-3xl p-6 text-center shadow-2xl border border-[#E9E1FC] dark:border-[#352F63] relative"
            >
              {/* Question Icon Circle */}
              <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-950/60 text-amber-500 rounded-full flex items-center justify-center text-3xl font-extrabold shadow-inner mb-4">
                ?
              </div>

              <h2 className="text-xl font-bold text-[#17142B] dark:text-white mb-2">
                Bonus Spin!
              </h2>
              <p className="text-xs sm:text-sm text-[#6E678D] dark:text-[#B3A9D6] leading-relaxed mb-6">
                Watch a short ad for one more spin of the wheel and earn +1 bonus coin!
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowBonusAdModal(false);
                    onBack();
                  }}
                  className="flex-1 py-3 bg-[#F2ECFD] dark:bg-[#2A2454] text-[#6C3FE8] dark:text-[#C4B5FD] text-xs font-bold rounded-2xl hover:bg-[#E7DCFA] transition-colors cursor-pointer"
                >
                  No thanks
                </button>
                <button
                  type="button"
                  onClick={handleWatchBonusAd}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-2xl shadow-md shadow-amber-500/25 flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch Ad</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
