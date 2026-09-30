import React, { useState } from 'react';
import { ServiceDashboard } from '../../types/dashboard';
import { X, FileText, Download, Copy, Share2, Printer, Check, Link, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface ExportShareModalProps {
  dashboard: ServiceDashboard;
  onClose: () => void;
}

export const ExportShareModal: React.FC<ExportShareModalProps> = ({
  dashboard,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // 1. Export CSV
  const handleExportCSV = () => {
    soundManager.playSuccess();
    triggerHaptic('medium');

    const headers = ['Label', 'Value', 'Unit', 'Target'];
    const rows = dashboard.trend.data.map((d) => [
      `"${d.label}"`,
      d.value,
      `"${dashboard.trend.unit || ''}"`,
      d.target ?? '',
    ]);

    const csvContent = [
      `"Blessikaa Analytics Export - ${dashboard.serviceName}"`,
      `"Export Date: ${new Date().toISOString()}"`,
      '',
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `blessikaa-${dashboard.serviceId}-analytics-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('CSV Exported Successfully');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // 2. Export JSON
  const handleExportJSON = () => {
    soundManager.playSuccess();
    triggerHaptic('medium');

    const jsonString = JSON.stringify(
      {
        service: dashboard.serviceName,
        serviceId: dashboard.serviceId,
        exportedAt: new Date().toISOString(),
        hero: dashboard.hero,
        secondary: dashboard.secondary,
        trend: dashboard.trend,
        breakdown: dashboard.breakdown,
        insights: dashboard.insights,
        recent: dashboard.recent,
      },
      null,
      2
    );

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `blessikaa-${dashboard.serviceId}-data-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('JSON Exported Successfully');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // 3. Print / PDF
  const handlePrint = () => {
    soundManager.playTick();
    triggerHaptic('light');
    window.print();
  };

  // 4. Copy Universal Share Link (Section 15: nextcue.app/dashboard/<service>)
  const handleCopyLink = () => {
    soundManager.playSuccess();
    triggerHaptic('light');
    const shareUrl = `${window.location.origin}/dashboard/${dashboard.serviceId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#1E1A3D] rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-purple-200/90 dark:border-[#383068] space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xl shadow-xs">
              {dashboard.emoji}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Export & Share
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                {dashboard.serviceName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        <div className="space-y-2.5 pt-1">
          {/* Option 1: CSV Export */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="w-full p-3.5 rounded-2xl bg-purple-50/60 dark:bg-[#15112E] hover:bg-purple-100/70 dark:hover:bg-[#282154] border border-purple-200/80 dark:border-[#383068] flex items-center justify-between text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  Export CSV Spreadsheet
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Compatible with Excel, Sheets, and analytics
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Option 2: JSON Structured Data */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full p-3.5 rounded-2xl bg-purple-50/60 dark:bg-[#15112E] hover:bg-purple-100/70 dark:hover:bg-[#282154] border border-purple-200/80 dark:border-[#383068] flex items-center justify-between text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  Export Raw JSON
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Complete machine-readable service telemetry
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Option 3: Print / PDF Report */}
          <button
            type="button"
            onClick={handlePrint}
            className="w-full p-3.5 rounded-2xl bg-purple-50/60 dark:bg-[#15112E] hover:bg-purple-100/70 dark:hover:bg-[#282154] border border-purple-200/80 dark:border-[#383068] flex items-center justify-between text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  Print or PDF Document
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Formatted summary for consultations
                </span>
              </div>
            </div>
            <Printer className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform" />
          </button>

          {/* Option 4: Shareable Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full p-3.5 rounded-2xl bg-purple-50/60 dark:bg-[#15112E] hover:bg-purple-100/70 dark:hover:bg-[#282154] border border-purple-200/80 dark:border-[#383068] flex items-center justify-between text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                <Link className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  {copiedLink ? 'Link Copied to Clipboard!' : 'Copy Universal Deep Link'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  nextcue.app/dashboard/{dashboard.serviceId}
                </span>
              </div>
            </div>
            {copiedLink ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform" />
            )}
          </button>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
