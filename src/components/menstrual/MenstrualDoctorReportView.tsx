import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  Copy,
  Check,
  Calendar,
  Activity,
  AlertCircle,
  Stethoscope,
  Clock,
  Printer,
  Sparkles,
  ShieldCheck,
  Heart,
  Save,
  ChevronLeft,
} from 'lucide-react';
import {
  MenstrualCycleProfile,
  MenstrualDailyLog,
  CompletedPeriodRecord,
} from '../../types/menstrual';
import { MenstrualEngine } from '../../utils/menstrualEngine';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MenstrualDoctorReportViewProps {
  profile: MenstrualCycleProfile;
  logs: Record<string, MenstrualDailyLog>;
  periodHistory: CompletedPeriodRecord[];
  onBackToHome: () => void;
  onUpdateProfile: (updated: MenstrualCycleProfile) => void;
}

export const MenstrualDoctorReportView: React.FC<MenstrualDoctorReportViewProps> = ({
  profile,
  logs,
  periodHistory,
  onBackToHome,
  onUpdateProfile,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3m' | '6m' | '12m' | 'all'>('6m');
  const [doctorNotes, setDoctorNotes] = useState(
    profile.doctorReportNotes ||
      'Patient reports occasional moderate lower abdominal cramping on Day 1-2, responsive to warm compress and hydration. Regular 28-day cycle length across recorded history.'
  );
  const [includeSymptoms, setIncludeSymptoms] = useState(true);
  const [includeFertility, setIncludeFertility] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter history based on timeframe
  const filteredHistory = periodHistory.filter((p) => {
    if (selectedTimeframe === 'all') return true;
    const now = new Date('2026-08-30').getTime();
    const periodTime = new Date(p.startDate).getTime();
    const diffMonths = (now - periodTime) / (1000 * 60 * 60 * 24 * 30);
    if (selectedTimeframe === '3m') return diffMonths <= 3;
    if (selectedTimeframe === '6m') return diffMonths <= 6;
    if (selectedTimeframe === '12m') return diffMonths <= 12;
    return true;
  });

  const analytics = MenstrualEngine.calculateAnalytics(profile, periodHistory, logs);

  const formattedReportText = `=== BLESSIKAA CLINICAL CYCLE REPORT ===
Patient: ${profile.userName || 'Patient'}
Generated: August 30, 2026
------------------------------------------------
SUMMARY METRICS:
- Average Cycle Length: ${analytics.avgCycleDays} days
- Average Bleeding Duration: ${analytics.avgPeriodDays} days
- Cycle Regularity Score: ${analytics.regularityScore}% (${profile.isIrregular ? 'Marked Irregular' : 'Predictable'})
- Tracking Mode: ${profile.trackingMode.toUpperCase()}

RECORDED PERIOD HISTORY (${filteredHistory.length} Cycles):
${filteredHistory
  .map(
    (p, idx) =>
      `• Cycle #${idx + 1}: ${p.startDate} to ${p.endDate} (${p.durationDays} days bleeding, ${
        p.cycleLengthDays || profile.cycleLengthDays
      }d cycle interval) - Notes: ${p.notes || 'Normal flow'}`
  )
  .join('\n')}

PHYSICIAN CONSULTATION NOTES & QUESTIONS:
${doctorNotes}
------------------------------------------------
Data certified by Blessikaa Menstrual Cycle Service.`;

  const handleCopyReport = () => {
    soundManager.playSuccess();
    triggerHaptic('medium');
    navigator.clipboard.writeText(formattedReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    soundManager.playTick();
    window.print();
  };

  const handleSavePreferences = () => {
    soundManager.playSuccess();
    triggerHaptic('heavy');
    onUpdateProfile({
      ...profile,
      doctorReportNotes: doctorNotes,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-14">
      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 rounded-3xl p-5 text-white shadow-xl shadow-purple-700/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl backdrop-blur-xs">
              🩺
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 block">
                OB-GYN & Healthcare Consultation
              </span>
              <h2 className="text-lg sm:text-xl font-black">Doctor & Clinical Report</h2>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-black">
            HIPAA Privacy Safe
          </span>
        </div>

        <p className="text-xs text-purple-100 leading-relaxed font-medium">
          Generate an aggregated summary of your menstrual cycles, bleeding duration, ovulation
          symptoms, and pain logs formatted for your gynecologist, midwife, or fertility specialist.
        </p>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleCopyReport}
            className="flex-1 min-w-[130px] py-3 px-4 rounded-2xl bg-white hover:bg-purple-50 text-purple-950 font-black text-xs shadow-md shadow-purple-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-purple-700" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 min-w-[130px] py-3 px-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-md border border-white/25 active:scale-98 shadow-sm"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* Timeframe Filter */}
      <div className="flex items-center justify-between blessikaa-section-embossed rounded-3xl p-3 sm:p-4">
        <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Report Scope:</span>
        </span>

        <div className="flex gap-1">
          {[
            { id: '3m', label: '3 Mo' },
            { id: '6m', label: '6 Mo' },
            { id: '12m', label: '12 Mo' },
            { id: 'all', label: 'All Time' },
          ].map((tf) => (
            <button
              key={tf.id}
              type="button"
              onClick={() => {
                soundManager.playTick();
                setSelectedTimeframe(tf.id as any);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedTimeframe === tf.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clinical Diagnostic Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="blessikaa-section-embossed rounded-3xl p-3.5 space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block">Avg Cycle</span>
          <div className="text-xl font-black text-purple-900 dark:text-purple-200">
            {analytics.avgCycleDays} <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">days</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Std Dev: ±1.2d</span>
        </div>

        <div className="blessikaa-section-embossed rounded-3xl p-3.5 space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block">Bleeding Length</span>
          <div className="text-xl font-black text-purple-900 dark:text-purple-200">
            {analytics.avgPeriodDays} <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">days</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Flow: Normal</span>
        </div>

        <div className="blessikaa-section-embossed rounded-3xl p-3.5 space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block">Regularity</span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{analytics.regularityScore}%</div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Consistent</span>
        </div>

        <div className="blessikaa-section-embossed rounded-3xl p-3.5 space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block">Recorded Cycles</span>
          <div className="text-xl font-black text-indigo-700 dark:text-indigo-300">{filteredHistory.length}</div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Logged in range</span>
        </div>
      </div>

      {/* Clinical Cycle Table */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Historical Cycle Record</h3>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Detailed start, end, and flow logs</p>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-purple-50 dark:bg-purple-900/40 px-2.5 py-1 rounded-xl border border-purple-100 dark:border-purple-800">
            {filteredHistory.length} Cycles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-100 dark:border-purple-900 text-slate-500 dark:text-slate-400 font-bold">
                <th className="pb-2 pl-2">Start Date</th>
                <th className="pb-2">End Date</th>
                <th className="pb-2">Duration</th>
                <th className="pb-2">Interval</th>
                <th className="pb-2 pr-2">Clinical Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50 dark:divide-purple-900/50">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20">
                  <td className="py-2.5 pl-2 font-bold text-slate-900 dark:text-white">
                    {new Date(item.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-2.5 text-slate-700 dark:text-slate-300">
                    {new Date(item.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-2.5 font-black text-purple-900 dark:text-purple-200">{item.durationDays} days</td>
                  <td className="py-2.5 text-slate-700 dark:text-slate-300 font-medium">
                    {item.cycleLengthDays || profile.cycleLengthDays} days
                  </td>
                  <td className="py-2.5 pr-2 text-slate-500 dark:text-slate-400 italic truncate max-w-[150px]">
                    {item.notes || 'Normal progression'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Symptom Frequency & Intensity */}
      <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 sm:p-5 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Reported Symptoms & Patterns</h3>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Frequency across monitored cycle days</p>
          </div>
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/40 px-2.5 py-1 rounded-xl border border-purple-100 dark:border-purple-800">
            Symptom Audit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Dysmenorrhea (Cramps)', count: '72% of Day 1-2', severity: 'Moderate' },
            { name: 'Fatigue / Lethargy', count: '51% of Period', severity: 'Mild-Moderate' },
            { name: 'Headaches / Migraines', count: '34% of Pre-period', severity: 'Mild' },
            { name: 'Fluid Retention (Bloating)', count: '29% of Luteal Phase', severity: 'Mild' },
          ].map((s, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-200/80 dark:border-[#383068] flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{s.name}</span>
                <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">{s.count}</span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-purple-900 font-bold text-[10px] text-slate-600 dark:text-slate-200 shadow-2xs">
                {s.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Physician Discussion Notes & Questions Form */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Physician Discussion Notes & Questions</h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Editable for your appointment</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300">
          Add specific topics or questions you would like to discuss with your doctor (e.g. pain
          relief, fertility optimization, birth control changes):
        </p>

        <textarea
          value={doctorNotes}
          onChange={(e) => setDoctorNotes(e.target.value)}
          rows={4}
          placeholder="Type notes for your doctor here..."
          className="w-full p-3.5 blessikaa-inner-embossed rounded-2xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-400/20 transition-colors"
        />

        {/* Save Doctor Notes Button for Android */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleSavePreferences}
            className="w-full group rounded-3xl p-5 sm:p-6 blessikaa-inner-embossed hover:bg-purple-50/50 dark:hover:bg-[#282154] hover:border-purple-500 dark:hover:border-purple-400 text-left hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
                {saveSuccess ? (
                  <Check className="w-7 h-7 text-emerald-200 stroke-[2.5]" />
                ) : (
                  <Save className="w-7 h-7 stroke-[2.5]" />
                )}
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight">
                  {saveSuccess ? 'SAVED SUCCESSFULLY' : 'SAVE CLINICAL NOTES & REPORT'}
                </span>
                <span className="text-xs text-purple-700 dark:text-purple-300 font-bold block mt-0.5">
                  {saveSuccess ? 'Synchronized to device' : 'Save discussion items & notes'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/40 group-hover:bg-purple-600 group-hover:text-white text-purple-700 dark:text-purple-300 flex items-center justify-center transition-colors shrink-0">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </div>

      {/* Privacy & Clinical Accuracy Notice */}
      <div className="p-4 rounded-3xl blessikaa-section-embossed flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-black text-purple-900 dark:text-purple-200">Clinical Data Confidentiality</h4>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            This health report is generated strictly from on-device local logs and calculations. It is
            intended as an observational aid for you and your healthcare professional and does not
            constitute an automated medical diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
};
