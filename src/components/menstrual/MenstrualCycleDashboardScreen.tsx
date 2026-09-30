import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Calendar,
  Activity,
  Heart,
  Share2,
  Settings,
  Plus,
  Home,
  Shield,
  Sparkles,
  FileText,
} from 'lucide-react';
import {
  MenstrualCycleProfile,
  MenstrualDailyLog,
  CompletedPeriodRecord,
  CyclePrediction,
  CyclePhase,
} from '../../types/menstrual';
import {
  MenstrualEngine,
  DEFAULT_MENSTRUAL_PROFILE,
  INITIAL_DAILY_LOGS,
  INITIAL_PERIOD_HISTORY,
} from '../../utils/menstrualEngine';
import { MenstrualFirstUseWizard } from './MenstrualFirstUseWizard';
import { MenstrualHomeView } from './MenstrualHomeView';
import { MenstrualCalendarView } from './MenstrualCalendarView';
import { MenstrualInsightsView } from './MenstrualInsightsView';
import { MenstrualPregnancyView } from './MenstrualPregnancyView';
import { MenstrualDoctorReportView } from './MenstrualDoctorReportView';
import { MenstrualSettingsView } from './MenstrualSettingsView';
import { MenstrualLogTodayModal } from './MenstrualLogTodayModal';
import { MenstrualSharingModal } from './MenstrualSharingModal';
import { MenstrualDateDetailModal } from './MenstrualDateDetailModal';
import { MenstrualPhaseInfoModal } from './MenstrualPhaseInfoModal';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MenstrualCycleDashboardScreenProps {
  onBack: () => void;
  onNavigateTab?: (tab: string) => void;
}

export type MenstrualSubTab =
  | 'home'
  | 'calendar'
  | 'insights'
  | 'pregnancy'
  | 'doctor-report'
  | 'settings';

export const MenstrualCycleDashboardScreen: React.FC<MenstrualCycleDashboardScreenProps> = ({
  onBack,
  onNavigateTab,
}) => {
  // Master State
  const [profile, setProfile] = useState<MenstrualCycleProfile>(() =>
    MenstrualEngine.loadProfile()
  );
  const [logs, setLogs] = useState<Record<string, MenstrualDailyLog>>(() =>
    MenstrualEngine.loadDailyLogs()
  );
  const [periodHistory, setPeriodHistory] = useState<CompletedPeriodRecord[]>(() =>
    MenstrualEngine.loadPeriodHistory()
  );

  // Active view tab inside the service
  const [activeSubTab, setActiveSubTab] = useState<MenstrualSubTab>('home');

  // Scroll Position Memory Ref
  const scrollPositionsRef = useRef<Record<string, number>>({
    home: 0,
    calendar: 0,
    insights: 0,
    pregnancy: 0,
    'doctor-report': 0,
    settings: 0,
  });

  // Modals state
  const [isFirstUseOpen, setIsFirstUseOpen] = useState<boolean>(!profile.isConfigured);
  const [logModalDate, setLogModalDate] = useState<string | null>(null);
  const [isSharingOpen, setIsSharingOpen] = useState<boolean>(false);
  const [inspectDate, setInspectDate] = useState<string | null>(null);
  const [selectedPhaseInfo, setSelectedPhaseInfo] = useState<CyclePhase | null>(null);

  // Prediction calculation (relative to 2026-08-30)
  const prediction: CyclePrediction = MenstrualEngine.calculateCyclePrediction(
    profile,
    '2026-08-30'
  );

  // Synchronized sub-tab switcher that preserves scroll positions
  const handleNavigateSubTab = (nextTab: MenstrualSubTab) => {
    if (nextTab === activeSubTab) return;

    // 1. Save current scroll position
    scrollPositionsRef.current[activeSubTab] = window.scrollY;

    // 2. Set new tab
    setActiveSubTab(nextTab);

    // 3. Restore target tab's scroll position smoothly or instantly
    const targetScrollY = scrollPositionsRef.current[nextTab] || 0;
    setTimeout(() => {
      window.scrollTo({
        top: targetScrollY,
        behavior: 'instant' as ScrollBehavior,
      });
    }, 10);
  };

  // Back button handler: if on sub-service, return to Menstrual Home; if on Menstrual Home, return to App Services Hub
  const handleBackNavigation = () => {
    soundManager.playTick();
    triggerHaptic('light');

    if (activeSubTab !== 'home') {
      handleNavigateSubTab('home');
    } else {
      onBack();
    }
  };

  // Synchronize with local storage on state change
  const handleUpdateProfile = (newProfile: MenstrualCycleProfile) => {
    setProfile(newProfile);
    MenstrualEngine.saveProfile(newProfile);
  };

  const handleSaveDailyLog = (newLog: MenstrualDailyLog) => {
    const updated = { ...logs, [newLog.date]: newLog };
    setLogs(updated);
    MenstrualEngine.saveDailyLogs(updated);
    setLogModalDate(null);
    setInspectDate(null);
  };

  const handleDeleteDailyLog = (dateStr: string) => {
    const updated = { ...logs };
    delete updated[dateStr];
    setLogs(updated);
    MenstrualEngine.saveDailyLogs(updated);
    setInspectDate(null);
  };

  const handleAddPeriodRecord = (record: CompletedPeriodRecord) => {
    const updated = [...periodHistory, record];
    setPeriodHistory(updated);
    MenstrualEngine.savePeriodHistory(updated);
  };

  const handleResetData = () => {
    localStorage.removeItem('blessikaa_menstrual_profile_v1');
    localStorage.removeItem('blessikaa_menstrual_logs_v1');
    localStorage.removeItem('blessikaa_menstrual_periods_v1');
    setProfile(DEFAULT_MENSTRUAL_PROFILE);
    setLogs(INITIAL_DAILY_LOGS);
    setPeriodHistory(INITIAL_PERIOD_HISTORY);
    soundManager.playSuccess();
  };

  // If first use wizard is active
  if (isFirstUseOpen) {
    return (
      <div className="min-h-screen bg-[#FAF7FD] text-slate-900 flex flex-col">
        <MenstrualFirstUseWizard
          onComplete={(newProfile) => {
            handleUpdateProfile(newProfile);
            setIsFirstUseOpen(false);
          }}
          onSkip={() => {
            setIsFirstUseOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAFF] dark:bg-[#111126] text-slate-900 dark:text-white flex flex-col justify-between pb-24 animate-fadeIn relative overflow-x-hidden selection:bg-[#6C3FE8] selection:text-white">
      {/* Ambient Master Purple Brightness Glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#6C3FE8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-[#8F67F5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-2/3 left-10 w-72 h-72 bg-[#EEE8FF]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#15112E]/95 backdrop-blur-md border-b-2 border-purple-200/80 dark:border-[#383068] px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="menstrual-btn-back"
            onClick={handleBackNavigation}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1E1A3D] hover:bg-purple-50 dark:hover:bg-[#282154] text-purple-700 dark:text-purple-300 border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 shadow-xs transition-all cursor-pointer"
            title={activeSubTab !== 'home' ? 'Back to Menstrual Home' : 'Back to Services Hub'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base">🌸</span>
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {activeSubTab === 'home' && 'Menstrual Health'}
                {activeSubTab === 'calendar' && 'Cycle Calendar'}
                {activeSubTab === 'insights' && 'Cycle Insights'}
                {activeSubTab === 'pregnancy' && 'Pregnancy & TTC'}
                {activeSubTab === 'doctor-report' && 'Doctor Report'}
                {activeSubTab === 'settings' && 'Service Settings'}
              </h1>
            </div>
            <p className="text-[11px] text-purple-700 dark:text-purple-300 font-bold">
              {activeSubTab === 'home' ? 'Personal Wellness Vault' : 'Menstrual Health Service'}
            </p>
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              handleNavigateSubTab('doctor-report');
            }}
            className={`p-2 rounded-2xl border-2 transition-all cursor-pointer ${
              activeSubTab === 'doctor-report'
                ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#1E1A3D] border-purple-200/80 dark:border-[#383068] text-purple-700 dark:text-purple-300 hover:border-purple-500'
            }`}
            title="Doctor & Clinical Report"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              setIsSharingOpen(true);
            }}
            className="p-2 rounded-2xl bg-white dark:bg-[#1E1A3D] hover:bg-purple-50 dark:hover:bg-[#282154] text-purple-700 dark:text-purple-300 border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 shadow-xs transition-all cursor-pointer"
            title="Share & Export Report"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              handleNavigateSubTab('settings');
            }}
            className={`p-2 rounded-2xl border-2 transition-all cursor-pointer ${
              activeSubTab === 'settings'
                ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#1E1A3D] border-purple-200/80 dark:border-[#383068] text-purple-700 dark:text-purple-300 hover:border-purple-500'
            }`}
            title="Service Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto p-4 sm:p-6 space-y-4">
        {activeSubTab === 'home' && (
          <MenstrualHomeView
            profile={profile}
            prediction={prediction}
            todayLog={logs['2026-08-30']}
            onOpenLogToday={() => setLogModalDate('2026-08-30')}
            onNavigateTab={handleNavigateSubTab}
            onOpenPhaseInfo={(phase) => setSelectedPhaseInfo(phase)}
          />
        )}

        {activeSubTab === 'calendar' && (
          <MenstrualCalendarView
            profile={profile}
            logs={logs}
            periodHistory={periodHistory}
            prediction={prediction}
            onSelectDate={(dateStr) => setInspectDate(dateStr)}
            onOpenLogDate={(dateStr) => setLogModalDate(dateStr)}
            onBackToHome={() => handleNavigateSubTab('home')}
          />
        )}

        {activeSubTab === 'insights' && (
          <MenstrualInsightsView
            profile={profile}
            logs={logs}
            periodHistory={periodHistory}
            onAddPeriodRecord={handleAddPeriodRecord}
            onBackToHome={() => handleNavigateSubTab('home')}
          />
        )}

        {activeSubTab === 'pregnancy' && (
          <MenstrualPregnancyView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onBackToHome={() => handleNavigateSubTab('home')}
          />
        )}

        {activeSubTab === 'doctor-report' && (
          <MenstrualDoctorReportView
            profile={profile}
            logs={logs}
            periodHistory={periodHistory}
            onBackToHome={() => handleNavigateSubTab('home')}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeSubTab === 'settings' && (
          <MenstrualSettingsView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onResetData={handleResetData}
            onBackToHome={() => handleNavigateSubTab('home')}
          />
        )}
      </main>

      {/* Bottom Service Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#15112E]/95 backdrop-blur-md border-t-2 border-purple-200/80 dark:border-[#383068] px-4 py-2.5 flex items-center justify-around max-w-lg mx-auto shadow-lg">
        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            handleNavigateSubTab('home');
          }}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeSubTab === 'home' ? 'text-purple-700 dark:text-purple-300 font-black scale-105' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            handleNavigateSubTab('calendar');
          }}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeSubTab === 'calendar' ? 'text-purple-700 dark:text-purple-300 font-black scale-105' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold">Calendar</span>
        </button>

        {/* Center Quick Log Floating Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            triggerHaptic('medium');
            setLogModalDate('2026-08-30');
          }}
          className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 hover:scale-105 transition-transform cursor-pointer border-2 border-purple-300/40"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            handleNavigateSubTab('insights');
          }}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeSubTab === 'insights' ? 'text-purple-700 dark:text-purple-300 font-black scale-105' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-bold">Insights</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playTick();
            handleNavigateSubTab('doctor-report');
          }}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeSubTab === 'doctor-report' ? 'text-purple-700 dark:text-purple-300 font-black scale-105' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold">Report</span>
        </button>
      </nav>

      {/* Log Today / Date Modal */}
      {logModalDate && (
        <MenstrualLogTodayModal
          date={logModalDate}
          existingLog={logs[logModalDate]}
          profile={profile}
          onSave={handleSaveDailyLog}
          onClose={() => setLogModalDate(null)}
        />
      )}

      {/* Date Detail Inspection Modal */}
      {inspectDate && (
        <MenstrualDateDetailModal
          date={inspectDate}
          log={logs[inspectDate]}
          prediction={prediction}
          profile={profile}
          onEdit={(dateStr) => {
            setInspectDate(null);
            setLogModalDate(dateStr);
          }}
          onDelete={handleDeleteDailyLog}
          onClose={() => setInspectDate(null)}
        />
      )}

      {/* Doctor & Partner Sharing Modal */}
      {isSharingOpen && (
        <MenstrualSharingModal
          profile={profile}
          periodHistory={periodHistory}
          logs={logs}
          onClose={() => setIsSharingOpen(false)}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* Phase Info Educational Modal */}
      {selectedPhaseInfo && (
        <MenstrualPhaseInfoModal
          phase={selectedPhaseInfo}
          onClose={() => setSelectedPhaseInfo(null)}
        />
      )}
    </div>
  );
};
