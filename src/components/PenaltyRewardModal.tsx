import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  ShieldAlert,
  Gift,
  Flame,
  Award,
  Trash2,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  Heart,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { CustomPenalty, CustomReward } from '../types';
import { PenaltyRewardService } from '../utils/penaltyRewardService';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import confetti from 'canvas-confetti';

interface PenaltyRewardModalProps {
  onClose: () => void;
  totalPoints?: number;
  onUpdatePoints?: (delta: number) => void;
}

export const PenaltyRewardModal: React.FC<PenaltyRewardModalProps> = ({
  onClose,
  totalPoints = 0,
  onUpdatePoints,
}) => {
  const [activeTab, setActiveTab] = useState<'penalties' | 'rewards'>('penalties');
  const [penalties, setPenalties] = useState<CustomPenalty[]>(() =>
    PenaltyRewardService.getPenalties()
  );
  const [rewards, setRewards] = useState<CustomReward[]>(() =>
    PenaltyRewardService.getRewards()
  );

  // Form states for creating new penalty
  const [showAddPenalty, setShowAddPenalty] = useState(false);
  const [penaltyTitle, setPenaltyTitle] = useState('');
  const [penaltyDesc, setPenaltyDesc] = useState('');
  const [penaltyCategory, setPenaltyCategory] = useState<CustomPenalty['category']>('discipline');
  const [penaltyIntensity, setPenaltyIntensity] = useState<CustomPenalty['intensity']>('moderate');
  const [penaltyIcon, setPenaltyIcon] = useState('⚡');

  // Form states for creating new reward
  const [showAddReward, setShowAddReward] = useState(false);
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardDesc, setRewardDesc] = useState('');
  const [rewardCategory, setRewardCategory] = useState<CustomReward['category']>('treat');
  const [rewardCostXp, setRewardCostXp] = useState(150);
  const [rewardIcon, setRewardIcon] = useState('🎁');

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleEnforcePenalty = (penalty: CustomPenalty) => {
    soundManager.playTick();
    triggerHaptic('medium');
    const updated = PenaltyRewardService.enforcePenalty(penalty.id);
    setPenalties(updated);
    setNotificationMsg(`Enforced: "${penalty.title}". Accountability logged!`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleDeletePenalty = (id: string) => {
    soundManager.playTick();
    const updated = PenaltyRewardService.deletePenalty(id);
    setPenalties(updated);
  };

  const handleCreatePenalty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!penaltyTitle.trim()) return;

    soundManager.playCelebration();
    triggerHaptic('success');
    const created = PenaltyRewardService.addPenalty({
      title: penaltyTitle,
      description: penaltyDesc || 'Custom habit accountability commitment.',
      category: penaltyCategory,
      intensity: penaltyIntensity,
      icon: penaltyIcon,
      isAutoApplied: true,
    });
    setPenalties(PenaltyRewardService.getPenalties());
    setShowAddPenalty(false);
    setPenaltyTitle('');
    setPenaltyDesc('');
    setNotificationMsg(`Custom penalty "${created.title}" added to system!`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleClaimReward = (reward: CustomReward) => {
    soundManager.playCelebration();
    triggerHaptic('success');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#fb923c', '#38bdf8', '#4ade80'],
    });

    const updated = PenaltyRewardService.claimReward(reward.id);
    setRewards(updated);
    if (reward.costXp && onUpdatePoints) {
      onUpdatePoints(-reward.costXp);
    }
    setNotificationMsg(`🎉 Claimed Reward: "${reward.title}"! Enjoy your well-earned victory.`);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleDeleteReward = (id: string) => {
    soundManager.playTick();
    const updated = PenaltyRewardService.deleteReward(id);
    setRewards(updated);
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardTitle.trim()) return;

    soundManager.playCelebration();
    triggerHaptic('success');
    const created = PenaltyRewardService.addReward({
      title: rewardTitle,
      description: rewardDesc || 'Custom milestone achievement reward.',
      category: rewardCategory,
      icon: rewardIcon,
      costXp: Number(rewardCostXp) || 100,
    });
    setRewards(PenaltyRewardService.getRewards());
    setShowAddReward(false);
    setRewardTitle('');
    setRewardDesc('');
    setNotificationMsg(`Custom reward "${created.title}" unlocked in system!`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-purple-100 shadow-2xl p-5 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md">
            ⚖️
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
              Accountability & Motivation Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Penalties & Rewards System
            </h2>
          </div>
        </div>

        {/* Status Toast */}
        {notificationMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex p-1 bg-purple-50 rounded-2xl border border-purple-100">
          <button
            onClick={() => {
              setActiveTab('penalties');
              soundManager.playTick();
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'penalties'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-700 hover:text-purple-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Custom Penalties ({penalties.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('rewards');
              soundManager.playTick();
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'rewards'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-700 hover:text-purple-900'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Custom Rewards ({rewards.length})</span>
          </button>
        </div>

        {/* Penalties View */}
        {activeTab === 'penalties' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Daily Miss / Resistance Penalties
                </h3>
                <p className="text-[11px] text-slate-500">
                  Penalties are enforced when you miss a day's mission or break your streak.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddPenalty(!showAddPenalty);
                  soundManager.playTick();
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Penalty</span>
              </button>
            </div>

            {/* Add Penalty Form */}
            {showAddPenalty && (
              <form
                onSubmit={handleCreatePenalty}
                className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3 animate-in fade-in"
              >
                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                  Create Custom Penalty
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Penalty Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 50 Jump Squats or $10 Book Fine"
                      value={penaltyTitle}
                      onChange={(e) => setPenaltyTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Category & Icon
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={penaltyCategory}
                        onChange={(e) =>
                          setPenaltyCategory(e.target.value as CustomPenalty['category'])
                        }
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-purple-500"
                      >
                        <option value="physical">Physical Exercise</option>
                        <option value="digital">Digital Detox</option>
                        <option value="discipline">Discipline / Habit</option>
                        <option value="financial">Financial Charity</option>
                        <option value="custom">Custom</option>
                      </select>
                      <input
                        type="text"
                        value={penaltyIcon}
                        onChange={(e) => setPenaltyIcon(e.target.value)}
                        className="w-12 text-center px-1 py-2 text-sm rounded-xl bg-white border border-purple-200"
                        title="Emoji Icon"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Description / Execution Rule
                  </label>
                  <input
                    type="text"
                    placeholder="Details on how and when to execute this penalty..."
                    value={penaltyDesc}
                    onChange={(e) => setPenaltyDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddPenalty(false)}
                    className="px-3 py-1.5 rounded-xl bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
                  >
                    Save Penalty
                  </button>
                </div>
              </form>
            )}

            {/* List of Penalties */}
            <div className="space-y-2.5">
              {penalties.map((penalty) => (
                <div
                  key={penalty.id}
                  className="p-3.5 rounded-2xl bg-white hover:bg-purple-50/40 border border-purple-100 hover:border-purple-200 shadow-xs flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl p-2 rounded-xl bg-purple-50 border border-purple-100 shrink-0">
                      {penalty.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {penalty.title}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            penalty.intensity === 'strict'
                              ? 'bg-rose-100 text-rose-700'
                              : penalty.intensity === 'moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {penalty.intensity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {penalty.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEnforcePenalty(penalty)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <span>Enforce</span>
                      {penalty.timesEnforced > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-purple-200 text-purple-900 text-[10px] font-bold">
                          {penalty.timesEnforced}x
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeletePenalty(penalty.id)}
                      className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Penalty"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rewards View */}
        {activeTab === 'rewards' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Milestone & Victory Rewards
                </h3>
                <p className="text-[11px] text-slate-500">
                  Earn XP by conquering days, then redeem your custom incentives.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddReward(!showAddReward);
                  soundManager.playTick();
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Reward</span>
              </button>
            </div>

            {/* Add Reward Form */}
            {showAddReward && (
              <form
                onSubmit={handleCreateReward}
                className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3 animate-in fade-in"
              >
                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                  Create Custom Reward
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Reward Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Specialty Coffee or Relaxing Massage"
                      value={rewardTitle}
                      onChange={(e) => setRewardTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Category & Icon
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={rewardCategory}
                        onChange={(e) =>
                          setRewardCategory(e.target.value as CustomReward['category'])
                        }
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-purple-500"
                      >
                        <option value="treat">Culinary Treat</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="leisure">Leisure & Wellness</option>
                        <option value="purchase">Product Purchase</option>
                        <option value="experience">Experience / Outing</option>
                        <option value="custom">Custom</option>
                      </select>
                      <input
                        type="text"
                        value={rewardIcon}
                        onChange={(e) => setRewardIcon(e.target.value)}
                        className="w-12 text-center px-1 py-2 text-sm rounded-xl bg-white border border-purple-200"
                        title="Emoji Icon"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="What does this reward entail?"
                      value={rewardDesc}
                      onChange={(e) => setRewardDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      XP Cost
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={rewardCostXp}
                      onChange={(e) => setRewardCostXp(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddReward(false)}
                    className="px-3 py-1.5 rounded-xl bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
                  >
                    Save Reward
                  </button>
                </div>
              </form>
            )}

            {/* List of Rewards */}
            <div className="space-y-2.5">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="p-3.5 rounded-2xl bg-white hover:bg-purple-50/40 border border-purple-100 hover:border-purple-200 shadow-xs flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl p-2 rounded-xl bg-purple-50 border border-purple-100 shrink-0">
                      {reward.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {reward.title}
                        </span>
                        {reward.costXp && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            {reward.costXp} XP
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {reward.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleClaimReward(reward)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Claim</span>
                      {reward.timesClaimed > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                          {reward.timesClaimed}x
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteReward(reward.id)}
                      className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Reward"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
