import React, { useState, useEffect } from 'react';
import {
  AppSettings,
  AvatarConfig,
  Badge,
  Challenge,
  ChallengeNotificationConfig,
  DayLog,
  GenderType,
  NotificationItem,
  UserChallengeProgress,
  WheelReward,
} from './types';
import { StorageManager } from './utils/storage';
import { soundManager } from './utils/audio';
import { triggerHaptic } from './utils/haptics';
import { NotificationService } from './utils/notifications';
import { HabitFormationService } from './utils/habitService';
import { ALL_69_CHALLENGES, createFullChallengeFromCatalog } from './data/all69Challenges';

import { Navbar } from './components/Navbar';
import { BottomTabBar, TabType } from './components/BottomTabBar';
import { HomeScreen } from './components/HomeScreen';
import { ChallengePathwayScreen } from './components/ChallengePathwayScreen';
import { AllChallengesScreen } from './components/AllChallengesScreen';
import { CreateChallengeScreen } from './components/CreateChallengeScreen';
import { DailyWheelScreen } from './components/DailyWheelScreen';
import { AvatarCreatorScreen } from './components/AvatarCreatorScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { HomeTutorialOverlay } from './components/HomeTutorialOverlay';
import { HabitModeScreen } from './components/HabitModeScreen';
import { MatrixJourney } from './components/MatrixJourney';
import { ExploreChallenges } from './components/ExploreChallenges';
import { AIChallengeArchitect } from './components/AIChallengeArchitect';
import { AnalyticsView } from './components/AnalyticsView';
import { FeedScreen } from './components/FeedScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AddActionModal } from './components/AddActionModal';
import { CompletionModal } from './components/CompletionModal';
import { CertificateModal } from './components/CertificateModal';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AICoachModal } from './components/AICoachModal';
import { SettingsModal } from './components/SettingsModal';
import { CapacitorGuideModal } from './components/CapacitorGuideModal';
import { FloatingDrawerMenu } from './components/FloatingDrawerMenu';
import { PenaltyRewardModal } from './components/PenaltyRewardModal';
import { ServiceModal } from './components/ServiceModal';
import { ChallengesHubScreen } from './components/ChallengesHubScreen';
import { CommunityChallengesScreen } from './components/CommunityChallengesScreen';
import { ServicesHubScreen } from './components/ServicesHubScreen';
import { PharmacyDashboardScreen } from './components/PharmacyDashboardScreen';
import { MenstrualCycleDashboardScreen } from './components/menstrual/MenstrualCycleDashboardScreen';
import { FinanceDashboardScreen } from './components/finance/FinanceDashboardScreen';
import { UniversalFormBuilder } from './components/forms/UniversalFormBuilder';
import { ChallengeMilestone, HabitRules } from './types';
import { HabitContinuationEngine } from './utils/habitContinuationEngine';

export default function App() {
  // Application State
  const [settings, setSettings] = useState<AppSettings>(() => StorageManager.getSettings());
  const [challenges, setChallenges] = useState<Challenge[]>(() => StorageManager.getChallenges());
  const [activeChallengeId, setActiveChallengeId] = useState<string>(() =>
    StorageManager.getActiveChallengeId()
  );
  const [progressMap, setProgressMap] = useState<Record<string, UserChallengeProgress>>(() =>
    StorageManager.getProgressMap()
  );
  const [badges, setBadges] = useState<Badge[]>(() => StorageManager.getBadges());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    StorageManager.getNotifications()
  );
  const [customCommunityChallenges, setCustomCommunityChallenges] = useState<Challenge[]>(() => {
    try {
      const stored = localStorage.getItem('blessikaa_custom_community_challenges');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lastCompletedDay, setLastCompletedDay] = useState<number>(1);
  const [activeCelebrationMilestone, setActiveCelebrationMilestone] = useState<ChallengeMilestone | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showAICoachModal, setShowAICoachModal] = useState(false);
  const [showCapacitorGuide, setShowCapacitorGuide] = useState(false);
  const [showGlobalPenalties, setShowGlobalPenalties] = useState(false);

  // Fast action modal targets
  const [quickServiceAction, setQuickServiceAction] = useState<
    'scan' | 'create' | 'share' | 'request' | null
  >(null);

  // Sound sync
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Active challenge and progress
  const activeChallenge =
    challenges.find((c) => c.id === activeChallengeId) || challenges[0];

  const currentProgress: UserChallengeProgress = progressMap[activeChallenge.id] || {
    challengeId: activeChallenge.id,
    startedAt: new Date().toISOString(),
    currentDay: 1,
    dayLogs: {},
    isCompleted: false,
    streak: 0,
    highestStreak: 0,
    totalPoints: 0,
  };

  // Background Daily Reminder check
  useEffect(() => {
    const checkReminder = () => {
      if (!settings.reminderEnabled || !settings.reminderTime) return;
      const now = new Date();
      const currentHourMin = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      if (currentHourMin === settings.reminderTime && now.getSeconds() < 30) {
        const notifTitle = `Time for ${activeChallenge.title} ✨`;
        const notifBody = `Day ${currentProgress.currentDay} is waiting! Keep your ${currentProgress.streak}-day streak alive.`;

        // Send browser notification
        NotificationService.sendSystemNotification(notifTitle, { body: notifBody });

        // Add to in-app history
        const newNotif = NotificationService.createNotificationItem(
          notifTitle,
          notifBody,
          'reminder'
        );
        const updated = [newNotif, ...notifications];
        setNotifications(updated);
        StorageManager.saveNotifications(updated);
      }
    };

    const interval = setInterval(checkReminder, 30000);
    return () => clearInterval(interval);
  }, [settings, activeChallenge, currentProgress, notifications]);

  // Check and unlock badges
  const evaluateBadges = (
    newProgress: UserChallengeProgress,
    allProg: Record<string, UserChallengeProgress>
  ) => {
    let updatedBadges = [...badges];
    let newUnlock = false;

    const unlock = (badgeId: string) => {
      const idx = updatedBadges.findIndex((b) => b.id === badgeId);
      if (idx >= 0 && !updatedBadges[idx].unlockedAt) {
        updatedBadges[idx] = {
          ...updatedBadges[idx],
          unlockedAt: new Date().toISOString(),
        };
        newUnlock = true;
      }
    };

    const completedDaysCount = (
      Object.values(newProgress.dayLogs) as DayLog[]
    ).filter((l) => l.completed).length;

    if (completedDaysCount >= 1) unlock('badge_first_step');
    if (newProgress.streak >= 3) unlock('badge_streak_3');
    if (newProgress.dayLogs[7]?.completed) unlock('badge_milestone_7');
    if (newProgress.streak >= 10) unlock('badge_streak_10');
    if (newProgress.dayLogs[14]?.completed) unlock('badge_milestone_14');
    if (completedDaysCount >= 21) unlock('badge_mastery_21');

    const totalReflections = (
      Object.values(newProgress.dayLogs) as DayLog[]
    ).filter(
      (l) => l.reflectionNote && l.reflectionNote.trim().length > 0
    ).length;
    if (totalReflections >= 5) unlock('badge_journaler');

    const participatedChallengesCount = Object.keys(allProg).length;
    if (participatedChallengesCount >= 2) unlock('badge_multi_challenger');

    if (newUnlock) {
      setBadges(updatedBadges);
      StorageManager.saveBadges(updatedBadges);
    }
  };

  // Handlers
  const handleSelectChallenge = (id: string) => {
    setActiveChallengeId(id);
    StorageManager.setActiveChallengeId(id);
    if (!progressMap[id]) {
      const initProg: UserChallengeProgress = {
        challengeId: id,
        startedAt: new Date().toISOString(),
        currentDay: 1,
        dayLogs: {},
        isCompleted: false,
        streak: 0,
        highestStreak: 0,
        totalPoints: 0,
      };
      const updated = { ...progressMap, [id]: initProg };
      setProgressMap(updated);
      StorageManager.saveProgressMap(updated);
    }
  };

  const handleSelectCatalogChallenge = (chId: string) => {
    const existing = challenges.find((c) => c.id === chId);
    if (existing) {
      handleSelectChallenge(chId);
      setActiveTab('pathway');
    } else {
      const catalogItem = ALL_69_CHALLENGES.find((c) => c.id === chId);
      if (catalogItem) {
        const fullChallenge = createFullChallengeFromCatalog(catalogItem);
        const updatedChallenges = [fullChallenge, ...challenges];
        setChallenges(updatedChallenges);
        StorageManager.saveCustomChallenge(fullChallenge);
        handleSelectChallenge(fullChallenge.id);
        setActiveTab('pathway');
      } else {
        handleSelectChallenge(chId);
        setActiveTab('pathway');
      }
    }
  };

  const handleUpdateDayLog = (day: number, log: DayLog) => {
    const updatedDayLogs = {
      ...currentProgress.dayLogs,
      [day]: log,
    };

    const updatedProg: UserChallengeProgress = {
      ...currentProgress,
      dayLogs: updatedDayLogs,
    };

    const updatedMap = {
      ...progressMap,
      [activeChallenge.id]: updatedProg,
    };

    setProgressMap(updatedMap);
    StorageManager.saveProgressMap(updatedMap);
  };

  const handleUpdateReflection = (day: number, note: string) => {
    const existingLog = currentProgress.dayLogs[day] || { completed: false, completedTasks: [] };
    const updatedLog = { ...existingLog, reflectionNote: note };
    handleUpdateDayLog(day, updatedLog);
  };

  const handleCompleteDay = (day: number, log: DayLog) => {
    const isAlreadyCompleted = currentProgress.dayLogs[day]?.completed;
    const newStreak = isAlreadyCompleted
      ? currentProgress.streak
      : (currentProgress.streak || 0) + 1;
    const newHighest = Math.max(newStreak, currentProgress.highestStreak || 0);
    const newPoints = isAlreadyCompleted
      ? currentProgress.totalPoints
      : (currentProgress.totalPoints || 0) + 100;
    
    // Dynamic next day beyond Day 21
    const nextCurrentDay = Math.max(day + 1, currentProgress.currentDay || 1);

    const updatedDayLogs = {
      ...currentProgress.dayLogs,
      [day]: log,
    };

    const completedDaysCount = (Object.values(updatedDayLogs) as DayLog[]).filter(
      (l) => l.completed
    ).length;

    const isFinished = completedDaysCount >= 21;
    const isHabitStatus = currentProgress.status === 'habit_mode' || day >= 21;

    const updatedProg: UserChallengeProgress = {
      ...currentProgress,
      currentDay: nextCurrentDay,
      dayLogs: updatedDayLogs,
      streak: newStreak,
      highestStreak: newHighest,
      totalPoints: newPoints,
      isCompleted: isFinished,
      completedAt: isFinished ? (currentProgress.completedAt || new Date().toISOString()) : undefined,
      status: isHabitStatus ? 'habit_mode' : 'active',
      streakShields: currentProgress.streakShields ?? 2,
    };

    const updatedMap = {
      ...progressMap,
      [activeChallenge.id]: updatedProg,
    };

    setProgressMap(updatedMap);
    StorageManager.saveProgressMap(updatedMap);
    evaluateBadges(updatedProg, updatedMap);

    // Check if a habit continuum milestone was reached (e.g. Day 21, 30, 50, 75, 100, 180, 365, 500, 1000)
    const milestoneReached = HabitContinuationEngine.checkMilestoneReached(completedDaysCount);
    if (milestoneReached && day > 21) {
      setActiveCelebrationMilestone(milestoneReached);
      handleEarnBonusXP(milestoneReached.xp, `${milestoneReached.title} Milestone Reached!`);
    }

    // Auto-bridge to HabitContinuum if finished 21 days
    if (isFinished && !currentProgress.isCompleted) {
      HabitFormationService.createHabitFromChallenge(
        activeChallenge.id,
        activeChallenge.title,
        activeChallenge.category,
        newStreak
      );
    }

    // In-app celebration notification
    const notifTitle = day > 21 
      ? `Habit Day ${day} Conquered! 🌱` 
      : (day === 21 ? '🏆 21 DAYS COMPLETE!' : `Day ${day} Conquered! 🔥`);
    const notifBody = day >= 21
      ? `+100 XP gained! Your habit continuum in "${activeChallenge.title}" is unstoppable (${newStreak}-day streak).`
      : `+100 XP earned! You are on a ${newStreak}-day streak in "${activeChallenge.title}".`;

    const newNotif = NotificationService.createNotificationItem(
      notifTitle,
      notifBody,
      day >= 21 ? 'milestone' : 'streak'
    );
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    StorageManager.saveNotifications(updatedNotifs);

    setLastCompletedDay(day);
    setShowCompletionModal(true);
  };

  const handleTransitionToHabitMode = (challengeId: string) => {
    const targetProg = progressMap[challengeId] || currentProgress;
    const transitioned = HabitContinuationEngine.transitionToHabitMode(targetProg);
    const updatedMap = {
      ...progressMap,
      [challengeId]: transitioned,
    };
    setProgressMap(updatedMap);
    StorageManager.saveProgressMap(updatedMap);

    soundManager.playCelebration();
    triggerHaptic('success');

    const newNotif = NotificationService.createNotificationItem(
      `🌱 Habit Mode Activated!`,
      `Day 22 of "${activeChallenge.title}" unlocked. 21 days to start, a lifetime to continue!`,
      'milestone'
    );
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    StorageManager.saveNotifications(updatedNotifs);

    setShowCompletionModal(false);
    setActiveTab('pathway');
  };

  const handleUpdateHabitRules = (challengeId: string, rules: HabitRules) => {
    const targetProg = progressMap[challengeId] || currentProgress;
    const updatedProg: UserChallengeProgress = {
      ...targetProg,
      habitRules: rules,
    };
    const updatedMap = {
      ...progressMap,
      [challengeId]: updatedProg,
    };
    setProgressMap(updatedMap);
    StorageManager.saveProgressMap(updatedMap);
  };

  const handleEarnBonusXP = (xp: number, reason: string) => {
    const newPoints = (currentProgress.totalPoints || 0) + xp;
    const updatedProg: UserChallengeProgress = {
      ...currentProgress,
      totalPoints: newPoints,
    };
    const updatedMap = {
      ...progressMap,
      [activeChallenge.id]: updatedProg,
    };
    setProgressMap(updatedMap);
    StorageManager.saveProgressMap(updatedMap);

    const newNotif = NotificationService.createNotificationItem(
      `+${xp} Bonus XP Earned! ⭐`,
      reason,
      'milestone'
    );
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    StorageManager.saveNotifications(updatedNotifs);
  };

  const handleEarnCoins = (amount: number) => {
    const nextCoins = (settings.coins || 0) + amount;
    const updated = { ...settings, coins: nextCoins };
    setSettings(updated);
    StorageManager.saveSettings(updated);
    triggerHaptic('medium');
  };

  const handleWheelReward = (reward: WheelReward) => {
    if (reward.type === 'xp' && typeof reward.value === 'number') {
      handleEarnBonusXP(reward.value, `Daily Wheel Spin Reward: ${reward.label}`);
    } else if (reward.type === 'streak_freeze') {
      const nextFreezes = (settings.streakFreezes || 0) + 1;
      const updated = { ...settings, streakFreezes: nextFreezes };
      setSettings(updated);
      StorageManager.saveSettings(updated);
    }
  };

  const handleSelectCommunityChallenge = (commChallenge: Challenge) => {
    const existing = challenges.find((c) => c.id === commChallenge.id);
    if (!existing) {
      const updated = [commChallenge, ...challenges];
      setChallenges(updated);
      StorageManager.saveCustomChallenge(commChallenge);
    }
    handleSelectChallenge(commChallenge.id);
    setActiveTab('pathway');
  };

  const handleCreateCustomChallenge = (
    challenge: Challenge,
    targetScope: 'self' | 'others' | 'both' = 'self'
  ) => {
    const updated = StorageManager.saveCustomChallenge(challenge);
    setChallenges(updated);

    if (targetScope === 'others' || targetScope === 'both') {
      const nextComm = [challenge, ...customCommunityChallenges];
      setCustomCommunityChallenges(nextComm);
      try {
        localStorage.setItem('blessikaa_custom_community_challenges', JSON.stringify(nextComm));
      } catch (e) {
        console.error(e);
      }
    }

    handleSelectChallenge(challenge.id);
    setActiveTab('pathway');
  };

  const handleAdoptAIChallenge = (challenge: Challenge) => {
    const updated = StorageManager.saveCustomChallenge(challenge);
    setChallenges(updated);
    handleSelectChallenge(challenge.id);
    setActiveTab('pathway');
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageManager.saveSettings(newSettings);
  };

  const handleToggleTheme = () => {
    const nextMode = settings.themeMode === 'light' ? 'dark' : 'light';
    const updated = { ...settings, themeMode: nextMode };
    setSettings(updated);
    StorageManager.saveSettings(updated);
  };

  const handleSaveAvatar = (
    newAvatar: AvatarConfig,
    remainingCoins: number,
    newUnlockedItems: string[]
  ) => {
    const updated: AppSettings = {
      ...settings,
      avatar: newAvatar,
      coins: remainingCoins,
      purchasedAvatarItems: newUnlockedItems,
    };
    setSettings(updated);
    StorageManager.saveSettings(updated);
    soundManager.playSuccess();
    triggerHaptic('medium');
  };

  const handleSaveNotificationConfig = (config: ChallengeNotificationConfig) => {
    const nextConfigs = {
      ...(settings.challengeNotificationConfigs || {}),
      [config.challengeId]: config,
    };
    const updated = { ...settings, challengeNotificationConfigs: nextConfigs };
    setSettings(updated);
    StorageManager.saveSettings(updated);
    soundManager.playSuccess();
  };

  const handleRestartChallenge = (challengeId: string) => {
    const resetProg: UserChallengeProgress = {
      challengeId,
      startedAt: new Date().toISOString(),
      currentDay: 1,
      dayLogs: {},
      isCompleted: false,
      streak: 0,
      highestStreak: 0,
      totalPoints: 0,
    };
    const updatedMap = {
      ...progressMap,
      [challengeId]: resetProg,
    };
    setProgressMap(updatedMap);
    StorageManager.saveProgressMap(updatedMap);
    soundManager.playSuccess();
  };

  const handleHideChallenge = (challengeId: string) => {
    const nextHidden = [...(settings.hiddenChallengeIds || []), challengeId];
    const updated = { ...settings, hiddenChallengeIds: nextHidden };
    setSettings(updated);
    StorageManager.saveSettings(updated);
    soundManager.playSuccess();
  };

  const handleCompleteOnboarding = (name: string, gender: GenderType) => {
    const updated: AppSettings = {
      ...settings,
      userName: name,
      userGender: gender,
      avatar: {
        ...settings.avatar,
        gender,
      },
      onboardingCompleted: true,
      tutorialCompleted: false,
    };
    setSettings(updated);
    StorageManager.saveSettings(updated);
    soundManager.playCelebration();
  };

  const handleDismissTutorial = () => {
    const updated: AppSettings = {
      ...settings,
      tutorialCompleted: true,
    };
    setSettings(updated);
    StorageManager.saveSettings(updated);
    soundManager.playSuccess();
  };

  const handleExportData = () => {
    const dataStr = StorageManager.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blessikaa-ecosystem-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string) => {
    const success = StorageManager.importAllData(jsonStr);
    if (success) {
      setSettings(StorageManager.getSettings());
      setChallenges(StorageManager.getChallenges());
      setActiveChallengeId(StorageManager.getActiveChallengeId());
      setProgressMap(StorageManager.getProgressMap());
      setBadges(StorageManager.getBadges());
      setNotifications(StorageManager.getNotifications());
    }
    return success;
  };

  const handleResetProgress = () => {
    const resetProg: UserChallengeProgress = {
      challengeId: activeChallenge.id,
      startedAt: new Date().toISOString(),
      currentDay: 1,
      dayLogs: {},
      isCompleted: false,
      streak: 0,
      highestStreak: 0,
      totalPoints: 0,
    };
    const updatedMap = {
      ...progressMap,
      [activeChallenge.id]: resetProg,
    };
    setProgressMap(updatedMap);
    StorageManager.saveProgressMap(updatedMap);
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className={`min-h-screen ${
        settings.themeMode === 'dark'
          ? 'dark bg-[#111126] text-white'
          : 'bg-[#FCFAFF] text-[#17142B]'
      } flex flex-col selection:bg-[#6C3FE8] selection:text-white relative overflow-x-hidden font-sans transition-colors duration-300`}
    >
      {/* Ambient Master Purple Glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#6C3FE8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-[#8F67F5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-2/3 left-10 w-72 h-72 bg-[#EEE8FF]/30 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Onboarding Flow if not completed */}
      {!settings.onboardingCompleted && (
        <OnboardingFlow onComplete={handleCompleteOnboarding} />
      )}

      {/* 2. Interactive Tutorial Overlay */}
      {settings.onboardingCompleted && !settings.tutorialCompleted && (
        <HomeTutorialOverlay onDismiss={handleDismissTutorial} />
      )}

      {/* Top Navigation */}
      <Navbar
        activeChallenge={activeChallenge}
        challenges={challenges}
        onSelectChallenge={(id) => {
          handleSelectChallenge(id);
          setActiveTab('pathway');
        }}
        progress={currentProgress}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          const nextVal = !settings.soundEnabled;
          soundManager.setEnabled(nextVal);
          handleUpdateSettings({ ...settings, soundEnabled: nextVal });
        }}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        onOpenCoach={() => setShowAICoachModal(true)}
        onOpenSettings={() => setActiveTab('settings')}
        unreadNotifsCount={unreadNotifsCount}
        userCoins={settings.coins || 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-4 pb-24 sm:pb-28">
        {activeTab === 'home' && (
          <HomeScreen
            userName={settings.userName}
            theme={settings.themeMode || 'light'}
            onToggleTheme={handleToggleTheme}
            onOpenNotifications={() => setShowNotificationsModal(true)}
            onOpenSettings={() => setActiveTab('settings')}
            onNavigateTab={(tab) => setActiveTab(tab)}
            activeChallenge={activeChallenge}
            progress={currentProgress}
            streakCount={currentProgress.streak}
          />
        )}

        {(activeTab === 'today' || activeTab === 'pathway') && (
          <ChallengePathwayScreen
            challenge={activeChallenge}
            progress={currentProgress}
            userCoins={settings.coins || 0}
            onCompleteDay={handleCompleteDay}
            onUpdateReflection={handleUpdateReflection}
            onEarnCoins={handleEarnCoins}
            onRestartChallenge={handleRestartChallenge}
            onHideChallenge={handleHideChallenge}
            onSaveNotificationConfig={handleSaveNotificationConfig}
            onTransitionToHabitMode={handleTransitionToHabitMode}
            onUpdateHabitRules={handleUpdateHabitRules}
            initialNotificationConfig={settings.challengeNotificationConfigs?.[activeChallenge.id]}
            onOpenSettings={() => setActiveTab('settings')}
            onBack={() => setActiveTab('home')}
          />
        )}

        {(activeTab === 'challenges-hub' || activeTab === 'explore') && (
          <ChallengesHubScreen
            userChallenges={challenges}
            activeChallengeId={activeChallenge.id}
            progressMap={progressMap}
            onSelectChallenge={(chId) => {
              handleSelectChallenge(chId);
              setActiveTab('pathway');
            }}
            onOpenBlessikaChallenges={() => setActiveTab('all-challenges')}
            onOpenCommunityChallenges={() => setActiveTab('community-challenges')}
            onOpenCreateChallenge={() => setActiveTab('create-challenge')}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'services-hub' && (
          <ServicesHubScreen
            onBack={() => setActiveTab('home')}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'pharmacy' && (
          <PharmacyDashboardScreen
            onBack={() => setActiveTab('services-hub')}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'menstrual-cycle' && (
          <MenstrualCycleDashboardScreen
            onBack={() => setActiveTab('services-hub')}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceDashboardScreen
            onBack={() => setActiveTab('services-hub')}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'form-builder' && (
          <UniversalFormBuilder
            onBack={() => setActiveTab('services-hub')}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'welcome-tour' && (
          <div className="py-4">
            <OnboardingFlow
              onComplete={(name, gender) => {
                setActiveTab('home');
                handleCompleteOnboarding(name, gender);
              }}
            />
          </div>
        )}

        {activeTab === 'all-challenges' && (
          <AllChallengesScreen
            onSelectChallenge={(chId) => {
              handleSelectCatalogChallenge(chId);
            }}
            onBack={() => setActiveTab('challenges-hub')}
          />
        )}

        {activeTab === 'community-challenges' && (
          <CommunityChallengesScreen
            customCommunityChallenges={customCommunityChallenges}
            onSelectChallenge={(commChallenge) => {
              handleSelectCommunityChallenge(commChallenge);
            }}
            onOpenCreateChallenge={() => setActiveTab('create-challenge')}
            onBack={() => setActiveTab('challenges-hub')}
          />
        )}

        {activeTab === 'create-challenge' && (
          <CreateChallengeScreen
            onSaveChallenge={(c, targetScope) => {
              handleCreateCustomChallenge(c, targetScope);
            }}
            onBack={() => setActiveTab('challenges-hub')}
          />
        )}

        {activeTab === 'wheel' && (
          <DailyWheelScreen
            onSpinReward={handleWheelReward}
            onEarnCoins={handleEarnCoins}
            userCoins={settings.coins || 0}
            customPositiveWheel={settings.customPositiveWheel}
            customPenaltyWheel={settings.customPenaltyWheel}
            onOpenSettings={() => setActiveTab('settings')}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'avatar' && (
          <AvatarCreatorScreen
            currentAvatar={settings.avatar}
            userCoins={settings.coins || 0}
            unlockedItems={settings.purchasedAvatarItems || ['item_default']}
            onSave={handleSaveAvatar}
            onBack={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'habits' && (
          <HabitModeScreen
            onEarnXP={(xp, reason) => handleEarnBonusXP(xp, reason)}
            theme={settings.themeMode || 'light'}
          />
        )}

        {activeTab === 'explore' && (
          <div className="space-y-8">
            <ExploreChallenges
              challenges={challenges}
              activeChallengeId={activeChallenge.id}
              onSelectChallenge={(id) => {
                handleSelectChallenge(id);
                setActiveTab('pathway');
              }}
              onCreateCustomChallenge={handleCreateCustomChallenge}
              onOpenAIArchitect={() => setActiveTab('ai-architect')}
              onOpenAllChallenges={() => setActiveTab('all-challenges')}
            />

            <div className="pt-4 border-t border-[#E6E0F2]">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Full 21-Day Neural Pathway Matrix
              </h3>
              <MatrixJourney
                challenge={activeChallenge}
                progress={currentProgress}
                onSelectDayToView={(day) => {
                  const updatedProg = { ...currentProgress, currentDay: day };
                  setProgressMap({ ...progressMap, [activeChallenge.id]: updatedProg });
                  setActiveTab('pathway');
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'feed' && (
          <FeedScreen
            userName={settings.userName}
            activeChallengeTitle={activeChallenge.title}
            currentDay={currentProgress.currentDay}
            streakCount={currentProgress.streak}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            activeChallenge={activeChallenge}
            challenges={challenges}
            progress={currentProgress}
            allProgress={progressMap}
            badges={badges}
            onSelectChallenge={handleSelectChallenge}
            onOpenCertificate={() => setShowCertificateModal(true)}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onResetProgress={handleResetProgress}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'ai-architect' && (
          <AIChallengeArchitect onAdoptChallenge={handleAdoptAIChallenge} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            activeChallenge={activeChallenge}
            progress={currentProgress}
            allProgress={progressMap}
            badges={badges}
            userName={settings.userName}
            onOpenCertificate={() => setShowCertificateModal(true)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onResetProgress={handleResetProgress}
            onOpenCapacitorGuide={() => setShowCapacitorGuide(true)}
            onClose={() => setActiveTab('profile')}
          />
        )}
      </main>

      {/* Bottom Tab Bar (5 Master Tabs) */}
      <BottomTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      {/* Add Action Modal */}
      {showAddModal && (
        <AddActionModal
          onClose={() => setShowAddModal(false)}
          onNavigateTab={setActiveTab}
          onOpenScan={() => setQuickServiceAction('scan')}
          onOpenCreateChallenge={() => setActiveTab('create-challenge')}
          onOpenCreateRecord={() => setQuickServiceAction('create')}
        />
      )}

      {/* Quick Service Action Launcher */}
      {quickServiceAction && (
        <ServiceModal
          quickAction={quickServiceAction}
          onClose={() => setQuickServiceAction(null)}
          onNavigateChallenges={() => setActiveTab('pathway')}
        />
      )}

      {/* Modals */}
      {showCompletionModal && (
        <CompletionModal
          day={lastCompletedDay}
          challenge={activeChallenge}
          log={currentProgress.dayLogs[lastCompletedDay] || { completed: true, completedTasks: [] }}
          streak={currentProgress.streak}
          onClose={() => setShowCompletionModal(false)}
          onNextDay={() => {
            setShowCompletionModal(false);
            const nextDay = lastCompletedDay + 1;
            const updatedProg = {
              ...currentProgress,
              currentDay: Math.max(nextDay, currentProgress.currentDay || 1),
            };
            setProgressMap({ ...progressMap, [activeChallenge.id]: updatedProg });
            setActiveTab('pathway');
          }}
          onContinueHabit={() => handleTransitionToHabitMode(activeChallenge.id)}
          onViewCertificate={() => {
            setShowCompletionModal(false);
            setShowCertificateModal(true);
          }}
        />
      )}

      {/* Milestone Celebration Modal for Day 30, 50, 75, 100, 180, 365+ */}
      {activeCelebrationMilestone && (
        <MilestoneCelebrationModal
          milestone={activeCelebrationMilestone}
          challenge={activeChallenge}
          streak={currentProgress.streak}
          completionRate={Math.min(100, Math.round(((Object.values(currentProgress.dayLogs || {}) as DayLog[]).filter(l => l.completed).length / (currentProgress.currentDay || 1)) * 100))}
          totalCompletedDays={(Object.values(currentProgress.dayLogs || {}) as DayLog[]).filter(l => l.completed).length}
          onContinue={() => setActiveCelebrationMilestone(null)}
          onClose={() => setActiveCelebrationMilestone(null)}
        />
      )}

      {showCertificateModal && (
        <CertificateModal
          challenge={activeChallenge}
          progress={currentProgress}
          userName={settings.userName}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {showNotificationsModal && (
        <NotificationsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          notifications={notifications}
          onClearNotifications={() => {
            setNotifications([]);
            StorageManager.saveNotifications([]);
          }}
          onMarkAllRead={() => {
            const updated = notifications.map((n) => ({ ...n, read: true }));
            setNotifications(updated);
            StorageManager.saveNotifications(updated);
          }}
          onClose={() => setShowNotificationsModal(false)}
        />
      )}

      {showAICoachModal && (
        <AICoachModal
          challenge={activeChallenge}
          progress={currentProgress}
          onClose={() => setShowAICoachModal(false)}
        />
      )}

      {showCapacitorGuide && (
        <CapacitorGuideModal onClose={() => setShowCapacitorGuide(false)} />
      )}

      {/* Floating Action Drawer Menu (Only on Home Screen) */}
      {activeTab === 'home' && (
        <FloatingDrawerMenu
          onOpenPenaltiesRewards={() => setShowGlobalPenalties(true)}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          onOpenSettings={() => setActiveTab('profile')}
          onNavigateTab={(tab) => setActiveTab(tab)}
          streakCount={currentProgress.streak || 1}
        />
      )}

      {/* Global Penalty & Reward Modal */}
      {showGlobalPenalties && (
        <PenaltyRewardModal
          totalPoints={currentProgress.totalPoints || 0}
          onClose={() => setShowGlobalPenalties(false)}
        />
      )}
    </div>
  );
}
