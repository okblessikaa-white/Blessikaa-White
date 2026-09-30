import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Check,
  Camera,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  Pill,
  Search,
  Sliders,
  Users,
  MoveUp,
  MoveDown,
  BookmarkCheck,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { MedicineItem, FamilyCareProfile } from '../../types';
import { COMMON_DRUG_DATABASE, INITIAL_FAMILY_PROFILES } from '../../data/pharmacyData';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';
import {
  FORM_CATEGORIES,
  PRESET_FIELD_MAP,
  BUILT_IN_CONDITIONAL_RULES,
  PresetType,
  MedicineMode,
  ConditionalRule,
} from './FormBuilderConfig';
import { BlueFamilyPickerPopup } from './BlueFamilyPickerPopup';

interface AddMedicineSmartWizardProps {
  initialMedicine?: MedicineItem | null;
  onSave: (medicine: MedicineItem) => void;
  onClose: () => void;
  onOpenScanner?: () => void;
}

const COMMON_FORMS = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Injection',
  'IV Infusion',
  'Drops',
  'Inhaler',
  'Cream',
  'Ointment',
  'Spray',
  'Sachet',
  'Patch',
  'Gel',
  'Suppository',
];

const FREQUENCIES = [
  { label: 'Once daily', count: 1, defaultTimes: ['08:00'] },
  { label: 'Twice daily', count: 2, defaultTimes: ['08:00', '20:00'] },
  { label: 'Three times daily', count: 3, defaultTimes: ['08:00', '14:00', '20:00'] },
  { label: 'Four times daily', count: 4, defaultTimes: ['08:00', '12:00', '16:00', '20:00'] },
  { label: 'Every 8 hours', count: 3, defaultTimes: ['06:00', '14:00', '22:00'] },
  { label: 'Every 12 hours', count: 2, defaultTimes: ['08:00', '20:00'] },
  { label: 'As needed (PRN)', count: 1, defaultTimes: ['08:00'] },
];

const DURATION_PRESETS = [
  { label: '3 Days', days: 3 },
  { label: '7 Days', days: 7 },
  { label: '14 Days', days: 14 },
  { label: '30 Days', days: 30 },
  { label: 'Ongoing', days: 'ongoing' as const },
];

export const AddMedicineSmartWizard: React.FC<AddMedicineSmartWizardProps> = ({
  initialMedicine,
  onSave,
  onClose,
  onOpenScanner,
}) => {
  // Wizard Stages: 'mode_select' -> 'customize_builder' -> 'fill_form' -> 'review'
  const [stage, setStage] = useState<'mode_select' | 'customize_builder' | 'fill_form' | 'review'>(
    () => (initialMedicine ? 'fill_form' : 'mode_select')
  );

  // Active builder sub-tab
  const [builderTab, setBuilderTab] = useState<'fields' | 'logic'>('fields');

  // Mode & Preset Selection
  const [selectedMode, setSelectedMode] = useState<MedicineMode>('simple');
  const [selectedPreset, setSelectedPreset] = useState<PresetType>('personal');

  // Draft Restore Alert
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState<string | null>(null);
  const [lastAutosaveTime, setLastAutosaveTime] = useState<string | null>(null);

  // Active Category Order & Field Enablement State
  const [categoryOrder, setCategoryOrder] = useState<string[]>(() =>
    FORM_CATEGORIES.map((c) => c.id)
  );

  const [enabledFields, setEnabledFields] = useState<Set<string>>(() => {
    try {
      if (initialMedicine) {
        return new Set<string>(PRESET_FIELD_MAP.doctor);
      }
      const savedCustom = localStorage.getItem('blessikaa_custom_form_preset');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return new Set<string>(parsed);
        }
      }
    } catch {}
    return new Set<string>(PRESET_FIELD_MAP.personal);
  });

  // Conditional Logic Rules State
  const [rules, setRules] = useState<ConditionalRule[]>(BUILT_IN_CONDITIONAL_RULES);

  // Category Accordion open state in builder
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    basic: true,
    patient: true,
    dosage: true,
    prescription: false,
    course: false,
    safety: false,
    monitoring: false,
    inventory: false,
    billing: false,
    reminders: false,
  });

  // Blue Family Picker Popup State
  const [showFamilyPicker, setShowFamilyPicker] = useState(false);
  const [selectedFamilyProfile, setSelectedFamilyProfile] = useState<FamilyCareProfile>(
    INITIAL_FAMILY_PROFILES[0]
  );

  // Form Step within 'fill_form'
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State Data
  const [formData, setFormData] = useState<Partial<MedicineItem>>(() => {
    if (initialMedicine) return { ...initialMedicine };
    const today = new Date().toISOString().slice(0, 10);
    return {
      id: `med_${Date.now()}`,
      name: '',
      genericName: '',
      strength: '500mg',
      strengthUnit: 'mg',
      form: 'Tablet',
      formVariant: 'Standard',
      dosageQuantity: 1,
      dosageUnit: 'tablet(s)',
      frequency: 'Twice daily',
      timesPerDay: 2,
      specificTimes: ['08:00', '20:00'],
      mealTiming: 'With food',
      startDate: today,
      durationDays: 14,
      condition: '',
      doctorName: '',
      doctorSpeciality: '',
      prescriptionNumber: '',
      routeOfAdministration: 'Oral',
      adminInstructions: '',
      storageConditions: 'Room temperature',
      currentStock: 30,
      reorderLevel: 6,
      reorderQuantity: 30,
      reminderBeforeMinutes: 15,
      remindMissedDose: true,
      remindRefill: true,
      reminderChannels: ['App'],
      status: 'active',
      dosesLogged: [],
      symptomNotes: [],
      patientName: 'Me (Alex)',
    };
  });

  // Autocomplete search suggestions for Medicine Name
  const [searchQuery, setSearchQuery] = useState(formData.name || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Dynamic AI Suggestions / Triggered warnings
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Check for saved draft on initial mount
  useEffect(() => {
    if (!initialMedicine) {
      try {
        const savedDraft = localStorage.getItem('blessikaa_medicine_draft');
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed?.data?.name) {
            setHasSavedDraft(true);
            setDraftTimestamp(parsed?.timestamp || 'recently');
          }
        }
      } catch {}
    }
  }, [initialMedicine]);

  // Autosave draft on form change
  useEffect(() => {
    if (!initialMedicine && formData.name?.trim()) {
      const timer = setTimeout(() => {
        try {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          localStorage.setItem(
            'blessikaa_medicine_draft',
            JSON.stringify({
              data: formData,
              preset: selectedPreset,
              mode: selectedMode,
              step: formStep,
              timestamp: nowStr,
            })
          );
          setLastAutosaveTime(nowStr);
        } catch {}
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [formData, selectedPreset, selectedMode, formStep, initialMedicine]);

  // Restore Draft
  const handleRestoreDraft = () => {
    try {
      const savedDraft = localStorage.getItem('blessikaa_medicine_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.data) setFormData(parsed.data);
        if (parsed.preset) applyPreset(parsed.preset);
        if (parsed.mode) setSelectedMode(parsed.mode);
        if (parsed.step) setFormStep(parsed.step);
        if (parsed.data.name) setSearchQuery(parsed.data.name);
        setStage('fill_form');
        setHasSavedDraft(false);
        soundManager.playSuccess();
        triggerHaptic('medium');
      }
    } catch {}
  };

  // Discard Draft
  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem('blessikaa_medicine_draft');
      setHasSavedDraft(false);
      soundManager.playTick();
    } catch {}
  };

  // Update presets
  const applyPreset = (preset: PresetType) => {
    setSelectedPreset(preset);
    soundManager.playTick();
    triggerHaptic('light');

    if (preset === 'personal') {
      setSelectedMode('simple');
      setEnabledFields(new Set(PRESET_FIELD_MAP.personal));
    } else if (preset === 'caregiver') {
      setSelectedMode('advanced');
      setEnabledFields(new Set(PRESET_FIELD_MAP.caregiver));
    } else if (preset === 'doctor') {
      setSelectedMode('expert');
      setEnabledFields(new Set(PRESET_FIELD_MAP.doctor));
    } else if (preset === 'pharmacist') {
      setSelectedMode('expert');
      setEnabledFields(new Set(PRESET_FIELD_MAP.pharmacist));
    } else if (preset === 'clinic') {
      setSelectedMode('expert');
      setEnabledFields(new Set(PRESET_FIELD_MAP.clinic));
    } else if (preset === 'custom') {
      setSelectedMode('custom');
    }
  };

  // Apply Mode
  const applyMode = (mode: MedicineMode) => {
    setSelectedMode(mode);
    soundManager.playTick();
    triggerHaptic('light');

    if (mode === 'simple') {
      applyPreset('personal');
    } else if (mode === 'advanced') {
      applyPreset('caregiver');
    } else if (mode === 'expert') {
      applyPreset('doctor');
    }
  };

  // Evaluate Conditional Rules on form changes
  useEffect(() => {
    rules.forEach((rule) => {
      if (!rule.enabled) return;
      const val = (formData as any)[rule.conditionField];
      let matches = false;

      if (rule.operator === 'equals') {
        matches = val === rule.conditionValue;
      } else if (rule.operator === 'in' && Array.isArray(rule.conditionValue)) {
        matches = rule.conditionValue.includes(val);
      } else if (rule.operator === 'contains') {
        matches = String(val || '').toLowerCase().includes(String(rule.conditionValue).toLowerCase());
      } else if (rule.operator === 'is_truthy') {
        matches = Boolean(val);
      }

      if (matches && rule.action === 'show') {
        setEnabledFields((prev) => {
          const next = new Set(prev);
          rule.targetFields.forEach((f) => next.add(f));
          return next;
        });
      }
    });
  }, [formData.form, formData.courseType, formData.scheduleCategory, rules]);

  // Toggle individual field in builder
  const toggleField = (fieldId: string) => {
    soundManager.playTick();
    triggerHaptic('light');
    setEnabledFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldId)) {
        if (fieldId === 'name') return next;
        next.delete(fieldId);
      } else {
        next.add(fieldId);
      }
      return next;
    });
  };

  // Toggle whole category
  const toggleCategoryAll = (categoryId: string, enable: boolean) => {
    soundManager.playTick();
    const category = FORM_CATEGORIES.find((c) => c.id === categoryId);
    if (!category) return;

    setEnabledFields((prev) => {
      const next = new Set(prev);
      category.fields.forEach((f) => {
        if (enable) {
          next.add(f.id);
        } else {
          if (f.id !== 'name') next.delete(f.id);
        }
      });
      return next;
    });
  };

  // Move Category Up / Down
  const moveCategory = (index: number, direction: 'up' | 'down') => {
    soundManager.playTick();
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categoryOrder.length) return;

    const newOrder = [...categoryOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setCategoryOrder(newOrder);
  };

  // Toggle Conditional Rule
  const toggleRule = (ruleId: string) => {
    soundManager.playTick();
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  // Save current configuration as custom preset
  const handleSaveAsCustomPreset = () => {
    soundManager.playCelebration();
    triggerHaptic('heavy');
    try {
      localStorage.setItem('blessikaa_custom_form_preset', JSON.stringify(Array.from(enabledFields)));
      setSelectedPreset('custom');
      alert('Your custom medicine form preset has been saved!');
    } catch {}
  };

  // Drug autocomplete filtering
  const matchedDrugs = COMMON_DRUG_DATABASE.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSelectSuggestedDrug = (drug: (typeof COMMON_DRUG_DATABASE)[0]) => {
    soundManager.playSuccess();
    triggerHaptic('medium');

    const defaultUnit = drug.forms[0]?.toLowerCase().includes('syrup')
      ? 'ml'
      : drug.forms[0]?.toLowerCase().includes('inhaler')
      ? 'puffs'
      : drug.forms[0]?.toLowerCase().includes('drops')
      ? 'drops'
      : 'tablet(s)';

    setFormData((prev) => ({
      ...prev,
      name: drug.name,
      genericName: drug.genericName,
      form: drug.forms[0] || 'Tablet',
      strength: drug.strengths[0] || '500mg',
      dosageUnit: defaultUnit,
      condition: drug.indications.split(',')[0] || '',
      adminInstructions: drug.precautions || '',
      mealTiming: drug.food.toLowerCase().includes('empty')
        ? 'Empty stomach'
        : drug.food.toLowerCase().includes('with')
        ? 'With food'
        : 'Anytime',
    }));

    setSearchQuery(drug.name);
    setShowSuggestions(false);

    // Trigger AI suggestion alerts
    const alerts: string[] = [];
    if (drug.name.toLowerCase().includes('insulin') || drug.forms.includes('Injection')) {
      alerts.push('Detected Injectable / Biologic: Route of Admin & Cold Storage (2-8°C) activated.');
      setEnabledFields((prev) => new Set([...prev, 'routeOfAdministration', 'storageConditions']));
    }
    if (drug.category.toLowerCase().includes('antibiotic')) {
      alerts.push('Antibiotic Regimen: Recommend completing full course duration.');
    }
    setAiSuggestions(alerts);
  };

  // Add all AI recommended fields
  const handleApplyAiRecommendations = () => {
    soundManager.playSuccess();
    triggerHaptic('medium');
    setEnabledFields((prev) => {
      const next = new Set(prev);
      next.add('adminInstructions');
      next.add('foodRestrictions');
      next.add('storageConditions');
      next.add('missedDoseAction');
      return next;
    });
    setAiSuggestions([]);
  };

  // Next / Back handlers
  const handleNextStep = () => {
    if (formStep === 1 && !formData.name?.trim()) {
      alert('Please enter or select a medicine name to continue.');
      return;
    }
    soundManager.playTick();
    triggerHaptic('light');
    if (formStep < 5) {
      setFormStep((prev) => (prev + 1) as any);
    } else {
      setStage('review');
    }
  };

  const handlePrevStep = () => {
    soundManager.playTick();
    triggerHaptic('light');
    if (stage === 'review') {
      setStage('fill_form');
      setFormStep(5);
    } else if (formStep > 1) {
      setFormStep((prev) => (prev - 1) as any);
    } else {
      setStage('mode_select');
    }
  };

  // Final Save
  const handleFinalSave = () => {
    soundManager.playCelebration();
    triggerHaptic('heavy');

    const finalItem: MedicineItem = {
      id: formData.id || `med_${Date.now()}`,
      name: formData.name || 'Prescription Medicine',
      genericName: formData.genericName || '',
      strength: formData.strength || '500mg',
      strengthUnit: formData.strengthUnit || 'mg',
      form: formData.form || 'Tablet',
      formVariant: formData.formVariant || 'Standard',
      dosageQuantity: Number(formData.dosageQuantity) || 1,
      dosageUnit: formData.dosageUnit || 'tablet(s)',
      frequency: formData.frequency || 'Twice daily',
      timesPerDay: formData.timesPerDay || 2,
      specificTimes: formData.specificTimes?.length ? formData.specificTimes : ['08:00', '20:00'],
      mealTiming: formData.mealTiming || 'With food',
      startDate: formData.startDate || new Date().toISOString().slice(0, 10),
      durationDays: formData.durationDays || 14,
      condition: formData.condition || '',
      doctorName: formData.doctorName || '',
      doctorSpeciality: formData.doctorSpeciality || '',
      prescriptionNumber: formData.prescriptionNumber || '',
      icd10Code: formData.icd10Code || '',
      primaryDiagnosis: formData.primaryDiagnosis || '',
      offLabelJustification: formData.offLabelJustification || '',
      routeOfAdministration: formData.routeOfAdministration || 'Oral',
      adminInstructions: formData.adminInstructions || '',
      maxDailyDose: formData.maxDailyDose || '',
      storageConditions: formData.storageConditions || 'Room temperature',
      missedDoseAction:
        formData.missedDoseAction || 'Take as soon as remembered unless near next dose.',
      blackBoxWarning: formData.blackBoxWarning || '',
      foodRestrictions: formData.foodRestrictions || [],
      labTestsRequired: formData.labTestsRequired || [],
      testFrequency: formData.testFrequency,
      tdmTargetRange: formData.tdmTargetRange,
      reviewDate: formData.reviewDate,
      currentStock: Number(formData.currentStock) || 30,
      reorderLevel: Number(formData.reorderLevel) || 6,
      reorderQuantity: Number(formData.reorderQuantity) || 30,
      stockLocation: formData.stockLocation,
      costPerUnit: formData.costPerUnit,
      insuranceCovered: formData.insuranceCovered,
      pharmacyName: formData.pharmacyName,
      reminderBeforeMinutes: Number(formData.reminderBeforeMinutes) || 15,
      remindMissedDose: formData.remindMissedDose ?? true,
      remindRefill: formData.remindRefill ?? true,
      reminderChannels: formData.reminderChannels || ['App'],
      patientName: selectedFamilyProfile.name || formData.patientName || 'Me (Alex)',
      patientAge: formData.patientAge,
      patientGender: formData.patientGender,
      allergies: formData.allergies || [],
      emergencyContact: formData.emergencyContact,
      status: formData.status || 'active',
      adherenceRate: formData.adherenceRate || 100,
      streakDays: formData.streakDays || 1,
      dosesLogged: formData.dosesLogged || [],
      symptomNotes: formData.symptomNotes || [],
    };

    try {
      localStorage.removeItem('blessikaa_medicine_draft');
    } catch {}

    onSave(finalItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-[#191438] w-full max-w-2xl rounded-3xl border border-purple-200/90 dark:border-[#382F6A] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-purple-100 dark:border-[#2F2763] bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-purple-50/80 dark:from-[#191535] dark:via-[#1D1740] dark:to-[#191535]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-purple-600/30">
                💊
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {initialMedicine ? 'Edit Medication' : 'Add Medication'}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">
                    {stage === 'mode_select' && 'Select your role & entry workflow'}
                    {stage === 'customize_builder' && 'Form Builder & Rule Engine'}
                    {stage === 'fill_form' && `Step ${formStep} of 5 — Fill Prescription Details`}
                    {stage === 'review' && 'Review & Verification'}
                  </p>
                  {lastAutosaveTime && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Auto-saved {lastAutosaveTime}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {stage === 'fill_form' && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setStage('customize_builder');
                  }}
                  className="p-2 rounded-xl text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-[#2B2358] transition-all cursor-pointer"
                  title="Customize Form Fields"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  onClose();
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2B2358] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Step indicator when in fill_form mode */}
          {stage === 'fill_form' && (
            <div className="grid grid-cols-5 gap-1.5 pt-3">
              {[
                { num: 1, label: 'Identity' },
                { num: 2, label: 'Schedule' },
                { num: 3, label: 'Course' },
                { num: 4, label: 'Safety & Stock' },
                { num: 5, label: 'Reminders' },
              ].map((s) => (
                <div key={s.num} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      formStep >= s.num
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                        : 'bg-purple-200/60 dark:bg-[#352C69]'
                    }`}
                  />
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider block truncate text-center ${
                      formStep === s.num
                        ? 'text-purple-600 dark:text-purple-300 font-black'
                        : 'text-slate-400 opacity-60'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL MAIN CONTENT AREA */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Saved Draft Resume Notification Banner */}
          {hasSavedDraft && stage === 'mode_select' && (
            <div className="p-3.5 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-[#251E4E] dark:to-[#1E1742] rounded-2xl border border-purple-300 dark:border-[#4B3B8A] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-purple-600 dark:text-purple-300 shrink-0" />
                <div>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white">
                    Resume Previous Setup?
                  </h5>
                  <p className="text-[11px] text-purple-800 dark:text-purple-300">
                    Saved draft available from {draftTimestamp}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleRestoreDraft}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-purple-700 transition-all cursor-pointer"
                >
                  Continue Setup
                </button>
              </div>
            </div>
          )}

          {/* STAGE 1: MODE & ROLE WORKFLOW SELECTION */}
          {stage === 'mode_select' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="text-center space-y-1 max-w-md mx-auto">
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Manage Medicines Your Way
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a workflow depth tailored to your usage. All modes share the same core Blessikaa Engine.
                </p>
              </div>

              {/* Three Structured Modes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => applyMode('simple')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMode === 'simple'
                      ? 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-600 dark:border-purple-500 shadow-md ring-2 ring-purple-500/20'
                      : 'bg-white dark:bg-[#14102D] border-slate-200 dark:border-[#352F63] hover:border-purple-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🌱</span>
                      {selectedMode === 'simple' && (
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">
                          ✓
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-1">
                      Simple Mode
                    </h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Everyday personal use. 5–10 fields, 1-tap tracking & reminders in under 1 minute.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => applyMode('advanced')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMode === 'advanced'
                      ? 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-600 dark:border-purple-500 shadow-md ring-2 ring-purple-500/20'
                      : 'bg-white dark:bg-[#14102D] border-slate-200 dark:border-[#352F63] hover:border-purple-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">👨‍👩‍👧</span>
                      {selectedMode === 'advanced' && (
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">
                          ✓
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-1">
                      Caregiver / Advanced
                    </h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Family members & dependents. Allergies, storage rules, stock & caregiver alerts.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => applyMode('expert')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMode === 'expert'
                      ? 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-600 dark:border-purple-500 shadow-md ring-2 ring-purple-500/20'
                      : 'bg-white dark:bg-[#14102D] border-slate-200 dark:border-[#352F63] hover:border-purple-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🩺</span>
                      {selectedMode === 'expert' && (
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">
                          ✓
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-1">
                      Expert / Clinical
                    </h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Doctors & pharmacists. ICD-10 coding, lab monitoring, regulatory schedules & batches.
                    </p>
                  </div>
                </button>
              </div>

              {/* Role Preset Badges */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Role Workflows & Presets
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setStage('customize_builder');
                    }}
                    className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Open Form Builder</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'personal' as const, label: 'Personal (Self)', icon: '👤' },
                    { id: 'caregiver' as const, label: 'Caregiver (Family)', icon: '👨‍👩‍👧' },
                    { id: 'doctor' as const, label: 'Physician / Rx', icon: '🩺' },
                    { id: 'pharmacist' as const, label: 'Pharmacist / OTC', icon: '💊' },
                    { id: 'clinic' as const, label: 'Hospital / Clinic', icon: '🏥' },
                    { id: 'custom' as const, label: 'Custom Preset', icon: '⚙️' },
                  ].map((preset) => {
                    const isSelected = selectedPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset.id)}
                        className={`p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-[#14102D] border border-slate-200 dark:border-[#352F63] text-slate-700 dark:text-slate-300 hover:bg-purple-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{preset.icon}</span>
                          <span>{preset.label}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setStage('fill_form');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <span>Continue to Step 1 ({selectedPreset.toUpperCase()} Mode)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onOpenScanner && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      onOpenScanner();
                    }}
                    className="w-full py-2.5 px-3 bg-purple-50 hover:bg-purple-100 dark:bg-[#251E4E] text-purple-800 dark:text-purple-200 rounded-2xl text-xs font-black border border-purple-200 dark:border-[#3E3673] flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Camera className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>📷 Scan Prescription with OCR (AI Auto-Extract)</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* STAGE 2: FORM BUILDER & CONDITIONAL LOGIC ENGINE */}
          {stage === 'customize_builder' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Header & Sub-Tabs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-purple-50/70 dark:bg-[#1E1742] p-3.5 rounded-2xl border border-purple-200 dark:border-[#352F63]">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    Blessikaa Form Builder & Engine
                  </h4>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
                    {enabledFields.size} fields enabled across {FORM_CATEGORIES.length} sections
                  </p>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                  <div className="flex bg-white dark:bg-[#14102D] p-1 rounded-xl border border-purple-200 dark:border-[#352F63]">
                    <button
                      type="button"
                      onClick={() => setBuilderTab('fields')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        builderTab === 'fields'
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Fields & Sections
                    </button>
                    <button
                      type="button"
                      onClick={() => setBuilderTab('logic')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        builderTab === 'logic'
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Rule Engine</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveAsCustomPreset}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Sub-tab 1: Form Categories & Fields */}
              {builderTab === 'fields' && (
                <div className="space-y-2.5">
                  {categoryOrder.map((catId, catIdx) => {
                    const cat = FORM_CATEGORIES.find((c) => c.id === catId);
                    if (!cat) return null;
                    const isExpanded = expandedCategories[catId];
                    const enabledInCat = cat.fields.filter((f) => enabledFields.has(f.id)).length;

                    return (
                      <div
                        key={cat.id}
                        className="border border-purple-100 dark:border-[#352F63] rounded-2xl bg-white dark:bg-[#14102D] overflow-hidden shadow-2xs"
                      >
                        <div className="p-3 bg-purple-50/40 dark:bg-[#1A143A] flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }))
                            }
                            className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
                          >
                            <span className="text-lg">{cat.icon}</span>
                            <div>
                              <span className="text-xs font-black text-slate-900 dark:text-white block">
                                {cat.label}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                {enabledInCat} of {cat.fields.length} fields active
                              </span>
                            </div>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={catIdx === 0}
                              onClick={() => moveCategory(catIdx, 'up')}
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                              title="Move Section Up"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={catIdx === categoryOrder.length - 1}
                              onClick={() => moveCategory(catIdx, 'down')}
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                              title="Move Section Down"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleCategoryAll(cat.id, enabledInCat === 0)}
                              className="text-[10px] px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-md font-bold hover:bg-purple-200 cursor-pointer ml-1"
                            >
                              {enabledInCat === cat.fields.length ? 'Disable All' : 'Enable All'}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Field Checkboxes */}
                        {isExpanded && (
                          <div className="p-3 border-t border-purple-50 dark:border-[#2D2656] grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {cat.fields.map((field) => {
                              const isChecked = enabledFields.has(field.id);
                              const isCoreName = field.id === 'name';

                              return (
                                <button
                                  key={field.id}
                                  type="button"
                                  onClick={() => toggleField(field.id)}
                                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                    isChecked
                                      ? 'bg-purple-50/80 dark:bg-[#251E4E] border-purple-300 dark:border-[#4B3B8A]'
                                      : 'bg-slate-50/50 dark:bg-[#110D25] border-slate-200 dark:border-[#29224E] opacity-60'
                                  }`}
                                >
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                                        {field.label}
                                      </span>
                                      {isCoreName && (
                                        <span className="text-[9px] px-1.5 py-0.2 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 rounded font-black uppercase">
                                          Required
                                        </span>
                                      )}
                                    </div>
                                    {field.description && (
                                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                        {field.description}
                                      </p>
                                    )}
                                  </div>

                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    disabled={isCoreName}
                                    onChange={() => {}}
                                    className="w-4 h-4 accent-purple-600 rounded-md cursor-pointer ml-2"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sub-tab 2: Visual Conditional Logic Rules */}
              {builderTab === 'logic' && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-[#251E4E] rounded-2xl border border-amber-200 dark:border-[#3E3673] text-xs text-amber-900 dark:text-amber-200">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Active Clinical & Operational Logic Rules</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Rules automatically reveal or require specialized fields during entry based on real-time selections.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {rules.map((rule) => (
                      <div
                        key={rule.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          rule.enabled
                            ? 'bg-purple-50/50 dark:bg-[#171233] border-purple-200 dark:border-[#382F6A]'
                            : 'bg-slate-50 dark:bg-[#100D22] border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              {rule.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase">
                              {rule.action}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleRule(rule.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              rule.enabled
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {rule.enabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                          {rule.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          <span className="bg-white dark:bg-[#251E4E] px-2 py-0.5 rounded-md border border-purple-200 dark:border-[#382F6A] font-bold text-purple-800 dark:text-purple-300">
                            Condition: {rule.conditionField} = {String(rule.conditionValue)}
                          </span>
                          <span className="bg-white dark:bg-[#251E4E] px-2 py-0.5 rounded-md border border-purple-200 dark:border-[#382F6A] font-bold text-purple-800 dark:text-purple-300">
                            Target Fields: {rule.targetFields.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Return to form button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStage('mode_select')}
                  className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#251E4E] border border-slate-200 dark:border-[#352F63] text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Modes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setStage('fill_form');
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-xs font-black shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <span>Apply & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE 3: PROGRESSIVE FORM FILLING (STEPS 1 TO 5) */}
          {stage === 'fill_form' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* AI Recommendation Alert Banner */}
              {aiSuggestions.length > 0 && (
                <div className="p-3.5 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-[#251E4E] dark:to-[#1E1742] border border-purple-300 dark:border-[#4B3B8A] rounded-2xl text-xs text-purple-900 dark:text-purple-200 font-bold flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>{aiSuggestions[0]}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyAiRecommendations}
                    className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-[10px] font-black shrink-0 hover:bg-purple-700 transition-all cursor-pointer"
                  >
                    Accept Suggestions
                  </button>
                </div>
              )}

              {/* STEP 1: MEDICINE IDENTITY & BASIC DETAILS */}
              {formStep === 1 && (
                <div className="space-y-4">
                  {/* Medicine Name with Search & Autocomplete */}
                  <div className="space-y-1.5 relative">
                    <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Medicine Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setFormData((prev) => ({ ...prev, name: e.target.value }));
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search clinical drug database (e.g. Metformin, Amoxicillin)..."
                        className="w-full pl-10 pr-4 py-3 bg-purple-50/40 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-600"
                      />
                    </div>

                    {/* Auto-suggestions dropdown */}
                    {showSuggestions && searchQuery.trim().length > 1 && matchedDrugs.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#1E1A3D] rounded-2xl p-2 border border-purple-200 dark:border-[#352F63] shadow-xl z-20 space-y-1">
                        <p className="text-[10px] font-black text-purple-600 dark:text-purple-300 uppercase tracking-wider px-2 py-1">
                          Matched from Clinical Drug Database
                        </p>
                        {matchedDrugs.map((drug) => (
                          <button
                            key={drug.name}
                            type="button"
                            onClick={() => handleSelectSuggestedDrug(drug)}
                            className="w-full p-2 rounded-xl text-left hover:bg-purple-50 dark:hover:bg-[#251E4E] transition-all flex items-center justify-between cursor-pointer"
                          >
                            <div>
                              <span className="text-xs font-black text-slate-900 dark:text-white">
                                {drug.name}
                              </span>
                              <span className="text-[11px] text-slate-500 block">
                                {drug.genericName} • {drug.category}
                              </span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-md font-bold">
                              Auto-fill
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dependent / Family Member Blue Popup Trigger */}
                  {enabledFields.has('familyProfile') && (
                    <div className="p-3.5 bg-blue-50/70 dark:bg-[#0F1E40] rounded-2xl border-2 border-blue-200 dark:border-blue-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-black">
                          {selectedFamilyProfile.avatar}
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-300 tracking-wider">
                            Assigned Patient Profile
                          </span>
                          <h5 className="text-xs font-black text-slate-900 dark:text-white">
                            {selectedFamilyProfile.name} ({selectedFamilyProfile.relation})
                          </h5>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playTick();
                          setShowFamilyPicker(true);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
                      >
                        Change Profile
                      </button>
                    </div>
                  )}

                  {/* Strength & Dosage Form */}
                  <div className="grid grid-cols-2 gap-3">
                    {enabledFields.has('strength') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Strength / Concentration
                        </label>
                        <input
                          type="text"
                          value={formData.strength || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, strength: e.target.value }))}
                          placeholder="e.g. 500mg, 10mg/ml"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    )}

                    {enabledFields.has('form') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Dosage Form
                        </label>
                        <select
                          value={formData.form || 'Tablet'}
                          onChange={(e) => {
                            const newForm = e.target.value;
                            const defaultUnit =
                              newForm === 'Syrup'
                                ? 'ml'
                                : newForm === 'Drops'
                                ? 'drops'
                                : newForm === 'Inhaler'
                                ? 'puffs'
                                : 'tablet(s)';
                            setFormData((prev) => ({ ...prev, form: newForm, dosageUnit: defaultUnit }));
                          }}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        >
                          {COMMON_FORMS.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Generic Active Molecule & Form Variant */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {enabledFields.has('genericName') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Generic Molecule Name
                        </label>
                        <input
                          type="text"
                          value={formData.genericName || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, genericName: e.target.value }))}
                          placeholder="e.g. Metformin Hydrochloride"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    )}

                    {enabledFields.has('formVariant') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Release / Variant Type
                        </label>
                        <input
                          type="text"
                          value={formData.formVariant || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, formVariant: e.target.value }))}
                          placeholder="e.g. Extended Release (ER)"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Condition / Prescribed For */}
                  {enabledFields.has('condition') && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Prescribed For / Indication
                      </label>
                      <input
                        type="text"
                        value={formData.condition || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, condition: e.target.value }))}
                        placeholder="e.g. Type 2 Diabetes, High BP, Bronchitis..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: DOSAGE SCHEDULE, TIMES & MEAL RULES */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Amount Per Dose
                      </label>
                      <input
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={formData.dosageQuantity || 1}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, dosageQuantity: Number(e.target.value) }))
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Dosage Unit
                      </label>
                      <select
                        value={formData.dosageUnit || 'tablet(s)'}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dosageUnit: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                      >
                        {['tablet(s)', 'capsule(s)', 'ml', 'drops', 'puffs', 'mg', 'sachet(s)', 'units (IU)'].map(
                          (u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Frequency Quick Selectors */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Frequency
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {FREQUENCIES.map((freq) => {
                        const isSelected = formData.frequency === freq.label;
                        return (
                          <button
                            key={freq.label}
                            type="button"
                            onClick={() => {
                              soundManager.playTick();
                              setFormData((prev) => ({
                                ...prev,
                                frequency: freq.label,
                                timesPerDay: freq.count,
                                specificTimes: freq.defaultTimes,
                              }));
                            }}
                            className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                              isSelected
                                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                : 'bg-slate-50 dark:bg-[#14112B] border-slate-200 dark:border-[#352F63] text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {freq.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scheduled Times Array Pickers */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Dose Clock Times ({formData.specificTimes?.length || 2} per day)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {formData.specificTimes?.map((timeVal, idx) => (
                        <div key={idx} className="relative">
                          <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-600" />
                          <input
                            type="time"
                            value={timeVal}
                            onChange={(e) => {
                              const newTimes = [...(formData.specificTimes || [])];
                              newTimes[idx] = e.target.value;
                              setFormData((prev) => ({ ...prev, specificTimes: newTimes }));
                            }}
                            className="w-full pl-8 pr-2 py-2 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meal Timing Rule */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Meal Timing Rule
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        'With food',
                        'Before meals',
                        'After meals',
                        'Empty stomach',
                        'Before bed',
                        'Anytime',
                      ].map((meal) => (
                        <button
                          key={meal}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, mealTiming: meal as any }))}
                          className={`p-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                            formData.mealTiming === meal
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-slate-50 dark:bg-[#14112B] border-slate-200 dark:border-[#352F63] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {meal}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Route of Administration (if enabled by injection rule or preset) */}
                  {enabledFields.has('routeOfAdministration') && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Route of Administration
                      </label>
                      <select
                        value={formData.routeOfAdministration || 'Oral'}
                        onChange={(e) => setFormData((prev) => ({ ...prev, routeOfAdministration: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                      >
                        {['Oral', 'Sublingual', 'Topical', 'Inhaled', 'Intravenous (IV)', 'Subcutaneous (SC)', 'Intramuscular (IM)', 'Ophthalmic', 'Otic', 'Nasal'].map(
                          (r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: COURSE DURATION, PRESCRIBER & DIAGNOSIS */}
              {formStep === 3 && (
                <div className="space-y-4">
                  {/* Start Date & Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Course Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Duration Preset
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {DURATION_PRESETS.map((dur) => (
                          <button
                            key={dur.label}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, durationDays: dur.days }))}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              formData.durationDays === dur.days
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-slate-50 dark:bg-[#14112B] border-slate-200 dark:border-[#352F63] text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {dur.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Doctor Name & Speciality */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {enabledFields.has('doctorName') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Prescribing Doctor / Clinic
                        </label>
                        <input
                          type="text"
                          value={formData.doctorName || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, doctorName: e.target.value }))}
                          placeholder="e.g. Dr. Sarah Jenkins"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    )}

                    {enabledFields.has('doctorSpeciality') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Doctor Speciality
                        </label>
                        <input
                          type="text"
                          value={formData.doctorSpeciality || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, doctorSpeciality: e.target.value }))}
                          placeholder="e.g. Cardiology, Endocrinology"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Rx ID & ICD-10 Coding */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {enabledFields.has('prescriptionNumber') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Rx / Prescription ID
                        </label>
                        <input
                          type="text"
                          value={formData.prescriptionNumber || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, prescriptionNumber: e.target.value }))}
                          placeholder="e.g. RX-2026-9901"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    )}

                    {enabledFields.has('icd10Code') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          ICD-10 Diagnostic Code
                        </label>
                        <input
                          type="text"
                          value={formData.icd10Code || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, icd10Code: e.target.value }))}
                          placeholder="e.g. E11.9 (Type 2 Diabetes)"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Regimen Type & Taper Schedule */}
                  {enabledFields.has('courseType') && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Regimen Protocol Type
                      </label>
                      <select
                        value={formData.courseType || 'Single course'}
                        onChange={(e) => setFormData((prev) => ({ ...prev, courseType: e.target.value as any }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                      >
                        {[
                          'Single course',
                          'Recurring course',
                          'Lifelong / Maintenance',
                          'PRN / As needed',
                          'Titration course',
                          'Tapering course',
                          'Pulse therapy',
                        ].map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {enabledFields.has('stepDownSchedule') && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Tapering / Step-Down Protocol Table
                      </label>
                      <textarea
                        rows={2}
                        value={formData.stepDownSchedule || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, stepDownSchedule: e.target.value }))}
                        placeholder="e.g. Week 1: 20mg daily, Week 2: 10mg daily, Week 3: 5mg daily, then stop."
                        className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: SAFETY, STORAGE & INVENTORY CABINET */}
              {formStep === 4 && (
                <div className="space-y-4">
                  {/* Storage Conditions & Missed Dose Action */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {enabledFields.has('storageConditions') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Storage Temperature & Conditions
                        </label>
                        <select
                          value={formData.storageConditions || 'Room temperature'}
                          onChange={(e) => setFormData((prev) => ({ ...prev, storageConditions: e.target.value as any }))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        >
                          {[
                            'Room temperature (15-25°C)',
                            'Refrigerate (2-8°C)',
                            'Protect from light',
                            'Protect from moisture',
                            'Do not freeze',
                          ].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {enabledFields.has('missedDoseAction') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Missed Dose Clinical Action
                        </label>
                        <input
                          type="text"
                          value={formData.missedDoseAction || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, missedDoseAction: e.target.value }))}
                          placeholder="Take when remembered; never double dose."
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Cabinet Stock & Low Refill Level */}
                  <div className="grid grid-cols-2 gap-3">
                    {enabledFields.has('currentStock') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Quantity in Cabinet
                        </label>
                        <input
                          type="number"
                          value={formData.currentStock || 30}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, currentStock: Number(e.target.value) }))
                          }
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    )}

                    {enabledFields.has('reorderLevel') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Low Stock Alert Threshold
                        </label>
                        <input
                          type="number"
                          value={formData.reorderLevel || 6}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, reorderLevel: Number(e.target.value) }))
                          }
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Dispensing Pharmacy & Lab Tests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {enabledFields.has('pharmacyName') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Dispensing Pharmacy
                        </label>
                        <input
                          type="text"
                          value={formData.pharmacyName || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, pharmacyName: e.target.value }))}
                          placeholder="e.g. Walgreens #482, Apollo Pharmacy"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    )}

                    {enabledFields.has('labTestsRequired') && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Required Blood / Lab Tests
                        </label>
                        <input
                          type="text"
                          value={(formData.labTestsRequired || []).join(', ')}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              labTestsRequired: e.target.value.split(',').map((s) => s.trim()),
                            }))
                          }
                          placeholder="e.g. HbA1c, Serum Creatinine, LFT"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: REMINDERS, NOTIFICATIONS & REVIEW LINK */}
              {formStep === 5 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Advance Reminder Lead Time
                    </label>
                    <select
                      value={formData.reminderBeforeMinutes || 15}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, reminderBeforeMinutes: Number(e.target.value) }))
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <option value={0}>At exact dose time</option>
                      <option value={5}>5 minutes before</option>
                      <option value={15}>15 minutes before</option>
                      <option value={30}>30 minutes before</option>
                      <option value={60}>1 hour before</option>
                    </select>
                  </div>

                  {/* Reminder Toggles */}
                  <div className="space-y-2">
                    <label
                      className="p-3 bg-purple-50/50 dark:bg-[#14112B] rounded-2xl border border-purple-200 dark:border-[#382F6A] flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Missed Dose Warning Chime
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Alert again 30 minutes after scheduled time if dose is unlogged
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.remindMissedDose ?? true}
                        onChange={(e) => setFormData((prev) => ({ ...prev, remindMissedDose: e.target.checked }))}
                        className="w-4 h-4 accent-purple-600 rounded-md cursor-pointer"
                      />
                    </label>

                    <label
                      className="p-3 bg-purple-50/50 dark:bg-[#14112B] rounded-2xl border border-purple-200 dark:border-[#382F6A] flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Low Stock Refill Alert
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Push alert when cabinet count falls to {formData.reorderLevel || 6} units
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.remindRefill ?? true}
                        onChange={(e) => setFormData((prev) => ({ ...prev, remindRefill: e.target.checked }))}
                        className="w-4 h-4 accent-purple-600 rounded-md cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Summary Card Prompt */}
                  <div className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-[#201844] dark:to-[#171133] rounded-2xl border border-purple-200 dark:border-[#382F6A] text-center space-y-1">
                    <span className="text-xs font-black text-purple-900 dark:text-purple-200">
                      Ready to Review
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      You have configured {formData.name || 'this medicine'} with {formData.frequency} schedule.
                    </p>
                  </div>
                </div>
              )}

              {/* Stepper Navigation Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#251E4E] border border-slate-200 dark:border-[#352F63] text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{formStep === 1 ? 'Modes' : 'Back'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-xs font-black shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <span>{formStep === 5 ? 'Review Details' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE 4: FINAL REVIEW & CONFIRMATION SCREEN */}
          {stage === 'review' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto text-xl font-black">
                  ✓
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Review Medication Details
                </h4>
                <p className="text-xs text-slate-500">
                  Please verify details before activating your schedule and reminders.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="space-y-2.5">
                {/* Card 1: Medicine Identity */}
                <div className="p-3.5 bg-purple-50/50 dark:bg-[#14112B] rounded-2xl border border-purple-200 dark:border-[#382F6A] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">
                      Medication Identity
                    </span>
                    <h5 className="text-sm font-black text-slate-900 dark:text-white">
                      {formData.name || 'Unnamed Medicine'} {formData.strength}
                    </h5>
                    <p className="text-xs text-slate-500">
                      {formData.form} • {formData.genericName || 'Standard Formulation'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStage('fill_form');
                      setFormStep(1);
                    }}
                    className="px-2.5 py-1 text-xs text-purple-600 font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>

                {/* Card 2: Dosage & Schedule */}
                <div className="p-3.5 bg-purple-50/50 dark:bg-[#14112B] rounded-2xl border border-purple-200 dark:border-[#382F6A] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">
                      Dose & Timing
                    </span>
                    <h5 className="text-sm font-black text-slate-900 dark:text-white">
                      {formData.dosageQuantity} {formData.dosageUnit} • {formData.frequency}
                    </h5>
                    <p className="text-xs text-slate-500">
                      Clock: {formData.specificTimes?.join(', ')} • {formData.mealTiming}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStage('fill_form');
                      setFormStep(2);
                    }}
                    className="px-2.5 py-1 text-xs text-purple-600 font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>

                {/* Card 3: Patient & Course */}
                <div className="p-3.5 bg-purple-50/50 dark:bg-[#14112B] rounded-2xl border border-purple-200 dark:border-[#382F6A] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">
                      Patient & Duration
                    </span>
                    <h5 className="text-sm font-black text-slate-900 dark:text-white">
                      For: {selectedFamilyProfile.name} • {formData.durationDays} Days Course
                    </h5>
                    <p className="text-xs text-slate-500">
                      Starts: {formData.startDate} • Doctor: {formData.doctorName || 'Self-logged'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStage('fill_form');
                      setFormStep(3);
                    }}
                    className="px-2.5 py-1 text-xs text-purple-600 font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Final Save Button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-3 rounded-2xl bg-white dark:bg-[#251E4E] border border-slate-200 dark:border-[#352F63] text-xs font-black text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  Back to Form
                </button>

                <button
                  type="button"
                  onClick={handleFinalSave}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Activate Schedule</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Blue Family Member Picker Popup Modal */}
      {showFamilyPicker && (
        <BlueFamilyPickerPopup
          selectedProfileId={selectedFamilyProfile.id}
          onSelect={(prof) => {
            setSelectedFamilyProfile(prof);
            setFormData((prev) => ({ ...prev, patientName: prof.name }));
            setShowFamilyPicker(false);
          }}
          onClose={() => setShowFamilyPicker(false)}
        />
      )}
    </div>
  );
};
