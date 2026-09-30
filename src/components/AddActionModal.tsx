import React from 'react';
import {
  X,
  Sparkles,
  Plus,
  FileText,
  Camera,
  Gift,
  Flame,
  Activity,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface AddActionModalProps {
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
  onOpenScan: () => void;
  onOpenCreateChallenge: () => void;
  onOpenCreateRecord: () => void;
}

export const AddActionModal: React.FC<AddActionModalProps> = ({
  onClose,
  onNavigateTab,
  onOpenScan,
  onOpenCreateChallenge,
  onOpenCreateRecord,
}) => {
  const actions = [
    {
      id: 'universal_form_builder',
      title: 'Universal Form Builder & Smart Fields',
      desc: 'Build reusable smart forms with 38+ field engines, conditional logic & validation',
      icon: '⚡',
      bg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-200',
      action: () => {
        onNavigateTab('form-builder');
        onClose();
      },
    },
    {
      id: 'create_challenge',
      title: 'Architect 21-Day Challenge',
      desc: 'Design a personalized routine with 21 custom daily missions',
      icon: '🏆',
      bg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-200',
      action: () => {
        onOpenCreateChallenge();
        onClose();
      },
    },
    {
      id: 'scan_doc',
      title: 'Scan & Encrypt Document',
      desc: 'Capture document via camera, apply OCR, and save to vault',
      icon: '📸',
      bg: 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200',
      action: () => {
        onOpenScan();
        onClose();
      },
    },
    {
      id: 'add_record',
      title: 'Create Service Record',
      desc: 'Add Medical, Finance, Travel, or Legal items to your hub',
      icon: '📋',
      bg: 'bg-violet-50 hover:bg-violet-100/80 border-violet-200',
      action: () => {
        onOpenCreateRecord();
        onClose();
      },
    },
    {
      id: 'ai_coach',
      title: 'Consult AI Habit Coach',
      desc: 'Get personalized neuroscience feedback on your daily routine',
      icon: '✨',
      bg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-200',
      action: () => {
        onNavigateTab('ai-architect');
        onClose();
      },
    },
    {
      id: 'spin_wheel',
      title: 'Spin Daily Lucky Wheel',
      desc: 'Win streak freezes, bonus XP, and exclusive badges',
      icon: '🎡',
      bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-200',
      action: () => {
        onNavigateTab('wheel');
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#E6E0F2] space-y-4 animate-in slide-in-from-bottom duration-200">
        <div className="flex justify-between items-center pb-2 border-b border-[#F8F5FF]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EEE8FF] text-[#6C3FE8] flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Blessikaa Fast Action</h3>
              <p className="text-[11px] text-slate-500">Select an action to launch</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playTick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {actions.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playTick();
                triggerHaptic('light');
                item.action();
              }}
              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 group transform active:scale-98 ${item.bg}`}
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block group-hover:text-[#6C3FE8] transition-colors">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-500 line-clamp-1">{item.desc}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#6C3FE8] group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
