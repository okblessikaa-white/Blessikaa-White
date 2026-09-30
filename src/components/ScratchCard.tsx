import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Gift, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface ScratchCardReward {
  icon?: string;
  title: string;
  description: string;
  xp?: number;
}

interface ScratchCardProps {
  onReveal?: (reward: ScratchCardReward) => void;
  reward?: ScratchCardReward;
  isRevealed?: boolean;
  size?: 'small' | 'medium' | 'large';
  theme?: 'dark' | 'light';
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  onReveal,
  reward,
  isRevealed = false,
  size = 'medium',
  theme = 'dark',
}) => {
  const [scratchProgress, setScratchProgress] = useState(0);
  const [revealed, setRevealed] = useState(isRevealed);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const defaultReward: ScratchCardReward = {
    icon: '🎁',
    title: "Today's Mission Unlocked",
    description: 'Complete today’s action tasks for +100 XP',
    xp: 100,
  };

  const rewardData = reward || defaultReward;

  useEffect(() => {
    setRevealed(isRevealed);
    if (!isRevealed) {
      initCanvas();
    }
  }, [isRevealed, reward]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sizes = {
      small: { width: 280, height: 160 },
      medium: { width: 340, height: 210 },
      large: { width: 420, height: 260 },
    };
    const { width, height } = sizes[size] || sizes.medium;
    canvas.width = width;
    canvas.height = height;

    // Background gradient for scratch layer
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    if (theme === 'light') {
      gradient.addColorStop(0, '#7c3aed');
      gradient.addColorStop(0.5, '#9333ea');
      gradient.addColorStop(1, '#6d28d9');
    } else {
      gradient.addColorStop(0, '#6d28d9');
      gradient.addColorStop(0.5, '#8b5cf6');
      gradient.addColorStop(1, '#4c1d95');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative speckled particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 3.5 + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Inner dashed border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(12, 12, width - 24, height - 24);
    ctx.setLineDash([]);

    // Scratch Prompt Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH TO REVEAL ✨', width / 2, height / 2 - 14);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Swipe or tap & drag to scratch', width / 2, height / 2 + 14);

    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
    ctx.fillText('⚡ +100 XP REWARD INSIDE', width / 2, height / 2 + 36);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startScratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (revealed) return;
    isDrawingRef.current = true;
    soundManager.playTick();
    triggerHaptic('light');
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const radius = 32;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Check transparency progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    const total = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 8) {
      // Step by 8 for high performance
      if (pixels[i] < 128) transparent++;
    }

    const progress = transparent / (total / 2);
    setScratchProgress(progress);

    if (progress > 0.35 && !revealed) {
      triggerReveal();
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || revealed) return;
    if ('touches' in e) {
      // prevent touch scroll while scratching
      if (e.cancelable) e.preventDefault();
    }
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  };

  const endScratch = () => {
    isDrawingRef.current = false;
  };

  const triggerReveal = () => {
    setRevealed(true);
    soundManager.playCelebration();
    triggerHaptic('success');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#a855f7', '#fb923c', '#f43f5e', '#fde047'],
    });
    onReveal?.(rewardData);
  };

  return (
    <div className="relative inline-block select-none overflow-hidden rounded-2xl shadow-xl">
      {/* Background Revealed Card Content */}
      <div
        className="w-full h-full min-h-[210px] p-6 rounded-3xl flex flex-col items-center justify-center text-center transition-all bg-gradient-to-br from-white via-purple-50/50 to-white text-slate-900 border-2 border-purple-200 shadow-lg"
      >
        <div className="text-5xl mb-2 animate-bounce">{rewardData.icon || '🎁'}</div>
        <h4 className="font-bold text-base sm:text-lg text-slate-900 mb-1">
          {rewardData.title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xs leading-relaxed">
          {rewardData.description}
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>+{rewardData.xp || 100} XP Unlocked</span>
        </div>
      </div>

      {/* Canvas Scratch Overlay */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-20 cursor-pointer touch-none rounded-2xl w-full h-full"
          onMouseDown={startScratch}
          onMouseMove={handleMove}
          onMouseUp={endScratch}
          onMouseLeave={endScratch}
          onTouchStart={startScratch}
          onTouchMove={handleMove}
          onTouchEnd={endScratch}
        />
      )}

      {/* Instant Reveal Fallback Button */}
      {!revealed && (
        <div className="absolute bottom-2.5 right-2.5 z-30">
          <button
            onClick={triggerReveal}
            className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-[10px] text-white/90 border border-white/20 transition-all"
          >
            Tap to Reveal
          </button>
        </div>
      )}

      {/* Scratch Progress Bar */}
      {!revealed && scratchProgress > 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-white/20 rounded-full overflow-hidden z-30 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-rose-400 rounded-full transition-all duration-100"
            style={{ width: `${Math.min(scratchProgress * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
