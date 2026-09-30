import React from 'react';
import { Home, Compass, Plus, MessageCircle, User, Target, BarChart3, Gift } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

export type TabType =
  | 'home'
  | 'explore'
  | 'today'
  | 'pathway'
  | 'all-challenges'
  | 'community-challenges'
  | 'create-challenge'
  | 'challenges-hub'
  | 'services-hub'
  | 'pharmacy'
  | 'menstrual-cycle'
  | 'finance'
  | 'form-builder'
  | 'welcome-tour'
  | 'avatar'
  | 'feed'
  | 'profile'
  | 'wheel'
  | 'habits'
  | 'analytics'
  | 'ai-architect'
  | 'settings';

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAddModal: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  onOpenAddModal,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'explore' as TabType, label: 'Challenges', icon: Compass },
    { id: 'add' as any, label: 'Add', icon: Plus, isAdd: true },
    { id: 'feed' as TabType, label: 'Feed', icon: MessageCircle },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E6E0F2] shadow-[0_-4px_24px_rgba(108,63,232,0.06)] pb-safe">
      <div className="max-w-md md:max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
        {tabs.map((tab) => {
          if (tab.isAdd) {
            return (
              <button
                key="tab-add"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('medium');
                  onOpenAddModal();
                }}
                className="relative -top-4 p-3.5 rounded-full bg-gradient-to-tr from-[#6C3FE8] to-[#8F67F5] text-white shadow-lg shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-4 border-[#FCFAFF]"
                title="Fast Actions"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
            );
          }

          const Icon = tab.icon;
          const isActive =
            activeTab === tab.id ||
            (tab.id === 'explore' &&
              [
                'explore',
                'challenges-hub',
                'all-challenges',
                'community-challenges',
                'create-challenge',
                'today',
                'pathway',
              ].includes(activeTab)) ||
            (tab.id === 'profile' && activeTab === 'settings');

          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => {
                onTabChange(tab.id as TabType);
                soundManager.playTick();
                triggerHaptic('light');
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-[#6C3FE8] font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 w-6 h-1 rounded-full bg-[#6C3FE8] shadow-[0_0_8px_rgba(108,63,232,0.6)]" />
              )}
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-[#EEE8FF] text-[#6C3FE8]' : 'hover:bg-[#F8F5FF]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#6C3FE8]' : 'text-slate-400'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
