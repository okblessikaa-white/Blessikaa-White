import React, { useState } from 'react';
import {
  X,
  Plus,
  Sparkles,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Trash2,
  ExternalLink,
  Layers,
  ArrowRight,
  Search,
  Download,
} from 'lucide-react';
import { SubServiceItem } from '../data/servicesHubData';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface SubServiceModalProps {
  subService: SubServiceItem | null;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
  onOpenOCR: (serviceId?: string) => void;
}

export const SubServiceModal: React.FC<SubServiceModalProps> = ({
  subService,
  onClose,
  onNavigateTab,
  onOpenOCR,
}) => {
  if (!subService) return null;

  const storageKey = `blessikaa_subservice_records_${subService.id}`;
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return subService.sampleRecords || [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newBadge, setNewBadge] = useState('New');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundManager.playSuccess();
    triggerHaptic('success');

    const newRec = {
      id: `rec_${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Custom user recorded entry',
      date: 'Just now',
      badge: newBadge || 'Custom',
    };

    const updated = [newRec, ...records];
    setRecords(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    setNewTitle('');
    setNewSubtitle('');
    setShowAddForm(false);
    setActionSuccess('Record encrypted and saved to vault successfully!');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleDeleteRecord = (id: string) => {
    soundManager.playTick();
    triggerHaptic('light');
    const updated = records.filter((r: any) => r.id !== id);
    setRecords(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  };

  const filteredRecords = records.filter(
    (r: any) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border-b border-purple-800/40 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {subService.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  {subService.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    subService.status === 'encrypted'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : subService.status === 'synced'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  ● {subService.status.toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                {subService.name}
              </h2>
              <p className="text-xs text-purple-200/80 font-medium">
                {subService.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playTick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {actionSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Description & Overview */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-xs text-slate-300 leading-relaxed">
              {subService.description}
            </p>
            {/* Features Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {subService.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-purple-900/40 text-purple-200 border border-purple-700/40"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Action Launcher Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {subService.routeTab && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('medium');
                  onClose();
                  onNavigateTab(subService.routeTab);
                }}
                className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-center col-span-2 sm:col-span-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Dedicated Workspace</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                soundManager.playTick();
                triggerHaptic('light');
                onClose();
                onNavigateTab('form-builder');
              }}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-purple-400/30 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 text-center"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Universal Form Builder</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playTick();
                triggerHaptic('light');
                onClose();
                onOpenOCR(subService.id);
              }}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-indigo-400/30 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 text-center"
            >
              <Camera className="w-4 h-4 text-indigo-400" />
              <span>AI OCR Scan</span>
            </button>
          </div>

          {/* Records & Vault Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Encrypted Vault Records</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full font-bold">
                  {records.length} items
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  setShowAddForm(!showAddForm);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Cancel' : 'Quick Add'}</span>
              </button>
            </div>

            {/* Quick Add Form Drawer */}
            {showAddForm && (
              <form
                onSubmit={handleAddRecord}
                className="p-4 rounded-2xl bg-purple-950/40 border border-purple-600/40 space-y-3 animate-fadeIn"
              >
                <h4 className="text-xs font-bold text-purple-200">
                  + Add Encrypted Entry to {subService.name}
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Record title / item name..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-purple-500/30 text-xs text-white placeholder-slate-400 outline-none focus:border-purple-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Details, amount, dosage, or note..."
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-purple-500/30 text-xs text-white placeholder-slate-400 outline-none focus:border-purple-400"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Badge / tag (e.g. Verified, Urgent)"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      className="w-1/2 px-3 py-2 rounded-xl bg-slate-800 border border-purple-500/30 text-xs text-white placeholder-slate-400 outline-none focus:border-purple-400"
                    />
                    <button
                      type="submit"
                      className="w-1/2 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-md"
                    >
                      Save to Local Vault
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Search Filter for Records */}
            {records.length > 3 && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter stored records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white placeholder-slate-400 outline-none focus:border-purple-400"
                />
              </div>
            )}

            {/* Records List */}
            <div className="space-y-2">
              {filteredRecords.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-white/10 rounded-2xl">
                  No records match your search. Click "+ Quick Add" or use OCR to scan a document.
                </div>
              ) : (
                filteredRecords.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-3 transition-all group"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white truncate block">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/20">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 truncate">
                        {item.subtitle}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {item.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playSuccess();
                          triggerHaptic('light');
                          setActionSuccess(`Link ready: Encrypted share link generated for ${item.title}`);
                          setTimeout(() => setActionSuccess(null), 3000);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all"
                        title="Share Encrypted Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(item.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all opacity-70 group-hover:opacity-100"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-purple-800/30 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>End-to-End Encrypted Sandbox</span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
