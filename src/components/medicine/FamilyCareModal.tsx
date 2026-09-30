import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Users,
  Plus,
  Heart,
  ShieldCheck,
  Check,
  PawPrint,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { FamilyCareProfile } from '../../types';
import { INITIAL_FAMILY_PROFILES } from '../../data/pharmacyData';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface FamilyCareModalProps {
  currentProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onClose: () => void;
}

export const FamilyCareModal: React.FC<FamilyCareModalProps> = ({
  currentProfileId,
  onSelectProfile,
  onClose,
}) => {
  const [profiles, setProfiles] = useState<FamilyCareProfile[]>(INITIAL_FAMILY_PROFILES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState<'Me' | 'Mother' | 'Father' | 'Child' | 'Pet'>('Child');
  const [newSpecies, setNewSpecies] = useState('');

  const handleAddProfile = () => {
    if (!newName.trim()) return;
    soundManager.playSuccess();
    triggerHaptic('heavy');

    const isPet = newRelation === 'Pet';
    const newProf: FamilyCareProfile = {
      id: `fam_${Date.now()}`,
      name: newName,
      relation: newRelation,
      isPet,
      species: isPet ? newSpecies || 'Canine / Feline' : undefined,
      avatar: isPet ? '🐕' : newRelation === 'Child' ? '👶' : '👤',
      medicinesCount: 0,
      permissions: isPet ? ['Veterinary Health Profile'] : ['Full Caregiver Control'],
    };

    setProfiles([...profiles, newProf]);
    setNewName('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1A3D] w-full max-w-lg rounded-3xl border border-purple-200/90 dark:border-[#382F6A] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 dark:border-[#2F2763] bg-purple-50/50 dark:bg-[#191535] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Family & Pet Care Profiles
              </h3>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
                Manage medications for dependents, parents & pets
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2B2358] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profiles List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          <div className="space-y-2">
            {profiles.map((prof) => {
              const isSelected = currentProfileId === prof.id;
              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => {
                    soundManager.playSuccess();
                    triggerHaptic('medium');
                    onSelectProfile(prof.id);
                    onClose();
                  }}
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-[#1C2847] border-blue-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#16122E] border-slate-200 dark:border-[#2F2763] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-white dark:bg-[#251E4E] shadow-xs">
                      {prof.avatar}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                          {prof.name}
                        </h4>
                        {prof.isPet && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-md text-[9px] font-black uppercase">
                            Pet / Vet
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {prof.isPet ? prof.species : `${prof.relation} • ${prof.medicinesCount} active meds`}
                      </p>
                      {prof.permissions && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prof.permissions.map((perm, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-950 px-1.5 py-0.2 rounded-md"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-1 rounded-full bg-blue-600 text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add Profile Form */}
          {showAddForm ? (
            <div className="p-4 bg-purple-50/60 dark:bg-[#1C173B] rounded-2xl border border-purple-200 dark:border-[#382F6A] space-y-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Add New Family Member / Pet
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Leo, Bella..."
                    className="w-full px-3 py-2 bg-white dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Relation / Role
                  </label>
                  <select
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl text-xs font-bold"
                  >
                    <option value="Child">Child</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Pet">Pet 🐕</option>
                  </select>
                </div>
              </div>

              {newRelation === 'Pet' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Pet Species & Weight
                  </label>
                  <input
                    type="text"
                    value={newSpecies}
                    onChange={(e) => setNewSpecies(e.target.value)}
                    placeholder="e.g. Canine / Golden Retriever (30kg)"
                    className="w-full px-3 py-2 bg-white dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl text-xs font-bold"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAddProfile}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black cursor-pointer"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundManager.playTick();
                setShowAddForm(true);
              }}
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-[#20274D] text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-[#333D75] rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Family Member or Pet Profile</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-100 dark:border-[#2F2763] bg-purple-50/40 dark:bg-[#191535] flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Active: {profiles.find((p) => p.id === currentProfileId)?.name || 'Alex'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white dark:bg-[#251E4E] border border-slate-200 dark:border-[#352F63] rounded-2xl text-xs font-black cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
