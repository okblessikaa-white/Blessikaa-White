import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ServiceItem, RecentDocItem } from '../types';
import { BLESSIKAA_SERVICES, RECENT_DOCUMENTS } from '../data/servicesData';
import { ServiceModal } from './ServiceModal';
import { ServiceIcon } from './ServiceIcon';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface ServicesHubScreenProps {
  onBack: () => void;
  onNavigateTab: (tab: any) => void;
}

export const ServicesHubScreen: React.FC<ServicesHubScreenProps> = ({
  onBack,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<RecentDocItem | null>(null);
  const [quickAction, setQuickAction] = useState<'scan' | 'create' | 'share' | 'request' | null>(
    null
  );

  const categories = [
    'All',
    'Health & Wellness',
    'Wealth & Finance',
    'Enterprise & Career',
    'Technology & AI',
    'Lifestyle & Travel',
    'Education & Mastery',
    'Civic & Family',
    'Creative & Media',
  ];

  const filteredServices = BLESSIKAA_SERVICES.filter((s) => {
    const matchesSearch =
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenService = (service: ServiceItem) => {
    soundManager.playTick();
    triggerHaptic('light');
    if (service.id === 'pharmacy') {
      onNavigateTab('pharmacy');
      return;
    }
    if (service.id === 'menstrual_cycle') {
      onNavigateTab('menstrual-cycle');
      return;
    }
    if (
      service.id === 'finance' ||
      service.id === 'banking' ||
      service.id === 'investments' ||
      service.id === 'insurance' ||
      service.id === 'tax'
    ) {
      onNavigateTab('finance');
      return;
    }
    setSelectedService(service);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-2 px-3 sm:px-6 animate-fadeIn pb-28 space-y-4">
      {/* Search Input Row with Back Navigation (Header above removed as requested) */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            onBack();
            soundManager.playTick();
          }}
          className="p-3 rounded-2xl bg-white dark:bg-[#1E1A3D] border border-purple-200/80 dark:border-[#352F63] text-purple-700 dark:text-purple-300 hover:bg-purple-50 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
          title="Back to Home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#1E1A3D] border border-purple-200 dark:border-[#352F63] shadow-xs focus-within:border-purple-500 transition-all">
          <Search className="w-5 h-5 text-purple-600 dark:text-purple-400 ml-1 shrink-0" />
          <input
            type="text"
            placeholder="Search 69+ services, tools, records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-xs sm:text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 font-bold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Bar with Top Purple Dash Indicator */}
      <div className="relative mb-5 pt-1 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  soundManager.playTick();
                  triggerHaptic('light');
                }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50 dark:bg-[#2A2357] text-[#6C3FE8] dark:text-[#C4B5FD] border-2 border-purple-400 dark:border-purple-500 shadow-sm'
                    : 'bg-white dark:bg-[#1E1A3D] text-[#675F8A] dark:text-[#AEA5D2] border-2 border-[#EBE3FA] dark:border-[#352F63] hover:border-purple-300 hover:text-[#6C3FE8]'
                }`}
              >
                {/* Purple dash indicator on the head of active category button */}
                {isSelected && (
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-[#6C3FE8] shadow-[0_0_8px_rgba(108,63,232,0.8)]" />
                )}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid: Button Style matching Home Screen Challenges & Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredServices.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => handleOpenService(service)}
            className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50/50 dark:hover:bg-[#282154] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 text-left shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer w-full"
          >
            <div className="flex items-center gap-4 min-w-0 pr-2">
              <ServiceIcon serviceId={service.id} category={service.category} size="xl" />
              <div className="min-w-0 flex-1">
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
                  {service.label}
                </span>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
                  {service.category}
                </span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-[#2C245C] group-hover:bg-purple-600 group-hover:text-white text-purple-700 dark:text-purple-300 flex items-center justify-center transition-colors shrink-0">
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-[#1E1A3D] rounded-3xl border border-[#E9E1FC] dark:border-[#352F63] p-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-purple-50 text-[#6C3FE8] flex items-center justify-center text-2xl mb-3">
            🔍
          </div>
          <h3 className="text-base font-bold text-[#17142B] dark:text-white mb-1">
            No services match your search
          </h3>
          <p className="text-xs text-[#7A7398] dark:text-[#A8A0C7]">
            Try searching for another keyword or selecting "All" categories.
          </p>
        </div>
      )}

      {/* Service Modal */}
      {(selectedService || selectedDoc || quickAction) && (
        <ServiceModal
          service={selectedService}
          document={selectedDoc}
          quickAction={quickAction}
          onClose={() => {
            setSelectedService(null);
            setSelectedDoc(null);
            setQuickAction(null);
          }}
          onNavigateChallenges={() => onNavigateTab('today')}
        />
      )}
    </div>
  );
};
