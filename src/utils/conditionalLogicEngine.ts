import { FormFieldConfig, ConditionalRule, FormLayoutMode, PersonaRole } from '../types/formEngine';

export interface FieldRuntimeState {
  visible: boolean;
  required: boolean;
  disabled: boolean;
  currentValue: any;
  error?: string;
}

export class ConditionalLogicEngine {
  /**
   * Evaluates if a single conditional rule passes given current form values
   */
  static evaluateRule(rule: ConditionalRule, formValues: Record<string, any>): boolean {
    const rawVal = formValues[rule.sourceFieldId];

    switch (rule.operator) {
      case 'equals':
        if (typeof rawVal === 'boolean') {
          return rawVal === (rule.value === true || rule.value === 'true');
        }
        return String(rawVal ?? '').toLowerCase().trim() === String(rule.value ?? '').toLowerCase().trim();

      case 'not_equals':
        if (typeof rawVal === 'boolean') {
          return rawVal !== (rule.value === true || rule.value === 'true');
        }
        return String(rawVal ?? '').toLowerCase().trim() !== String(rule.value ?? '').toLowerCase().trim();

      case 'contains':
        if (Array.isArray(rawVal)) {
          return rawVal.includes(rule.value);
        }
        return String(rawVal ?? '').toLowerCase().includes(String(rule.value ?? '').toLowerCase());

      case 'not_contains':
        if (Array.isArray(rawVal)) {
          return !rawVal.includes(rule.value);
        }
        return !String(rawVal ?? '').toLowerCase().includes(String(rule.value ?? '').toLowerCase());

      case 'greater_than':
        return Number(rawVal || 0) > Number(rule.value || 0);

      case 'less_than':
        return Number(rawVal || 0) < Number(rule.value || 0);

      case 'is_empty':
        return (
          rawVal === undefined ||
          rawVal === null ||
          rawVal === '' ||
          (Array.isArray(rawVal) && rawVal.length === 0)
        );

      case 'is_not_empty':
        return (
          rawVal !== undefined &&
          rawVal !== null &&
          rawVal !== '' &&
          (!Array.isArray(rawVal) || rawVal.length > 0)
        );

      case 'in_array':
        if (Array.isArray(rule.value)) {
          return rule.value.includes(rawVal);
        }
        return false;

      default:
        return true;
    }
  }

  /**
   * Computes the complete runtime state (visibility, required, disabled) for all fields
   */
  static computeFieldsState(
    fields: FormFieldConfig[],
    formValues: Record<string, any>,
    layoutMode: FormLayoutMode = 'standard',
    persona: PersonaRole = 'user'
  ): Record<string, FieldRuntimeState> {
    const result: Record<string, FieldRuntimeState> = {};

    fields.forEach((field) => {
      // 1. Base visibility according to Layout Mode
      let isVisibleByTier = true;
      if (layoutMode === 'simple') {
        isVisibleByTier = field.tierLevel === 'simple' || field.required;
      } else if (layoutMode === 'standard') {
        isVisibleByTier = field.tierLevel !== 'expert';
      }

      // 2. Persona view permissions
      let isVisibleByRole = true;
      let isEditableByRole = true;
      if (field.permissions?.whoCanView && field.permissions.whoCanView.length > 0) {
        isVisibleByRole =
          field.permissions.whoCanView.includes(persona) ||
          field.permissions.whoCanView.includes('user' as any) ||
          persona === 'admin';
      }
      if (field.permissions?.whoCanEdit && field.permissions.whoCanEdit.length > 0) {
        isEditableByRole =
          field.permissions.whoCanEdit.includes(persona) ||
          field.permissions.whoCanEdit.includes('user' as any) ||
          persona === 'admin';
      }

      let visible = !field.hidden && isVisibleByTier && isVisibleByRole;
      let required = field.required;
      let disabled = field.disabled || !isEditableByRole;

      // 3. Evaluate conditional rules if present
      if (field.conditionalRules && field.conditionalRules.length > 0) {
        field.conditionalRules.forEach((rule) => {
          const rulePasses = this.evaluateRule(rule, formValues);

          if (rule.action === 'show') {
            visible = rulePasses;
          } else if (rule.action === 'hide') {
            visible = !rulePasses;
          } else if (rule.action === 'require') {
            if (rulePasses) required = true;
          } else if (rule.action === 'disable') {
            if (rulePasses) disabled = true;
          }
        });
      }

      result[field.id] = {
        visible,
        required,
        disabled,
        currentValue: formValues[field.name] ?? field.defaultValue ?? '',
      };
    });

    return result;
  }

  /**
   * Validates form values against all active field rules and returns error map
   */
  static validateForm(
    fields: FormFieldConfig[],
    formValues: Record<string, any>,
    fieldsState: Record<string, FieldRuntimeState>
  ): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      const state = fieldsState[field.id];
      // Skip validation if field is hidden
      if (!state || !state.visible) return;

      const val = formValues[field.name];
      const isValEmpty =
        val === undefined ||
        val === null ||
        val === '' ||
        (Array.isArray(val) && val.length === 0);

      // Required check
      if (state.required && isValEmpty) {
        errors[field.name] = `${field.label} is required`;
        return;
      }

      // Skip format checks if empty and optional
      if (isValEmpty) return;

      // Validation bounds
      if (field.validation) {
        const { min, max, minLength, maxLength, pattern, customErrorMessage } = field.validation;

        if (typeof val === 'number') {
          if (min !== undefined && val < min) {
            errors[field.name] = customErrorMessage || `Minimum value is ${min}`;
          }
          if (max !== undefined && val > max) {
            errors[field.name] = customErrorMessage || `Maximum value is ${max}`;
          }
        }

        if (typeof val === 'string') {
          if (minLength !== undefined && val.length < minLength) {
            errors[field.name] =
              customErrorMessage || `Must be at least ${minLength} characters`;
          }
          if (maxLength !== undefined && val.length > maxLength) {
            errors[field.name] =
              customErrorMessage || `Cannot exceed ${maxLength} characters`;
          }
          if (pattern) {
            try {
              const regex = new RegExp(pattern);
              if (!regex.test(val)) {
                errors[field.name] = customErrorMessage || `Invalid format`;
              }
            } catch (e) {
              // Regex compile error fallback
            }
          }
        }
      }

      // Email format
      if (field.type === 'email' && typeof val === 'string' && val.length > 0) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          errors[field.name] = 'Please enter a valid email address';
        }
      }

      // Phone format
      if (field.type === 'phone' && typeof val === 'string' && val.length > 0) {
        if (val.length < 6) {
          errors[field.name] = 'Please enter a valid phone number';
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
