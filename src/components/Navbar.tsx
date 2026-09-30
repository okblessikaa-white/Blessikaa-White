import React from 'react';
import { Bell, Volume2, VolumeX, Sparkles, Settings, User } from 'lucide-react';
import { Challenge, UserChallengeProgress } from '../types';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  activeChallenge: Challenge;
  challenges: Challenge[];
  onSelectChallenge: (id: string) => void;
  progress: UserChallengeProgress;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNotifications: () => void;
  onOpenCoach: () => void;
  onOpenSettings: () => void;
  unreadNotifsCount: number;
  userCoins?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeChallenge,
  challenges,
  onSelectChallenge,
  progress,
  soundEnabled,
  onToggleSound,
  onOpenNotifications,
  onOpenCoach,
  onOpenSettings,
  unreadNotifsCount,
  userCoins = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 border-b border-purple-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand: Blessikaa - Build a blessed life */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 p-0.5 shadow-md shadow-purple-500/15 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <span className="font-black text-sm tracking-tight bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                ✨
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent truncate">
                Blessikaa
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-purple-600/90 truncate leading-none">
              Build a blessed life
            </p>
          </div>
        </div>

        {/* Action Buttons: AI, Setting, Audio, Notifications */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AI Coach Action */}
          <button
            id="navbar-ai-btn"
            onClick={() => {
              onOpenCoach();
              soundManager.playTick();
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
            title="AI Coach & Daily Guidance"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" />
            <span className="text-xs font-bold">AI</span>
          </button>

          {/* Coins Display - ahead or besides settings */}
          <button
            id="navbar-coins-btn"
            type="button"
            onClick={() => {
              onOpenSettings();
              soundManager.playTick();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#FFF9E6] hover:bg-[#FFF3CD] text-amber-700 rounded-xl text-xs font-bold border border-amber-200 shadow-2xs transition-all cursor-pointer active:scale-95"
            title="Coins - Tap to open Settings & Wheel Customizer"
          >
            <span className="text-xs">🪙</span>
            <span>{userCoins}</span>
          </button>

          {/* Settings Button - right beside coins */}
          <button
            id="navbar-settings-btn"
            type="button"
            onClick={() => {
              onOpenSettings();
              soundManager.playTick();
            }}
            className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-purple-700 transition-colors shadow-2xs active:scale-95 cursor-pointer"
            title="App Settings & Wheel Customizer"
          >
            <Settings className="w-4 h-4 text-purple-700" />
          </button>

          {/* Audio Sound Toggle */}
          <button
            id="navbar-sound-btn"
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-purple-700 transition-colors shadow-2xs active:scale-95"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-purple-700" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Notifications Center */}
          <button
            id="navbar-notifications-btn"
            onClick={() => {
              onOpenNotifications();
              soundManager.playTick();
            }}
            className="relative p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-purple-700 transition-colors shadow-2xs active:scale-95"
            title="Notifications & Reminders"
          >
            <Bell className="w-4 h-4 text-purple-700" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                {unreadNotifsCount > 9 ? '9+' : unreadNotifsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
