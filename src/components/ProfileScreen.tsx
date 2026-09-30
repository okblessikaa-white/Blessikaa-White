import React, { useState } from 'react';
import {
  User,
  Flame,
  Trophy,
  Award,
  BookOpen,
  Settings,
  Sparkles,
  Download,
  Upload,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Bell,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
  Star,
  Zap,
} from 'lucide-react';
import { AppSettings, Badge, Challenge, DayLog, UserChallengeProgress } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { AvatarView } from './AvatarView';

interface ProfileScreenProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  activeChallenge: Challenge;
  challenges: Challenge[];
  progress: UserChallengeProgress;
  allProgress: Record<string, UserChallengeProgress>;
  badges: Badge[];
  onSelectChallenge: (id: string) => void;
  onOpenCertificate: () => void;
  onExportData: () => void;
  onImportData: (json: string) => boolean;
  onResetProgress: () => void;
  onNavigateTab: (tab: any) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  settings,
  onUpdateSettings,
  activeChallenge,
  challenges,
  progress,
  allProgress,
  badges,
  onSelectChallenge,
  onOpenCertificate,
  onExportData,
  onImportData,
  onResetProgress,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'badges' | 'journal' | 'settings'>(
    'overview'
  );
  const [editingProfile, setEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(settings.userName || 'Blessed Seeker');
  const [bioInput, setBioInput] = useState(settings.userBio || 'Living intentionally with 21-day neuroplastic mastery.');
  const [importJson, setImportJson] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Compute stats
  const allProgressList = Object.values(allProgress || {}) as UserChallengeProgress[];
  const totalXp = allProgressList.reduce((acc, p) => acc + (p.totalPoints || 0), 0);
  const userLevel = Math.max(1, Math.floor(totalXp / 300) + 1);
  const nextLevelXp = userLevel * 300;
  const currentLevelProgress = Math.min(100, Math.round(((totalXp % 300) / 300) * 100));

  const completedChallenges = allProgressList.filter((p) => p.isCompleted);
  const activeChallengesCount = allProgressList.filter((p) => !p.isCompleted).length;

  const unlockedBadges = badges.filter((b) => b.unlockedAt);
  const lockedBadges = badges.filter((b) => !b.unlockedAt);

  // Extract all journal reflections across all challenges
  const allJournals: { challengeTitle: string; day: number; date: string; note: string; mood?: string }[] = [];
  (Object.entries(allProgress || {}) as [string, UserChallengeProgress][]).forEach(([cId, prog]) => {
    const ch = challenges.find((c) => c.id === cId);
    const title = ch?.title || 'Challenge';
    Object.entries(prog.dayLogs || {}).forEach(([dStr, log]: [string, DayLog]) => {
      if (log.reflectionNote && log.reflectionNote.trim().length > 0) {
        allJournals.push({
          challengeTitle: title,
          day: parseInt(dStr, 10),
          date: log.completedAt || 'Recently',
          note: log.reflectionNote,
          mood: log.mood,
        });
      }
    });
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccess();
    triggerHaptic('medium');
    onUpdateSettings({
      ...settings,
      userName: nameInput.trim() || 'Blessed Seeker',
      userBio: bioInput.trim(),
    });
    setEditingProfile(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6C3FE8] via-[#4B22B8] to-[#4338CA] p-6 text-white shadow-xl shadow-purple-900/10 border border-[#8F67F5]/30">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                onClick={() => onNavigateTab('avatar')}
                className="w-16 h-16 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center p-1 shadow-inner cursor-pointer hover:scale-105 transition-transform"
                title="Tap to customize your avatar"
              >
                {settings.avatar ? (
                  <AvatarView config={settings.avatar} className="w-full h-full" />
                ) : (
                  <span className="text-3xl">✨</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {settings.userName || 'Blessed Seeker'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-purple-950 shadow-xs">
                    Level {userLevel}
                  </span>
                </div>
                <p className="text-xs text-purple-200 mt-0.5 line-clamp-1">
                  {settings.userBio || 'Building a Blessed Life through 21-day neuroplastic habits.'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => {
                      soundManager.playTick();
                      onNavigateTab('avatar');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-[10px] font-bold text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>🎨 Customize Avatar</span>
                  </button>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                    <span>🪙 {settings.coins || 0} Coins</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playTick();
                setEditingProfile(!editingProfile);
              }}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold backdrop-blur-md transition-all"
            >
              {editingProfile ? 'Close' : 'Edit Profile'}
            </button>
          </div>

          {/* Level Progress Bar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-purple-100">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Level {userLevel} Explorer</span>
              </span>
              <span className="text-amber-300">
                {totalXp} XP ({currentLevelProgress}% to Level {userLevel + 1})
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>
          </div>

          {/* 4 Key Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-lg font-black text-amber-300 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-amber-300 fill-current" />
                <span>{progress.streak || 1}d</span>
              </div>
              <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">
                Current Streak
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-lg font-black text-white">
                {progress.highestStreak || progress.streak || 1}d
              </div>
              <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">
                Best Streak
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-lg font-black text-white">{completedChallenges.length}</div>
              <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">
                Completed
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-lg font-black text-white">{unlockedBadges.length}</div>
              <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">
                Badges Unlocked
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      {editingProfile && (
        <form
          onSubmit={handleSaveProfile}
          className="p-5 rounded-3xl bg-white border border-[#E6E0F2] shadow-sm space-y-3.5 animate-in fade-in duration-200"
        >
          <h3 className="text-sm font-bold text-slate-900">Update Profile Details</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Display Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F8F5FF] border border-[#E6E0F2] text-xs text-slate-800 outline-none focus:border-[#6C3FE8]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Bio / Personal Vision</label>
              <input
                type="text"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F8F5FF] border border-[#E6E0F2] text-xs text-slate-800 outline-none focus:border-[#6C3FE8]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEditingProfile(false)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#6C3FE8] hover:bg-[#4B22B8] text-white text-xs font-bold shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#E6E0F2] pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'My Challenges', icon: Layers },
          { id: 'badges', label: `Achievements (${unlockedBadges.length})`, icon: Trophy },
          { id: 'journal', label: `Reflections (${allJournals.length})`, icon: BookOpen },
          { id: 'settings', label: 'Settings & Vault', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                soundManager.playTick();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#6C3FE8] text-white shadow-xs'
                  : 'bg-white border border-[#E6E0F2] text-slate-700 hover:bg-[#F8F5FF]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Challenges */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-slate-900">Enrolled 21-Day Challenges</h3>
            <button
              onClick={() => onNavigateTab('explore')}
              className="text-xs font-bold text-[#6C3FE8] hover:underline flex items-center gap-1"
            >
              <span>Explore All 73+</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {(Object.entries(allProgress || {}) as [string, UserChallengeProgress][]).map(([cId, prog]) => {
              const ch = challenges.find((c) => c.id === cId) || activeChallenge;
              const completedCount = (Object.values(prog.dayLogs || {}) as DayLog[]).filter(
                (l) => l.completed
              ).length;
              const percent = Math.min(100, Math.round((completedCount / 21) * 100));
              const isCurrentActive = ch.id === activeChallenge.id;

              return (
                <div
                  key={cId}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                    isCurrentActive
                      ? 'bg-white border-[#6C3FE8] shadow-md ring-2 ring-[#EEE8FF]'
                      : 'bg-white border-[#E6E0F2] hover:border-[#8F67F5]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isCurrentActive && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-[#EEE8FF] text-[#6C3FE8]">
                            Active Challenge
                          </span>
                        )}
                        {prog.isCompleted && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                            Completed ✓
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900">{ch.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{ch.description}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-[#6C3FE8]">{percent}%</div>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {completedCount}/21 Days
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[#F8F5FF] overflow-hidden my-3 border border-[#E6E0F2]">
                    <div
                      className="h-full bg-gradient-to-r from-[#6C3FE8] to-[#8F67F5] rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{prog.streak} Day Streak</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {prog.isCompleted ? (
                        <button
                          onClick={() => onOpenCertificate()}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                        >
                          <Award className="w-3 h-3" />
                          <span>View Certificate</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectChallenge(ch.id);
                            onNavigateTab('today');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#6C3FE8] hover:bg-[#4B22B8] text-white text-xs font-bold shadow-xs"
                        >
                          {isCurrentActive ? 'Continue Today' : 'Switch & Open'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Achievements & Badges */}
      {activeSubTab === 'badges' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900">Ecosystem Badges & Accolades</h3>
              <p className="text-xs text-slate-500">
                Unlock achievements by conquering daily challenges & streaks
              </p>
            </div>
            <span className="text-xs font-bold text-[#6C3FE8]">
              {unlockedBadges.length} / {badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.map((badge) => {
              const isUnlocked = Boolean(badge.unlockedAt);
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-3xl border transition-all text-center flex flex-col items-center justify-between ${
                    isUnlocked
                      ? 'bg-white border-[#8F67F5] shadow-xs'
                      : 'bg-[#F8F5FF]/60 border-[#E6E0F2] opacity-60'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#EEE8FF] text-[#6C3FE8] flex items-center justify-center text-2xl mb-2 shadow-xs">
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{badge.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                      {badge.description}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#F8F5FF] w-full">
                    {isUnlocked ? (
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-400 font-semibold">
                        {badge.requirement}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Daily Journal Archive */}
      {activeSubTab === 'journal' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900">Personal Reflections Vault</h3>
              <p className="text-xs text-slate-500">
                Your private thoughts, breakthroughs, and daily reflections
              </p>
            </div>
            <span className="text-xs font-bold text-[#6C3FE8]">{allJournals.length} Entries</span>
          </div>

          {allJournals.length > 0 ? (
            <div className="space-y-3">
              {allJournals.map((j, i) => (
                <div
                  key={i}
                  className="p-4.5 rounded-3xl bg-white border border-[#E6E0F2] shadow-xs space-y-2"
                >
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#6C3FE8]">{j.challengeTitle}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#EEE8FF] text-purple-900">
                        Day {j.day}
                      </span>
                      {j.mood && (
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {j.mood}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{j.date.slice(0, 10)}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic bg-[#F8F5FF] p-3 rounded-2xl border border-[#E6E0F2]/60">
                    "{j.note}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-[#E6E0F2] text-center space-y-2">
              <BookOpen className="w-8 h-8 text-purple-400 mx-auto" />
              <h4 className="font-bold text-sm text-slate-900">No reflections logged yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Complete your daily challenge tasks in "Today" tab and add your notes to build a lifelong journal vault.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Settings & Data Vault */}
      {activeSubTab === 'settings' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white border border-[#E6E0F2] p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Preferences & Audio</h3>
            
            {/* Audio Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-[#F8F5FF]">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Sound Effects</span>
                <span className="text-[11px] text-slate-500">Audio feedback on completion & ticks</span>
              </div>
              <button
                onClick={() => {
                  const nextVal = !settings.soundEnabled;
                  soundManager.setEnabled(nextVal);
                  onUpdateSettings({ ...settings, soundEnabled: nextVal });
                }}
                className={`p-2 rounded-xl border transition-all ${
                  settings.soundEnabled
                    ? 'bg-[#EEE8FF] border-[#8F67F5] text-[#6C3FE8]'
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Daily Reminder Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-[#F8F5FF]">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Daily Push Reminder</span>
                <span className="text-[11px] text-slate-500">Scheduled time: {settings.reminderTime || '08:00'} AM</span>
              </div>
              <input
                type="time"
                value={settings.reminderTime || '08:00'}
                onChange={(e) => onUpdateSettings({ ...settings, reminderTime: e.target.value, reminderEnabled: true })}
                className="px-2.5 py-1 rounded-xl bg-[#F8F5FF] border border-[#E6E0F2] text-xs font-bold text-[#6C3FE8]"
              />
            </div>
          </div>

          {/* Backup & Export */}
          <div className="rounded-3xl bg-white border border-[#E6E0F2] p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-base text-slate-900">Data Vault & Encryption</h3>
            <p className="text-xs text-slate-500">
              Export your entire challenge progress, badges, and records as an encrypted offline JSON file.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => {
                  soundManager.playSuccess();
                  onExportData();
                }}
                className="px-4 py-2.5 rounded-2xl bg-[#6C3FE8] hover:bg-[#4B22B8] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Offline Backup</span>
              </button>

              <button
                onClick={() => setShowImportBox(!showImportBox)}
                className="px-4 py-2.5 rounded-2xl bg-[#F8F5FF] hover:bg-[#EEE8FF] border border-[#E6E0F2] text-[#6C3FE8] text-xs font-bold flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Backup</span>
              </button>
            </div>

            {showImportBox && (
              <div className="pt-3 space-y-2 border-t border-[#F8F5FF]">
                <textarea
                  rows={3}
                  placeholder="Paste your JSON backup data here..."
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#F8F5FF] border border-[#E6E0F2] text-xs text-slate-800 font-mono outline-none"
                />
                <button
                  onClick={() => {
                    const ok = onImportData(importJson);
                    if (ok) {
                      soundManager.playSuccess();
                      setShowImportBox(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Restore Data
                </button>
              </div>
            )}
          </div>

          {/* Reset Danger Zone */}
          <div className="rounded-3xl bg-rose-50/50 border border-rose-200 p-5 space-y-2">
            <h4 className="font-bold text-xs text-rose-900">Danger Zone</h4>
            <p className="text-[11px] text-rose-700">
              Reset your active challenge progression to Day 1. Completed logs will be cleared.
            </p>
            {showResetConfirm ? (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    onResetProgress();
                    setShowResetConfirm(false);
                    soundManager.playTick();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-800 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Current Challenge</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
