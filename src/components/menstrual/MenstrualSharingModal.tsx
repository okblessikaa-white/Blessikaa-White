import React, { useState } from 'react';
import {
  X,
  Share2,
  FileDown,
  Lock,
  UserCheck,
  Check,
  Shield,
  Clock,
  Printer,
  Copy,
} from 'lucide-react';
import {
  MenstrualCycleProfile,
  CompletedPeriodRecord,
  MenstrualDailyLog,
} from '../../types/menstrual';
import { MenstrualEngine } from '../../utils/menstrualEngine';
import { soundManager } from '../../utils/audio';

interface MenstrualSharingModalProps {
  profile: MenstrualCycleProfile;
  periodHistory: CompletedPeriodRecord[];
  logs: Record<string, MenstrualDailyLog>;
  onClose: () => void;
  onUpdateProfile: (updated: MenstrualCycleProfile) => void;
}

export const MenstrualSharingModal: React.FC<MenstrualSharingModalProps> = ({
  profile,
  periodHistory,
  logs,
  onClose,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'doctor' | 'partner'>('doctor');

  // Doctor Report Config
  const [timeframe, setTimeframe] = useState<'3_months' | '6_months' | 'all'>('3_months');
  const [includeSymptoms, setIncludeSymptoms] = useState(true);
  const [includeFlow, setIncludeFlow] = useState(true);
  const [includeMood, setIncludeMood] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Partner Config
  const [partnerEmail, setPartnerEmail] = useState(profile.privacy.partnerEmail || '');
  const [partnerPermission, setPartnerPermission] = useState(
    profile.privacy.partnerPermission || 'view_only'
  );
  const [isPartnerActive, setIsPartnerActive] = useState(profile.privacy.sharedWith === 'partner');

  const analytics = MenstrualEngine.calculateAnalytics(profile, periodHistory, logs);

  const handleCopySummary = () => {
    soundManager.playSuccess();
    const text = `🌸 BLESSIKAA MENSTRUAL HEALTH SUMMARY
Generated: Aug 30, 2026
-------------------------------------
• Average Cycle Length: ${analytics.avgCycleDays} Days
• Average Period Duration: ${analytics.avgPeriodDays} Days
• Regularity Score: ${analytics.regularityScore}%
• Recorded Periods: ${periodHistory.length}
• Top Symptoms: ${analytics.symptomFrequencies.slice(0, 3).map((s) => s.symptom).join(', ')}
• Privacy: Encrypted Health Vault`;

    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSavePartner = () => {
    soundManager.playSuccess();
    onUpdateProfile({
      ...profile,
      privacy: {
        ...profile.privacy,
        sharedWith: isPartnerActive ? 'partner' : 'nobody',
        partnerEmail,
        partnerPermission,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-lg max-h-[90vh] bg-[#FAF8FD] dark:bg-[#15112E] rounded-3xl shadow-2xl border-2 border-purple-200/80 dark:border-[#383068] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#1E1A3D] border-b border-purple-100 dark:border-[#383068] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-purple-600/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Health Sharing & Reports</h3>
              <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">Doctor export & partner sync</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-4 pt-3 bg-white dark:bg-[#1E1A3D] border-b border-purple-100 dark:border-[#383068] flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('doctor')}
            className={`pb-3 px-4 text-xs font-black border-b-2 transition-all cursor-pointer ${
              activeTab === 'doctor'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            👨‍⚕️ Doctor Summary Export
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('partner')}
            className={`pb-3 px-4 text-xs font-black border-b-2 transition-all cursor-pointer ${
              activeTab === 'partner'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            💜 Partner Sharing
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'doctor' ? (
            <>
              <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Select Timeframe
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '3_months', label: 'Last 3 Months' },
                    { id: '6_months', label: 'Last 6 Months' },
                    { id: 'all', label: 'All History' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTimeframe(t.id as any)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        timeframe === t.id
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                          : 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 hover:bg-purple-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Checklist */}
              <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 block">
                  Included Data Fields
                </span>

                <div className="space-y-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSymptoms}
                      onChange={(e) => setIncludeSymptoms(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                    <span>Symptom frequencies & peak severity days</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeFlow}
                      onChange={(e) => setIncludeFlow(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                    <span>Bleeding duration & flow intensity patterns</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeMood}
                      onChange={(e) => setIncludeMood(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                    <span>Mood & energy correlations</span>
                  </label>
                </div>
              </div>

              {/* Report Preview */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] text-xs space-y-2 font-mono text-slate-800 dark:text-slate-200">
                <div className="font-bold text-purple-900 dark:text-purple-300 border-b border-purple-100 dark:border-[#383068] pb-1 flex items-center justify-between">
                  <span>CLINICAL REPORT PREVIEW</span>
                  <span className="text-[10px] font-sans bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-md font-bold">
                    Ready
                  </span>
                </div>
                <div>• Average Cycle: {analytics.avgCycleDays} days</div>
                <div>• Average Period: {analytics.avgPeriodDays} days</div>
                <div>• Regularity Score: {analytics.regularityScore}%</div>
                <div>• Recent Periods: {periodHistory.slice(-3).map((p) => p.startDate).join(', ')}</div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex-1 group rounded-2xl p-3 bg-purple-50 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 font-black text-xs hover:bg-purple-100 dark:hover:bg-purple-900/70 border-2 border-purple-200/80 dark:border-[#383068] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-xl bg-purple-200/60 dark:bg-purple-800/60 flex items-center justify-center">
                    <Copy className="w-3.5 h-3.5 text-purple-800 dark:text-purple-200" />
                  </div>
                  <span>{copiedLink ? 'Copied Summary!' : 'Copy Summary'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playSuccess();
                    window.print?.();
                  }}
                  className="flex-1 group rounded-2xl p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                    <FileDown className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>Export PDF / Print</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Partner Sharing Section */}
              <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">Partner Cycle Sync</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Share period dates, fertile windows or PMS heads-up
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPartnerActive(!isPartnerActive)}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      isPartnerActive ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {isPartnerActive && (
                  <div className="space-y-3 pt-2 border-t border-purple-100 dark:border-[#383068]">
                    <div>
                      <label className="text-xs font-black text-slate-800 dark:text-slate-200 block mb-1.5">
                        Partner's Email or Phone
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. partner@example.com"
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white shadow-xs focus:outline-hidden focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-800 dark:text-slate-200 block mb-1.5">
                        Permission Level
                      </label>
                      <select
                        value={partnerPermission}
                        onChange={(e: any) => setPartnerPermission(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white shadow-xs focus:outline-hidden focus:border-purple-600"
                      >
                        <option value="view_only">View Only (Period & Phase dates)</option>
                        <option value="view_contribute">View + Contribute notes</option>
                        <option value="full_access">Full Access (All symptoms & logs)</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-300 flex items-center gap-2 text-xs font-medium border border-purple-100 dark:border-[#383068]">
                      <Lock className="w-4 h-4 text-purple-700 dark:text-purple-400 shrink-0" />
                      <span>You can revoke partner access instantly at any time.</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSavePartner}
                className="w-full group rounded-3xl p-3.5 sm:p-4 bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md hover:shadow-lg transition-all flex items-center justify-between cursor-pointer active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block font-black text-slate-900 dark:text-white text-xs sm:text-sm tracking-wide">
                      SAVE PARTNER SETTINGS
                    </span>
                    <span className="block text-[10px] text-purple-600 dark:text-purple-300 font-medium">
                      Store sharing preferences securely
                    </span>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-700/60 text-purple-700 dark:text-purple-300 font-black text-[10px] uppercase tracking-wider group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  Save
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
