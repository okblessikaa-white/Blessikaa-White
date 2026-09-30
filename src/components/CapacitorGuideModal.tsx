import React, { useState } from 'react';
import { Smartphone, Check, Copy, X, Terminal, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CapacitorGuideModalProps {
  onClose: () => void;
}

export const CapacitorGuideModal: React.FC<CapacitorGuideModalProps> = ({ onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const steps = [
    {
      title: 'Step 1: Install Capacitor CLI & Core',
      desc: 'Add Capacitor dependencies to your project package.',
      code: 'npm install @capacitor/core @capacitor/cli @capacitor/android',
    },
    {
      title: 'Step 2: Initialize Capacitor Config',
      desc: 'Generate capacitor.config.ts with app name and Android package ID.',
      code: 'npx cap init "21 Days Challenge" "com.habit21.app" --web-dir "dist"',
    },
    {
      title: 'Step 3: Build Web Assets',
      desc: 'Build the production optimized React + Tailwind bundle.',
      code: 'npm run build',
    },
    {
      title: 'Step 4: Add Android Platform Target',
      desc: 'Generate native Android Studio project folder.',
      code: 'npx cap add android',
    },
    {
      title: 'Step 5: Sync Assets & Open in Android Studio',
      desc: 'Sync distribution assets and launch in Android Studio to build APK.',
      code: 'npx cap sync\nnpx cap open android',
    },
  ];

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    soundManager.playTick();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-purple-100 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-100 text-purple-700 border border-purple-200">
              <Smartphone className="w-3.5 h-3.5 text-purple-600" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Capacitor Android Packaging
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            How to Convert into a Native Android APK
          </h3>
          <p className="text-xs text-slate-600">
            This web app is built with mobile-first touch sizing, safe area paddings, Web Audio, and haptics ready for instant packaging with Capacitor.
          </p>
        </div>

        {/* Step-by-Step commands */}
        <div className="space-y-3 pt-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {step.title}
                </span>
                <button
                  onClick={() => handleCopy(step.code, idx)}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-lg bg-white hover:bg-purple-50 border border-purple-200 text-purple-700 font-medium"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-purple-600" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-600">{step.desc}</p>

              <pre className="p-2.5 rounded-xl bg-slate-900 text-[11px] font-mono text-purple-200 overflow-x-auto border border-slate-800">
                {step.code}
              </pre>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
