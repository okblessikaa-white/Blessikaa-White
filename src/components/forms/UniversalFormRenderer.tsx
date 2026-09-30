import React, { useState, useEffect } from 'react';
import {
  FormSchema,
  FormLayoutMode,
  PersonaRole,
  FormFieldConfig,
  FormSubmissionEntry,
} from '../../types/formEngine';
import { ConditionalLogicEngine, FieldRuntimeState } from '../../utils/conditionalLogicEngine';
import { UniversalFieldInput } from './UniversalFieldInput';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';
import {
  CheckCircle,
  AlertCircle,
  Send,
  Lock,
  Layers,
  Sparkles,
  Shield,
  FileCheck,
} from 'lucide-react';

interface UniversalFormRendererProps {
  schema: FormSchema;
  initialValues?: Record<string, any>;
  layoutMode?: FormLayoutMode;
  persona?: PersonaRole;
  isReadOnly?: boolean;
  onSubmitSuccess?: (submission: FormSubmissionEntry) => void;
}

export const UniversalFormRenderer: React.FC<UniversalFormRendererProps> = ({
  schema,
  initialValues = {},
  layoutMode = schema.layoutMode || 'standard',
  persona = 'user',
  isReadOnly = false,
  onSubmitSuccess,
}) => {
  const currentPersona: PersonaRole = (persona as PersonaRole) || 'user';

  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = { ...initialValues };
    schema.fields.forEach((f) => {
      if (defaults[f.name] === undefined && f.defaultValue !== undefined) {
        defaults[f.name] = f.defaultValue;
      }
    });
    return defaults;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Compute reactive field states (visibility, required, disabled) based on conditional rules & layout mode
  const fieldsState: Record<string, FieldRuntimeState> = ConditionalLogicEngine.computeFieldsState(
    schema.fields,
    formValues,
    layoutMode,
    currentPersona
  );

  const handleFieldChange = (fieldName: string, value: any) => {
    const nextValues = { ...formValues, [fieldName]: value };
    setFormValues(nextValues);

    // Clear error on edit
    if (errors[fieldName]) {
      const nextErrors = { ...errors };
      delete nextErrors[fieldName];
      setErrors(nextErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');

    const validationResult = ConditionalLogicEngine.validateForm(
      schema.fields,
      formValues,
      fieldsState
    );

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      soundManager.playPenalty();
      return;
    }

    setIsSubmitting(true);
    soundManager.playSuccess();

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      triggerHaptic('success');

      const newSubmission: FormSubmissionEntry = {
        id: `sub_${Date.now()}`,
        formId: schema.id,
        formTitle: schema.title,
        serviceCategory: schema.serviceCategory,
        values: formValues,
        submittedAt: new Date().toISOString(),
        submittedBy: 'Alex Morgan',
        submittedByRole: currentPersona,
        status: 'submitted',
        auditLogs: [
          {
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: 'Form Submitted',
            actor: 'Alex Morgan',
            actorRole: currentPersona,
            details: `Universal submission generated with ${Object.keys(formValues).length} populated fields`,
          },
        ],
        proofsAttached: [],
      };

      if (onSubmitSuccess) {
        onSubmitSuccess(newSubmission);
      }
    }, 600);
  };

  if (submissionSuccess) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 shadow-xl text-center space-y-4 animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle className="w-9 h-9 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Submission Received!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {schema.successMessage ||
              'Your form entry has been verified, recorded in the audit vault, and synchronized with Blessikaa.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmissionSuccess(false);
            setFormValues({});
          }}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all"
        >
          Submit Another Entry
        </button>
      </div>
    );
  }

  const visibleFields = schema.fields.filter((f) => fieldsState[f.id]?.visible);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Metadata Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-[#E6E0F2] dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-base">
            ✨
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {schema.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {schema.serviceCategory} • Mode: <span className="font-semibold capitalize">{layoutMode}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            {visibleFields.length} active fields
          </span>
        </div>
      </div>

      {/* Field Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {schema.fields.map((field) => {
          const state = fieldsState[field.id];
          if (!state || !state.visible) return null;

          const isFullWidth =
            field.layoutSpan === 'full' ||
            field.type === 'textarea' ||
            field.type === 'rich_text' ||
            field.type === 'signature' ||
            field.type === 'checklist' ||
            field.type === 'ai_field';

          return (
            <div
              key={field.id}
              className={`${isFullWidth ? 'sm:col-span-2' : 'sm:col-span-1'} transition-all`}
            >
              <UniversalFieldInput
                field={field}
                value={formValues[field.name]}
                onChange={(val) => handleFieldChange(field.name, val)}
                error={errors[field.name]}
                disabled={isReadOnly || state.disabled}
                required={state.required}
                persona={persona}
                allFormValues={formValues}
              />
            </div>
          );
        })}
      </div>

      {/* Workflow steps indicator if schema has steps */}
      {schema.workflowSteps && schema.workflowSteps.length > 0 && (
        <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
          <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span>Workflow & Approval Sequence</span>
          </h4>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {schema.workflowSteps.map((st, idx) => (
              <div
                key={st.id}
                className="flex items-center gap-2 text-xs bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900 shadow-sm"
              >
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{st.title}</span>
                <span className="text-[10px] text-slate-500">({st.assigneeRole})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit / Action Bar */}
      {!isReadOnly && (
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>{isSubmitting ? 'Verifying & Saving...' : 'Submit & Save Record'}</span>
          </button>
        </div>
      )}
    </form>
  );
};
