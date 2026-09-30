// BLESSIKAA UNIVERSAL FORM ENGINE & SMART FIELD ARCHITECTURE
// Machine-readable specification and dynamic schema typing

export type FieldType =
  // 🔤 Text
  | 'text'
  | 'textarea'
  | 'rich_text'
  // 🔢 Numbers & Metrics
  | 'number'
  | 'progress'
  | 'rating'
  | 'duration'
  | 'calculated'
  // 💰 Money & Billing
  | 'money'
  // 📅 Date & Time
  | 'date'
  | 'time'
  | 'datetime'
  | 'recurring_schedule'
  // ☑️ Choices & Selection
  | 'checkbox'
  | 'choice'
  | 'dropdown'
  | 'checklist'
  // 📍 Location & Contact
  | 'phone'
  | 'email'
  | 'website'
  | 'location'
  | 'map_route'
  // 📁 Media, Uploads & Capture
  | 'photo'
  | 'file_upload'
  | 'video'
  | 'audio'
  | 'signature'
  | 'drawing'
  | 'scan'
  // 🏢 Domain Entities (Ecosystem integration)
  | 'person'
  | 'property'
  | 'medicine'
  | 'vehicle'
  | 'pet'
  | 'item_inventory'
  | 'category_tag'
  // 🛡️ Workflow, Governance & Smart Assist
  | 'reminder'
  | 'permission'
  | 'share_with'
  | 'notes_comments'
  | 'linked_field'
  | 'ai_field';

export type FieldCategory =
  | 'basic_text'
  | 'numbers_finance'
  | 'date_time'
  | 'selection_choices'
  | 'contact_location'
  | 'media_capture'
  | 'domain_entities'
  | 'workflow_governance';

export type FormLayoutMode = 'simple' | 'standard' | 'expert' | 'custom';

export type PersonaRole = 'user' | 'professional' | 'admin' | 'sub_account';

export type PreviewDevice = 'mobile' | 'tablet' | 'desktop';

export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customErrorMessage?: string;
}

export interface FieldPermissions {
  whoCanView: PersonaRole[];
  whoCanEdit: PersonaRole[];
  whoCanApprove: ('owner' | 'professional' | 'admin')[];
}

export type ConditionalOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'is_empty'
  | 'is_not_empty'
  | 'in_array';

export type ConditionalAction = 'show' | 'hide' | 'require' | 'disable' | 'set_value';

export interface ConditionalRule {
  id: string;
  sourceFieldId: string;
  operator: ConditionalOperator;
  value: any;
  action: ConditionalAction;
  targetValue?: any;
}

export interface FieldChoiceOption {
  id: string;
  label: string;
  value: string;
  color?: string;
  icon?: string;
  description?: string;
}

export interface FieldSpecificConfig {
  // Date specifics
  dateSubtype?: 'single' | 'date_range' | 'recurring' | 'deadline' | 'expiry' | 'review_date';
  minDate?: string;
  maxDate?: string;
  disablePastDates?: boolean;

  // Time specifics
  timeSubtype?: 'single' | 'time_range';

  // Money specifics
  currency?: string; // 'USD', 'EUR', 'GBP', 'INR', 'AED', 'SGD', 'CAD', 'AUD'
  includeTax?: boolean;
  taxRate?: number; // percent e.g. 5
  includeDiscount?: boolean;
  discountPercent?: number;
  trackPaymentStatus?: boolean; // 'unpaid' | 'pending' | 'paid' | 'refunded'
  allowedPaymentMethods?: string[]; // ['Card', 'Cash', 'Bank Transfer', 'Apple Pay', 'UPI']
  enableReceiptUpload?: boolean;

  // Number specifics
  numberUnit?: string; // 'kg', 'lbs', 'miles', 'km', 'hours', '%', 'points', 'units'
  step?: number;
  numberDisplay?: 'input' | 'slider' | 'stepper';

  // Choice & Dropdown
  options?: FieldChoiceOption[];
  allowMultiple?: boolean;
  searchable?: boolean;
  allowCustomInput?: boolean;

  // Scan specifics
  scanType?: 'qr_code' | 'barcode' | 'document_ocr' | 'prescription_ocr' | 'receipt_ocr';

  // Person specifics
  personRoleFilter?: 'family' | 'employee' | 'doctor' | 'customer' | 'contractor' | 'all';
  allowSelectMultiplePersons?: boolean;

  // Calculated specifics
  formula?: string; // e.g. "field_qty * field_price - field_discount"
  referencedFieldIds?: string[];
  outputDecimalPlaces?: number;

  // AI Field specifics
  aiPrompt?: string; // "Summarize symptoms into clinical notes" or "Extract key action items"
  aiOutputFormat?: 'text' | 'bullet_points' | 'tags' | 'risk_score' | 'recommendation';
  aiModel?: string;

  // Checklist items
  checklistItems?: { id: string; text: string; checkedByDefault?: boolean }[];

  // Rating specifics
  ratingMaxStars?: number; // 5, 10
  ratingIcon?: 'star' | 'heart' | 'thumb' | 'smile';

  // File & Media specifics
  maxFileSizeMb?: number;
  allowedFileExtensions?: string[]; // ['pdf', 'doc', 'docx', 'jpg', 'png', 'csv']
  maxFilesCount?: number;
  cameraFacing?: 'user' | 'environment';
}

export interface FormFieldConfig {
  id: string;
  type: FieldType;
  name: string; // Identifier key, e.g., "medicine_dosage"
  label: string; // Display title, e.g., "Dosage & Strength"
  icon: string; // Lucide icon name or emoji
  placeholder?: string;
  description?: string; // Help text / subtitle
  required: boolean;
  defaultValue?: any;
  hidden?: boolean;
  disabled?: boolean;
  layoutSpan?: 'full' | 'half' | 'third';
  tierLevel?: 'simple' | 'standard' | 'expert'; // For layout mode filtering

  // Mini configuration sub-modules
  validation?: FieldValidation;
  permissions?: FieldPermissions;
  conditionalRules?: ConditionalRule[];

  notificationTrigger?: {
    enabled: boolean;
    timing: 'immediate' | 'scheduled' | 'on_condition';
    recipient: 'user' | 'assigned_person' | 'admin' | 'custom_email';
    emailOrPhone?: string;
    messageTemplate: string;
  };

  reminder?: {
    enabled: boolean;
    advanceDays: number;
    timeOfDay: string;
    recurring: boolean;
  };

  attachProof?: {
    enabled: boolean;
    proofType: 'photo' | 'document' | 'gps' | 'signature' | 'any';
    mandatoryForApproval: boolean;
    label?: string;
  };

  auditLogEnabled?: boolean;
  specificConfig?: FieldSpecificConfig;
}

export interface FormWorkflowStep {
  id: string;
  title: string;
  description?: string;
  assigneeRole: PersonaRole;
  requiresApproval: boolean;
  statusBadge: string;
  statusColor: string; // Tailwind class or hex
}

export interface FormSchema {
  id: string;
  title: string;
  serviceCategory: string; // 'Medicine & Health', 'Real Estate', 'Vehicles', 'Finances', etc.
  description: string;
  icon: string;
  version: number;
  layoutMode: FormLayoutMode;
  fields: FormFieldConfig[];
  workflowSteps?: FormWorkflowStep[];
  createdAt: string;
  updatedAt: string;
  isTemplate?: boolean;
  isCustom?: boolean;
  author?: string;
  tags?: string[];
  submissionsCount?: number;
  successMessage?: string;
  redirectTab?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  actorRole: PersonaRole;
  fieldChanged?: string;
  oldValue?: any;
  newValue?: any;
  details?: string;
}

export interface ProofAttachment {
  id: string;
  fieldId: string;
  fileName: string;
  fileType: string;
  fileSizeFormatted: string;
  dataUrl?: string;
  uploadedAt: string;
  gpsCoordinates?: string;
}

export interface FormSubmissionEntry {
  id: string;
  formId: string;
  formTitle: string;
  serviceCategory: string;
  values: Record<string, any>;
  submittedAt: string;
  submittedBy: string;
  submittedByRole: PersonaRole;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'completed';
  auditLogs: AuditLogEntry[];
  proofsAttached: ProofAttachment[];
  notes?: string;
  ratingScore?: number;
}

export interface SmartTemplateGroup {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  fieldCount: number;
  fields: FormFieldConfig[];
  presetWorkflow?: FormWorkflowStep[];
}
