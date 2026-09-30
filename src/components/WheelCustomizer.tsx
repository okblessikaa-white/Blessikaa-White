import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  RotateCcw,
  Play,
  Check,
  Plus,
  Minus,
  Palette,
  Trophy,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AppSettings, CustomWheelConfig, WheelTriangleItem } from '../types';
import {
  DEFAULT_PENALTY_WHEEL_CONFIG,
  DEFAULT_POSITIVE_WHEEL_CONFIG,
  POPULAR_WHEEL_ICONS,
  WHEEL_COLOR_PALETTE,
  buildAdjustedWheelTriangles,
} from '../utils/wheelDefaults';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface WheelCustomizerProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const WheelCustomizer: React.FC<WheelCustomizerProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [activeWheelType, setActiveWheelType] = useState<'positive' | 'penalty'>('positive');
  const [expandedTriangleId, setExpandedTriangleId] = useState<number | null>(1);
  const [testSpinning, setTestSpinning] = useState<boolean>(false);
  const [testRotation, setTestRotation] = useState<number>(0);
  const [testResult, setTestResult] = useState<WheelTriangleItem | null>(null);

  // Get current active wheel configuration
  const currentConfig: CustomWheelConfig =
    activeWheelType === 'positive'
      ? settings.customPositiveWheel || DEFAULT_POSITIVE_WHEEL_CONFIG
      : settings.customPenaltyWheel || DEFAULT_PENALTY_WHEEL_CONFIG;

  const triangles = currentConfig.triangles || [];
  const segmentCount = currentConfig.segmentCount || triangles.length || 8;
  const sliceAngle = 360 / Math.max(1, triangles.length);

  const handleUpdateConfig = (newConfig: CustomWheelConfig) => {
    if (activeWheelType === 'positive') {
      onUpdateSettings({
        ...settings,
        customPositiveWheel: newConfig,
      });
    } else {
      onUpdateSettings({
        ...settings,
        customPenaltyWheel: newConfig,
      });
    }
  };

  const handleSegmentCountChange = (newCount: number) => {
    const clamped = Math.max(4, Math.min(12, newCount));
    soundManager.playTick();
    triggerHaptic('light');

    const updatedTriangles = buildAdjustedWheelTriangles(
      activeWheelType,
      clamped,
      triangles
    );

    handleUpdateConfig({
      segmentCount: clamped,
      triangles: updatedTriangles,
    });
  };

  const handleUpdateTriangle = (id: number, updates: Partial<WheelTriangleItem>) => {
    const updated = triangles.map((t) => (t.id === id ? { ...t, ...updates } : t));
    handleUpdateConfig({
      ...currentConfig,
      triangles: updated,
    });
  };

  const handleResetToDefaults = () => {
    soundManager.playSuccess();
    triggerHaptic('medium');
    if (activeWheelType === 'positive') {
      handleUpdateConfig(DEFAULT_POSITIVE_WHEEL_CONFIG);
    } else {
      handleUpdateConfig(DEFAULT_PENALTY_WHEEL_CONFIG);
    }
    setTestResult(null);
  };

  const handleTestSpin = () => {
    if (testSpinning || triangles.length === 0) return;
    setTestSpinning(true);
    setTestResult(null);
    soundManager.playWheelTick();
    triggerHaptic('medium');

    const selectedIdx = Math.floor(Math.random() * triangles.length);
    const extraRotations = 4 * 360;
    const targetOffset = 360 - selectedIdx * sliceAngle - sliceAngle / 2;
    const newRotation = testRotation + extraRotations + targetOffset;

    setTestRotation(newRotation);

    const interval = setInterval(() => {
      soundManager.playWheelTick();
    }, 180);

    setTimeout(() => {
      clearInterval(interval);
      setTestSpinning(false);
      const landed = triangles[selectedIdx];
      setTestResult(landed);
      soundManager.playCelebration();
      triggerHaptic('success');
    }, 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Description */}
      <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 dark:text-purple-200">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Positive & Penalty Wheel Customizer</span>
          </div>
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-[#1E1A3D] text-[11px] font-semibold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 transition-all cursor-pointer shadow-2xs"
            title="Reset this wheel to original presets"
          >
            <RotateCcw className="w-3 h-3 text-purple-600" />
            <span>Reset</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
          Configure the exact number of triangles (slices) on your wheels, edit custom text, assign icons, and choose slice colors.
        </p>
      </div>

      {/* Wheel Type Switcher */}
      <div className="flex items-center p-1 bg-purple-100/60 dark:bg-[#251F4E] rounded-2xl border border-purple-200/70 dark:border-[#382F66]">
        <button
          type="button"
          onClick={() => {
            setActiveWheelType('positive');
            soundManager.playTick();
            setTestResult(null);
            setExpandedTriangleId(1);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeWheelType === 'positive'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-purple-800 dark:text-purple-300 hover:bg-purple-50/50'
          }`}
        >
          <span>🎡 Positive Lucky Wheel</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveWheelType('penalty');
            soundManager.playTick();
            setTestResult(null);
            setExpandedTriangleId(1);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeWheelType === 'penalty'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-700 dark:text-rose-300 hover:bg-rose-50/50'
          }`}
        >
          <span>⚡ Discipline Penalty Wheel</span>
        </button>
      </div>

      {/* Triangles (Slices) Count Selector */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1A3D] border border-purple-100 dark:border-[#352F63] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>📐 Number of Triangles in Wheel</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Choose from 4 to 12 triangles (slices) on this wheel.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={segmentCount <= 4}
              onClick={() => handleSegmentCountChange(segmentCount - 1)}
              className="p-1.5 rounded-lg bg-purple-50 dark:bg-[#2A2353] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 disabled:opacity-40 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-black text-purple-900 dark:text-purple-100">
              {segmentCount}
            </span>
            <button
              type="button"
              disabled={segmentCount >= 12}
              onClick={() => handleSegmentCountChange(segmentCount + 1)}
              className="p-1.5 rounded-lg bg-purple-50 dark:bg-[#2A2353] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 disabled:opacity-40 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Count Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[4, 5, 6, 7, 8, 9, 10, 12].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleSegmentCountChange(num)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                segmentCount === num
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-purple-50 dark:bg-[#251F4E] text-purple-700 dark:text-purple-300 hover:bg-purple-100 border border-purple-100 dark:border-purple-900/50'
              }`}
            >
              {num} Triangles
            </button>
          ))}
        </div>
      </div>

      {/* Live Interactive Wheel Preview & Test Spin */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-purple-50/70 to-white dark:from-[#251F4E] dark:to-[#1E1A3D] border border-purple-100 dark:border-[#382F66] shadow-xs flex flex-col items-center justify-center relative overflow-hidden">
        {/* Pointer Arrow */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-500 drop-shadow-md" />

        {/* SVG Wheel Preview */}
        <div className="relative w-52 h-52 sm:w-56 sm:h-56 my-2">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-md transition-transform"
            style={{
              transform: `rotate(${testRotation}deg)`,
              transition: testSpinning ? 'transform 3.0s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
            }}
          >
            {triangles.map((triangle, idx) => {
              const startAngle = (idx * sliceAngle * Math.PI) / 180;
              const endAngle = ((idx + 1) * sliceAngle * Math.PI) / 180;
              const x1 = 100 + 95 * Math.cos(startAngle);
              const y1 = 100 + 95 * Math.sin(startAngle);
              const x2 = 100 + 95 * Math.cos(endAngle);
              const y2 = 100 + 95 * Math.sin(endAngle);

              const path = `M 100 100 L ${x1} ${y1} A 95 95 0 0 1 ${x2} ${y2} Z`;
              const midAngle = ((idx + 0.5) * sliceAngle * Math.PI) / 180;
              const textX = 100 + 58 * Math.cos(midAngle);
              const textY = 100 + 58 * Math.sin(midAngle);
              const rotationDeg = (idx + 0.5) * sliceAngle + 90;

              return (
                <g key={triangle.id}>
                  <path
                    d={path}
                    fill={triangle.color}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  <g transform={`rotate(${rotationDeg}, ${textX}, ${textY})`}>
                    <text
                      x={textX}
                      y={textY}
                      fill="#FFFFFF"
                      fontSize={segmentCount > 8 ? '8' : '9.5'}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {triangle.icon} {triangle.label.length > 10 ? triangle.label.slice(0, 9) + '..' : triangle.label}
                    </text>
                  </g>
                </g>
              );
            })}
            {/* Center Star Hub */}
            <circle cx="100" cy="100" r="20" fill="#FFFFFF" stroke="#6C3FE8" strokeWidth="3" />
            <circle cx="100" cy="100" r="14" fill="#6C3FE8" />
            <text x="100" y="101" fill="#FFFFFF" fontSize="10" textAnchor="middle" dominantBaseline="central">
              ✨
            </text>
          </svg>
        </div>

        {/* Test Spin Button */}
        <button
          type="button"
          onClick={handleTestSpin}
          disabled={testSpinning}
          className="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{testSpinning ? 'Spinning Wheel...' : 'Test Spin Wheel'}</span>
        </button>

        {testResult && (
          <div className="mt-2.5 p-2 px-3 rounded-xl bg-purple-100/80 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-700 text-center animate-fadeIn">
            <span className="text-[11px] font-bold text-purple-900 dark:text-purple-200">
              Landed on: <span className="text-purple-700 dark:text-purple-300">{testResult.icon} {testResult.label}</span>
            </span>
          </div>
        )}
      </div>

      {/* Triangles List Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>✨ Configure Triangles ({triangles.length})</span>
          </label>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            Tap slice to edit text, icon & color
          </span>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {triangles.map((triangle, idx) => {
            const isExpanded = expandedTriangleId === triangle.id;

            return (
              <div
                key={triangle.id}
                className="rounded-2xl border border-purple-100 dark:border-[#352F63] bg-white dark:bg-[#1E1A3D] overflow-hidden transition-all shadow-2xs"
              >
                {/* Header Row */}
                <button
                  type="button"
                  onClick={() => setExpandedTriangleId(isExpanded ? null : triangle.id)}
                  className="w-full p-3 flex items-center justify-between gap-2.5 text-left hover:bg-purple-50/40 dark:hover:bg-[#251F4E]/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: triangle.color }}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-sm shrink-0">{triangle.icon}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {triangle.label || `Triangle ${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-2xs shrink-0"
                      style={{ backgroundColor: triangle.color }}
                    />
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Customizer Form */}
                {isExpanded && (
                  <div className="p-3 pt-0 border-t border-purple-50 dark:border-[#2D2754] space-y-3 mt-1">
                    {/* Text Label Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Triangle Text / Label:
                      </label>
                      <input
                        type="text"
                        value={triangle.label}
                        onChange={(e) =>
                          handleUpdateTriangle(triangle.id, { label: e.target.value })
                        }
                        placeholder="e.g. +1 Coin or 10 Pushups"
                        className="w-full px-3 py-2 rounded-xl bg-purple-50/50 dark:bg-[#251F4E] border border-purple-200/80 dark:border-[#382F66] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Icon Selection */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Icon / Emoji:
                        </label>
                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                          Current: {triangle.icon}
                        </span>
                      </div>

                      {/* Quick Emoji Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {POPULAR_WHEEL_ICONS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              handleUpdateTriangle(triangle.id, { icon: emoji });
                              soundManager.playTick();
                            }}
                            className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer ${
                              triangle.icon === emoji
                                ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-110'
                                : 'bg-purple-50 dark:bg-[#251F4E] hover:bg-purple-100 dark:hover:bg-[#322967]'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Swatches */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Palette className="w-3 h-3 text-purple-600" />
                          <span>Slice Color:</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {WHEEL_COLOR_PALETTE.map((hex) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => {
                              handleUpdateTriangle(triangle.id, { color: hex });
                              soundManager.playTick();
                            }}
                            className={`w-6 h-6 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                              triangle.color === hex
                                ? 'ring-2 ring-purple-500 scale-115 shadow-sm'
                                : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: hex }}
                          >
                            {triangle.color === hex && (
                              <Check className="w-3 h-3 text-white stroke-[3]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reward Details for Positive Wheel */}
                    {activeWheelType === 'positive' && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                            Reward Type:
                          </label>
                          <select
                            value={triangle.type || 'xp'}
                            onChange={(e) =>
                              handleUpdateTriangle(triangle.id, {
                                type: e.target.value as any,
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-xl bg-purple-50/50 dark:bg-[#251F4E] border border-purple-200/80 dark:border-[#382F66] text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            <option value="coins">Coins 🪙</option>
                            <option value="xp">XP Points ⭐</option>
                            <option value="streak_freeze">Streak Freeze ❄️</option>
                            <option value="spin">Bonus Spin 🎁</option>
                            <option value="custom">Custom Perk ✨</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                            Reward Value:
                          </label>
                          <input
                            type="number"
                            value={Number(triangle.value) || 1}
                            onChange={(e) =>
                              handleUpdateTriangle(triangle.id, {
                                value: Number(e.target.value) || 1,
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-xl bg-purple-50/50 dark:bg-[#251F4E] border border-purple-200/80 dark:border-[#382F66] text-xs font-semibold text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
