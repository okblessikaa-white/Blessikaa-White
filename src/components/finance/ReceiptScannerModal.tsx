import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Scan,
  RefreshCw,
  Edit3,
  Calendar,
  Building2,
  DollarSign,
  Tag,
  FileCheck,
} from 'lucide-react';
import { SAMPLE_OCR_RECEIPTS } from '../../data/financeData';
import { FinancialTransaction, FinancialAccount } from '../../types/financeTypes';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: FinancialAccount[];
  currencySymbol: string;
  onConfirmExpense: (tx: Partial<FinancialTransaction>) => void;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
  isOpen,
  onClose,
  accounts,
  currencySymbol,
  onConfirmExpense,
}) => {
  const [selectedSample, setSelectedSample] = useState<(typeof SAMPLE_OCR_RECEIPTS)[0]>(
    SAMPLE_OCR_RECEIPTS[0]
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(false);

  // Editable parsed fields
  const [detectedMerchant, setDetectedMerchant] = useState<string>(selectedSample.merchant);
  const [detectedAmount, setDetectedAmount] = useState<number>(selectedSample.amount);
  const [detectedDate, setDetectedDate] = useState<string>(selectedSample.date);
  const [detectedCategory, setDetectedCategory] = useState<string>(selectedSample.category);
  const [detectedSubcategory, setDetectedSubcategory] = useState<string>(
    selectedSample.subcategory
  );
  const [detectedTax, setDetectedTax] = useState<number>(selectedSample.taxAmount);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0]?.id || 'acc_main_bank'
  );
  const [notes, setNotes] = useState<string>('Scanned via Blessikaa AI OCR Engine');

  if (!isOpen) return null;

  const handleSelectSample = (sample: (typeof SAMPLE_OCR_RECEIPTS)[0]) => {
    setSelectedSample(sample);
    setScanComplete(false);
    setIsScanning(true);
    soundManager.playTick();

    setTimeout(() => {
      setDetectedMerchant(sample.merchant);
      setDetectedAmount(sample.amount);
      setDetectedDate(sample.date);
      setDetectedCategory(sample.category);
      setDetectedSubcategory(sample.subcategory);
      setDetectedTax(sample.taxAmount);
      setIsScanning(false);
      setScanComplete(true);
      soundManager.playCelebration();
      triggerHaptic('medium');
    }, 900);
  };

  const handleTriggerManualScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    soundManager.playTick();

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      soundManager.playCelebration();
      triggerHaptic('medium');
    }, 1000);
  };

  const handleSaveTransaction = () => {
    soundManager.playCelebration();
    triggerHaptic('medium');

    onConfirmExpense({
      type: 'expense',
      amount: detectedAmount,
      currency: currencySymbol,
      category: detectedCategory,
      subcategory: detectedSubcategory,
      accountId: selectedAccountId,
      date: detectedDate,
      time: '11:30 AM',
      merchant: detectedMerchant,
      notes: notes,
      isTaxDeducted: detectedTax > 0,
      taxAmount: detectedTax,
      tags: ['ReceiptOCR', 'Verified'],
      status: 'completed',
      source: 'receipt_ocr',
      ownerProfileId: 'prof_me',
      createdBy: 'Roshan',
      splitItems: selectedSample.items.map((item, idx) => ({
        id: `item_${idx}`,
        category: detectedSubcategory,
        amount: item.price,
        note: item.name,
      })),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-inner">
              <Camera className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">AI Receipt & Bill OCR Scanner</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold uppercase">
                  98% Accuracy
                </span>
              </div>
              <p className="text-xs text-purple-200/90">
                Instant extraction with Human Verification Protocol
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Sample Receipt Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Choose Test Receipt or Capture Photo:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_OCR_RECEIPTS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedSample.id === sample.id
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                    {sample.merchant}
                  </span>
                  <span className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 block">
                    {currencySymbol}
                    {sample.amount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block mt-0.5">
                    {sample.imageLabel}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Scanner Viewport Simulation */}
          <div className="relative rounded-2xl bg-slate-950 text-white p-5 overflow-hidden border border-slate-800 shadow-inner">
            {/* Viewfinder corners */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-purple-400" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-purple-400" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-purple-400" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-purple-400" />

            {/* Scanning Laser Animation */}
            {isScanning && (
              <motion.div
                initial={{ top: '10%' }}
                animate={{ top: ['10%', '85%', '10%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="absolute left-4 right-4 h-1 bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 shadow-lg shadow-purple-500/80 z-20"
              />
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Receipt className="w-5 h-5 text-purple-400" />
                  <span className="font-mono text-sm font-bold text-purple-200">
                    {selectedSample.imageLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Document ID: {selectedSample.id} • Confidence: {selectedSample.confidenceScore}%
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerManualScan}
                  disabled={isScanning}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/30"
                >
                  <Scan className="w-3.5 h-3.5" />
                  {isScanning ? 'Analyzing...' : 'Rescan Document'}
                </button>
              </div>
            </div>

            {/* Extracted line items breakdown */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
              <div className="flex justify-between font-bold text-slate-400 text-[11px]">
                <span>EXTRACTED LINE ITEM</span>
                <span>PRICE</span>
              </div>
              {selectedSample.items.map((item, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-slate-900">
                  <span className="truncate pr-2">✓ {item.name}</span>
                  <span className="font-bold text-white shrink-0">
                    {currencySymbol}
                    {item.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* HUMAN VERIFICATION & EDITABLE FORM */}
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-200">
                  Human Confirmation & Review
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                You can edit any extracted value below
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Merchant Name
                </label>
                <input
                  type="text"
                  value={detectedMerchant}
                  onChange={(e) => setDetectedMerchant(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Total Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={detectedAmount}
                  onChange={(e) => setDetectedAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-black rounded-xl border border-purple-300 dark:border-purple-900 bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={detectedDate}
                  onChange={(e) => setDetectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Paid From Account
                </label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.icon} {acc.name} ({currencySymbol}
                      {acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Receipt Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveTransaction}
              className="flex-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              Confirm & Save Verified Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
