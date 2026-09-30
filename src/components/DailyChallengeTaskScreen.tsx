import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Coins,
  Share2,
  CheckCircle2,
  Sparkles,
  X,
  Play,
  Save,
  Check,
  Clock,
  Flame,
  Shield,
  Moon,
  Camera,
  Plus,
  Trash2,
  Calendar,
  Infinity as InfinityIcon,
  Settings,
} from 'lucide-react';
import { Challenge, DayLog, DayPlan, HabitGoalItem, UserChallengeProgress } from '../types';
import { HabitContinuationEngine } from '../utils/habitContinuationEngine';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface DailyChallengeTaskScreenProps {
  challenge: Challenge;
  day: number;
  progress: UserChallengeProgress;
  userCoins: number;
  onCompleteDay: (day: number, log: DayLog) => void;
  onUpdateReflection: (day: number, note: string) => void;
  onEarnCoins: (amount: number) => void;
  onBack: () => void;
  onOpenSettings?: () => void;
  onNavigateDay?: (targetDay: number) => void;
}

export const DailyChallengeTaskScreen: React.FC<DailyChallengeTaskScreenProps> = ({
  challenge,
  day,
  progress,
  userCoins,
  onCompleteDay,
  onUpdateReflection,
  onEarnCoins,
  onBack,
  onOpenSettings,
  onNavigateDay,
}) => {
  const isHabitMode = progress.status === 'habit_mode' || day > 21;
  const currentLog = progress.dayLogs[day] || {
    completed: false,
    completedTasks: [],
  };

  const dayPlan: DayPlan = HabitContinuationEngine.getDayPlan(challenge, day);

  const [isScratched, setIsScratched] = useState<boolean>(
    Boolean(currentLog.scratched || currentLog.completed)
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(currentLog.completed);
  const [showReflectionModal, setShowReflectionModal] = useState<boolean>(false);
  const [reflectionText, setReflectionText] = useState<string>(currentLog.reflectionNote || '');
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [scratchPercent, setScratchPercent] = useState<number>(0);
  const [showCopied, setShowCopied] = useState<boolean>(false);

  // Habit Mode Interactive Checklist
  const [checkedTasks, setCheckedTasks] = useState<string[]>(
    currentLog.completedTasks && currentLog.completedTasks.length > 0
      ? currentLog.completedTasks
      : []
  );

  const [customGoals, setCustomGoals] = useState<HabitGoalItem[]>(
    currentLog.customGoals || [
      { id: 'g1', text: 'Warm-up & Mental Alignment', completed: checkedTasks.includes('g1') },
      { id: 'g2', text: dayPlan.tasks[0] || 'Core Habit Practice', completed: checkedTasks.includes('g2') },
      { id: 'g3', text: 'Cool-down & Gratitude Reflection', completed: checkedTasks.includes('g3') },
    ]
  );

  const [newGoalInput, setNewGoalInput] = useState('');
  const [timeSpent, setTimeSpent] = useState<number>(
    currentLog.timeSpentMinutes || dayPlan.estimatedMinutes || 20
  );
  const [selectedMood, setSelectedMood] = useState<string>(
    currentLog.mood || '🔥 Unstoppable'
  );
  const [photoUploaded, setPhotoUploaded] = useState<boolean>(!!currentLog.photoUrl);
  const [photoPreview, setPhotoPreview] = useState<string | null>(currentLog.photoUrl || null);
  const [showMoodPopup, setShowMoodPopup] = useState<boolean>(!currentLog.completed);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  const MOODS = ['🔥 Unstoppable', '⚡ Energized', '🌱 Steady', '🧘 Calm', '💪 Challenged'];

  // Automatically show mood & energy popup when day box is clicked if not completed
  useEffect(() => {
    if (!currentLog.completed) {
      setShowMoodPopup(true);
    }
  }, [day, currentLog.completed]);

  // Initialize Canvas Scratch Surface for Days 1 to Infinity (1-21 Foundation, 22+ Habit Continuum)
  useEffect(() => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw scratchable overlay gradient:
    // Days 1-21: Classic silver purple / lavender gradient
    // Days 22+: Iridescent cosmic gradient (Deep Violet -> Indigo -> Emerald / Gold)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    if (day <= 21) {
      gradient.addColorStop(0, '#C4B5FD');
      gradient.addColorStop(0.5, '#A78BFA');
      gradient.addColorStop(1, '#8B5CF6');
    } else {
      gradient.addColorStop(0, '#8B5CF6');
      gradient.addColorStop(0.4, '#6366F1');
      gradient.addColorStop(0.8, '#10B981');
      gradient.addColorStop(1, '#F59E0B');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add playful dots / cosmic stars pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    for (let x = 15; x < width; x += 28) {
      for (let y = 15; y < height; y += 28) {
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Add instructional text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const scratchPrompt = day <= 21
      ? `✨ Scratch Day ${day} Challenge ✨`
      : `♾️ Scratch Day ${day} Habit Focus ♾️`;
    ctx.fillText(scratchPrompt, width / 2, height / 2);
  }, [isScratched, day]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    soundManager.playTick();

    setScratchPercent((prev) => {
      const next = prev + 3;
      if (next >= 40 && !isScratched) {
        revealFullScratch();
      }
      return next;
    });
  };

  const revealFullScratch = () => {
    setIsScratched(true);
    soundManager.playStreakChime();
    triggerHaptic('medium');
    const existing = progress.dayLogs[day] || {
      completed: false,
      completedTasks: [],
    };
    onCompleteDay(day, {
      ...existing,
      scratched: true,
    });
  };

  const handleToggleGoal = (id: string) => {
    soundManager.playTick();
    triggerHaptic('light');
    const updated = customGoals.map((g) =>
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    setCustomGoals(updated);
    const completedIds = updated.filter((g) => g.completed).map((g) => g.text);
    setCheckedTasks(completedIds);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    const newGoal: HabitGoalItem = {
      id: `custom_${Date.now()}`,
      text: newGoalInput.trim(),
      completed: false,
    };
    setCustomGoals([...customGoals, newGoal]);
    setNewGoalInput('');
    soundManager.playTick();
  };

  const handleRemoveGoal = (id: string) => {
    soundManager.playTick();
    setCustomGoals(customGoals.filter((g) => g.id !== id));
  };

  const handleCompleteAction = () => {
    soundManager.playCelebration();
    triggerHaptic('success');
    setIsCompleted(true);

    const completedTexts = customGoals.filter((g) => g.completed).map((g) => g.text);
    if (completedTexts.length === 0) {
      completedTexts.push(dayPlan.tasks[0]);
    }

    const updatedLog: DayLog = {
      completed: true,
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      completedTasks: completedTexts,
      reflectionNote: reflectionText,
      scratched: true,
      timeSpentMinutes: timeSpent,
      mood: selectedMood,
      customGoals,
      photoUrl: photoPreview || undefined,
    };

    onCompleteDay(day, updatedLog);
    setShowRewardModal(true);
  };

  const handleMarkRestDay = () => {
    soundManager.playSuccess();
    triggerHaptic('medium');
    const updatedLog: DayLog = {
      completed: false,
      isRestDay: true,
      status: 'REST_DAY',
      completedAt: new Date().toISOString(),
      completedTasks: ['Rest & Neural Consolidation'],
      reflectionNote: reflectionText || 'Planned restorative rest day.',
      scratched: true,
      timeSpentMinutes: 0,
      mood: '🧘 Calm',
    };
    onCompleteDay(day, updatedLog);
    onBack();
  };

  const handleSaveReflection = () => {
    soundManager.playSuccess();
    onUpdateReflection(day, reflectionText);
    setShowReflectionModal(false);
  };

  const handleShare = () => {
    const shareText = isHabitMode
      ? `🌱 Habit Mode: Day ${day} of "${challenge.title}"! 🔥 Streak: ${progress.streak} days with BLESSIKAA Habit Engine!`
      : `Day ${day} of "${challenge.title}" in Blessikaa: "${dayPlan.tasks[0]}" ✨ #Blessikaa #21DayChallenge`;

    if (navigator.share) {
      navigator.share({
        title: `Blessikaa - Day ${day}`,
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const handleClaimReward = (multiplier: number = 1) => {
    const earned = 1 * multiplier;
    onEarnCoins(earned);
    soundManager.playCelebration();
    setShowRewardModal(false);
    if (onNavigateDay) {
      onNavigateDay(day + 1);
    } else {
      onBack();
    }
  };

  const handlePhotoUploadSimulation = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
        setPhotoUploaded(true);
        soundManager.playSuccess();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-2 px-3 sm:px-4 animate-fadeIn relative pb-24">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2.5 rounded-2xl bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#F6F2FF] transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            {isHabitMode && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-200 dark:border-purple-800">
                <InfinityIcon className="w-3 h-3" />
                <span>Habit Continuum</span>
              </span>
            )}
          </div>
          <div className="flex items-center justify-center gap-1.5">
            {onNavigateDay && day > 1 && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  onNavigateDay(day - 1);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={`Previous: Day ${day - 1}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-lg sm:text-xl font-bold text-[#17142B] dark:text-white">
              Day {day} {isHabitMode ? 'of ∞' : 'of 21'}
            </h1>
            {onNavigateDay && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  onNavigateDay(day + 1);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={`Next: Day ${day + 1}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reflection Pen Button */}
          <button
            type="button"
            onClick={() => setShowReflectionModal(true)}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#F6F2FF] transition-all cursor-pointer shadow-xs relative"
            title="Add Reflection Note"
          >
            <Edit3 className="w-4 h-4" />
            {reflectionText.trim().length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            )}
          </button>

          {/* Settings Button - ahead or beside coins */}
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2.5 rounded-2xl bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#F6F2FF] transition-all cursor-pointer shadow-xs"
              title="Settings & Wheel Customizer"
            >
              <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </button>
          )}

          {/* Coins Counter */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#FFF9E6] dark:bg-[#2A2412] hover:bg-[#FFF3CD] text-amber-600 dark:text-amber-300 rounded-2xl text-xs font-bold border border-amber-200 dark:border-amber-800/50 shadow-xs cursor-pointer transition-all active:scale-95"
            title="Blessikaa Coins - Tap to open Wheel Customizer in Settings"
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>{userCoins}</span>
          </button>
        </div>
      </div>

      {/* Challenge Title Banner */}
      <div className="text-center mb-3">
        <p className="text-xs font-semibold text-[#8B5CF6] dark:text-[#C4B5FD] uppercase tracking-wider">
          {challenge.title}
        </p>
        <h2 className="text-base sm:text-lg font-bold text-[#17142B] dark:text-white mt-0.5">
          {isScratched ? dayPlan.title : `Scratch to see Day ${day} ${day > 21 ? 'habit focus' : 'challenge'}`}
        </h2>
      </div>

      {/* Main Task / Scratch Area for All Days (1 to Infinity) */}
      <div className="relative w-full aspect-[16/10] max-h-[210px] bg-white dark:bg-[#1E1A3D] border-2 border-[#E9E1FC] dark:border-[#352F63] rounded-2xl p-4 shadow-xs overflow-hidden flex flex-col items-center justify-center text-center mb-2.5">
        {/* Revealed Task Content */}
        <div className="p-3 flex flex-col items-center justify-center w-full">
          {day <= 21 ? (
            <>
              <div className="w-10 h-10 rounded-xl bg-[#EDE7F6] dark:bg-[#2F295B] text-[#6C3FE8] dark:text-[#C4B5FD] flex items-center justify-center text-xl mb-2 shadow-inner">
                🎯
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#17142B] dark:text-white mb-1 leading-snug">
                {dayPlan.tasks[0]}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#756E92] dark:text-[#B1A8D4] leading-relaxed max-w-xs">
                {dayPlan.tip}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between w-full mb-1.5 px-1">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <InfinityIcon className="w-3.5 h-3.5" />
                  <span>Day {day} Continuum</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-[#282154] text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                  ⏱️ {timeSpent} Mins
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#17142B] dark:text-white mb-1 leading-snug">
                {dayPlan.tasks[0]}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#756E92] dark:text-[#B1A8D4] leading-relaxed max-w-xs">
                💡 {dayPlan.psychologyTip || dayPlan.tip}
              </p>
            </>
          )}
        </div>

        {/* Canvas Scratch Overlay */}
        {!isScratched && (
          <canvas
            ref={canvasRef}
            width={380}
            height={210}
            onPointerDown={(e) => {
              isDrawingRef.current = true;
              scratch(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (!isDrawingRef.current) return;
              scratch(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              isDrawingRef.current = false;
            }}
            className="absolute inset-0 w-full h-full cursor-crosshair rounded-2xl touch-none"
          />
        )}
      </div>

      {/* Action Buttons: Skip Scratch, Share, and Rest Day moved right below scratch card */}
      <div className="flex items-center gap-2 mb-3">
        {!isScratched && (
          <button
            type="button"
            onClick={revealFullScratch}
            className="flex-1 py-2 px-3 bg-[#F2ECFD] dark:bg-[#2B2456] text-[#6C3FE8] dark:text-[#D8B4FE] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#E7DCFA] transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skip scratch</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleShare}
          className="flex-1 py-2 px-3 bg-white dark:bg-[#1E1A3D] border border-[#E9E1FC] dark:border-[#352F63] text-[#564E74] dark:text-[#C5BDE2] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#F8F5FF] transition-all cursor-pointer shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5 text-[#6C3FE8]" />
          <span>{showCopied ? 'Copied! ✨' : 'Share'}</span>
        </button>

        {isHabitMode && !isCompleted && (
          <button
            type="button"
            onClick={handleMarkRestDay}
            className="py-2 px-3 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-all cursor-pointer shadow-xs"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Rest Day</span>
          </button>
        )}
      </div>

      {/* Interactive Habit Checklist: Compact layout with scrollable tasks, time spent, and proof upload */}
      <div className="bg-white dark:bg-[#1E1A3D] border border-[#E9E1FC] dark:border-[#352F63] rounded-2xl p-3.5 sm:p-4 shadow-xs mb-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Today's Action Checklist</span>
          </h3>
          <div className="flex items-center gap-2">
            {/* Quick Mood & Time Chip to re-open popup anytime */}
            <button
              type="button"
              onClick={() => setShowMoodPopup(true)}
              className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
              title="Click to change mood or time"
            >
              <span>{selectedMood.split(' ')[0]}</span>
              <span>{timeSpent}m</span>
              <Edit3 className="w-2.5 h-2.5 opacity-60" />
            </button>
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-300">
              {customGoals.filter((g) => g.completed).length}/{customGoals.length} Done
            </span>
          </div>
        </div>

        {/* Scrollable Container within Action Checklist */}
        <div className="max-h-[220px] sm:max-h-[250px] overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
          {/* 1. Checklist Items with strictly uniform checkbox sizes */}
          <div className="space-y-1.5">
            {customGoals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => handleToggleGoal(goal.id)}
                className={`py-1.5 px-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                  goal.completed
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-[#FAF8FE] dark:bg-[#251F4E] border-[#EAE3FB] dark:border-[#383069] hover:bg-[#F3EEFC]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Fixed uniform checkbox size */}
                  <div
                    className={`w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] shrink-0 rounded-md border flex items-center justify-center transition-all ${
                      goal.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-purple-400'
                    }`}
                  >
                    {goal.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs font-medium leading-snug break-words ${
                      goal.completed
                        ? 'text-emerald-800 dark:text-emerald-300 line-through opacity-80'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {goal.text}
                  </span>
                </div>

                {goal.id.startsWith('custom_') && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveGoal(goal.id);
                    }}
                    className="text-slate-400 hover:text-rose-500 p-0.5 shrink-0 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add custom checklist step */}
          <form onSubmit={handleAddGoal} className="flex gap-1.5 pt-0.5">
            <input
              type="text"
              value={newGoalInput}
              onChange={(e) => setNewGoalInput(e.target.value)}
              placeholder="+ Add personal step..."
              className="flex-1 px-3 py-1.5 bg-[#FAF8FE] dark:bg-[#251F4E] border border-[#E9E1FC] dark:border-[#383069] rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200 rounded-xl text-xs font-bold hover:bg-purple-200 transition-colors cursor-pointer"
            >
              Add
            </button>
          </form>

          {/* Divider */}
          <div className="h-px bg-purple-100/70 dark:bg-purple-900/40 my-1" />

          {/* 2. Time Spent Section inside scrollable area */}
          <div className="pt-0.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Time Spent:</span>
              </span>
              <span className="text-purple-600 dark:text-purple-300 font-bold text-xs">
                {timeSpent} Mins
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[10, 15, 20, 30, 45].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setTimeSpent(mins);
                    soundManager.playTick();
                  }}
                  className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeSpent === mins
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 dark:bg-[#2A2355] text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-[#342C69]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-purple-100/70 dark:bg-purple-900/40 my-1" />

          {/* 3. Upload Proof Section inside scrollable area */}
          <div className="pt-0.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Upload Proof (Optional)</span>
              </span>
              {photoPreview && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Photo Attached
                </span>
              )}
            </div>

            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-purple-200 dark:border-purple-800 h-28 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <img src={photoPreview} alt="Daily Proof" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    setPhotoUploaded(false);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/65 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                  title="Remove proof photo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="border border-dashed border-purple-300 dark:border-purple-700/70 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50/40 dark:bg-[#251F4B]/40 hover:bg-purple-100/50 cursor-pointer transition-colors">
                <Camera className="w-3.5 h-3.5" />
                <span>Tap to upload proof photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUploadSimulation}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Day Completed Action Button */}
      <button
        type="button"
        onClick={handleCompleteAction}
        disabled={isCompleted}
        className={`w-full py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isCompleted
            ? 'bg-emerald-500 text-white shadow-emerald-500/25 cursor-default'
            : 'bg-gradient-to-r from-[#6C3FE8] to-[#8F67F5] text-white shadow-[#6C3FE8]/30 hover:scale-[1.01]'
        }`}
      >
        <CheckCircle2 className="w-5 h-5" />
        <span>{isCompleted ? `Day ${day} Completed! 🎉` : `COMPLETE DAY ${day}`}</span>
      </button>

      {/* Advance to Next Day Button when completed */}
      {isCompleted && onNavigateDay && (
        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('light');
            onNavigateDay(day + 1);
          }}
          className="w-full mt-3 py-3.5 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
        >
          <span>Advance to Day {day + 1}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Mood & Energy Popup Modal */}
      <AnimatePresence>
        {showMoodPopup && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="w-full max-w-sm bg-white dark:bg-[#1E1A3D] rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#E9E1FC] dark:border-[#352F63] relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowMoodPopup(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EDE7F6] dark:bg-[#2F295B] text-[#6C3FE8] dark:text-[#C4B5FD] flex items-center justify-center text-2xl mb-2 shadow-inner">
                  ✨
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#17142B] dark:text-white">
                  Today's Mood & Energy
                </h3>
                <p className="text-xs text-[#756E92] dark:text-[#B1A8D4] mt-0.5">
                  How are you feeling for Day {day}? Choose your vibe and time:
                </p>
              </div>

              {/* Moods Selection */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Choose Your Mood & Energy</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {MOODS.map((m) => {
                    const isSelected = selectedMood === m;
                    const emoji = m.split(' ')[0];
                    const label = m.split(' ')[1];
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setSelectedMood(m);
                          soundManager.playTick();
                          triggerHaptic('light');
                        }}
                        className={`p-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 scale-105 ring-2 ring-purple-300'
                            : 'bg-[#F9F7FD] dark:bg-[#262050] text-slate-600 dark:text-slate-300 hover:bg-[#F2ECFD]'
                        }`}
                      >
                        <span className="text-lg">{emoji}</span>
                        <span className="text-[9px] font-bold truncate max-w-full">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Wants to Spend */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Time You Want to Spend:</span>
                  </span>
                  <span className="text-purple-600 dark:text-purple-300 font-bold text-xs">{timeSpent} Mins</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[10, 15, 20, 30, 45].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        setTimeSpent(mins);
                        soundManager.playTick();
                      }}
                      className={`py-2 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                        timeSpent === mins
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-[#F2ECFD] dark:bg-[#2A2454] text-purple-700 dark:text-purple-300 hover:bg-purple-100'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playSuccess();
                  triggerHaptic('medium');
                  setShowMoodPopup(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-[#6C3FE8] to-[#8F67F5] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirm & Begin Day {day}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reflection Note Modal */}
      <AnimatePresence>
        {showReflectionModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-sm bg-white dark:bg-[#1E1A3D] rounded-3xl p-6 shadow-2xl border border-[#E9E1FC] dark:border-[#352F63] relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#17142B] dark:text-white">
                  Day {day} Reflection Note ✏️
                </h3>
                <button
                  type="button"
                  onClick={() => setShowReflectionModal(false)}
                  className="p-1 text-[#837B9F] hover:text-[#17142B] dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="How did today's session feel? Any breakthroughs or insights?"
                rows={4}
                className="w-full p-3.5 bg-[#F9F7FD] dark:bg-[#251F4B] border border-[#E5DEFA] dark:border-[#38316B] rounded-2xl text-xs sm:text-sm text-[#17142B] dark:text-white placeholder-[#8F88A6]/60 focus:outline-hidden focus:border-[#6C3FE8] mb-4 resize-none"
              />

              <button
                type="button"
                onClick={handleSaveReflection}
                className="w-full py-3 bg-[#6C3FE8] hover:bg-[#5C32D4] text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Reflection</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Completion Reward Modal */}
      <AnimatePresence>
        {showRewardModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              className="w-full max-w-sm bg-white dark:bg-[#1E1A3D] rounded-3xl p-6 text-center shadow-2xl border border-[#E9E1FC] dark:border-[#352F63] relative"
            >
              <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center text-3xl shadow-inner mb-3">
                🎉
              </div>

              <h2 className="text-xl font-bold text-[#17142B] dark:text-white">
                Day {day} Conquered!
              </h2>
              <p className="text-xs sm:text-sm text-[#6C658B] dark:text-[#B2A8D6] mt-1 mb-5">
                +100 XP gained! You have reinforced your continuous momentum in "{challenge.title}".
              </p>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleClaimReward(3)}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-2xl shadow-md shadow-amber-500/25 flex items-center justify-center gap-1.5 hover:scale-[1.01] transition-transform cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Short Ad (+3 🪙) & Advance to Day {day + 1}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleClaimReward(1)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-600/20 hover:scale-[1.01] transition-transform cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Claim +1 🪙 and Continue to Day {day + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setShowRewardModal(false);
                    onBack();
                  }}
                  className="w-full py-2.5 bg-slate-100 dark:bg-[#2A2454] text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-[#342D69] transition-colors cursor-pointer"
                >
                  Return to Pathway Map
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
