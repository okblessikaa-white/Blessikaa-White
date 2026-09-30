import { FormSchema } from '../types/formEngine';
import { SMART_TEMPLATES } from './formTemplates';

export const DEFAULT_FORM_SCHEMAS: FormSchema[] = [
  {
    id: 'schema_med_intake',
    title: 'Universal Medicine & Prescription Intake',
    serviceCategory: 'Healthcare & Pharmacy',
    description: 'Standardized clinical and patient medicine log with conditional dosage routes and pill photos.',
    icon: 'Pill',
    version: 1,
    layoutMode: 'standard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isTemplate: false,
    fields: SMART_TEMPLATES.find((t) => t.id === 'template_medicine_prescription')?.fields || [],
    workflowSteps: [
      {
        id: 'step_patient_input',
        title: 'Patient Entry',
        assigneeRole: 'user',
        requiresApproval: false,
        statusBadge: 'Draft Submitted',
        statusColor: 'bg-purple-100 text-purple-700',
      },
      {
        id: 'step_pharmacist_review',
        title: 'Pharmacist Review',
        assigneeRole: 'professional',
        requiresApproval: true,
        statusBadge: 'Verified Clinical',
        statusColor: 'bg-emerald-100 text-emerald-700',
      },
    ],
    tags: ['Pharmacy', 'Prescriptions', 'Dosage'],
    submissionsCount: 14,
  },
  {
    id: 'schema_property_lease',
    title: 'Property & Rental Asset Registry',
    serviceCategory: 'Location & Properties',
    description: 'Comprehensive property asset onboarding with valuation, occupancy status, and lease attachments.',
    icon: 'Home',
    version: 1,
    layoutMode: 'standard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isTemplate: false,
    fields: SMART_TEMPLATES.find((t) => t.id === 'template_property_asset')?.fields || [],
    tags: ['Real Estate', 'Leases', 'Assets'],
    submissionsCount: 8,
  },
  {
    id: 'schema_payment_expense',
    title: 'Payment & Expense Transaction',
    serviceCategory: 'Finance & Billing',
    description: 'Standardized payment ledger with tax calculation, conditional payment method, and receipt upload.',
    icon: 'DollarSign',
    version: 1,
    layoutMode: 'standard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isTemplate: false,
    fields: SMART_TEMPLATES.find((t) => t.id === 'template_payment_invoice')?.fields || [],
    tags: ['Finance', 'Expenses', 'Invoices'],
    submissionsCount: 22,
  },
  {
    id: 'schema_task_tracker',
    title: 'Task & Action Milestone Verification',
    serviceCategory: 'Productivity & Work',
    description: 'Milestone tracking with priority levels, subtask checklists, and camera proof submission.',
    icon: 'CheckSquare',
    version: 1,
    layoutMode: 'standard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isTemplate: false,
    fields: SMART_TEMPLATES.find((t) => t.id === 'template_task_milestone')?.fields || [],
    tags: ['Tasks', 'Workflows', 'Checklists'],
    submissionsCount: 37,
  },
  {
    id: 'schema_habit_challenge',
    title: '21-Day Habit & Neuroplasticity Commitment',
    serviceCategory: 'Habits & Neuroplasticity',
    description: 'Neural pathway tracker with identity anchoring, cue alarms, and Day 22+ continuous habit transition.',
    icon: 'Zap',
    version: 1,
    layoutMode: 'simple',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isTemplate: false,
    fields: SMART_TEMPLATES.find((t) => t.id === 'template_challenge_habit')?.fields || [],
    tags: ['Habits', '21 Days', 'Neuroplasticity'],
    submissionsCount: 51,
  },
];

const STORAGE_KEY_FORM_SCHEMAS = 'blessikaa_universal_form_schemas';
const STORAGE_KEY_FORM_SUBMISSIONS = 'blessikaa_form_submissions';

export class FormEngineStorage {
  static getSchemas(): FormSchema[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_FORM_SCHEMAS);
      if (!data) return DEFAULT_FORM_SCHEMAS;
      const parsed: FormSchema[] = JSON.parse(data);
      return parsed.length > 0 ? parsed : DEFAULT_FORM_SCHEMAS;
    } catch {
      return DEFAULT_FORM_SCHEMAS;
    }
  }

  static saveSchemas(schemas: FormSchema[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_FORM_SCHEMAS, JSON.stringify(schemas));
    } catch (e) {
      console.error('Error saving form schemas:', e);
    }
  }

  static saveSchema(schema: FormSchema): void {
    const schemas = this.getSchemas();
    const existingIndex = schemas.findIndex((s) => s.id === schema.id);
    let next: FormSchema[];
    if (existingIndex >= 0) {
      next = [...schemas];
      next[existingIndex] = { ...schema, updatedAt: new Date().toISOString() };
    } else {
      next = [schema, ...schemas];
    }
    this.saveSchemas(next);
  }

  static deleteSchema(id: string): void {
    const schemas = this.getSchemas().filter((s) => s.id !== id);
    this.saveSchemas(schemas);
  }

  static getSubmissions(): any[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_FORM_SUBMISSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveSubmission(sub: any): void {
    try {
      const list = this.getSubmissions();
      const next = [sub, ...list];
      localStorage.setItem(STORAGE_KEY_FORM_SUBMISSIONS, JSON.stringify(next));
    } catch (e) {
      console.error('Error saving submission:', e);
    }
  }
}
