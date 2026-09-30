import React from 'react';
import { Award, Crown, CheckCircle2, Download, Printer, X, Sparkles, Share2 } from 'lucide-react';
import { Challenge, UserChallengeProgress } from '../types';
import { soundManager } from '../utils/audio';

interface CertificateModalProps {
  challenge: Challenge;
  progress: UserChallengeProgress;
  userName: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  challenge,
  progress,
  userName,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: `21 Days Challenge Certificate: ${challenge.title}`,
          text: `I just conquered 21 continuous days of "${challenge.title}" with a 100% completion rate!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `I just completed 21 continuous days of "${challenge.title}" on the 21 Days Challenge App!`
      );
      alert('Certificate text copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-purple-100 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Printable Certificate Frame */}
        <div className="relative rounded-3xl bg-gradient-to-b from-purple-50/70 via-white to-purple-50/70 border-4 border-double border-purple-300 p-6 sm:p-10 text-center space-y-4 shadow-sm">
          {/* Header Seal */}
          <div className="mx-auto w-16 h-16 rounded-full bg-purple-600 p-1 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-purple-700 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-amber-300" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-widest text-purple-700">
              Official Certificate of Mastery
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              21-Day Neuroplasticity Graduation
            </h2>
          </div>

          <div className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            This certifies that the recipient has successfully maintained unbroken discipline, conquered daily resistance, and wired lifelong automaticity for:
          </div>

          {/* Name & Challenge */}
          <div className="space-y-2 py-2">
            <div className="text-xl sm:text-2xl font-black text-purple-900 underline decoration-purple-400 underline-offset-8">
              {userName || 'Dedicated Achiever'}
            </div>
            <div className="text-sm sm:text-base font-bold text-purple-700">
              "{challenge.title}"
            </div>
          </div>

          {/* 3 Milestone Badges Checked */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-purple-100 text-[10px] sm:text-xs text-slate-700">
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-900">Day 7 Milestone</span>
              <span className="text-[10px] text-slate-500">Neural Seed</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-900">Day 14 Milestone</span>
              <span className="text-[10px] text-slate-500">Momentum Pivot</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-slate-900">Day 21 Milestone</span>
              <span className="text-[10px] text-amber-600 font-semibold">Full Mastery</span>
            </div>
          </div>

          <div className="pt-3 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Verified: 21 Days Challenge System</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-semibold text-purple-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Share Triumph</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
