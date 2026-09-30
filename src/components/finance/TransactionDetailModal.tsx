import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  Copy,
  Share2,
  Receipt,
  Calendar,
  Clock,
  Building2,
  Tag,
  CreditCard,
  MapPin,
  FileCheck,
  ShieldAlert,
  AlertCircle,
  History,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { FinancialTransaction, FinancialAccount } from '../../types/financeTypes';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: FinancialTransaction | null;
  accounts: FinancialAccount[];
  currencySymbol: string;
  onDeleteTransaction: (id: string) => void;
  onDuplicateTransaction: (tx: FinancialTransaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
  accounts,
  currencySymbol,
  onDeleteTransaction,
  onDuplicateTransaction,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  if (!isOpen || !transaction) return null;

  const account = accounts.find((a) => a.id === transaction.accountId);
  const targetAccount = transaction.targetAccountId
    ? accounts.find((a) => a.id === transaction.targetAccountId)
    : null;

  const handleShare = () => {
    soundManager.playTick();
    setCopiedLink(true);
    navigator.clipboard?.writeText(
      `Blessikaa Verified Record #${transaction.id} • ${transaction.merchant || transaction.category} • ${currencySymbol}${transaction.amount}`
    );
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDuplicate = () => {
    soundManager.playTick();
    triggerHaptic('light');
    onDuplicateTransaction(transaction);
    onClose();
  };

  const handleDelete = () => {
    soundManager.playPenalty();
    triggerHaptic('heavy');
    onDeleteTransaction(transaction.id);
    onClose();
  };

  const isExpense = transaction.type === 'expense';
  const isIncome = transaction.type === 'income';
  const isTransfer = transaction.type === 'transfer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Hero */}
        <div
          className={`p-6 text-white text-center shrink-0 relative ${
            isIncome
              ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
              : isExpense
              ? 'bg-gradient-to-br from-rose-600 to-red-700'
              : 'bg-gradient-to-br from-blue-600 to-indigo-700'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider mb-2">
            {transaction.type.toUpperCase()} RECORD
          </span>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isExpense ? '-' : isIncome ? '+' : ''}
            {currencySymbol}
            {transaction.amount.toLocaleString()}
          </h2>

          <p className="text-sm font-semibold text-white/90 mt-1">
            {transaction.merchant || transaction.category}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-800 dark:text-slate-200">
          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Category</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {transaction.category}
                {transaction.subcategory ? ` → ${transaction.subcategory}` : ''}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Date & Time</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {transaction.date} {transaction.time && `• ${transaction.time}`}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">
                {isTransfer ? 'From Account' : 'Account'}
              </span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                {account?.icon || '🏦'} {account?.name || 'Main Account'}
              </span>
            </div>

            {targetAccount && (
              <div>
                <span className="text-slate-500 font-medium block">To Account</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                  {targetAccount.icon} {targetAccount.name}
                </span>
              </div>
            )}

            <div>
              <span className="text-slate-500 font-medium block">Status</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 capitalize flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {transaction.status}
              </span>
            </div>

            {transaction.location && (
              <div>
                <span className="text-slate-500 font-medium block">Location</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {transaction.location}
                </span>
              </div>
            )}
          </div>

          {/* Split Items */}
          {transaction.splitItems && transaction.splitItems.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
              <span className="text-xs font-bold text-purple-900 dark:text-purple-300 block mb-2">
                Itemized Split Breakdown
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {transaction.splitItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-1 border-b border-purple-100/50 dark:border-purple-900/30"
                  >
                    <span>
                      {item.note || item.category} ({item.category})
                    </span>
                    <span className="font-bold text-purple-900 dark:text-purple-200">
                      {currencySymbol}
                      {item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {transaction.notes && (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Notes & Description
              </span>
              <p className="font-medium">{transaction.notes}</p>
            </div>
          )}

          {/* Tags */}
          {transaction.tags && transaction.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {transaction.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 text-xs font-semibold"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Audit History Accordion */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            <button
              type="button"
              onClick={() => setShowAuditTrail(!showAuditTrail)}
              className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              {showAuditTrail ? 'Hide Immutable Audit Trail' : 'View Audit & Verification Trail'}
            </button>

            {showAuditTrail && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 font-mono">
                <div className="text-slate-500">Record ID: {transaction.id}</div>
                <div className="text-slate-500">Created By: {transaction.createdBy}</div>
                <div className="text-slate-500">
                  Profile Owner: {transaction.ownerProfileId}
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Source: {transaction.source || 'Direct Manual Entry'} • Verified
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {showConfirmDelete ? (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-2">
                <p className="text-xs font-bold text-rose-800 dark:text-rose-200">
                  Are you sure you want to delete this record?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(false)}
                    className="flex-1 py-1.5 rounded-lg border border-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copiedLink ? 'Copied Link!' : 'Share'}
                </button>

                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="flex-1 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate
                </button>

                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
