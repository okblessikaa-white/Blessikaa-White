export type FinanceMode = 'simple' | 'standard' | 'expert' | 'custom';

export type FinanceProfileRole =
  | 'personal'
  | 'parent'
  | 'child'
  | 'family'
  | 'worker'
  | 'freelancer'
  | 'landlord';

export type FinancialRecordType =
  | 'income'
  | 'expense'
  | 'transfer'
  | 'budget'
  | 'bill'
  | 'subscription'
  | 'loan'
  | 'debt'
  | 'lending'
  | 'borrowing'
  | 'investment'
  | 'insurance'
  | 'asset'
  | 'liability'
  | 'goal'
  | 'reimbursement'
  | 'allowance'
  | 'document';

export type AccountType =
  | 'bank'
  | 'cash'
  | 'wallet'
  | 'credit_card'
  | 'debit_card'
  | 'digital_wallet'
  | 'investment'
  | 'other';

export interface FinancialAccount {
  id: string;
  name: string;
  type: AccountType;
  institutionName?: string;
  accountNumberMasked?: string;
  balance: number;
  currency: string;
  color: string;
  icon: string;
  includeInNetWorth: boolean;
  isDefault?: boolean;
  creditLimit?: number;
  ownerProfileId?: string;
}

export interface SplitItem {
  id: string;
  category: string;
  amount: number;
  note?: string;
}

export interface RecurringRule {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  occurrencesCount?: number;
  autoDeduct?: boolean;
}

export interface FinanceAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: FinanceProfileRole | string;
  action: string;
  recordType?: string;
  recordId?: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  currency: string;
  category: string;
  subcategory?: string;
  accountId: string;
  targetAccountId?: string; // For transfers
  date: string; // YYYY-MM-DD
  time?: string;
  merchant?: string;
  location?: string;
  notes?: string;
  isRecurring?: boolean;
  recurringRule?: RecurringRule;
  isTaxDeducted?: boolean;
  taxAmount?: number;
  tags?: string[];
  receiptUrl?: string;
  receiptThumbnail?: string;
  status: 'completed' | 'pending' | 'cleared' | 'disputed' | 'cancelled';
  splitItems?: SplitItem[];
  proofUrl?: string;
  proofVerified?: boolean;
  ownerProfileId: string;
  createdBy: string;
  auditLogs?: FinanceAuditLog[];
  source?: 'manual' | 'receipt_ocr' | 'recurring' | 'transfer';
}

export interface FinancialBudget {
  id: string;
  name: string;
  period: 'weekly' | 'monthly' | 'yearly';
  category: string;
  limit: number;
  spent: number;
  currency: string;
  alertAt70?: boolean;
  alertAt90?: boolean;
  alertAt100?: boolean;
  startDate: string;
  isRecurring: boolean;
  rolloverRemaining?: boolean;
}

export interface FinancialBill {
  id: string;
  name: string;
  provider: string;
  amount: number;
  currency: string;
  dueDate: string;
  frequency: 'once' | 'monthly' | 'quarterly' | 'yearly';
  accountId?: string;
  isAutoPay: boolean;
  status: 'upcoming' | 'paid' | 'overdue';
  category: string;
  reminderDaysBefore: number;
  lateFeeNote?: string;
  receiptProofUrl?: string;
  paidDate?: string;
  paidBy?: string;
  proofSubmittedBy?: string;
  proofApprovedBy?: string;
  proofStatus?: 'none' | 'pending_review' | 'approved' | 'rejected';
}

export interface FinancialSubscription {
  id: string;
  serviceName: string;
  icon?: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  nextBillingDate: string;
  paymentAccountId: string;
  category: string;
  trialEndDate?: string;
  status: 'active' | 'expiring' | 'cancelled' | 'paused';
  cancellationUrl?: string;
  notes?: string;
  receiptUrl?: string;
}

export interface FinancialGoalMilestone {
  id: string;
  title: string;
  targetAmount: number;
  reached: boolean;
  reachedDate?: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: string;
  priority: 'low' | 'medium' | 'high';
  monthlyContribution: number;
  linkedAccountId?: string;
  category: string;
  icon: string;
  color: string;
  milestones: FinancialGoalMilestone[];
  isCompleted: boolean;
}

export interface FinancialLoan {
  id: string;
  lender: string;
  loanName: string;
  loanType: 'home' | 'personal' | 'vehicle' | 'education' | 'business' | 'other';
  principal: number;
  remainingBalance: number;
  interestRate: number; // e.g. 8.5%
  interestType: 'fixed' | 'reducing';
  termMonths: number;
  emiAmount: number;
  dueDateDay: number; // day of month (e.g. 5)
  startDate: string;
  endDate?: string;
  collateral?: string;
  currency: string;
  status: 'active' | 'paid_off' | 'overdue';
}

export interface LendingBorrowingRecord {
  id: string;
  personName: string;
  personContact?: string;
  amount: number;
  currency: string;
  type: 'lent' | 'borrowed'; // 'lent' (Owed to me) vs 'borrowed' (I owe)
  date: string;
  expectedReturnDate: string;
  purpose: string;
  status: 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'disputed';
  amountRepaid: number;
  notes?: string;
  proofDocumentUrl?: string;
  paymentsHistory?: {
    id: string;
    amount: number;
    date: string;
    note?: string;
  }[];
}

export interface InvestmentItem {
  id: string;
  name: string;
  assetClass:
    | 'stocks'
    | 'mutual_funds'
    | 'fixed_deposits'
    | 'bonds'
    | 'gold'
    | 'crypto'
    | 'property'
    | 'other';
  investedAmount: number;
  currentValue: number;
  returnsAmount: number;
  returnsPercent: number;
  units?: number;
  unitPrice?: number;
  currency: string;
  purchaseDate: string;
  institution?: string;
  notes?: string;
}

export interface InsurancePolicy {
  id: string;
  provider: string;
  policyName: string;
  policyNumber: string;
  policyType: 'health' | 'life' | 'vehicle' | 'property' | 'travel' | 'other';
  policyHolder: string;
  coverageAmount: number;
  premiumAmount: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  startDate: string;
  expiryDate: string;
  beneficiary?: string;
  documentsCount: number;
  currency: string;
  status: 'active' | 'expiring_soon' | 'lapsed';
}

export interface PersonalAsset {
  id: string;
  name: string;
  category: 'property' | 'vehicle' | 'jewellery' | 'electronics' | 'land' | 'equipment' | 'other';
  purchasePrice: number;
  currentEstimatedValue: number;
  purchaseDate: string;
  owner: string;
  location?: string;
  attachedLoanId?: string;
  currency: string;
  notes?: string;
  photosCount?: number;
}

export interface PersonalLiability {
  id: string;
  name: string;
  category: 'credit_debt' | 'mortgage' | 'personal_loan' | 'tax_payable' | 'other';
  amount: number;
  interestRate?: number;
  monthlyPayment?: number;
  dueDate?: string;
  creditor: string;
  currency: string;
}

export interface ReimbursementRecord {
  id: string;
  title: string;
  amount: number;
  currency: string;
  purpose: string;
  category: string;
  receiptPhotoUrl?: string;
  submitterName: string;
  submitterRole: FinanceProfileRole | string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submittedDate: string;
  approvedDate?: string;
  reviewerNotes?: string;
}

export interface AllowanceRecord {
  id: string;
  recipientName: string;
  recipientRole: 'child' | 'house_worker' | 'parent' | 'student' | 'other';
  monthlyAmount: number;
  currency: string;
  paymentFrequency: 'weekly' | 'biweekly' | 'monthly';
  lastPaidDate?: string;
  nextPaymentDate: string;
  status: 'active' | 'paused';
  notes?: string;
  paymentHistory: {
    id: string;
    amount: number;
    date: string;
    type: 'salary' | 'allowance' | 'bonus' | 'advance';
    note?: string;
    proofReceiptUrl?: string;
  }[];
}

export interface FinancialDocument {
  id: string;
  title: string;
  type:
    | 'bank_statement'
    | 'bill_receipt'
    | 'tax_document'
    | 'insurance_policy'
    | 'loan_agreement'
    | 'contract'
    | 'property_deed'
    | 'investment_cert'
    | 'other';
  fileSize: string;
  uploadDate: string;
  category: string;
  tags: string[];
  fileUrl?: string;
  isEncrypted: boolean;
  notes?: string;
}

export interface FinancialHealthMetric {
  score: number; // 0-100
  rating: 'Strong' | 'Good' | 'Fair' | 'Needs Attention';
  emergencySavingsMonths: number;
  budgetAdherencePercent: number;
  billsOnTimePercent: number;
  debtToIncomeRatio: number;
  diversificationScore: number;
  recommendations: string[];
}

export interface FinanceAlertItem {
  id: string;
  type:
    | 'bill_overdue'
    | 'budget_warning'
    | 'subscription_renewal'
    | 'low_balance'
    | 'goal_milestone'
    | 'monthly_report'
    | 'proof_submitted';
  severity: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  actionRoute?: string;
}

export interface FinanceProfile {
  id: string;
  name: string;
  role: FinanceProfileRole;
  avatar: string;
  canViewBalances: boolean;
  canAddExpenses: boolean;
  canEditRecords: boolean;
  canViewInvestments: boolean;
  canViewSalary: boolean;
  monthlyAllowanceLimit?: number;
}

export interface CustomDashboardModules {
  showNetWorth: boolean;
  showMoneyOverview: boolean;
  showCashflowBar: boolean;
  showUpcomingBills: boolean;
  showGoals: boolean;
  showRecentTransactions: boolean;
  showInvestments: boolean;
  showLoansDebts: boolean;
  showInsurance: boolean;
  showFamilyFinance: boolean;
  showHealthScore: boolean;
  showForecast: boolean;
}

export interface FinanceSettingsState {
  currency: string;
  currencySymbol: string;
  mode: FinanceMode;
  defaultAccountId: string;
  defaultCategory: string;
  dashboardModules: CustomDashboardModules;
  pinLockEnabled: boolean;
  biometricEnabled: boolean;
  sensitiveScreensLocked: boolean;
  alertChannels: {
    inApp: boolean;
    browserPush: boolean;
    emailDigest: boolean;
    sms: boolean;
  };
  budgetThresholds: {
    at70: boolean;
    at90: boolean;
    at100: boolean;
  };
}
