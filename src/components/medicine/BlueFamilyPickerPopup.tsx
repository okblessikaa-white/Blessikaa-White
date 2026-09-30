import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Users,
  Plus,
  Heart,
  Check,
  PawPrint,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { FamilyCareProfile } from '../../types';
import { INITIAL_FAMILY_PROFILES } from '../../data/pharmacyData';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface BlueFamilyPickerPopupProps {
  selectedProfileId?: string;
  onSelect: (profile: FamilyCareProfile) => void;
  onClose: () => void;
}

export const BlueFamilyPickerPopup: React.FC<BlueFamilyPickerPopupProps> = ({
  selectedProfileId = 'fam_me',
  onSelect,
  onClose,
}) => {
  const [profiles, setProfiles] = useState<FamilyCareProfile[]>(INITIAL_FAMILY_PROFILES);
  const [showAddQuick, setShowAddQuick] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickRelation, setQuickRelation] = useState<'Me' | 'Mother' | 'Father' | 'Child' | 'Pet'>('Child');

  const handleQuickAdd = () => {
    if (!quickName.trim()) return;
    soundManager.playSuccess();
    triggerHaptic('medium');

    const isPet = quickRelation === 'Pet';
    const newProf: FamilyCareProfile = {
      id: `fam_${Date.now()}`,
      name: quickName,
      relation: quickRelation,
      isPet,
      species: isPet ? 'Canine / Feline' : undefined,
      avatar: isPet ? '🐕' : quickRelation === 'Child' ? '👶' : '👤',
      medicinesCount: 0,
      permissions: ['Full Caregiver Control'],
    };

    setProfiles([...profiles, newProf]);
    setQuickName('');
    setShowAddQuick(false);
    onSelect(newProf);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3.5 bg-blue-950/60 backdrop-blur-xs animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-[#0E1B38] w-full max-w-md rounded-3xl border-2 border-blue-400/80 dark:border-blue-500/50 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[85vh]"
      >
        {/* Crisp Blue Popup Header */}
        <div className="p-4 sm:p-5 border-b border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black shadow-inner">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                Assign Medication To
              </h3>
              <p className="text-[11px] text-blue-100 font-medium">
                Choose patient, dependent or pet profile
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              onClose();
            }}
            className="p-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Options List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-2.5">
          {profiles.map((prof) => {
            const isSelected = selectedProfileId === prof.id;
            return (
              <button
                key={prof.id}
                type="button"
                onClick={() => {
                  soundManager.playSuccess();
                  triggerHaptic('medium');
                  onSelect(prof);
                }}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-[#132349] border-blue-100 dark:border-blue-900/40 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-xs font-black ${
                      prof.isPet
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600'
                        : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700'
                    }`}
                  >
                    {prof.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        {prof.name}
                      </span>
                      {prof.relation === 'Me' && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-black uppercase">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold">
                      {prof.relation} {prof.isPet ? `(${prof.species || 'Pet'})` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-400">
                      <span className="text-xs">＋</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {/* Quick Add Dependent */}
          {!showAddQuick ? (
            <button
              type="button"
              onClick={() => {
                soundManager.playTick();
                setShowAddQuick(true);
              }}
              className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-800 hover:border-blue-500 text-blue-700 dark:text-blue-300 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dependent / Family Member</span>
            </button>
          ) : (
            <div className="p-3.5 bg-blue-50 dark:bg-[#132349] rounded-2xl border border-blue-200 dark:border-blue-800 space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-900 dark:text-blue-200">
                  Quick Add Profile
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddQuick(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <input
                type="text"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                placeholder="Name (e.g. Grandma Rose, Bella the pup)"
                className="w-full px-3.5 py-2 bg-white dark:bg-[#0A152C] border border-blue-300 dark:border-blue-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
              />

              <div className="flex flex-wrap gap-1.5">
                {(['Mother', 'Father', 'Child', 'Pet'] as const).map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setQuickRelation(rel)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      quickRelation === rel
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-[#0A152C] text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleQuickAdd}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-xs cursor-pointer transition-all active:scale-98"
              >
                Save & Select Profile
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-[#0A152C] flex items-center justify-between text-xs text-blue-800 dark:text-blue-200 font-semibold">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Prescription & adherence logs will link to this profile.</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};
