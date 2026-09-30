import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Settings,
  Shield,
  DollarSign,
  Download,
  FileSpreadsheet,
  FileText,
  Sliders,
  History,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Bell,
  RefreshCw,
} from 'lucide-react';
import {
  FinanceSettingsState,
  FinanceMode,
  FinanceAuditLog,
} from '../../types/financeTypes';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface FinanceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FinanceSettingsState;
  onUpdateSettings: (newSettings: FinanceSettingsState) => void;
  auditLogs: FinanceAuditLog[];
  onExportCSV: () => void;
  onExportPDF: () => void;
  onExportJSON: () => void;
}

export const FinanceSettingsModal: React.FC<FinanceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  auditLogs,
  onExportCSV,
  onExportPDF,
  onExportJSON,
}) => {
  const [activeTab, setActiveTab] = useState<'mode' | 'currency' | 'dashboard' | 'security' | 'audit' | 'export'>('mode');

  if (!isOpen) return null;

  const handleModeChange = (mode: FinanceMode) => {
    soundManager.playTick();
    triggerHaptic('light');
    onUpdateSettings({ ...settings, mode });
  };

  const handleCurrencyChange = (currency: string, symbol: string) => {
    soundManager.playTick();
    triggerHaptic('light');
    onUpdateSettings({ ...settings, currency, currencySymbol: symbol });
  };

  const handleModuleToggle = (moduleKey: keyof typeof settings.dashboardModules) => {
    soundManager.playTick();
    onUpdateSettings({
      ...settings,
      dashboardModules: {
        ...settings.dashboardModules,
        [moduleKey]: !settings.dashboardModules[moduleKey],
      },
    });
  };

  const currencies = [
    { code: 'NPR', symbol: '₹', name: 'Nepalese Rupee (NPR ₹)' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR ₹)' },
    { code: 'USD', symbol: '$', name: 'US Dollar (USD $)' },
    { code: 'EUR', symbol: '€', name: 'Euro (EUR €)' },
    { code: 'GBP', symbol: '£', name: 'British Pound (GBP £)' },
    { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (C$)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-inner">
              <Settings className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Personal Finance Settings</h2>
              <p className="text-xs text-purple-200/90">
                Mode selection, dashboard customization, security & audit logs
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-4 gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'mode', label: 'Mode & Complexity', icon: Sliders },
            { id: 'currency', label: 'Currency', icon: DollarSign },
            { id: 'dashboard', label: 'Dashboard Widgets', icon: Eye },
            { id: 'security', label: 'Security & PIN', icon: Lock },
            { id: 'audit', label: 'Audit Trail', icon: History },
            { id: 'export', label: 'Export & Backup', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  soundManager.playTick();
                }}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* 1. MODE & COMPLEXITY */}
          {activeTab === 'mode' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                How would you like to use Personal Finance?
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'simple',
                    title: 'Simple Mode',
                    desc: 'Track money, cash, income & expenses easily in 2 taps. Minimalist interface.',
                    icon: '🌱',
                  },
                  {
                    id: 'standard',
                    title: 'Standard Mode',
                    desc: 'Money management + Monthly budgets + Bill tracking + Savings goals.',
                    icon: '⚡',
                  },
                  {
                    id: 'expert',
                    title: 'Expert Mode',
                    desc: 'Complete financial lifecycle: Loans, Investments, Assets, Liabilities, Family & Audit.',
                    icon: '💎',
                  },
                ].map((modeItem) => (
                  <button
                    key={modeItem.id}
                    type="button"
                    onClick={() => handleModeChange(modeItem.id as FinanceMode)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      settings.mode === modeItem.id
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 ring-2 ring-purple-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{modeItem.icon}</span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {modeItem.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {modeItem.desc}
                    </p>
                    {settings.mode === modeItem.id && (
                      <span className="inline-flex items-center gap-1 mt-3 px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Active Mode
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  Universal Design Principle:
                </span>
                <p>
                  You can change your mode anytime. Your underlying financial ledger is always safely
                  stored and never lost regardless of the active view mode.
                </p>
              </div>
            </div>
          )}

          {/* 2. CURRENCY */}
          {activeTab === 'currency' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Select Master Currency & Symbol
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleCurrencyChange(curr.code, curr.symbol)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      settings.currency === curr.code
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 font-bold text-purple-900 dark:text-purple-200'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-bold block">{curr.name}</span>
                      <span className="text-xs text-slate-500">Symbol: {curr.symbol}</span>
                    </div>
                    {settings.currency === curr.code && (
                      <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. DASHBOARD MODULES */}
          {activeTab === 'dashboard' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Customize Dashboard Cards & Modules
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'showNetWorth', label: 'Net Worth Calculator (Assets - Liabilities)' },
                  { key: 'showMoneyOverview', label: 'Money Overview (Cash, Savings, Debt)' },
                  { key: 'showCashflowBar', label: 'Monthly Income vs Expense Progress' },
                  { key: 'showUpcomingBills', label: 'Upcoming Bills & Reminders' },
                  { key: 'showGoals', label: 'Financial Goals & Milestones' },
                  { key: 'showRecentTransactions', label: 'Recent Transactions Feed' },
                  { key: 'showInvestments', label: 'Investment Portfolio' },
                  { key: 'showLoansDebts', label: 'Loans & Lending/Borrowing' },
                  { key: 'showInsurance', label: 'Insurance Policies' },
                  { key: 'showFamilyFinance', label: 'Family Finances & Allowances' },
                  { key: 'showHealthScore', label: 'Financial Health Wellness Score' },
                  { key: 'showForecast', label: '30/90 Day Cashflow Forecast' },
                ].map((mod) => (
                  <label
                    key={mod.key}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-purple-300"
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {mod.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={
                        settings.dashboardModules[mod.key as keyof typeof settings.dashboardModules]
                      }
                      onChange={() =>
                        handleModuleToggle(mod.key as keyof typeof settings.dashboardModules)
                      }
                      className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 4. SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Financial Vault Security & Privacy
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      Sensitive Data Lock & PIN
                    </span>
                    <span className="text-xs text-slate-500">
                      Require PIN before opening salary, investments or net worth
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.pinLockEnabled}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, pinLockEnabled: e.target.checked })
                    }
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      Biometric Authentication
                    </span>
                    <span className="text-xs text-slate-500">
                      Use Fingerprint / Face ID for instant unlock
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.biometricEnabled}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, biometricEnabled: e.target.checked })
                    }
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Immutable Financial Activity Log
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-purple-900 dark:text-purple-300">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{log.details}</p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Actor: {log.actor} ({log.actorRole})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Data Portability & Report Generator
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={onExportPDF}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-left transition-all cursor-pointer space-y-2"
                >
                  <FileText className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    Financial Statement (PDF)
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Printable monthly report with summary & category charts
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onExportCSV}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-left transition-all cursor-pointer space-y-2"
                >
                  <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    Spreadsheet (CSV)
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Full transaction table compatible with Excel and Sheets
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onExportJSON}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-left transition-all cursor-pointer space-y-2"
                >
                  <Download className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    Encrypted Backup (JSON)
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Complete vault export for backup & migration
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
