import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Plus,
  Search,
  Camera,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Activity,
  Heart,
  Pill,
  Trash2,
  Edit3,
  TrendingUp,
  Share2,
  Download,
  Check,
  ChevronRight,
  Package,
  Sliders,
  DollarSign,
  User,
  Users,
  RefreshCw,
  Bell,
  Sparkles,
  Flame,
  HelpCircle,
  PhoneCall,
  Settings,
  MoreVertical,
} from 'lucide-react';
import {
  MedicineItem,
  MedicineMode,
  MedicineWorkspaceRole,
  MedicationDoseLog,
  SymptomNote,
} from '../types';
import { INITIAL_MEDICINES, INITIAL_FAMILY_PROFILES } from '../data/pharmacyData';
import { WorkspaceSelector } from './medicine/WorkspaceSelector';
import { AddMedicineSmartWizard } from './medicine/AddMedicineSmartWizard';
import { PrescriptionScannerModal } from './medicine/PrescriptionScannerModal';
import { MedicineDetailModal } from './medicine/MedicineDetailModal';
import { MissedDoseModal } from './medicine/MissedDoseModal';
import { SideEffectModal } from './medicine/SideEffectModal';
import { RefillModal } from './medicine/RefillModal';
import { DoctorWorkspace } from './medicine/DoctorWorkspace';
import { PharmacistWorkspace } from './medicine/PharmacistWorkspace';
import { FamilyCareModal } from './medicine/FamilyCareModal';
import { MedicineSafetyCenterModal } from './medicine/MedicineSafetyCenterModal';
import { MedicineDocumentsModal } from './medicine/MedicineDocumentsModal';
import { MedicineSettingsModal } from './medicine/MedicineSettingsModal';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface PharmacyDashboardScreenProps {
  onBack: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const PharmacyDashboardScreen: React.FC<PharmacyDashboardScreenProps> = ({
  onBack,
  onNavigateTab,
}) => {
  // Workspace Role State (Stored in localStorage)
  const [workspaceRole, setWorkspaceRole] = useState<MedicineWorkspaceRole>(() => {
    try {
      const saved = localStorage.getItem('blessikaa_medicine_role');
      if (
        saved === 'personal' ||
        saved === 'caregiver' ||
        saved === 'doctor' ||
        saved === 'pharmacist' ||
        saved === 'clinic'
      ) {
        return saved;
      }
    } catch {}
    return 'personal';
  });

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);

  // Active Family/Caregiver Profile
  const [activeProfileId, setActiveProfileId] = useState<string>('fam_me');

  // Medicines List in localStorage
  const [medicines, setMedicines] = useState<MedicineItem[]>(() => {
    try {
      const saved = localStorage.getItem('blessikaa_medicines_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MEDICINES;
  });

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Modals
  const [showAddWizard, setShowAddWizard] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [selectedDetailMed, setSelectedDetailMed] = useState<MedicineItem | null>(null);
  const [editingMedicine, setEditingMedicine] = useState<MedicineItem | null>(null);
  const [missedDoseMed, setMissedDoseMed] = useState<MedicineItem | null>(null);
  const [showSideEffectModal, setShowSideEffectModal] = useState(false);
  const [sideEffectDefaultMed, setSideEffectDefaultMed] = useState<MedicineItem | null>(null);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [refillDefaultMed, setRefillDefaultMed] = useState<MedicineItem | null>(null);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('blessikaa_medicine_role', workspaceRole);
    } catch {}
  }, [workspaceRole]);

  useEffect(() => {
    try {
      localStorage.setItem('blessikaa_medicines_list', JSON.stringify(medicines));
    } catch {}
  }, [medicines]);

  // Overall Adherence Calculation
  const activeMeds = medicines.filter((m) => m.status === 'active');
  const avgAdherence =
    activeMeds.length > 0
      ? Math.round(
          activeMeds.reduce((acc, m) => acc + (m.adherenceRate || 100), 0) / activeMeds.length
        )
      : 100;

  // Stock check
  const lowStockMeds = activeMeds.filter((m) => m.currentStock <= m.reorderLevel);

  // Filtered Medicines
  const filteredMedicines = activeMeds.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.condition?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1-Tap Dose Logger
  const handleLogDose = (medicineId: string, status: 'taken' | 'skipped') => {
    soundManager.playSuccess();
    triggerHaptic('heavy');
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateStr = now.toISOString().slice(0, 10);

    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId) {
          const newDoses = [
            {
              date: dateStr,
              time: timeStr,
              scheduledTime: med.specificTimes[0] || '08:00',
              status,
            },
            ...(med.dosesLogged || []),
          ];

          const takenCount = newDoses.filter((d) => d.status === 'taken').length;
          const totalCount = newDoses.length;
          const adherenceRate = Math.min(100, Math.round((takenCount / Math.max(1, totalCount)) * 100));

          const newStock = status === 'taken' ? Math.max(0, med.currentStock - 1) : med.currentStock;
          const streak = status === 'taken' ? (med.streakDays || 0) + 1 : med.streakDays || 0;

          return {
            ...med,
            dosesLogged: newDoses,
            currentStock: newStock,
            adherenceRate,
            streakDays: streak,
          };
        }
        return med;
      })
    );
  };

  // Add / Save Medicine Handler
  const handleSaveMedicine = (newOrUpdated: MedicineItem) => {
    soundManager.playCelebration();
    triggerHaptic('heavy');
    setMedicines((prev) => {
      const idx = prev.findIndex((m) => m.id === newOrUpdated.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newOrUpdated;
        return updated;
      }
      return [newOrUpdated, ...prev];
    });
    setShowAddWizard(false);
    setEditingMedicine(null);
  };

  // Delete Medicine Handler
  const handleDeleteMedicine = (id: string) => {
    soundManager.playTick();
    triggerHaptic('medium');
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  // Import Scanner Medicines
  const handleImportScanned = (scannedList: MedicineItem[]) => {
    soundManager.playCelebration();
    setMedicines((prev) => [...scannedList, ...prev]);
  };

  // Save Side Effect
  const handleSaveSideEffect = (medicineId: string, symptom: SymptomNote) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId) {
          return {
            ...med,
            symptomNotes: [symptom, ...(med.symptomNotes || [])],
          };
        }
        return med;
      })
    );
  };

  // Update Stock from Refill
  const handleUpdateStock = (medicineId: string, addedStock: number) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId) {
          return {
            ...med,
            currentStock: med.currentStock + addedStock,
          };
        }
        return med;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F7FD] via-[#F4F0FA] to-[#EDE7F6] dark:from-[#0F0B1E] dark:via-[#140F2B] dark:to-[#1B1438] text-slate-900 dark:text-slate-100 pb-20 font-sans">
      {/* ========================================================= */}
      {/* TOP HEADER                                                */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-30 bg-white/85 dark:bg-[#15102D]/85 backdrop-blur-md border-b border-purple-200/70 dark:border-[#2D245A] px-4 py-3 sm:px-6 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundManager.playTick();
                onBack();
              }}
              className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-[#251E4E] dark:hover:bg-[#2F2763] text-purple-900 dark:text-purple-200 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Return to Services Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Medicine & Rx
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase">
                  Service
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden xs:block">
                Manage medications, schedules & clinical health
              </p>
            </div>
          </div>

          {/* Right Header Actions: Workspace Selector & Settings */}
          <div className="flex items-center gap-2">
            <WorkspaceSelector
              currentRole={workspaceRole}
              onSelectRole={(newRole) => setWorkspaceRole(newRole)}
              isOpen={isWorkspaceMenuOpen}
              onToggleOpen={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            />

            <button
              type="button"
              onClick={() => {
                soundManager.playTick();
                setShowSettingsModal(true);
              }}
              className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-[#251E4E] text-purple-900 dark:text-purple-200 transition-all cursor-pointer shadow-xs"
              title="Medicine Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN CONTAINER                                            */}
      {/* ========================================================= */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* ========================================================= */}
        {/* VIEW ROUTING BASED ON ROLE WORKSPACE                      */}
        {/* ========================================================= */}

        {/* 1. DOCTOR WORKSPACE */}
        {workspaceRole === 'doctor' ? (
          <DoctorWorkspace onIssuePrescription={handleSaveMedicine} />
        ) : workspaceRole === 'pharmacist' ? (
          /* 2. PHARMACIST WORKSPACE */
          <PharmacistWorkspace />
        ) : (
          /* 3. PERSONAL / CAREGIVER / CLINIC PATIENT-FACING HOME */
          <div className="space-y-6">
            {/* Search Bar & Caregiver Profile Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medicine, prescription, or condition..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E1A3D] border border-purple-200/90 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white shadow-xs focus:outline-hidden focus:border-purple-600"
                />
              </div>

              {/* Family / Dependent Profile Pill */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  setShowFamilyModal(true);
                }}
                className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-[#1E1A3D] border border-purple-200/90 dark:border-[#382F6A] rounded-2xl text-xs font-black text-slate-800 dark:text-white shadow-xs hover:bg-purple-50 cursor-pointer transition-all"
              >
                <Users className="w-4 h-4 text-purple-600" />
                <span>
                  Profile:{' '}
                  {INITIAL_FAMILY_PROFILES.find((p) => p.id === activeProfileId)?.name || 'Me (Alex)'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* ===================================================== */}
            {/* HEALTH & SAFETY WARNING CARD (IF ANY)                 */}
            {/* ===================================================== */}
            {lowStockMeds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-300 dark:border-amber-700/60 rounded-3xl flex flex-wrap items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shrink-0 shadow-md shadow-amber-500/20">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-200">
                      Low Stock Alert: {lowStockMeds.map((m) => m.name).join(', ')}
                    </h4>
                    <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90">
                      Only a few doses remain in your cabinet. Order refills now to maintain steady therapy.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRefillDefaultMed(lowStockMeds[0]);
                    setShowRefillModal(true);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-black shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  Order Refill
                </button>
              </motion.div>
            )}

            {/* ===================================================== */}
            {/* PRIMARY QUICK ACTIONS BAR (Standardized Button System) */}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {/* 1. Add Medicine */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  setEditingMedicine(null);
                  setShowAddWizard(true);
                }}
                className="p-3 bg-purple-600 hover:bg-purple-700 border-2 border-purple-600 hover:border-purple-400 text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer active:scale-95 transition-all group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span className="text-[11px] font-black leading-tight text-center">Add Med</span>
              </button>

              {/* 2. Scan Prescription */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  setShowScannerModal(true);
                }}
                className="p-3 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50 dark:hover:bg-[#251E4E] border-2 border-purple-200/80 dark:border-[#382F6A] hover:border-purple-500 dark:hover:border-purple-400 text-purple-700 dark:text-purple-300 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:shadow-purple-500/10 cursor-pointer active:scale-95 transition-all"
              >
                <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-[11px] font-black leading-tight text-center">Scan Rx</span>
              </button>

              {/* 3. Refill */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  setRefillDefaultMed(medicines[0] || null);
                  setShowRefillModal(true);
                }}
                className="p-3 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50 dark:hover:bg-[#251E4E] border-2 border-purple-200/80 dark:border-[#382F6A] hover:border-purple-500 dark:hover:border-purple-400 text-slate-800 dark:text-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:shadow-purple-500/10 cursor-pointer active:scale-95 transition-all"
              >
                <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] font-black leading-tight text-center">Refill</span>
              </button>

              {/* 4. Log Dose (1-tap) */}
              <button
                type="button"
                onClick={() => {
                  if (medicines.length > 0) {
                    triggerHaptic('light');
                    handleLogDose(medicines[0].id, 'taken');
                  }
                }}
                className="p-3 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50 dark:hover:bg-[#251E4E] border-2 border-purple-200/80 dark:border-[#382F6A] hover:border-purple-500 dark:hover:border-purple-400 text-slate-800 dark:text-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:shadow-purple-500/10 cursor-pointer active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-black leading-tight text-center">Log Dose</span>
              </button>

              {/* 5. Side Effect */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  setSideEffectDefaultMed(medicines[0] || null);
                  setShowSideEffectModal(true);
                }}
                className="p-3 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50 dark:hover:bg-[#251E4E] border-2 border-purple-200/80 dark:border-[#382F6A] hover:border-purple-500 dark:hover:border-purple-400 text-slate-800 dark:text-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:shadow-purple-500/10 cursor-pointer active:scale-95 transition-all"
              >
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="text-[11px] font-black leading-tight text-center">Side Effect</span>
              </button>

              {/* 6. Documents Vault */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  setShowDocumentsModal(true);
                }}
                className="p-3 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50 dark:hover:bg-[#251E4E] border-2 border-purple-200/80 dark:border-[#382F6A] hover:border-purple-500 dark:hover:border-purple-400 text-slate-800 dark:text-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:shadow-purple-500/10 cursor-pointer active:scale-95 transition-all"
              >
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[11px] font-black leading-tight text-center">Docs</span>
              </button>

              {/* 7. Safety Center */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  setShowSafetyModal(true);
                }}
                className="p-3 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50 dark:hover:bg-[#251E4E] border-2 border-purple-200/80 dark:border-[#382F6A] hover:border-purple-500 dark:hover:border-purple-400 text-slate-800 dark:text-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:shadow-purple-500/10 cursor-pointer active:scale-95 transition-all"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-black leading-tight text-center">Safety</span>
              </button>

              {/* 8. Family / Caregiver */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  setShowFamilyModal(true);
                }}
                className="p-3 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50 dark:hover:bg-[#251E4E] border-2 border-purple-200/80 dark:border-[#382F6A] hover:border-purple-500 dark:hover:border-purple-400 text-slate-800 dark:text-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:shadow-purple-500/10 cursor-pointer active:scale-95 transition-all"
              >
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] font-black leading-tight text-center">Care Team</span>
              </button>

              {/* 9. Reminders & Alerts */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  triggerHaptic('light');
                  setShowSettingsModal(true);
                }}
                className="p-3 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50 dark:hover:bg-[#251E4E] border-2 border-purple-200/80 dark:border-[#382F6A] hover:border-purple-500 dark:hover:border-purple-400 text-slate-800 dark:text-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:shadow-purple-500/10 cursor-pointer active:scale-95 transition-all"
              >
                <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-[11px] font-black leading-tight text-center">Reminders</span>
              </button>
            </div>

            {/* ===================================================== */}
            {/* TODAY'S DOSAGE SCHEDULE & ADHERENCE TIMELINE          */}
            {/* ===================================================== */}
            <div className="p-4 sm:p-5 bg-white dark:bg-[#1E1A3D] rounded-3xl border border-purple-200/80 dark:border-[#382F6A] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      Today's Schedule & Adherence
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Overall Therapy Adherence: <strong>{avgAdherence}%</strong>
                    </p>
                  </div>
                </div>

                {/* Progress pill */}
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-xs font-black">
                  {avgAdherence}% On Track
                </span>
              </div>

              {/* Chronological Timeline */}
              <div className="space-y-2 pt-1">
                {activeMeds.map((med) => {
                  const firstTime = med.specificTimes[0] || '08:00';
                  const isLoggedToday = med.dosesLogged?.some(
                    (d) => d.date === new Date().toISOString().slice(0, 10) && d.status === 'taken'
                  );

                  return (
                    <div
                      key={med.id}
                      className="p-3 bg-purple-50/50 dark:bg-[#191535] rounded-2xl border border-purple-100 dark:border-[#2E275E] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-black text-purple-700 dark:text-purple-300 bg-white dark:bg-[#251E4E] px-2.5 py-1 rounded-xl shadow-2xs">
                          {firstTime}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-slate-900 dark:text-white">
                              {med.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold">
                              ({med.strength})
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            {med.dosageQuantity} {med.dosageUnit} • {med.mealTiming}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isLoggedToday ? (
                          <span className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-[11px] font-black flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Taken</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleLogDose(med.id, 'taken')}
                            className="px-3 py-1 bg-white hover:bg-emerald-50 dark:bg-[#251E4E] border border-emerald-500 text-emerald-700 dark:text-emerald-300 rounded-xl text-[11px] font-black flex items-center gap-1 cursor-pointer active:scale-95 transition-all shadow-2xs"
                          >
                            <span>✓ Take</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setMissedDoseMed(med)}
                          className="p-1.5 text-slate-400 hover:text-amber-500 cursor-pointer"
                          title="Missed dose options"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ===================================================== */}
            {/* MY MEDICINES CARDS SECTION                            */}
            {/* ===================================================== */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    My Active Medications ({filteredMedicines.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tap any medication card for full schedule, safety and lab monitoring details
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setEditingMedicine(null);
                    setShowAddWizard(true);
                  }}
                  className="px-3.5 py-1.5 bg-purple-100 dark:bg-[#251E4E] text-purple-800 dark:text-purple-200 hover:bg-purple-200 rounded-2xl text-xs font-black flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine</span>
                </button>
              </div>

              {/* Medicines Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredMedicines.map((med) => {
                  const isLow = med.currentStock <= med.reorderLevel;

                  return (
                    <motion.div
                      key={med.id}
                      whileHover={{ scale: 1.008 }}
                      onClick={() => {
                        soundManager.playTick();
                        setSelectedDetailMed(med);
                      }}
                      className="p-4 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50/40 dark:hover:bg-[#231E47] rounded-3xl border border-purple-200/80 dark:border-[#382F6A] shadow-xs cursor-pointer transition-all space-y-3 relative group"
                    >
                      {/* Top Row: Name, Strength, Form */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-lg shrink-0">
                            💊
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                                {med.name}
                              </h4>
                              <span className="px-2 py-0.2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-md text-[10px] font-black">
                                {med.strength}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {med.dosageQuantity} {med.dosageUnit} • {med.frequency}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-[#251E4E] text-slate-600 dark:text-slate-300 rounded-lg">
                          {med.form}
                        </span>
                      </div>

                      {/* Middle: Food instructions & Next Dose */}
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-purple-50 dark:border-[#2A2359]">
                        <span>🍽 {med.mealTiming}</span>
                        <span>⏱ Next: {med.specificTimes[0] || '08:00 AM'}</span>
                        <span className={isLow ? 'text-rose-500 font-bold' : ''}>
                          📦 {med.currentStock} in cabinet
                        </span>
                      </div>

                      {/* Bottom Quick Action Buttons on Card */}
                      <div
                        className="flex items-center justify-between pt-2 border-t border-purple-50 dark:border-[#2A2359]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleLogDose(med.id, 'taken')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>✓ Taken</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              soundManager.playTick();
                              alert(`Snoozed ${med.name} dose reminder for 15 minutes.`);
                            }}
                            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-[#251E4E] text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <Clock className="w-3 h-3" />
                            <span>Snooze</span>
                          </button>
                        </div>

                        <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* ALL MODAL PORTALS                                         */}
      {/* ========================================================= */}

      {/* 1. Progressive Add / Edit Medicine Smart Wizard */}
      {showAddWizard && (
        <AddMedicineSmartWizard
          initialMedicine={editingMedicine}
          onSave={handleSaveMedicine}
          onClose={() => {
            setShowAddWizard(false);
            setEditingMedicine(null);
          }}
          onOpenScanner={() => {
            setShowAddWizard(false);
            setShowScannerModal(true);
          }}
        />
      )}

      {/* 2. AI Prescription Scanner */}
      {showScannerModal && (
        <PrescriptionScannerModal
          onImportMedicines={handleImportScanned}
          onClose={() => setShowScannerModal(false)}
        />
      )}

      {/* 3. 8-Tab Comprehensive Medicine Detail Modal */}
      {selectedDetailMed && (
        <MedicineDetailModal
          medicine={selectedDetailMed}
          onEdit={(med) => {
            setSelectedDetailMed(null);
            setEditingMedicine(med);
            setShowAddWizard(true);
          }}
          onDelete={handleDeleteMedicine}
          onClose={() => setSelectedDetailMed(null)}
          onLogDose={handleLogDose}
          onOpenSideEffect={(med) => {
            setSideEffectDefaultMed(med);
            setShowSideEffectModal(true);
          }}
          onOpenRefill={(med) => {
            setRefillDefaultMed(med);
            setShowRefillModal(true);
          }}
        />
      )}

      {/* 4. Missed Dose Protocol Modal */}
      {missedDoseMed && (
        <MissedDoseModal
          medicine={missedDoseMed}
          onTakeDose={(id) => handleLogDose(id, 'taken')}
          onSkipDose={(id) => handleLogDose(id, 'skipped')}
          onSnooze={(id) => alert(`Snoozed ${missedDoseMed.name} for 15 minutes.`)}
          onClose={() => setMissedDoseMed(null)}
        />
      )}

      {/* 5. Side Effect & Adverse Reaction Logger */}
      {showSideEffectModal && (
        <SideEffectModal
          medicines={medicines}
          defaultMedicine={sideEffectDefaultMed}
          onSaveReport={handleSaveSideEffect}
          onClose={() => {
            setShowSideEffectModal(false);
            setSideEffectDefaultMed(null);
          }}
        />
      )}

      {/* 6. Refill Stock Manager */}
      {showRefillModal && (
        <RefillModal
          medicines={medicines}
          defaultMedicine={refillDefaultMed}
          onUpdateStock={handleUpdateStock}
          onClose={() => {
            setShowRefillModal(false);
            setRefillDefaultMed(null);
          }}
        />
      )}

      {/* 7. Family & Pet Caregiver Profiles */}
      {showFamilyModal && (
        <FamilyCareModal
          currentProfileId={activeProfileId}
          onSelectProfile={(id) => setActiveProfileId(id)}
          onClose={() => setShowFamilyModal(false)}
        />
      )}

      {/* 8. Clinical Safety & Interactions Center */}
      {showSafetyModal && (
        <MedicineSafetyCenterModal
          medicines={medicines}
          onClose={() => setShowSafetyModal(false)}
        />
      )}

      {/* 9. Medical Documents Vault */}
      {showDocumentsModal && (
        <MedicineDocumentsModal onClose={() => setShowDocumentsModal(false)} />
      )}

      {/* 10. Medicine Settings */}
      {showSettingsModal && (
        <MedicineSettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
};
