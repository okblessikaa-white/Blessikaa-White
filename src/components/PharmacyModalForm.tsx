import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Check,
  Camera,
  Sparkles,
  AlertTriangle,
  Clock,
  Calendar,
  DollarSign,
  ShieldAlert,
  Activity,
  FileText,
  User,
  Package,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  Sliders,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { MedicineItem, MedicineMode, DrugInteractionInfo } from '../types';
import { COMMON_DRUG_DATABASE } from '../data/pharmacyData';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface PharmacyModalFormProps {
  initialMedicine?: MedicineItem | null;
  mode: MedicineMode;
  onSave: (medicine: MedicineItem) => void;
  onClose: () => void;
}

const MEDICINE_FORMS = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Injection',
  'IV',
  'Patch',
  'Ointment',
  'Cream',
  'Inhaler',
  'Spray',
  'Drops',
  'Suppository',
  'Gel',
  'Lotion',
  'Powder',
  'Sachet',
  'Pre-filled syringe',
];

const FORM_VARIANTS = [
  'Immediate Release',
  'Extended Release',
  'Sustained Release',
  'Enteric Coated',
  'Chewable',
  'Dispersible',
  'Sublingual',
  'Buccal',
  'Transdermal',
];

const ROUTES = [
  'Oral',
  'Sublingual',
  'Buccal',
  'Topical',
  'Transdermal',
  'Inhaled',
  'Intranasal',
  'Ophthalmic',
  'Otic',
  'Rectal',
  'Vaginal',
  'Intravenous',
  'Intramuscular',
  'Subcutaneous',
];

export const PharmacyModalForm: React.FC<PharmacyModalFormProps> = ({
  initialMedicine,
  mode: initialMode,
  onSave,
  onClose,
}) => {
  const [currentMode, setCurrentMode] = useState<MedicineMode>(initialMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Field sections accordion state (for professional mode)
  const [openSections, setOpenSections] = useState({
    patient: true,
    basic: true,
    dosing: true,
    course: true,
    safety: true,
    monitoring: false,
    billing: false,
    inventory: false,
    reminders: true,
  });

  // OCR Scan Simulation State
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<MedicineItem>>(() => {
    if (initialMedicine) return { ...initialMedicine };
    const todayStr = new Date().toISOString().slice(0, 10);
    return {
      id: 'med_' + Date.now(),
      name: '',
      genericName: '',
      strength: '500mg',
      strengthUnit: 'mg',
      form: 'Tablet',
      formVariant: 'Immediate Release',
      packaging: 'Strip',
      quantityPerPack: 10,
      batchNumber: 'LOT-' + Math.floor(1000 + Math.random() * 9000),
      mfgDate: todayStr,
      expiryDate: '2027-12-31',
      manufacturer: '',
      mrp: 25.0,
      scheduleCategory: 'Schedule H',

      // Patient
      patientName: 'Alex Mercer',
      patientAge: 38,
      patientGender: 'Male',
      patientPhone: '+1 (555) 234-5678',
      emergencyContact: 'Sarah Mercer (+1 555-987-6543)',
      allergies: ['Penicillin'],

      // Prescription
      prescriptionNumber: 'RX-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      prescriptionDate: todayStr,
      prescriptionType: 'New',
      consultationType: 'In-person',
      doctorName: '',
      doctorSpeciality: 'General Medicine',
      condition: '',
      primaryDiagnosis: '',
      icd10Code: '',

      // Dosing
      dosageQuantity: 1,
      dosageUnit: 'tablet(s)',
      frequency: 'Twice daily',
      timesPerDay: 2,
      specificTimes: ['08:00', '20:00'],
      mealTiming: 'With food',
      routeOfAdministration: 'Oral',
      adminInstructions: 'Take with a glass of water',

      // Course
      courseType: 'Single course',
      startDate: todayStr,
      durationDays: 7,
      totalDoses: 14,

      // Safety & instructions
      foodRestrictions: ['With food'],
      storageConditions: 'Room temperature',
      missedDoseAction: 'Take when remembered, skip if next dose due soon',
      contraindications: [],
      precautions: ['Complete full course as prescribed'],
      sideEffectsCommon: [],

      // Monitoring
      labTestsRequired: [],
      vitalSignsMonitoring: ['Blood Pressure', 'Pulse'],
      reviewDate: '',

      // Financial
      costPerUnit: 2.5,
      costPerDose: 2.5,
      costPerDay: 5.0,
      totalCourseCost: 35.0,
      insuranceCovered: true,
      copayAmount: 5.0,
      paymentMethod: 'Cash',

      // Inventory
      currentStock: 14,
      reorderLevel: 4,
      reorderQuantity: 20,

      // Reminders & Status
      reminderBeforeMinutes: 15,
      remindMissedDose: true,
      remindRefill: true,
      reminderChannels: ['App'],
      status: 'active',
      adherenceRate: 100,
      streakDays: 0,
      dosesLogged: [],
    };
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter drug database suggestions
  const drugSuggestions = COMMON_DRUG_DATABASE.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDrugSuggestion = (drug: (typeof COMMON_DRUG_DATABASE)[0]) => {
    soundManager.playTick();
    setFormData((prev) => ({
      ...prev,
      name: drug.name,
      genericName: drug.genericName,
      strength: drug.strengths[0] || prev.strength || '500mg',
      form: drug.forms[0] || 'Tablet',
      condition: prev.condition || drug.indications,
      foodRestrictions: [drug.food],
      storageConditions: (drug.storage as any) || 'Room temperature',
      sideEffectsCommon: drug.sideEffects,
      precautions: [drug.precautions],
    }));
    setSearchQuery(drug.name);
    setShowSuggestions(false);
  };

  // Update Times per day array when timesPerDay changes
  const handleTimesPerDayChange = (count: number) => {
    let times = ['08:00'];
    if (count === 2) times = ['08:00', '20:00'];
    if (count === 3) times = ['08:00', '14:00', '20:00'];
    if (count === 4) times = ['08:00', '12:00', '16:00', '20:00'];

    const duration = typeof formData.durationDays === 'number' ? formData.durationDays : 30;
    const total = duration * count;

    setFormData((prev) => ({
      ...prev,
      timesPerDay: count,
      specificTimes: times,
      totalDoses: total,
      frequency:
        count === 1
          ? 'Once daily'
          : count === 2
          ? 'Twice daily'
          : count === 3
          ? 'Thrice daily'
          : '4 times daily',
    }));
  };

  // Simulate AI Prescription OCR Scan
  const handleSimulateOCR = () => {
    setIsScanning(true);
    soundManager.playSuccess();
    triggerHaptic('medium');

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      setFormData((prev) => ({
        ...prev,
        name: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin Trihydrate',
        strength: '500mg',
        form: 'Capsule',
        doctorName: 'Dr. Sarah Jenkins (MD)',
        condition: 'Upper Respiratory Infection',
        dosageQuantity: 1,
        dosageUnit: 'capsule(s)',
        timesPerDay: 3,
        frequency: 'Thrice daily',
        specificTimes: ['08:00', '14:00', '20:00'],
        mealTiming: 'With food',
        durationDays: 7,
        totalDoses: 21,
        currentStock: 21,
        reorderLevel: 5,
        storageConditions: 'Room temperature',
        adminInstructions: 'Complete all 21 capsules even if feeling better',
      }));
      setTimeout(() => setScanSuccess(false), 3000);
    }, 1400);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Please enter a medicine name');
      return;
    }

    soundManager.playCelebration();
    triggerHaptic('medium');

    const finalItem: MedicineItem = {
      ...(formData as MedicineItem),
      id: formData.id || 'med_' + Date.now(),
      name: formData.name.trim(),
      strength: formData.strength || '500mg',
      form: formData.form || 'Tablet',
      dosageQuantity: Number(formData.dosageQuantity) || 1,
      dosageUnit: formData.dosageUnit || 'tablet(s)',
      frequency: formData.frequency || 'Once daily',
      timesPerDay: Number(formData.timesPerDay) || 1,
      specificTimes: formData.specificTimes?.length ? formData.specificTimes : ['08:00'],
      mealTiming: formData.mealTiming || 'With food',
      startDate: formData.startDate || new Date().toISOString().slice(0, 10),
      durationDays: formData.durationDays || 7,
      totalDoses:
        formData.totalDoses ||
        (typeof formData.durationDays === 'number'
          ? formData.durationDays * (formData.timesPerDay || 1)
          : 90),
      currentStock: Number(formData.currentStock) || 10,
      reorderLevel: Number(formData.reorderLevel) || 3,
      reorderQuantity: Number(formData.reorderQuantity) || 10,
      status: formData.status || 'active',
      adherenceRate: formData.adherenceRate ?? 100,
      streakDays: formData.streakDays ?? 0,
      dosesLogged: formData.dosesLogged || [],
    };

    onSave(finalItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-[#1E1A3D] w-full max-w-3xl rounded-3xl shadow-2xl border border-purple-100 dark:border-[#352F63] overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Top Header Bar with Mode Switch */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/30">
              💊
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                {initialMedicine ? 'Edit Prescription / Rx' : 'Add Medication / Rx'}
              </h2>
              <p className="text-[11px] text-purple-200">
                {currentMode === 'simple'
                  ? 'Patient & Caregiver Friendly Mode'
                  : 'Professional Clinical & Pharmacy Mode'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher Toggle */}
            <div className="flex items-center bg-black/25 p-1 rounded-2xl border border-white/20">
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  setCurrentMode('simple');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentMode === 'simple'
                    ? 'bg-white text-purple-900 shadow-xs'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                Simple Mode
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  setCurrentMode('professional');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentMode === 'professional'
                    ? 'bg-white text-purple-900 shadow-xs'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                Pro Mode
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick OCR Scan Banner */}
        <div className="px-4 py-2.5 bg-purple-50 dark:bg-[#251E4E] border-b border-purple-100 dark:border-[#352F63] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-semibold">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>Have a paper prescription? Use Smart AI scan to auto-fill</span>
          </div>
          <button
            type="button"
            onClick={handleSimulateOCR}
            disabled={isScanning}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isScanning ? 'Scanning Rx...' : 'Scan Rx Photo'}</span>
          </button>
        </div>

        {scanSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border-b border-emerald-200 flex items-center gap-2 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Prescription OCR auto-extracted: Amoxicillin 500mg (3x Daily for 7 days)</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ========================================================= */}
          {/* 1. SIMPLE MODE FORM (Patient & Caregiver Friendly)        */}
          {/* ========================================================= */}
          {currentMode === 'simple' ? (
            <div className="space-y-5">
              {/* Basic Information */}
              <div className="bg-white dark:bg-[#241E4B] p-4 sm:p-5 rounded-2xl border border-purple-100 dark:border-[#372F66] shadow-2xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-2">
                  <span>1. Basic Medicine Information</span>
                </h3>

                {/* Medicine Name with auto-suggest */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="e.g. Paracetamol, Metformin, Amoxicillin..."
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:border-purple-600 focus:outline-hidden"
                  />

                  {/* Auto-suggest dropdown */}
                  {showSuggestions && searchQuery.length > 0 && drugSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-[#1E1A3D] border border-purple-200 dark:border-[#352F63] rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                      {drugSuggestions.map((drug) => (
                        <button
                          key={drug.name}
                          type="button"
                          onClick={() => handleSelectDrugSuggestion(drug)}
                          className="w-full px-3.5 py-2 text-left hover:bg-purple-50 dark:hover:bg-[#2A2357] transition-colors border-b border-slate-100 dark:border-[#2C2556] last:border-0 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {drug.name}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {drug.genericName} • {drug.category}
                            </p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold rounded-lg">
                            {drug.strengths[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Strength
                    </label>
                    <input
                      type="text"
                      value={formData.strength || ''}
                      onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                      placeholder="e.g. 500mg, 10mg/5ml, 60,000 IU"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:border-purple-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Form
                    </label>
                    <select
                      value={formData.form || 'Tablet'}
                      onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:border-purple-600 focus:outline-hidden"
                    >
                      {MEDICINE_FORMS.slice(0, 10).map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dosage Schedule */}
              <div className="bg-white dark:bg-[#241E4B] p-4 sm:p-5 rounded-2xl border border-purple-100 dark:border-[#372F66] shadow-2xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  2. Dosage & Timing Schedule
                </h3>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      How Many to Take
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={formData.dosageQuantity || 1}
                        onChange={(e) =>
                          setFormData({ ...formData, dosageQuantity: parseFloat(e.target.value) })
                        }
                        className="w-20 px-3 py-2 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                        {formData.form?.toLowerCase() || 'tablet'}(s)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Times Per Day
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => handleTimesPerDayChange(count)}
                          className={`flex-1 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                            formData.timesPerDay === count
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-[#1E1A3D] text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {count}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Specific Times */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Specific Reminder Times
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(formData.specificTimes || ['08:00']).map((time, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500">#{idx + 1}</span>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => {
                            const newTimes = [...(formData.specificTimes || [])];
                            newTimes[idx] = e.target.value;
                            setFormData({ ...formData, specificTimes: newTimes });
                          }}
                          className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meal Timing */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    When to Take
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['With food', 'Empty stomach', 'After meals', 'Anytime'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData({ ...formData, mealTiming: opt as any })}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                          formData.mealTiming === opt
                            ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 text-purple-700 dark:text-purple-300'
                            : 'bg-slate-50 dark:bg-[#1E1A3D] border-slate-200 dark:border-[#352F63] text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="bg-white dark:bg-[#241E4B] p-4 sm:p-5 rounded-2xl border border-purple-100 dark:border-[#372F66] shadow-2xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  3. Course Duration & Stock
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      How Long to Take
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[3, 7, 14, 30].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              durationDays: d,
                              totalDoses: d * (formData.timesPerDay || 1),
                            });
                          }}
                          className={`py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            formData.durationDays === d
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 dark:bg-[#1E1A3D] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {d} Days
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Current Stock Left
                    </label>
                    <input
                      type="number"
                      value={formData.currentStock || 10}
                      onChange={(e) =>
                        setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Remind Refill When Below
                    </label>
                    <input
                      type="number"
                      value={formData.reorderLevel || 3}
                      onChange={(e) =>
                        setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Prescriber Info (Optional) */}
              <div className="bg-white dark:bg-[#241E4B] p-4 sm:p-5 rounded-2xl border border-purple-100 dark:border-[#372F66] shadow-2xs space-y-3.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  4. Doctor & Condition (Optional)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Doctor's Name
                    </label>
                    <input
                      type="text"
                      value={formData.doctorName || ''}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      placeholder="e.g. Dr. Robert Chen"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Prescribed For / Symptoms
                    </label>
                    <input
                      type="text"
                      value={formData.condition || ''}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      placeholder="e.g. Fever, Acid reflux, Blood pressure"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* 2. PROFESSIONAL MODE FORM (Doctor/Pharmacist/Hospital)    */
            /* ========================================================= */
            <div className="space-y-4">
              {/* Section: Patient Profile */}
              <div className="bg-white dark:bg-[#241E4B] rounded-2xl border border-purple-100 dark:border-[#372F66] shadow-2xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('patient')}
                  className="w-full px-4 py-3 bg-purple-50/70 dark:bg-[#2B2358] flex items-center justify-between text-left font-bold text-xs text-purple-900 dark:text-purple-200"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    Patient Information & Medical Profile
                  </span>
                  {openSections.patient ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openSections.patient && (
                  <div className="p-4 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Patient Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.patientName || ''}
                          onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Age & Gender
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={formData.patientAge || 35}
                            onChange={(e) =>
                              setFormData({ ...formData, patientAge: parseInt(e.target.value) || 0 })
                            }
                            className="w-16 px-2 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                          />
                          <select
                            value={formData.patientGender || 'Male'}
                            onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                            className="flex-1 px-2 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Emergency Contact
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContact || ''}
                          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                          placeholder="Name & Phone"
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Documented Allergies & Sensitivities
                      </label>
                      <input
                        type="text"
                        value={formData.allergies?.join(', ') || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            allergies: e.target.value.split(',').map((s) => s.trim()),
                          })
                        }
                        placeholder="e.g. Penicillin, Sulfa drugs, Peanuts, NSAIDs"
                        className="w-full px-3 py-1.5 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-xs font-semibold text-red-900 dark:text-red-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section: Detailed Medicine & Clinical Specs */}
              <div className="bg-white dark:bg-[#241E4B] rounded-2xl border border-purple-100 dark:border-[#372F66] shadow-2xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('basic')}
                  className="w-full px-4 py-3 bg-purple-50/70 dark:bg-[#2B2358] flex items-center justify-between text-left font-bold text-xs text-purple-900 dark:text-purple-200"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-600" />
                    Clinical Medicine Details & Form Variants
                  </span>
                  {openSections.basic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openSections.basic && (
                  <div className="p-4 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Brand Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Generic (Molecule) Name
                        </label>
                        <input
                          type="text"
                          value={formData.genericName || ''}
                          onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                          placeholder="e.g. Acetaminophen, Metformin HCl"
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Form Type
                        </label>
                        <select
                          value={formData.form || 'Tablet'}
                          onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        >
                          {MEDICINE_FORMS.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Form Variant
                        </label>
                        <select
                          value={formData.formVariant || 'Immediate Release'}
                          onChange={(e) => setFormData({ ...formData, formVariant: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        >
                          {FORM_VARIANTS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Strength
                        </label>
                        <input
                          type="text"
                          value={formData.strength || ''}
                          onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Schedule Category
                        </label>
                        <select
                          value={formData.scheduleCategory || 'Schedule H'}
                          onChange={(e) =>
                            setFormData({ ...formData, scheduleCategory: e.target.value as any })
                          }
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        >
                          <option>OTC</option>
                          <option>Prescription Only</option>
                          <option>Schedule H</option>
                          <option>Schedule H1</option>
                          <option>Schedule X</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section: Prescription Details & ICD-10 */}
              <div className="bg-white dark:bg-[#241E4B] rounded-2xl border border-purple-100 dark:border-[#372F66] shadow-2xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('dosing')}
                  className="w-full px-4 py-3 bg-purple-50/70 dark:bg-[#2B2358] flex items-center justify-between text-left font-bold text-xs text-purple-900 dark:text-purple-200"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Prescription ID, ICD-10 Diagnosis & Route
                  </span>
                  {openSections.dosing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openSections.dosing && (
                  <div className="p-4 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Prescription Number
                        </label>
                        <input
                          type="text"
                          value={formData.prescriptionNumber || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, prescriptionNumber: e.target.value })
                          }
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-bold font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Primary Diagnosis / ICD-10
                        </label>
                        <input
                          type="text"
                          value={formData.primaryDiagnosis || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, primaryDiagnosis: e.target.value })
                          }
                          placeholder="e.g. Type 2 DM (E11.9)"
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Route of Administration
                        </label>
                        <select
                          value={formData.routeOfAdministration || 'Oral'}
                          onChange={(e) =>
                            setFormData({ ...formData, routeOfAdministration: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        >
                          {ROUTES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Advanced Dosing Parameters */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Frequency
                        </label>
                        <select
                          value={formData.frequency || 'Twice daily'}
                          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        >
                          <option>Once daily</option>
                          <option>Twice daily</option>
                          <option>Thrice daily</option>
                          <option>4 times daily</option>
                          <option>Every 4 hours</option>
                          <option>Every 6 hours</option>
                          <option>Every 8 hours</option>
                          <option>Every 12 hours</option>
                          <option>Weekly</option>
                          <option>PRN / As needed</option>
                          <option>Tapering schedule</option>
                          <option>Titration</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Maintenance Dose
                        </label>
                        <input
                          type="text"
                          value={formData.maintenanceDose || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, maintenanceDose: e.target.value })
                          }
                          placeholder="e.g. 500mg BID"
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Max Daily Dose
                        </label>
                        <input
                          type="text"
                          value={formData.maxDailyDose || ''}
                          onChange={(e) => setFormData({ ...formData, maxDailyDose: e.target.value })}
                          placeholder="e.g. 2000mg"
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Course Type
                        </label>
                        <select
                          value={formData.courseType || 'Single course'}
                          onChange={(e) => setFormData({ ...formData, courseType: e.target.value as any })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        >
                          <option>Single course</option>
                          <option>Recurring course</option>
                          <option>Lifelong</option>
                          <option>PRN / As needed</option>
                          <option>Titration course</option>
                          <option>Tapering course</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section: Safety, Contraindications & Interactions */}
              <div className="bg-white dark:bg-[#241E4B] rounded-2xl border border-purple-100 dark:border-[#372F66] shadow-2xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('safety')}
                  className="w-full px-4 py-3 bg-purple-50/70 dark:bg-[#2B2358] flex items-center justify-between text-left font-bold text-xs text-purple-900 dark:text-purple-200"
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    Safety, Interactions, Warnings & Precautions
                  </span>
                  {openSections.safety ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openSections.safety && (
                  <div className="p-4 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Contraindications (Absolute / Relative)
                        </label>
                        <input
                          type="text"
                          value={formData.contraindications?.join(', ') || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contraindications: e.target.value.split(',').map((s) => s.trim()),
                            })
                          }
                          placeholder="e.g. Severe renal impairment, Heart failure"
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Storage & Handling
                        </label>
                        <select
                          value={formData.storageConditions || 'Room temperature'}
                          onChange={(e) =>
                            setFormData({ ...formData, storageConditions: e.target.value as any })
                          }
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#1E1A3D] border border-slate-200 dark:border-[#352F63] rounded-xl text-xs font-semibold"
                        >
                          <option>Room temperature</option>
                          <option>Refrigerate (2-8°C)</option>
                          <option>Protect from light</option>
                          <option>Protect from moisture</option>
                          <option>Do not freeze</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Button Bar */}
          <div className="pt-3 border-t border-slate-200 dark:border-[#352F63] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#251E4E] hover:bg-slate-200 dark:hover:bg-[#2C245C] text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{initialMedicine ? 'Update Prescription' : 'Save Prescription & Schedule'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
