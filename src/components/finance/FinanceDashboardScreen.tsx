import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Search,
  Camera,
  Calendar,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Wallet,
  Building2,
  CreditCard,
  Receipt,
  FileText,
  Target,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Users,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Sliders,
  Download,
  Share2,
  PieChart,
  Activity,
  Check,
  MoreVertical,
  HelpCircle,
  FolderLock,
  History,
  Tag,
  Flame,
} from 'lucide-react';
import {
  FinancialAccount,
  FinancialTransaction,
  FinancialBudget,
  FinancialBill,
  FinancialSubscription,
  FinancialGoal,
  FinancialLoan,
  LendingBorrowingRecord,
  InvestmentItem,
  InsurancePolicy,
  PersonalAsset,
  PersonalLiability,
  ReimbursementRecord,
  AllowanceRecord,
  FinancialDocument,
  FinancialHealthMetric,
  FinanceAlertItem,
  FinanceProfile,
  FinanceSettingsState,
  FinancialRecordType,
  FinanceMode,
} from '../../types/financeTypes';
import {
  INITIAL_FINANCE_PROFILES,
  INITIAL_FINANCIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_BILLS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_LOANS,
  INITIAL_LENDING_BORROWING,
  INITIAL_INVESTMENTS,
  INITIAL_INSURANCE_POLICIES,
  INITIAL_ASSETS,
  INITIAL_LIABILITIES,
  INITIAL_REIMBURSEMENTS,
  INITIAL_ALLOWANCES,
  INITIAL_DOCUMENTS,
  INITIAL_FINANCIAL_HEALTH,
  INITIAL_FINANCE_ALERTS,
  INITIAL_AUDIT_LOGS,
  DEFAULT_FINANCE_SETTINGS,
} from '../../data/financeData';
import { UniversalFinanceAdderModal } from './UniversalFinanceAdderModal';
import { ReceiptScannerModal } from './ReceiptScannerModal';
import { TransactionDetailModal } from './TransactionDetailModal';
import { FinanceSettingsModal } from './FinanceSettingsModal';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface FinanceDashboardScreenProps {
  onBack: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const FinanceDashboardScreen: React.FC<FinanceDashboardScreenProps> = ({
  onBack,
  onNavigateTab,
}) => {
  // Master State with LocalStorage Persistence
  const [profiles] = useState<FinanceProfile[]>(INITIAL_FINANCE_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>('prof_me');

  const [settings, setSettings] = useState<FinanceSettingsState>(() => {
    try {
      const saved = localStorage.getItem('blessikaa_finance_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_FINANCE_SETTINGS;
  });

  const [accounts, setAccounts] = useState<FinancialAccount[]>(() => {
    try {
      const saved = localStorage.getItem('blessikaa_finance_accounts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FINANCIAL_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('blessikaa_finance_txs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<FinancialBudget[]>(INITIAL_BUDGETS);
  const [bills, setBills] = useState<FinancialBill[]>(INITIAL_BILLS);
  const [subscriptions, setSubscriptions] = useState<FinancialSubscription[]>(INITIAL_SUBSCRIPTIONS);
  const [goals, setGoals] = useState<FinancialGoal[]>(INITIAL_SAVINGS_GOALS);
  const [loans, setLoans] = useState<FinancialLoan[]>(INITIAL_LOANS);
  const [lendingRecords, setLendingRecords] = useState<LendingBorrowingRecord[]>(INITIAL_LENDING_BORROWING);
  const [investments, setInvestments] = useState<InvestmentItem[]>(INITIAL_INVESTMENTS);
  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(INITIAL_INSURANCE_POLICIES);
  const [assets, setAssets] = useState<PersonalAsset[]>(INITIAL_ASSETS);
  const [liabilities, setLiabilities] = useState<PersonalLiability[]>(INITIAL_LIABILITIES);
  const [reimbursements, setReimbursements] = useState<ReimbursementRecord[]>(INITIAL_REIMBURSEMENTS);
  const [allowances, setAllowances] = useState<AllowanceRecord[]>(INITIAL_ALLOWANCES);
  const [documents, setDocuments] = useState<FinancialDocument[]>(INITIAL_DOCUMENTS);
  const [healthScore] = useState<FinancialHealthMetric>(INITIAL_FINANCIAL_HEALTH);
  const [alerts, setAlerts] = useState<FinanceAlertItem[]>(INITIAL_FINANCE_ALERTS);
  const [auditLogs, setAuditLogs] = useState<any[]>(INITIAL_AUDIT_LOGS);

  // Active View Tab
  const [currentTab, setCurrentTab] = useState<
    | 'overview'
    | 'transactions'
    | 'accounts'
    | 'budgets'
    | 'goals'
    | 'loans'
    | 'investments'
    | 'family'
    | 'intelligence'
  >('overview');

  // Filter & Search States
  const [txFilter, setTxFilter] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [hideBalances, setHideBalances] = useState<boolean>(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addModalDefaultType, setAddModalDefaultType] = useState<FinancialRecordType>('expense');
  const [isReceiptScannerOpen, setIsReceiptScannerOpen] = useState<boolean>(false);
  const [selectedTxForDetail, setSelectedTxForDetail] = useState<FinancialTransaction | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [showAlertsDrawer, setShowAlertsDrawer] = useState<boolean>(false);

  // Save Settings & Transactions to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('blessikaa_finance_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('blessikaa_finance_txs', JSON.stringify(transactions));
      localStorage.setItem('blessikaa_finance_accounts', JSON.stringify(accounts));
    } catch {}
  }, [transactions, accounts]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const currencySymbol = settings.currencySymbol || '₹';

  // Real-time Net Worth Calculation = Total Assets + Total Liquid Accounts - Total Liabilities - Debt
  const totalAccountBalances = accounts
    .filter((a) => a.includeInNetWorth)
    .reduce((acc, a) => acc + a.balance, 0);

  const totalAssetValues = assets.reduce((acc, a) => acc + a.currentEstimatedValue, 0);
  const totalInvestmentValues = investments.reduce((acc, i) => acc + i.currentValue, 0);
  const totalLiabilities = liabilities.reduce((acc, l) => acc + l.amount, 0);
  const totalLoanBalances = loans.reduce((acc, l) => acc + l.remainingBalance, 0);

  // Net Worth (Financial Wealth)
  const netWorth = totalAccountBalances + totalAssetValues + totalInvestmentValues - totalLiabilities;

  // Monthly Cash Flow
  const monthlyIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRatePercent = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;

  // Breakdown Overview
  const availableCash = accounts
    .filter((a) => a.type === 'bank' || a.type === 'cash' || a.type === 'digital_wallet' || a.type === 'wallet')
    .reduce((acc, a) => acc + (a.balance > 0 ? a.balance : 0), 0);

  const totalSavingsFund = accounts
    .filter((a) => a.name.toLowerCase().includes('savings') || a.type === 'bank')
    .reduce((acc, a) => acc + (a.name.toLowerCase().includes('savings') ? a.balance : 0), 0);

  const totalDebt = loans.reduce((acc, l) => acc + l.remainingBalance, 0) + Math.abs(accounts.find(a => a.type === 'credit_card')?.balance || 0);

  // Add Transaction Handler
  const handleAddTransaction = (newTx: Partial<FinancialTransaction>) => {
    const tx: FinancialTransaction = {
      id: `tx_${Date.now()}`,
      type: newTx.type || 'expense',
      amount: newTx.amount || 0,
      currency: currencySymbol,
      category: newTx.category || 'General',
      subcategory: newTx.subcategory,
      accountId: newTx.accountId || accounts[0].id,
      targetAccountId: newTx.targetAccountId,
      date: newTx.date || new Date().toISOString().split('T')[0],
      time: newTx.time || '12:00 PM',
      merchant: newTx.merchant,
      location: newTx.location,
      notes: newTx.notes,
      isRecurring: newTx.isRecurring,
      isTaxDeducted: newTx.isTaxDeducted,
      taxAmount: newTx.taxAmount,
      tags: newTx.tags || [],
      status: 'completed',
      ownerProfileId: activeProfileId,
      createdBy: activeProfile.name,
      source: newTx.source || 'manual',
      splitItems: newTx.splitItems,
    };

    // Update Account Balances
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === tx.accountId) {
          if (tx.type === 'expense') return { ...acc, balance: acc.balance - tx.amount };
          if (tx.type === 'income') return { ...acc, balance: acc.balance + tx.amount };
          if (tx.type === 'transfer') return { ...acc, balance: acc.balance - tx.amount };
        }
        if (tx.type === 'transfer' && acc.id === tx.targetAccountId) {
          return { ...acc, balance: acc.balance + tx.amount };
        }
        return acc;
      })
    );

    setTransactions([tx, ...transactions]);

    // Record Immutable Audit Log
    const newLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: activeProfile.name,
      actorRole: activeProfile.role,
      action: `Added ${tx.type.toUpperCase()} ${currencySymbol}${tx.amount.toLocaleString()}`,
      details: `${tx.category} • ${tx.merchant || tx.notes || 'Direct Entry'}`,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    const newLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: activeProfile.name,
      actorRole: activeProfile.role,
      action: `Deleted Record #${id}`,
      details: 'Transaction removed from ledger',
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleDuplicateTransaction = (tx: FinancialTransaction) => {
    handleAddTransaction({
      ...tx,
      date: new Date().toISOString().split('T')[0],
    });
  };

  // Filtered Transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = txFilter === 'all' || t.type === txFilter;
    const matchesSearch =
      t.merchant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.amount.toString().includes(searchQuery);
    const matchesCategory =
      selectedCategoryFilter === 'all' || t.category === selectedCategoryFilter;
    return matchesFilter && matchesSearch && matchesCategory;
  });

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="w-full max-w-5xl mx-auto py-2 px-3 sm:px-6 animate-fadeIn pb-32 space-y-5">
      {/* 1. TOP HEADER & PROFILE SWITCHER */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              onBack();
              soundManager.playTick();
            }}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200/80 dark:border-slate-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Back to Ecosystem"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Profile Selector Dropdown */}
          <div className="relative">
            <select
              value={activeProfileId}
              onChange={(e) => {
                setActiveProfileId(e.target.value);
                soundManager.playTick();
              }}
              className="py-2 pl-3 pr-8 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-purple-950 dark:text-purple-100 shadow-xs cursor-pointer focus:ring-2 focus:ring-purple-500 outline-hidden"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.avatar} {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mode Pill Indicator */}
          <button
            type="button"
            onClick={() => {
              setIsSettingsModalOpen(true);
              soundManager.playTick();
            }}
            className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-800 dark:text-purple-200 capitalize flex items-center gap-1 cursor-pointer"
            title="Active Mode"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
            {settings.mode} Mode
          </button>

          {/* Hide/Show Balances Toggle */}
          <button
            type="button"
            onClick={() => {
              setHideBalances(!hideBalances);
              soundManager.playTick();
            }}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-purple-50 transition-all cursor-pointer shadow-xs"
            title={hideBalances ? 'Show Balances' : 'Privacy Shield: Hide Balances'}
          >
            {hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-purple-600" />}
          </button>

          {/* Alerts Bell */}
          <button
            type="button"
            onClick={() => {
              setShowAlertsDrawer(!showAlertsDrawer);
              soundManager.playTick();
            }}
            className="relative p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 transition-all cursor-pointer shadow-xs"
            title="Finance Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-bounce">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Settings Modal Button */}
          <button
            type="button"
            onClick={() => {
              setIsSettingsModalOpen(true);
              soundManager.playTick();
            }}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 transition-all cursor-pointer shadow-xs"
            title="Finance Settings & Audit"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. NET WORTH & BALANCE HERO CARD */}
      <div className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white shadow-xl overflow-hidden border border-purple-700/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Total Net Worth (Assets − Liabilities)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-500/30">
                <TrendingUp className="w-3 h-3" /> ↑ 8.4% this month
              </span>
            </div>

            <div className="text-3xl sm:text-5xl font-black tracking-tight font-mono">
              {hideBalances ? '••••••••' : `${currencySymbol} ${netWorth.toLocaleString()}`}
            </div>
            <p className="text-xs text-purple-200/80 mt-1">
              {activeProfile.name} • Total Liquid & Invested Wealth
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsReceiptScannerOpen(true);
                soundManager.playTick();
              }}
              className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold backdrop-blur-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Camera className="w-4 h-4 text-purple-300" />
              Scan Receipt
            </button>
            <button
              type="button"
              onClick={() => {
                setAddModalDefaultType('expense');
                setIsAddModalOpen(true);
                soundManager.playTick();
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-900/50 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              + Add Record
            </button>
          </div>
        </div>

        {/* 4-Pillar Money Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6 pt-5 border-t border-purple-800/60 relative z-10">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="text-[11px] text-purple-200 font-medium block">Available Cash</span>
            <span className="text-base sm:text-lg font-black text-white font-mono mt-0.5 block">
              {hideBalances ? '••••' : `${currencySymbol}${availableCash.toLocaleString()}`}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="text-[11px] text-purple-200 font-medium block">Savings Reserve</span>
            <span className="text-base sm:text-lg font-black text-emerald-300 font-mono mt-0.5 block">
              {hideBalances ? '••••' : `${currencySymbol}${totalSavingsFund.toLocaleString()}`}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="text-[11px] text-purple-200 font-medium block">Investments</span>
            <span className="text-base sm:text-lg font-black text-indigo-300 font-mono mt-0.5 block">
              {hideBalances ? '••••' : `${currencySymbol}${totalInvestmentValues.toLocaleString()}`}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="text-[11px] text-purple-200 font-medium block">Total Debt / Loans</span>
            <span className="text-base sm:text-lg font-black text-rose-300 font-mono mt-0.5 block">
              {hideBalances ? '••••' : `${currencySymbol}${totalDebt.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTION SHORTCUT BUTTONS (Standardized Button System) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => {
            setAddModalDefaultType('income');
            setIsAddModalOpen(true);
            soundManager.playTick();
            triggerHaptic('light');
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50/50 dark:hover:bg-[#282154] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 text-left shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center gap-2.5 cursor-pointer w-full"
        >
          <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-lg font-black shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform shrink-0">
            +
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
              + Add Income
            </span>
            <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
              Salary, Freelance
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setAddModalDefaultType('expense');
            setIsAddModalOpen(true);
            soundManager.playTick();
            triggerHaptic('light');
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50/50 dark:hover:bg-[#282154] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 text-left shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center gap-2.5 cursor-pointer w-full"
        >
          <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center text-lg font-black shadow-md shadow-rose-500/20 group-hover:scale-110 transition-transform shrink-0">
            −
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
              − Add Expense
            </span>
            <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
              Food, Shopping
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setAddModalDefaultType('transfer');
            setIsAddModalOpen(true);
            soundManager.playTick();
            triggerHaptic('light');
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50/50 dark:hover:bg-[#282154] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 text-left shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center gap-2.5 cursor-pointer w-full"
        >
          <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
              ↔ Transfer
            </span>
            <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
              Bank to Wallet
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setAddModalDefaultType('bill');
            setIsAddModalOpen(true);
            soundManager.playTick();
            triggerHaptic('light');
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 bg-white dark:bg-[#1E1A3D] hover:bg-purple-50/50 dark:hover:bg-[#282154] border-2 border-purple-200/80 dark:border-[#383068] hover:border-purple-500 dark:hover:border-purple-400 text-left shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center gap-2.5 cursor-pointer w-full"
        >
          <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-lg shrink-0 shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform">
            🧾
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
              + Add Bill
            </span>
            <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
              Electricity, Sub
            </span>
          </div>
        </button>
      </div>

      {/* 4. CASHFLOW PROGRESS GAUGE (This Month) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              This Month Cash Flow
            </span>
            <div className="flex items-center gap-4 text-xs font-bold mt-1">
              <span className="text-emerald-600 dark:text-emerald-400">
                Income: {currencySymbol}
                {monthlyIncome.toLocaleString()}
              </span>
              <span className="text-rose-600 dark:text-rose-400">
                Expenses: {currencySymbol}
                {monthlyExpenses.toLocaleString()}
              </span>
              <span className="text-purple-600 dark:text-purple-400 font-extrabold">
                Savings: {currencySymbol}
                {monthlySavings.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-purple-700 dark:text-purple-300">
              {savingsRatePercent}% Saved
            </span>
            <span className="text-[10px] text-slate-400 block">Target: 40%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${Math.min(100, Math.max(10, 100 - savingsRatePercent))}%` }}
            className="bg-rose-500 h-full transition-all"
            title="Expenses"
          />
          <div
            style={{ width: `${Math.min(100, savingsRatePercent)}%` }}
            className="bg-emerald-500 h-full transition-all"
            title="Savings Surplus"
          />
        </div>
      </div>

      {/* 5. SERVICE SUB-NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 rounded-2xl p-1.5 gap-1.5 overflow-x-auto shadow-xs">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'transactions', label: 'Transactions', icon: '💸' },
          { id: 'accounts', label: 'Accounts & Cards', icon: '🏦' },
          { id: 'budgets', label: 'Budgets & Bills', icon: '🧾' },
          { id: 'goals', label: 'Savings & Goals', icon: '🎯' },
          { id: 'loans', label: 'Loans & Owed', icon: '🤝' },
          { id: 'investments', label: 'Assets & Net Worth', icon: '📈' },
          { id: 'family', label: 'Family & Allowances', icon: '👨‍👩‍👦' },
          { id: 'intelligence', label: 'Analytics & Vault', icon: '🧠' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setCurrentTab(tab.id as any);
              soundManager.playTick();
            }}
            className={`py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === tab.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 6. TAB CONTENT PANELS */}

      {/* --- TAB 1: OVERVIEW DASHBOARD --- */}
      {currentTab === 'overview' && (
        <div className="space-y-5">
          {/* Upcoming Bills & Due Reminders */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🧾</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Bills</h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab('budgets')}
                className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
              >
                View All ({bills.length})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {bills.slice(0, 3).map((bill) => (
                <div
                  key={bill.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {bill.name}
                    </span>
                    <span className="text-[11px] text-purple-600 font-extrabold block">
                      {currencySymbol}
                      {bill.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Due: {bill.dueDate}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playCelebration();
                      triggerHaptic('light');
                      alert(`Marked ${bill.name} as paid!`);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold cursor-pointer shrink-0"
                  >
                    Pay
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Goals Snapshot */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🎯</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Savings Goals</h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab('goals')}
                className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
              >
                Manage Goals
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.slice(0, 2).map((goal) => {
                const percent = Math.round((goal.currentAmount / goal.targetAmount) * 100);
                return (
                  <div
                    key={goal.id}
                    className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{goal.icon}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {goal.name}
                        </span>
                      </div>
                      <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                        {percent}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-purple-100 dark:bg-purple-900/60 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full"
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>
                        {currencySymbol}
                        {goal.currentAmount.toLocaleString()}
                      </span>
                      <span>
                        Target: {currencySymbol}
                        {goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions List */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">💸</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Ledger Records</h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab('transactions')}
                className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
              >
                View All ({transactions.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {transactions.slice(0, 5).map((tx) => (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => {
                    setSelectedTxForDetail(tx);
                    soundManager.playTick();
                  }}
                  className="w-full py-3 flex items-center justify-between text-left hover:bg-purple-50/50 dark:hover:bg-slate-700/40 rounded-xl px-2 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                        tx.type === 'income'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : tx.type === 'expense'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {tx.type === 'income' ? '💰' : tx.type === 'expense' ? '💸' : '↔'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {tx.merchant || tx.category}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {tx.date} • {tx.category} {tx.source === 'receipt_ocr' && '• 📷 OCR'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-black font-mono ${
                      tx.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : tx.type === 'expense'
                        ? 'text-slate-900 dark:text-white'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                    {currencySymbol}
                    {tx.amount.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: TRANSACTIONS WITH SEARCH & MULTI-FILTERS --- */}
      {currentTab === 'transactions' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search merchant, category, amount or note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Type Filter Buttons */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 gap-1">
                {(['all', 'income', 'expense', 'transfer'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setTxFilter(mode);
                      soundManager.playTick();
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                      txFilter === mode
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
              <span>LEDGER RECORDS ({filteredTransactions.length})</span>
              <button
                type="button"
                onClick={() => {
                  setAddModalDefaultType('expense');
                  setIsAddModalOpen(true);
                }}
                className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Quick Add
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => {
                    setSelectedTxForDetail(tx);
                    soundManager.playTick();
                  }}
                  className="py-3 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-slate-700/40 rounded-xl px-2 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 ${
                        tx.type === 'income'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700'
                          : tx.type === 'expense'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700'
                      }`}
                    >
                      {tx.type === 'income' ? '💰' : tx.type === 'expense' ? '💸' : '↔'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {tx.merchant || tx.category}
                        </span>
                        {tx.source === 'receipt_ocr' && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/60 text-[9px] font-extrabold text-purple-700 dark:text-purple-300">
                            OCR
                          </span>
                        )}
                        {tx.splitItems && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-100 text-[9px] font-bold text-blue-700">
                            Split ({tx.splitItems.length})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        {tx.date} • {tx.category} • {accounts.find((a) => a.id === tx.accountId)?.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm font-black font-mono block ${
                        tx.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : tx.type === 'expense'
                          ? 'text-slate-900 dark:text-white'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                      {currencySymbol}
                      {tx.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ Cleared
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: ACCOUNTS & WALLETS --- */}
      {currentTab === 'accounts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Financial Accounts</h3>
              <p className="text-xs text-slate-500">Bank accounts, cash reserves, cards & wallets</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAddModalDefaultType('allowance');
                setIsAddModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
            >
              + Add Account
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{acc.icon}</span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {acc.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {acc.institutionName} {acc.accountNumberMasked && `• ${acc.accountNumberMasked}`}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-300">
                    {acc.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Current Balance</span>
                    <span
                      className={`text-lg font-black font-mono ${
                        acc.balance < 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {hideBalances ? '••••' : `${currencySymbol}${acc.balance.toLocaleString()}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAddModalDefaultType('transfer');
                      setIsAddModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-all cursor-pointer"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: BUDGETS & BILLS --- */}
      {currentTab === 'budgets' && (
        <div className="space-y-5">
          {/* Monthly Budgets */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Budgets</h3>
                <p className="text-xs text-slate-500">Limits with 70%, 90%, 100% alert triggers</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddModalDefaultType('budget');
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
              >
                + Create Budget
              </button>
            </div>

            <div className="space-y-3">
              {budgets.map((bgt) => {
                const percent = Math.round((bgt.spent / bgt.limit) * 100);
                const isWarning = percent >= 80 && percent < 100;
                const isOver = percent >= 100;
                return (
                  <div
                    key={bgt.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-900 dark:text-white">{bgt.name}</span>
                      <span
                        className={`font-mono font-extrabold ${
                          isOver ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {currencySymbol}
                        {bgt.spent.toLocaleString()} / {currencySymbol}
                        {bgt.limit.toLocaleString()} ({percent}%)
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, percent)}%` }}
                        className={`h-full transition-all ${
                          isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-purple-600'
                        }`}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Remaining: {currencySymbol}{(bgt.limit - bgt.spent).toLocaleString()}</span>
                      <span>Alerts at 70%, 90%, 100% active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subscriptions */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Subscriptions</h3>
                <p className="text-xs text-slate-500">Recurring digital services & memberships</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddModalDefaultType('subscription');
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
              >
                + Add Subscription
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sub.icon || '🔁'}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {sub.serviceName}
                    </span>
                  </div>
                  <span className="text-sm font-black text-purple-600 font-mono block">
                    {currencySymbol}
                    {sub.amount.toLocaleString()} / mo
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Next billing: {sub.nextBillingDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 5: SAVINGS & GOALS --- */}
      {currentTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Financial Goals & Safety Nets</h3>
              <p className="text-xs text-slate-500">Milestone-driven savings with target countdown</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAddModalDefaultType('goal');
                setIsAddModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
            >
              + Create Goal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {goals.map((goal) => {
              const percent = Math.round((goal.currentAmount / goal.targetAmount) * 100);
              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{goal.icon}</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-black">
                      {percent}% Reached
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{goal.name}</h4>
                    <span className="text-xs text-slate-500 font-medium block">
                      Target Date: {goal.targetDate}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-purple-100 dark:bg-purple-900/60 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full"
                    />
                  </div>

                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-slate-900 dark:text-white">
                      {currencySymbol}
                      {goal.currentAmount.toLocaleString()}
                    </span>
                    <span className="text-slate-500">
                      Target: {currencySymbol}
                      {goal.targetAmount.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playCelebration();
                      triggerHaptic('medium');
                      const updated = goals.map((g) =>
                        g.id === goal.id
                          ? { ...g, currentAmount: g.currentAmount + g.monthlyContribution }
                          : g
                      );
                      setGoals(updated);
                    }}
                    className="w-full py-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 transition-all cursor-pointer"
                  >
                    + Deposit Monthly {currencySymbol}
                    {goal.monthlyContribution.toLocaleString()}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 6: LOANS & LENDING/BORROWING --- */}
      {currentTab === 'loans' && (
        <div className="space-y-5">
          {/* Lending / Borrowing Tracker */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lending & Borrowing (Owed / Due)
                </h3>
                <p className="text-xs text-slate-500">Peer-to-peer agreements & repayment statuses</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddModalDefaultType('lending');
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
              >
                + Add Record
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {lendingRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        rec.type === 'lent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rec.type === 'lent' ? 'Owed to Me' : 'I Owe'}
                    </span>
                    <span className="text-xs font-mono font-bold">{rec.expectedReturnDate}</span>
                  </div>

                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {rec.personName}
                  </span>

                  <div className="flex justify-between items-center">
                    <span className="text-base font-black font-mono text-purple-600">
                      {currencySymbol}
                      {rec.amount.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-600 capitalize">
                      {rec.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Long-Term Loans */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Loan Facilities & Mortgages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {loan.loanName}
                    </span>
                    <span className="text-xs font-bold text-purple-600">{loan.interestRate}% Interest</span>
                  </div>
                  <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
                    {currencySymbol}
                    {loan.remainingBalance.toLocaleString()} Outstanding
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Lender: {loan.lender}</span>
                    <span>EMI: {currencySymbol}{loan.emiAmount.toLocaleString()}/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 7: INVESTMENTS & ASSETS --- */}
      {currentTab === 'investments' && (
        <div className="space-y-5">
          {/* Investment Portfolio */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Investment Portfolio</h3>
                <p className="text-xs text-slate-500">Mutual funds, equities, FDs, gold</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddModalDefaultType('investment');
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
              >
                + Add Investment
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {investments.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5"
                >
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {inv.name}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      +{inv.returnsPercent}%
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-black font-mono text-purple-900 dark:text-purple-200">
                      {currencySymbol}
                      {inv.currentValue.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Invested: {currencySymbol}
                      {inv.investedAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Assets Registry */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tangible Asset Registry</h3>
                <p className="text-xs text-slate-500">Real estate properties, vehicles, jewellery</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddModalDefaultType('asset');
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
              >
                + Add Asset
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {assets.map((ast) => (
                <div
                  key={ast.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {ast.name}
                  </span>
                  <span className="text-sm font-black font-mono text-purple-600 block">
                    {currencySymbol}
                    {ast.currentEstimatedValue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Purchased: {ast.purchaseDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 8: FAMILY & ALLOWANCES --- */}
      {currentTab === 'family' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Allowances & Dependent Stipends
                </h3>
                <p className="text-xs text-slate-500">
                  Automated monthly allowances with receipt proof logging
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddModalDefaultType('allowance');
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
              >
                + Add Allowance
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allowances.map((alw) => (
                <div
                  key={alw.id}
                  className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {alw.recipientName}
                    </span>
                    <span className="text-xs font-black text-purple-600 font-mono">
                      {currencySymbol}
                      {alw.monthlyAmount.toLocaleString()} / mo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{alw.notes}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-purple-100 text-[10px] text-slate-500">
                    <span>Next Due: {alw.nextPaymentDate}</span>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playCelebration();
                        triggerHaptic('medium');
                        alert(`Allowance paid to ${alw.recipientName}!`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold cursor-pointer"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 9: INTELLIGENCE & VAULT --- */}
      {currentTab === 'intelligence' && (
        <div className="space-y-5">
          {/* Financial Health Score Indicator */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-purple-300 font-bold">
                  Blessikaa Financial Health Indicator
                </span>
                <h3 className="text-2xl font-black">{healthScore.score} / 100 — {healthScore.rating}</h3>
              </div>
              <span className="p-3 rounded-2xl bg-white/10 text-2xl font-bold">💎</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
              <div>
                <span className="text-purple-300 block">Emergency Cushion</span>
                <span className="font-bold">{healthScore.emergencySavingsMonths} Months</span>
              </div>
              <div>
                <span className="text-purple-300 block">Budget Adherence</span>
                <span className="font-bold">{healthScore.budgetAdherencePercent}%</span>
              </div>
              <div>
                <span className="text-purple-300 block">Bills On Time</span>
                <span className="font-bold">{healthScore.billsOnTimePercent}%</span>
              </div>
              <div>
                <span className="text-purple-300 block">Debt-to-Income</span>
                <span className="font-bold">{healthScore.debtToIncomeRatio}%</span>
              </div>
            </div>
          </div>

          {/* Encrypted Document Vault */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Encrypted Financial Vault</h3>
                <p className="text-xs text-slate-500">Statements, tax documents, property deeds</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddModalDefaultType('document');
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
              >
                + Upload Document
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-purple-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                        {doc.title}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {doc.fileSize} • {doc.uploadDate}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      alert(`Downloading encrypted file: ${doc.title}`);
                    }}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. ALL MODALS */}
      <UniversalFinanceAdderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        accounts={accounts}
        profiles={profiles}
        currencySymbol={currencySymbol}
        defaultType={addModalDefaultType}
        onAddTransaction={handleAddTransaction}
        onAddBudget={(bgt) => setBudgets([...budgets, { ...bgt, id: `bgt_${Date.now()}` } as any])}
        onAddBill={(b) => setBills([...bills, { ...b, id: `bill_${Date.now()}` } as any])}
        onAddSubscription={(s) => setSubscriptions([...subscriptions, { ...s, id: `sub_${Date.now()}` } as any])}
        onAddGoal={(g) => setGoals([...goals, { ...g, id: `goal_${Date.now()}` } as any])}
        onAddLoan={(l) => setLoans([...loans, { ...l, id: `loan_${Date.now()}` } as any])}
        onAddLendingBorrowing={(lb) => setLendingRecords([...lendingRecords, { ...lb, id: `lend_${Date.now()}` } as any])}
        onAddInvestment={(i) => setInvestments([...investments, { ...i, id: `inv_${Date.now()}` } as any])}
        onAddInsurance={(ins) => setInsurancePolicies([...insurancePolicies, { ...ins, id: `ins_${Date.now()}` } as any])}
        onAddAsset={(ast) => setAssets([...assets, { ...ast, id: `ast_${Date.now()}` } as any])}
        onAddLiability={(liab) => setLiabilities([...liabilities, { ...liab, id: `liab_${Date.now()}` } as any])}
        onAddReimbursement={(r) => setReimbursements([...reimbursements, { ...r, id: `reimb_${Date.now()}` } as any])}
        onOpenReceiptScanner={() => setIsReceiptScannerOpen(true)}
      />

      <ReceiptScannerModal
        isOpen={isReceiptScannerOpen}
        onClose={() => setIsReceiptScannerOpen(false)}
        accounts={accounts}
        currencySymbol={currencySymbol}
        onConfirmExpense={handleAddTransaction}
      />

      <TransactionDetailModal
        isOpen={!!selectedTxForDetail}
        onClose={() => setSelectedTxForDetail(null)}
        transaction={selectedTxForDetail}
        accounts={accounts}
        currencySymbol={currencySymbol}
        onDeleteTransaction={handleDeleteTransaction}
        onDuplicateTransaction={handleDuplicateTransaction}
      />

      <FinanceSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        auditLogs={auditLogs}
        onExportCSV={() => {
          soundManager.playTick();
          const csvContent =
            'data:text/csv;charset=utf-8,ID,Date,Type,Category,Merchant,Amount\n' +
            transactions.map((t) => `${t.id},${t.date},${t.type},${t.category},${t.merchant || ''},${t.amount}`).join('\n');
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', `Blessikaa_Finance_Statement_${new Date().toISOString().split('T')[0]}.csv`);
          document.body.appendChild(link);
          link.click();
        }}
        onExportPDF={() => {
          soundManager.playTick();
          alert('Generating PDF financial statement with charts & verification seal.');
        }}
        onExportJSON={() => {
          soundManager.playTick();
          const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify({ settings, accounts, transactions, budgets, goals }, null, 2)
          )}`;
          const link = document.createElement('a');
          link.setAttribute('href', jsonString);
          link.setAttribute('download', `Blessikaa_Finance_Vault_Backup_${Date.now()}.json`);
          document.body.appendChild(link);
          link.click();
        }}
      />
    </div>
  );
};
