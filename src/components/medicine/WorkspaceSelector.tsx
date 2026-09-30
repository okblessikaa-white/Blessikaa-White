import React from 'react';
import { motion } from 'motion/react';
import {
  User,
  Users,
  Stethoscope,
  Building2,
  Check,
  ChevronDown,
  Shield,
  Heart,
  Package,
} from 'lucide-react';
import { MedicineWorkspaceRole } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface WorkspaceSelectorProps {
  currentRole: MedicineWorkspaceRole;
  onSelectRole: (role: MedicineWorkspaceRole) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

const ROLES_CONFIG: {
  id: MedicineWorkspaceRole;
  label: string;
  subtitle: string;
  icon: any;
  color: string;
  badge?: string;
}[] = [
  {
    id: 'personal',
    label: 'Personal (Patient)',
    subtitle: 'My medications, 1-tap dose logging & refill reminders',
    icon: User,
    color: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40',
  },
  {
    id: 'caregiver',
    label: 'Caregiver & Family',
    subtitle: 'Family members, elderly parents, children & pet health',
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40',
    badge: 'Family / Pet',
  },
  {
    id: 'doctor',
    label: 'Doctor (Clinical Workspace)',
    subtitle: 'Patient profiles, Rx builder, ICD-10 & lab orders',
    icon: Stethoscope,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40',
    badge: 'MD / Specialist',
  },
  {
    id: 'pharmacist',
    label: 'Pharmacist & Dispensing',
    subtitle: 'Rx verification, FEFO batch inventory & refill queue',
    icon: Package,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40',
    badge: 'Rx Pharmacy',
  },
  {
    id: 'clinic',
    label: 'Clinic / Hospital Network',
    subtitle: 'Institutional bed records, departments & population health',
    icon: Building2,
    color: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/40',
    badge: 'Institutional',
  },
];

export const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
  currentRole,
  onSelectRole,
  isOpen,
  onToggleOpen,
}) => {
  const currentConfig = ROLES_CONFIG.find((r) => r.id === currentRole) || ROLES_CONFIG[0];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="relative z-40">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          soundManager.playTick();
          triggerHaptic('light');
          onToggleOpen();
        }}
        className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 hover:bg-purple-100/80 dark:bg-[#251E4E] dark:hover:bg-[#2F2763] border border-purple-200/80 dark:border-[#3E3673] rounded-2xl text-xs font-black text-purple-900 dark:text-purple-200 transition-all cursor-pointer shadow-xs active:scale-95"
        title="Switch Workspace Role"
      >
        <span className="p-1 rounded-lg bg-purple-600 text-white flex items-center justify-center">
          <CurrentIcon className="w-3.5 h-3.5" />
        </span>
        <div className="text-left hidden xs:block">
          <span className="block text-[11px] font-black leading-tight text-slate-800 dark:text-white">
            {currentConfig.label.split(' ')[0]}
          </span>
          <span className="block text-[9px] text-purple-600 dark:text-purple-300 font-bold uppercase tracking-wider">
            Workspace
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={onToggleOpen}
          />
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-80 sm:w-96 bg-white dark:bg-[#1E1A3D] rounded-3xl p-3 border border-purple-200/90 dark:border-[#382F6A] shadow-2xl z-50 space-y-1.5"
          >
            <div className="px-3 py-2 border-b border-purple-100 dark:border-[#2F2763] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Select Workspace
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Role-tailored clinical and personal interfaces
                </p>
              </div>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-[10px] font-black">
                Unified Engine
              </span>
            </div>

            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
              {ROLES_CONFIG.map((role) => {
                const Icon = role.icon;
                const isSelected = currentRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      soundManager.playSuccess();
                      triggerHaptic('medium');
                      onSelectRole(role.id);
                      onToggleOpen();
                    }}
                    className={`w-full p-2.5 rounded-2xl flex items-start gap-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : 'hover:bg-purple-50 dark:hover:bg-[#272052] text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isSelected ? 'bg-white/20 text-white' : role.color
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {role.label}
                        </span>
                        {role.badge && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-white/25 text-white'
                                : 'bg-slate-100 dark:bg-[#322A63] text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {role.badge}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] line-clamp-2 mt-0.5 ${
                          isSelected ? 'text-purple-100' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {role.subtitle}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-white shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};
