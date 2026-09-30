import React, { useState } from 'react';
import {
  Settings,
  User,
  Volume2,
  Smartphone,
  Download,
  Upload,
  RotateCcw,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { AppSettings } from '../types';
import { soundManager } from '../utils/audio';
import { WheelCustomizer } from './WheelCustomizer';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => boolean;
  onResetProgress: () => void;
  onOpenCapacitorGuide: () => void;
  onClose: () => void;
  initialTab?: 'wheels' | 'preferences' | 'backup';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  onResetProgress,
  onOpenCapacitorGuide,
  onClose,
  initialTab = 'wheels',
}) => {
  const [activeTab, setActiveTab] = useState<'wheels' | 'preferences' | 'backup'>(initialTab);
  const [name, setName] = useState(settings.userName || 'Achiever');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playTick();
    onUpdateSettings({
      ...settings,
      userName: name,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImportData(content);
      if (success) {
        soundManager.playCelebration();
        setImportStatus('Data backup successfully restored!');
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        setImportStatus('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/45 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#1E1A3D] border border-purple-100 dark:border-[#382F66] shadow-2xl p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 dark:bg-[#2A2353] hover:bg-purple-100 text-purple-700 dark:text-purple-300 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <Settings className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              Settings & Customizer
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Blessikaa Settings
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Customize Positive & Penalty wheels, setup triangles, and configure preferences.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-purple-50 dark:bg-[#251F4E] rounded-2xl border border-purple-100 dark:border-[#382F66] gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('wheels');
              soundManager.playTick();
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 truncate ${
              activeTab === 'wheels'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-800 dark:text-purple-300 hover:bg-purple-100/50'
            }`}
          >
            <span>🎡 Wheels Setup</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('preferences');
              soundManager.playTick();
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 truncate ${
              activeTab === 'preferences'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-800 dark:text-purple-300 hover:bg-purple-100/50'
            }`}
          >
            <span>⚙️ Preferences</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('backup');
              soundManager.playTick();
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 truncate ${
              activeTab === 'backup'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-800 dark:text-purple-300 hover:bg-purple-100/50'
            }`}
          >
            <span>📱 Data & APK</span>
          </button>
        </div>

        {/* TAB 1: WHEEL CUSTOMIZER */}
        {activeTab === 'wheels' && (
          <WheelCustomizer
            settings={settings}
            onUpdateSettings={onUpdateSettings}
          />
        )}

        {/* TAB 2: PREFERENCES & PROFILE */}
        {activeTab === 'preferences' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Name Form */}
            <form
              onSubmit={handleSaveName}
              className="p-4 rounded-2xl bg-purple-50/40 dark:bg-[#251F4E]/40 border border-purple-100 dark:border-[#382F66] space-y-2"
            >
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Your Name (Used on 21D Certificates)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#1E1A3D] border border-purple-200 dark:border-[#382F66] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all shadow-sm cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>

            {/* Toggles */}
            <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-[#251F4E]/40 border border-purple-100 dark:border-[#382F66] space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Audio Chimes & Synthesizer Feedback</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Play soft chime on checklist actions and streak celebration
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => {
                    soundManager.playTick();
                    onUpdateSettings({ ...settings, soundEnabled: e.target.checked });
                  }}
                  className="w-4 h-4 rounded text-purple-600 border-purple-300 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-100 dark:border-[#352F63]">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Haptic Vibration Feedback</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Vibrate gently on task toggles and timer completion (mobile)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.hapticsEnabled}
                  onChange={(e) => {
                    soundManager.playTick();
                    onUpdateSettings({ ...settings, hapticsEnabled: e.target.checked });
                  }}
                  className="w-4 h-4 rounded text-purple-600 border-purple-300 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Reset Progress Danger Zone */}
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-2">
              <div className="text-xs font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Reset Active Challenge Progress</span>
              </div>

              {confirmReset ? (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      onResetProgress();
                      setConfirmReset(false);
                      soundManager.playTick();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Yes, Reset Current Progress
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#251F4E] text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="text-xs text-red-600 hover:text-red-700 underline font-medium cursor-pointer"
                >
                  Reset progress for this challenge to Day 1
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: BACKUP & ANDROID */}
        {activeTab === 'backup' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Android / Capacitor Conversion Guide Trigger */}
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <span>Convert to Android / Capacitor App</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  View step-by-step CLI commands to package this app into an Android APK with Capacitor.
                </p>
              </div>
              <button
                onClick={onOpenCapacitorGuide}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shrink-0 shadow-sm transition-all cursor-pointer"
              >
                View Guide
              </button>
            </div>

            {/* Backup & Restore Data */}
            <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-[#251F4E]/40 border border-purple-100 dark:border-[#382F66] space-y-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Data Backup & Migration
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onExportData}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-[#251F4E] hover:bg-purple-100 border border-purple-200 dark:border-[#382F66] text-xs font-semibold text-purple-700 dark:text-purple-300 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-purple-600" />
                  <span>Export JSON Backup</span>
                </button>

                <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-[#251F4E] hover:bg-purple-100 border border-purple-200 dark:border-[#382F66] text-xs font-semibold text-purple-700 dark:text-purple-300 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-purple-600" />
                  <span>Import JSON Backup</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {importStatus && (
                <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 pt-1">
                  {importStatus}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
