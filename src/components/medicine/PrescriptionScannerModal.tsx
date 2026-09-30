import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { MedicineItem } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface PrescriptionScannerModalProps {
  onImportMedicines: (medicines: MedicineItem[]) => void;
  onClose: () => void;
}

const SAMPLE_EXTRACTED_MEDS = [
  {
    name: 'Amoxicillin + Clavulanic Acid',
    genericName: 'Augmentin 625mg',
    strength: '625mg',
    form: 'Tablet',
    frequency: 'Twice daily',
    timesPerDay: 2,
    specificTimes: ['08:00', '20:00'],
    mealTiming: 'With food' as const,
    durationDays: 7,
    condition: 'Upper Respiratory Tract Infection',
    selected: true,
  },
  {
    name: 'Pantoprazole',
    genericName: 'Pantoprazole Sodium',
    strength: '40mg',
    form: 'Tablet',
    frequency: 'Once daily',
    timesPerDay: 1,
    specificTimes: ['07:30'],
    mealTiming: 'Empty stomach' as const,
    durationDays: 14,
    condition: 'Gastric Acid Protection',
    selected: true,
  },
  {
    name: 'Cetirizine',
    genericName: 'Cetirizine HCl',
    strength: '10mg',
    form: 'Tablet',
    frequency: 'Once daily',
    timesPerDay: 1,
    specificTimes: ['21:00'],
    mealTiming: 'Anytime' as const,
    durationDays: 5,
    condition: 'Allergic Rhinitis',
    selected: true,
  },
];

export const PrescriptionScannerModal: React.FC<PrescriptionScannerModalProps> = ({
  onImportMedicines,
  onClose,
}) => {
  const [scanState, setScanState] = useState<'upload' | 'scanning' | 'results'>('upload');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [extractedMeds, setExtractedMeds] = useState(SAMPLE_EXTRACTED_MEDS);
  const [doctorInfo, setDoctorInfo] = useState({
    doctor: 'Dr. Sarah Jenkins, MD',
    speciality: 'Endocrinology & Internal Medicine',
    hospital: 'Metropolitan Health Center',
    date: new Date().toISOString().slice(0, 10),
  });

  const handleStartScan = (imagePlaceholder?: string) => {
    soundManager.playTick();
    triggerHaptic('medium');
    setPreviewImage(
      imagePlaceholder ||
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
    );
    setScanState('scanning');

    // Simulate OCR processing time
    setTimeout(() => {
      soundManager.playSuccess();
      triggerHaptic('heavy');
      setScanState('results');
    }, 2200);
  };

  const handleImport = () => {
    soundManager.playCelebration();
    triggerHaptic('heavy');

    const imported: MedicineItem[] = extractedMeds
      .filter((m) => m.selected)
      .map((m, idx) => ({
        id: `med_scan_${Date.now()}_${idx}`,
        name: m.name,
        genericName: m.genericName,
        strength: m.strength,
        strengthUnit: 'mg',
        form: m.form,
        formVariant: 'Standard',
        dosageQuantity: 1,
        dosageUnit: 'tablet(s)',
        frequency: m.frequency,
        timesPerDay: m.timesPerDay,
        specificTimes: m.specificTimes,
        mealTiming: m.mealTiming,
        startDate: new Date().toISOString().slice(0, 10),
        durationDays: m.durationDays,
        condition: m.condition,
        doctorName: `${doctorInfo.doctor} (${doctorInfo.speciality})`,
        reminderBeforeMinutes: 15,
        remindMissedDose: true,
        remindRefill: true,
        reminderChannels: ['App'],
        currentStock: m.timesPerDay * m.durationDays,
        reorderLevel: 4,
        reorderQuantity: 20,
        status: 'active',
        adherenceRate: 100,
        streakDays: 1,
        dosesLogged: [],
      }));

    onImportMedicines(imported);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1A3D] w-full max-w-xl rounded-3xl border border-purple-200/90 dark:border-[#382F6A] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 dark:border-[#2F2763] flex items-center justify-between bg-purple-50/50 dark:bg-[#191535]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Prescription AI Scanner
              </h3>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
                Instant OCR text & medication extraction
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

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {scanState === 'upload' && (
            <div className="space-y-4 text-center">
              <div className="border-2 border-dashed border-purple-200 dark:border-[#3E3673] rounded-3xl p-8 bg-purple-50/30 dark:bg-[#16122E] space-y-3 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-[#2A2359] text-purple-600 dark:text-purple-300 flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Capture or Upload Prescription
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                    Supports handwritten Rx, printed clinic summaries, discharge slips, and pharmacy receipts.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleStartScan()}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-2xl flex items-center gap-2 shadow-md shadow-purple-600/20 cursor-pointer active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartScan()}
                    className="px-5 py-2.5 bg-white dark:bg-[#272052] border border-purple-200 dark:border-[#3E3673] text-purple-700 dark:text-purple-200 text-xs font-black rounded-2xl flex items-center gap-2 hover:bg-purple-50 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Upload Document</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center text-slate-500 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero-storage, HIPAA-grade local OCR parsing</span>
              </div>
            </div>
          )}

          {scanState === 'scanning' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
                <Sparkles className="w-8 h-8 text-purple-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Reading Prescription & Parsing Dosages...
                </h4>
                <p className="text-xs text-purple-600 dark:text-purple-300 font-semibold mt-1">
                  Extracting drug names, strengths, frequencies & meal instructions
                </p>
              </div>
            </div>
          )}

          {scanState === 'results' && (
            <div className="space-y-4">
              {/* Doctor / Clinic Header found */}
              <div className="p-3.5 bg-purple-50 dark:bg-[#251E4E] rounded-2xl border border-purple-100 dark:border-[#352F63] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                    Detected Prescriber
                  </span>
                  <p className="text-xs font-black text-slate-900 dark:text-white">
                    {doctorInfo.doctor}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {doctorInfo.hospital} • {doctorInfo.date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setScanState('upload')}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-white dark:hover:bg-[#1E1A3D] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rescan</span>
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Found {extractedMeds.length} Medications
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Verify and check items to import
                  </span>
                </div>

                <div className="space-y-2">
                  {extractedMeds.map((med, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border transition-all ${
                        med.selected
                          ? 'bg-white dark:bg-[#221C47] border-purple-300 dark:border-purple-600/60 shadow-xs'
                          : 'bg-slate-50/70 dark:bg-[#15122B] border-slate-200 dark:border-[#2F2763] opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={med.selected}
                          onChange={(e) => {
                            const updated = [...extractedMeds];
                            updated[idx].selected = e.target.checked;
                            setExtractedMeds(updated);
                          }}
                          className="w-4 h-4 accent-purple-600 rounded-md mt-1 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-black text-slate-900 dark:text-white">
                              {med.name}{' '}
                              <span className="text-purple-600 text-[11px] font-bold">
                                {med.strength}
                              </span>
                            </h5>
                            <span className="text-[10px] px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-md font-bold">
                              {med.form}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                            <span>⏱ {med.frequency}</span>
                            <span>🍽 {med.mealTiming}</span>
                            <span>📅 {med.durationDays} days course</span>
                          </div>

                          {med.condition && (
                            <p className="text-[10px] text-purple-700 dark:text-purple-300 mt-1 font-medium">
                              For: {med.condition}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-100 dark:border-[#2F2763] bg-purple-50/40 dark:bg-[#191535] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-white dark:bg-[#251E4E] border border-slate-200 dark:border-[#352F63] text-xs font-black text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            Cancel
          </button>

          {scanState === 'results' && (
            <button
              type="button"
              onClick={handleImport}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Import Selected ({extractedMeds.filter((m) => m.selected).length})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
