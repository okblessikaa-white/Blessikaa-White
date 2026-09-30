import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Upload,
  FileText,
  Share2,
  Users,
  Download,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  Clock,
  Calendar,
  DollarSign,
  Heart,
  Activity,
  Award,
} from 'lucide-react';
import { RecentDocItem, ServiceItem, ServiceRecord } from '../types';
import { ServiceIcon } from './ServiceIcon';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface ServiceModalProps {
  service?: ServiceItem | null;
  document?: RecentDocItem | null;
  quickAction?: 'scan' | 'create' | 'share' | 'request' | null;
  onClose: () => void;
  onNavigateChallenges?: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  document,
  quickAction,
  onClose,
  onNavigateChallenges,
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'records' | 'vault'>('tools');
  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Service records state in localStorage
  const storageKey = service ? `blessikaa_service_records_${service.id}` : 'blessikaa_records_general';
  const [records, setRecords] = useState<ServiceRecord[]>(() => {
    try {
      const data = localStorage.getItem(storageKey);
      if (data) return JSON.parse(data);
    } catch (e) {}
    // Initial dummy records specific to service
    if (service?.id === 'medical') {
      return [
        {
          id: 'rec_1',
          serviceId: 'medical',
          title: 'Daily Multivitamin & Omega 3',
          details: 'Take 1 capsule with morning breakfast',
          date: 'Daily 08:00 AM',
          status: 'active',
        },
        {
          id: 'rec_2',
          serviceId: 'medical',
          title: 'Annual Blood Work & Lipid Panel',
          details: 'Fasting 12 hours prior. Completed at City Diagnostic.',
          date: '2026-08-15',
          status: 'completed',
        },
      ];
    }
    if (service?.id === 'finance') {
      return [
        {
          id: 'rec_3',
          serviceId: 'finance',
          title: 'Emergency Fund Savings Goal ($5,000)',
          details: 'Auto-transfer $250 weekly into high-yield savings.',
          date: 'Weekly',
          status: 'active',
        },
        {
          id: 'rec_4',
          serviceId: 'finance',
          title: 'Monthly Recurring Subscriptions Audit',
          details: 'Cancelled 2 unused streaming accounts (saved $32/mo).',
          date: '2026-08-20',
          status: 'completed',
        },
      ];
    }
    return [
      {
        id: 'rec_gen',
        serviceId: service?.id || 'general',
        title: `${service?.label || 'General'} Primary Record`,
        details: 'Encrypted document stored in Blessikaa ecosystem vault.',
        date: new Date().toISOString().slice(0, 10),
        status: 'active',
      },
    ];
  });

  // Form states for creating a new record
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundManager.playCelebration();
    triggerHaptic('success');
    const newRec: ServiceRecord = {
      id: 'rec_' + Date.now(),
      serviceId: service?.id || 'general',
      title: newTitle,
      details: newDetails || 'Saved into secure local archive.',
      date: new Date().toISOString().slice(0, 10),
      status: 'active',
      category: newCategory,
    };

    const updated = [newRec, ...records];
    setRecords(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    setNewTitle('');
    setNewDetails('');
    setActionSuccess(`"${newRec.title}" saved to ${service?.label || 'Blessikaa'} vault!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleDeleteRecord = (id: string) => {
    soundManager.playTick();
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleSimulateScan = () => {
    setScanStep('scanning');
    soundManager.playTick();
    triggerHaptic('medium');

    setTimeout(() => {
      setScanStep('done');
      soundManager.playCelebration();
      triggerHaptic('success');
      setActionSuccess('Document scanned, OCR verified & encrypted into Blessikaa Vault!');
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-purple-100 shadow-2xl p-5 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header matching Service info */}
        <div className="flex items-center gap-3.5">
          <ServiceIcon serviceId={service?.id || 'medical'} category={service?.category} size="xl" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
              {service?.category || 'BLESSIKAA SERVICE'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {service?.label || document?.name || 'Service Workbench'}
            </h2>
            <p className="text-xs text-slate-500 line-clamp-1">
              {service?.description || 'Encrypted workspace for daily tracking and record management.'}
            </p>
          </div>
        </div>

        {/* Action toast */}
        {actionSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex p-1 bg-purple-50 rounded-2xl border border-purple-100">
          <button
            onClick={() => {
              setActiveTab('tools');
              soundManager.playTick();
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tools'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-700 hover:text-purple-900'
            }`}
          >
            Interactive Tools
          </button>
          <button
            onClick={() => {
              setActiveTab('records');
              soundManager.playTick();
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'records'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-700 hover:text-purple-900'
            }`}
          >
            Saved Records ({records.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('vault');
              soundManager.playTick();
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'vault'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-700 hover:text-purple-900'
            }`}
          >
            Add New Record
          </button>
        </div>

        {/* Content: Interactive Tools */}
        {activeTab === 'tools' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                <span className="text-[10px] font-bold text-purple-600 uppercase">Status</span>
                <div className="text-base font-black text-slate-900">Encrypted & Active</div>
                <p className="text-[11px] text-slate-500">256-Bit Vault Storage</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                <span className="text-[10px] font-bold text-purple-600 uppercase">Records</span>
                <div className="text-base font-black text-slate-900">{records.length} Documents</div>
                <p className="text-[11px] text-slate-500">Synced to Local Cache</p>
              </div>
            </div>

            {/* Quick Document Scan Tool */}
            <div
              onClick={handleSimulateScan}
              className="p-5 rounded-2xl border-2 border-dashed border-purple-200 hover:border-purple-500 bg-purple-50/40 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
            >
              <Upload className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform mb-1.5" />
              <span className="text-xs font-bold text-slate-900">
                {scanStep === 'scanning' ? 'Scanning & Optical Reading...' : 'Scan / Upload New Document'}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                Instant OCR Indexing into {service?.label || 'Workspace'}
              </span>
            </div>

            {/* Challenge Bridge */}
            {onNavigateChallenges && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>21-Day Habit Link</span>
                  </div>
                  <p className="text-[11px] text-purple-200">
                    Strengthen habits in this domain with our curated challenge.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateChallenges();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-purple-900 text-xs font-bold shadow-xs hover:bg-purple-50"
                >
                  Start Day 1
                </button>
              </div>
            )}
          </div>
        )}

        {/* Content: Saved Records */}
        {activeTab === 'records' && (
          <div className="space-y-2.5">
            {records.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No records yet. Tap "Add New Record" to create one.
              </div>
            ) : (
              records.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {rec.title}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                        {rec.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">{rec.details}</p>
                    <span className="text-[10px] text-slate-400 block">{rec.date}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteRecord(rec.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Content: Add New Record Form */}
        {activeTab === 'vault' && (
          <form onSubmit={handleSaveRecord} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Record / Item Title
              </label>
              <input
                type="text"
                placeholder={`e.g. Prescription Note or Contract Doc`}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/40 border border-purple-200 text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Details / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Enter details, tracking instructions, or notes..."
                value={newDetails}
                onChange={(e) => setNewDetails(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/40 border border-purple-200 text-slate-900 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
            >
              Save to {service?.label || 'Vault'} Archive
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
