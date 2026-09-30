import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Minus,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Receipt,
  FileText,
  CreditCard,
  Building2,
  Wallet,
  Shield,
  Target,
  Users,
  Camera,
  Calendar,
  Tag,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import {
  FinancialRecordType,
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
  FinanceProfile,
} from '../../types/financeTypes';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface UniversalFinanceAdderModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: FinancialAccount[];
  profiles: FinanceProfile[];
  currencySymbol: string;
  defaultType?: FinancialRecordType;
  onAddTransaction: (tx: Partial<FinancialTransaction>) => void;
  onAddBudget?: (bgt: Partial<FinancialBudget>) => void;
  onAddBill?: (bill: Partial<FinancialBill>) => void;
  onAddSubscription?: (sub: Partial<FinancialSubscription>) => void;
  onAddGoal?: (goal: Partial<FinancialGoal>) => void;
  onAddLoan?: (loan: Partial<FinancialLoan>) => void;
  onAddLendingBorrowing?: (rec: Partial<LendingBorrowingRecord>) => void;
  onAddInvestment?: (inv: Partial<InvestmentItem>) => void;
  onAddInsurance?: (ins: Partial<InsurancePolicy>) => void;
  onAddAsset?: (ast: Partial<PersonalAsset>) => void;
  onAddLiability?: (liab: Partial<PersonalLiability>) => void;
  onAddReimbursement?: (reimb: Partial<ReimbursementRecord>) => void;
  onOpenReceiptScanner?: () => void;
}

export const UniversalFinanceAdderModal: React.FC<UniversalFinanceAdderModalProps> = ({
  isOpen,
  onClose,
  accounts,
  profiles,
  currencySymbol,
  defaultType = 'expense',
  onAddTransaction,
  onAddBudget,
  onAddBill,
  onAddSubscription,
  onAddGoal,
  onAddLoan,
  onAddLendingBorrowing,
  onAddInvestment,
  onAddInsurance,
  onAddAsset,
  onAddLiability,
  onAddReimbursement,
  onOpenReceiptScanner,
}) => {
  const [selectedType, setSelectedType] = useState<FinancialRecordType>(defaultType);
  const [showTypePicker, setShowTypePicker] = useState<boolean>(false);
  const [disclosureLevel, setDisclosureLevel] = useState<'basic' | 'more' | 'advanced'>('basic');

  // Form State
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Food');
  const [subcategory, setSubcategory] = useState<string>('Groceries');
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id || 'acc_main_bank');
  const [targetAccountId, setTargetAccountId] = useState<string>(
    accounts[1]?.id || 'acc_savings_bank'
  );
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('12:00 PM');
  const [merchant, setMerchant] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [ownerProfileId, setOwnerProfileId] = useState<string>('prof_me');

  // Advanced States
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringFrequency, setRecurringFrequency] = useState<string>('monthly');
  const [isTaxDeducted, setIsTaxDeducted] = useState<boolean>(false);
  const [taxAmount, setTaxAmount] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSplit, setIsSplit] = useState<boolean>(false);
  const [splitRows, setSplitRows] = useState<{ id: string; category: string; amount: string }[]>([
    { id: '1', category: 'Groceries', amount: '' },
    { id: '2', category: 'Household', amount: '' },
  ]);

  // Specialized states
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [personName, setPersonName] = useState<string>('');
  const [personContact, setPersonContact] = useState<string>('');
  const [lendingType, setLendingType] = useState<'lent' | 'borrowed'>('lent');
  const [assetClass, setAssetClass] = useState<string>('stocks');
  const [insuranceType, setInsuranceType] = useState<string>('health');
  const [policyNumber, setPolicyNumber] = useState<string>('');

  if (!isOpen) return null;

  const categoriesMap: Record<string, string[]> = {
    Food: ['Groceries', 'Dining Out', 'Coffee & Snacks', 'Delivery', 'Drinks'],
    Housing: ['Rent', 'Mortgage', 'Maintenance', 'Repairs', 'Furniture'],
    Utilities: ['Electricity', 'Water', 'Internet & Fiber', 'Mobile Recharge', 'Cooking Gas'],
    Transport: ['Fuel', 'Public Transit', 'Taxi & Rideshare', 'Parking', 'Vehicle Service'],
    Healthcare: ['Medicine', 'Doctor Consultation', 'Lab Tests', 'Dental', 'Supplements'],
    Shopping: ['Clothing', 'Electronics', 'Personal Care', 'Home Decor', 'Gifts'],
    Entertainment: ['Movies & Streaming', 'Games', 'Concerts', 'Hobbies', 'Books'],
    Education: ['Tuition Fees', 'Courses & Certs', 'Books', 'Stationery'],
    Salary: ['Full-time Salary', 'Freelance Work', 'Consulting', 'Bonus', 'Commission'],
    Investments: ['Dividend', 'Interest Received', 'Capital Gains', 'Rental Income'],
    Other: ['Refund', 'Gift Received', 'Reimbursement', 'Miscellaneous'],
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      soundManager.playPenalty();
      triggerHaptic('heavy');
      alert('Please enter a valid positive amount.');
      return;
    }

    soundManager.playCelebration();
    triggerHaptic('medium');

    if (selectedType === 'income' || selectedType === 'expense' || selectedType === 'transfer') {
      onAddTransaction({
        type: selectedType,
        amount: numAmount,
        currency: currencySymbol,
        category: category,
        subcategory: subcategory,
        accountId: accountId,
        targetAccountId: selectedType === 'transfer' ? targetAccountId : undefined,
        date: date,
        time: time,
        merchant: merchant || (selectedType === 'income' ? 'Direct Credit' : 'Store Merchant'),
        location: location,
        notes: notes,
        isRecurring: isRecurring,
        isTaxDeducted: isTaxDeducted,
        taxAmount: parseFloat(taxAmount) || undefined,
        tags: tags,
        status: 'completed',
        ownerProfileId: ownerProfileId,
        createdBy: 'Roshan',
        source: 'manual',
        splitItems: isSplit
          ? splitRows
              .filter((r) => parseFloat(r.amount) > 0)
              .map((r) => ({
                id: r.id,
                category: r.category,
                amount: parseFloat(r.amount),
              }))
          : undefined,
      });
    } else if (selectedType === 'budget' && onAddBudget) {
      onAddBudget({
        name: title || `${category} Budget`,
        category: category,
        limit: numAmount,
        spent: 0,
        currency: currencySymbol,
        period: 'monthly',
        alertAt70: true,
        alertAt90: true,
        alertAt100: true,
        startDate: date,
        isRecurring: isRecurring,
      });
    } else if (selectedType === 'bill' && onAddBill) {
      onAddBill({
        name: title || `${merchant || category} Bill`,
        provider: merchant || category,
        amount: numAmount,
        currency: currencySymbol,
        dueDate: dueDate || date,
        frequency: isRecurring ? 'monthly' : 'once',
        accountId: accountId,
        isAutoPay: false,
        status: 'upcoming',
        category: category,
        reminderDaysBefore: 3,
      });
    } else if (selectedType === 'subscription' && onAddSubscription) {
      onAddSubscription({
        serviceName: title || merchant || 'Subscription Service',
        amount: numAmount,
        currency: currencySymbol,
        billingCycle: 'monthly',
        nextBillingDate: dueDate || date,
        paymentAccountId: accountId,
        category: category,
        status: 'active',
      });
    } else if (selectedType === 'goal' && onAddGoal) {
      onAddGoal({
        name: title || 'New Savings Goal',
        targetAmount: parseFloat(targetAmount) || numAmount * 5,
        currentAmount: numAmount,
        currency: currencySymbol,
        targetDate: dueDate || '2027-01-01',
        priority: 'high',
        monthlyContribution: numAmount,
        linkedAccountId: accountId,
        category: category,
        icon: '🎯',
        color: '#8b5cf6',
        isCompleted: false,
        milestones: [],
      });
    } else if (selectedType === 'lending' || selectedType === 'borrowing') {
      if (onAddLendingBorrowing) {
        onAddLendingBorrowing({
          personName: personName || 'Friend / Associate',
          personContact: personContact,
          amount: numAmount,
          currency: currencySymbol,
          type: lendingType,
          date: date,
          expectedReturnDate: dueDate || date,
          purpose: notes || 'Personal agreement',
          status: 'pending',
          amountRepaid: 0,
        });
      }
    } else if (selectedType === 'loan' && onAddLoan) {
      onAddLoan({
        loanName: title || `${merchant || 'Bank'} Loan`,
        lender: merchant || 'Financial Institution',
        loanType: 'personal',
        principal: numAmount,
        remainingBalance: numAmount,
        interestRate: parseFloat(interestRate) || 9.5,
        interestType: 'reducing',
        termMonths: 24,
        emiAmount: Math.round(numAmount / 24),
        dueDateDay: 5,
        startDate: date,
        currency: currencySymbol,
        status: 'active',
      });
    } else if (selectedType === 'investment' && onAddInvestment) {
      onAddInvestment({
        name: title || 'Asset Investment',
        assetClass: assetClass as any,
        investedAmount: numAmount,
        currentValue: numAmount,
        returnsAmount: 0,
        returnsPercent: 0,
        currency: currencySymbol,
        purchaseDate: date,
        institution: merchant || 'Brokerage',
      });
    } else if (selectedType === 'insurance' && onAddInsurance) {
      onAddInsurance({
        provider: merchant || 'Insurance Provider',
        policyName: title || 'Policy Plan',
        policyNumber: policyNumber || `POL-${Math.floor(10000 + Math.random() * 90000)}`,
        policyType: insuranceType as any,
        policyHolder: 'Roshan',
        coverageAmount: numAmount * 20,
        premiumAmount: numAmount,
        paymentFrequency: 'annually',
        startDate: date,
        expiryDate: dueDate || '2027-08-31',
        documentsCount: 0,
        currency: currencySymbol,
        status: 'active',
      });
    } else if (selectedType === 'asset' && onAddAsset) {
      onAddAsset({
        name: title || 'Valuable Asset',
        category: 'property',
        purchasePrice: numAmount,
        currentEstimatedValue: numAmount,
        purchaseDate: date,
        owner: 'Roshan',
        currency: currencySymbol,
        notes: notes,
      });
    } else if (selectedType === 'liability' && onAddLiability) {
      onAddLiability({
        name: title || 'Debt Obligation',
        category: 'credit_debt',
        amount: numAmount,
        interestRate: parseFloat(interestRate) || 12,
        creditor: merchant || 'Lender',
        currency: currencySymbol,
      });
    } else if (selectedType === 'reimbursement' && onAddReimbursement) {
      onAddReimbursement({
        title: title || 'Work Reimbursement Claim',
        amount: numAmount,
        currency: currencySymbol,
        purpose: notes || 'Business & travel expense',
        category: category,
        submitterName: 'Roshan',
        submitterRole: 'personal',
        status: 'pending',
        submittedDate: date,
      });
    }

    onClose();
  };

  const typeConfig: Record<
    FinancialRecordType,
    { label: string; icon: string; color: string; group: string }
  > = {
    expense: { label: '- Expense', icon: '💸', color: '#ef4444', group: 'Money' },
    income: { label: '+ Income', icon: '💰', color: '#10b981', group: 'Money' },
    transfer: { label: '↔ Transfer', icon: '🔄', color: '#3b82f6', group: 'Money' },
    allowance: { label: '💵 Cash Entry', icon: '💵', color: '#f59e0b', group: 'Money' },
    budget: { label: '📊 Budget', icon: '📊', color: '#8b5cf6', group: 'Planning' },
    bill: { label: '🧾 Bill', icon: '🧾', color: '#ec4899', group: 'Planning' },
    subscription: { label: '🔄 Subscription', icon: '🔁', color: '#06b6d4', group: 'Planning' },
    goal: { label: '🎯 Financial Goal', icon: '🎯', color: '#10b981', group: 'Planning' },
    loan: { label: '💳 Loan', icon: '🏦', color: '#dc2626', group: 'Borrowing' },
    debt: { label: '⏳ Debt Obligation', icon: '⏳', color: '#d97706', group: 'Borrowing' },
    lending: { label: '🤝 Lending (Owed to Me)', icon: '🤝', color: '#059669', group: 'Borrowing' },
    borrowing: { label: '📥 Borrowed (I Owe)', icon: '📥', color: '#e11d48', group: 'Borrowing' },
    investment: { label: '📈 Investment', icon: '📈', color: '#059669', group: 'Growth' },
    insurance: { label: '🛡️ Insurance', icon: '🛡️', color: '#0284c7', group: 'Growth' },
    asset: { label: '🏠 Personal Asset', icon: '🏠', color: '#7c3aed', group: 'Assets & Net Worth' },
    liability: { label: '📉 Liability', icon: '📉', color: '#b91c1c', group: 'Assets & Net Worth' },
    reimbursement: {
      label: '💼 Reimbursement',
      icon: '💼',
      color: '#6366f1',
      group: 'Assets & Net Worth',
    },
    document: { label: '📄 Document', icon: '📄', color: '#64748b', group: 'Assets & Net Worth' },
  };

  const groupedTypes = Object.entries(typeConfig).reduce((acc, [typeKey, conf]) => {
    if (!acc[conf.group]) acc[conf.group] = [];
    acc[conf.group].push({ type: typeKey as FinancialRecordType, ...conf });
    return acc;
  }, {} as Record<string, (typeof typeConfig[FinancialRecordType] & { type: FinancialRecordType })[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-inner">
              {typeConfig[selectedType]?.icon || '💰'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  Add {typeConfig[selectedType]?.label.replace(/[+\-↔]/g, '').trim()}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowTypePicker(!showTypePicker)}
                  className="px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                >
                  Change <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-purple-100/90">
                Universal Finance Record • Blessikaa Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenReceiptScanner && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReceiptScanner();
                }}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
                title="Scan Receipt with AI OCR"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Type Picker Drawer */}
        <AnimatePresence>
          {showTypePicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-50 dark:bg-slate-800/80 border-b border-purple-100 dark:border-slate-700 p-4 shrink-0 overflow-y-auto max-h-56"
            >
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                What would you like to add?
              </div>
              <div className="space-y-3">
                {Object.entries(groupedTypes).map(([groupName, items]) => (
                  <div key={groupName}>
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 block mb-1">
                      {groupName}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {items.map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => {
                            setSelectedType(item.type);
                            setShowTypePicker(false);
                            soundManager.playTick();
                          }}
                          className={`p-2 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                            selectedType === item.type
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* LEVEL 1: ESSENTIAL HERO AMOUNT & PROFILE */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-purple-600" /> Amount *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">For Profile:</span>
                <select
                  value={ownerProfileId}
                  onChange={(e) => setOwnerProfileId(e.target.value)}
                  className="text-xs py-1 px-2 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 font-semibold text-purple-900 dark:text-purple-200"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.avatar} {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-purple-600">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="any"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-2xl sm:text-3xl font-black rounded-2xl bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-900/60 focus:border-purple-600 outline-hidden transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* RECORD TITLE (For Goals, Loans, Bills, Assets) */}
          {['budget', 'bill', 'subscription', 'goal', 'loan', 'asset', 'liability', 'reimbursement', 'document'].includes(
            selectedType
          ) && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Title / Name *
              </label>
              <input
                type="text"
                required
                placeholder={
                  selectedType === 'goal'
                    ? 'e.g. Emergency Fund or New Laptop'
                    : selectedType === 'bill'
                    ? 'e.g. Electricity Power Meter'
                    : selectedType === 'subscription'
                    ? 'e.g. Netflix Premium 4K'
                    : selectedType === 'loan'
                    ? 'e.g. Home Mortgage'
                    : 'e.g. Description or Item Name'
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-hidden text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* LENDING / BORROWING PERSON */}
          {(selectedType === 'lending' || selectedType === 'borrowing') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Agreement Type
                </label>
                <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                  <button
                    type="button"
                    onClick={() => setLendingType('lent')}
                    className={`flex-1 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      lendingType === 'lent'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    Owed to Me
                  </button>
                  <button
                    type="button"
                    onClick={() => setLendingType('borrowed')}
                    className={`flex-1 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      lendingType === 'borrowed'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    I Owe
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Person Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ram Sharma (Colleague)"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* CATEGORY & SUBCATEGORY (For transactions, budgets, etc.) */}
          {selectedType !== 'transfer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setCategory(newCat);
                    if (categoriesMap[newCat]) {
                      setSubcategory(categoriesMap[newCat][0]);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-purple-500 outline-hidden text-slate-900 dark:text-white"
                >
                  {Object.keys(categoriesMap).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Subcategory
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-purple-500 outline-hidden text-slate-900 dark:text-white"
                >
                  {(categoriesMap[category] || ['General']).map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ACCOUNT SELECTION */}
          {selectedType === 'transfer' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
              <div>
                <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider mb-1">
                  From Account (Debit)
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.icon} {acc.name} ({currencySymbol}
                      {acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider mb-1">
                  To Account (Credit)
                </label>
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {accounts
                    .filter((a) => a.id !== accountId)
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.icon} {acc.name} ({currencySymbol}
                        {acc.balance.toLocaleString()})
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Paid From / Account *
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-purple-500 outline-hidden text-slate-900 dark:text-white"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.icon} {acc.name} ({currencySymbol}
                      {acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-purple-500 outline-hidden text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* PROGRESSIVE DISCLOSURE TOGGLES: MORE & ADVANCED */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Form Complexity:</span>
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1">
              <button
                type="button"
                onClick={() => setDisclosureLevel('basic')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  disclosureLevel === 'basic'
                    ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Essential
              </button>
              <button
                type="button"
                onClick={() => setDisclosureLevel('more')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  disclosureLevel === 'more'
                    ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                More Options
              </button>
              <button
                type="button"
                onClick={() => setDisclosureLevel('advanced')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  disclosureLevel === 'advanced'
                    ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Advanced ⚡
              </button>
            </div>
          </div>

          {/* LEVEL 2: MORE OPTIONS */}
          {(disclosureLevel === 'more' || disclosureLevel === 'advanced') && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Merchant / Payee / Store
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bhatbhateni Supermarket"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kathmandu Central"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notes & Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional context, receipt notes, reason for expense..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              {/* RECURRING TOGGLE */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Recurring Schedule?
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isRecurring && (
                    <select
                      value={recurringFrequency}
                      onChange={(e) => setRecurringFrequency(e.target.value)}
                      className="text-xs py-1 px-2 rounded-md border border-purple-200 font-semibold text-purple-900 bg-purple-50"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  )}
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* LEVEL 3: ADVANCED SPLIT & TAX CALCULATIONS */}
          {disclosureLevel === 'advanced' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60"
            >
              <div className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center justify-between">
                <span>Advanced Bookkeeping & Multi-Split</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100">
                  Pro Feature
                </span>
              </div>

              {/* Tax Checkbox */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-purple-100">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tax / TDS / GST Deducted?
                </div>
                <div className="flex items-center gap-2">
                  {isTaxDeducted && (
                    <input
                      type="number"
                      placeholder="Tax Amount"
                      value={taxAmount}
                      onChange={(e) => setTaxAmount(e.target.value)}
                      className="w-24 px-2 py-0.5 text-xs rounded border border-purple-300"
                    />
                  )}
                  <input
                    type="checkbox"
                    checked={isTaxDeducted}
                    onChange={(e) => setIsTaxDeducted(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Split Expense Builder */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Split Across Categories
                  </span>
                  <input
                    type="checkbox"
                    checked={isSplit}
                    onChange={(e) => setIsSplit(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>
                {isSplit && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    {splitRows.map((row, idx) => (
                      <div key={row.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={row.category}
                          onChange={(e) => {
                            const updated = [...splitRows];
                            updated[idx].category = e.target.value;
                            setSplitRows(updated);
                          }}
                          className="flex-1 px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 font-semibold"
                        />
                        <div className="relative w-28">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            {currencySymbol}
                          </span>
                          <input
                            type="number"
                            placeholder="0"
                            value={row.amount}
                            onChange={(e) => {
                              const updated = [...splitRows];
                              updated[idx].amount = e.target.value;
                              setSplitRows(updated);
                            }}
                            className="w-full pl-6 pr-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 font-bold"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setSplitRows([
                          ...splitRows,
                          { id: Date.now().toString(), category: 'General', amount: '' },
                        ])
                      }
                      className="text-xs text-purple-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Split Line
                    </button>
                  </div>
                )}
              </div>

              {/* Tags Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Tags & Metadata
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 text-xs rounded-full font-medium flex items-center gap-1"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-purple-600/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Save {typeConfig[selectedType]?.label.replace(/[+\-↔]/g, '').trim()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
