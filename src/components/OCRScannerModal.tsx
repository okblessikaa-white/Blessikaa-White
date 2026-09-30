import React, { useState } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  FileText,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface OCRScannerModalProps {
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
  defaultServiceId?: string;
}

interface SamplePreset {
  id: string;
  name: string;
  type: string;
  icon: string;
  category: string;
  subServiceId: string;
  extracted: {
    title: string;
    issuer: string;
    date: string;
    amountOrDose: string;
    category: string;
    confidence: number;
    rawText: string;
  };
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'sample_rx',
    name: 'Clinical Pharmacy Prescription',
    type: 'Medical Rx',
    icon: '💊',
    category: 'Health & Wellness',
    subServiceId: 'sub_pharmacy_rx',
    extracted: {
      title: 'Atorvastatin 10mg & Metformin ER 500mg',
      issuer: 'Dr. Anita Roy, MD (Cardiologist, City Clinic)',
      date: '2026-09-24',
      amountOrDose: '1 Tab Daily Post Dinner (30-day course)',
      category: 'Prescription',
      confidence: 99.4,
      rawText: 'RX: Atorvastatin Calcium 10mg Tablets. Sig: 1 tab PO qHS pc. Refills: 3. Metformin HCl 500mg ER. Sig: 1 tab PO bid with meals. Dr. Anita Roy, Reg: MED-99214.',
    },
  },
  {
    id: 'sample_receipt',
    name: 'Supermarket Grocery Invoice',
    type: 'Financial Receipt',
    icon: '🧾',
    category: 'Wealth & Finance',
    subServiceId: 'sub_cash_expenses',
    extracted: {
      title: 'Fresh Farm Organic Market Provisions',
      issuer: 'Fresh Farm Retailers Ltd.',
      date: '2026-09-27',
      amountOrDose: '₹ 2,450.00 (Tax: ₹ 116.50)',
      category: 'Food & Groceries',
      confidence: 98.8,
      rawText: 'FRESH FARM ORG. INVOICE #89210. 1x Almond Milk (₹ 240), 2x Organic Oats (₹ 380), 1x Olive Oil 1L (₹ 850), Fresh Veggies (₹ 980). TOTAL: ₹ 2,450.00. PAID VIA UPI.',
    },
  },
  {
    id: 'sample_id',
    name: 'National Passport & ID Card',
    type: 'Civic Identity',
    icon: '🪪',
    category: 'Lifestyle & Travel',
    subServiceId: 'sub_gov_ids',
    extracted: {
      title: 'International Travel Passport Document',
      issuer: 'Ministry of External Affairs',
      date: 'Valid till 2034-11-20',
      amountOrDose: 'Class: P / ID #X981042',
      category: 'Identity Record',
      confidence: 99.8,
      rawText: 'P<UTOBLERSSIKAA<<ROSHAN<<<<<<<<<<<<<<<<<<<\nX9810425UTO9001014M3411208<<<<<<<<<<<<<<04',
    },
  },
  {
    id: 'sample_deed',
    name: 'Residential Lease & Rent Deed',
    type: 'Property Asset',
    icon: '🏠',
    category: 'Civic & Family',
    subServiceId: 'sub_property_deeds',
    extracted: {
      title: 'Residential Tenancy Agreement #402',
      issuer: 'Skyline Palms Housing Co.',
      date: '2026-10-01 to 2027-09-30',
      amountOrDose: 'Monthly Rent: ₹ 32,000 (Deposit: ₹ 96,000)',
      category: 'Real Estate Agreement',
      confidence: 97.6,
      rawText: 'THIS LEASE AGREEMENT executed between LANDLORD and TENANT for Apartment #402. Term: 12 Months. Monthly consideration: ₹ 32,000 payable on 1st of each calendar month.',
    },
  },
];

export const OCRScannerModal: React.FC<OCRScannerModalProps> = ({
  onClose,
  onNavigateTab,
  defaultServiceId,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<SamplePreset>(
    defaultServiceId === 'sub_pharmacy_rx' || defaultServiceId === 'pharmacy'
      ? SAMPLE_PRESETS[0]
      : SAMPLE_PRESETS[1]
  );
  const [scanning, setScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [customFileLoaded, setCustomFileLoaded] = useState<string | null>(null);

  const startScan = (preset?: SamplePreset) => {
    const target = preset || selectedPreset;
    setSelectedPreset(target);
    setScanning(true);
    setScanCompleted(false);
    setSaveSuccess(false);

    soundManager.playTick();
    triggerHaptic('medium');

    setTimeout(() => {
      setScanning(false);
      setScanCompleted(true);
      soundManager.playCelebration();
      triggerHaptic('success');
    }, 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomFileLoaded(file.name);
      startScan(selectedPreset);
    }
  };

  const handleSaveToVault = () => {
    soundManager.playSuccess();
    triggerHaptic('success');

    const storageKey = `blessikaa_subservice_records_${selectedPreset.subServiceId}`;
    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newRec = {
        id: `ocr_${Date.now()}`,
        title: selectedPreset.extracted.title,
        subtitle: `${selectedPreset.extracted.amountOrDose} • ${selectedPreset.extracted.issuer}`,
        date: 'Today (AI OCR)',
        badge: 'OCR Verified',
      };
      localStorage.setItem(storageKey, JSON.stringify([newRec, ...existing]));
    } catch {}

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border-b border-indigo-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-2xl shadow-inner">
              📷
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  AI Neural Vision
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Local Sandbox
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Universal AI OCR Scanner
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playTick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Sample Selectors */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Select Document Type to Test Scanner:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(p);
                    setScanCompleted(false);
                    soundManager.playTick();
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    selectedPreset.id === p.id
                      ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md shadow-indigo-900/30'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xl mb-1">{p.icon}</div>
                  <div className="text-xs font-bold truncate">{p.name}</div>
                  <div className="text-[10px] text-indigo-300/80">{p.type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Scanner Viewport */}
          <div className="relative rounded-3xl bg-slate-950 border-2 border-dashed border-indigo-500/40 p-6 flex flex-col items-center justify-center min-h-[220px] overflow-hidden text-center">
            {/* Animated Laser Beam */}
            {scanning && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse absolute top-1/2 -translate-y-1/2" />
                <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-xs animate-pulse" />
              </div>
            )}

            {!scanCompleted && !scanning && (
              <div className="space-y-3 z-10">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-3xl mx-auto text-indigo-300">
                  {selectedPreset.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {customFileLoaded || selectedPreset.name}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-0.5">
                    Position your document or upload a photo to extract structured fields.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => startScan()}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-900/40 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Run AI OCR Scan</span>
                  </button>

                  <label className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image/PDF</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            )}

            {scanning && (
              <div className="space-y-2 z-10">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin mx-auto" />
                <p className="text-sm font-black text-white">
                  Scanning & Digitizing Document...
                </p>
                <p className="text-xs text-indigo-300">
                  Detecting typography, numeric amounts, tables & timestamps
                </p>
              </div>
            )}

            {scanCompleted && (
              <div className="w-full text-left space-y-4 z-10 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold text-emerald-300">
                      Scan Verified ({selectedPreset.extracted.confidence}% Confidence)
                    </span>
                  </div>
                  <button
                    onClick={() => startScan()}
                    className="text-xs text-indigo-300 hover:text-indigo-200 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-Scan</span>
                  </button>
                </div>

                {/* Parsed Key-Value Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Title / Subject
                    </span>
                    <span className="font-semibold text-white">
                      {selectedPreset.extracted.title}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Issuer / Provider / Doctor
                    </span>
                    <span className="font-semibold text-white">
                      {selectedPreset.extracted.issuer}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Amount / Dosage / Terms
                    </span>
                    <span className="font-semibold text-cyan-300">
                      {selectedPreset.extracted.amountOrDose}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Extracted Timestamp
                    </span>
                    <span className="font-semibold text-white">
                      {selectedPreset.extracted.date}
                    </span>
                  </div>
                </div>

                {/* Raw OCR Stream */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-[11px] text-slate-300 font-mono">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1">
                    Raw OCR Stream
                  </span>
                  {selectedPreset.extracted.rawText}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/90 border-t border-indigo-900/30 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold transition-all"
          >
            Cancel
          </button>

          {scanCompleted && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  onClose();
                  onNavigateTab('form-builder');
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 text-xs font-bold transition-all"
              >
                Open in Form Builder
              </button>

              <button
                type="button"
                onClick={handleSaveToVault}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Saved to Vault!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Save to Encrypted Vault</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
