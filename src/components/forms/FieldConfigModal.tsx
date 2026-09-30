import React, { useState } from 'react';
import {
  FormFieldConfig,
  FieldChoiceOption,
  ConditionalRule,
  PersonaRole,
} from '../../types/formEngine';
import {
  X,
  Settings,
  Shield,
  Eye,
  Bell,
  CheckSquare,
  Sparkles,
  Layers,
  Plus,
  Trash2,
  Lock,
  Clock,
  Camera,
  FileText,
  Save,
  Sliders,
} from 'lucide-react';

interface FieldConfigModalProps {
  isOpen: boolean;
  field: FormFieldConfig | null;
  allFields: FormFieldConfig[];
  onClose: () => void;
  onSave: (updatedField: FormFieldConfig) => void;
}

export const FieldConfigModal: React.FC<FieldConfigModalProps> = ({
  isOpen,
  field,
  allFields,
  onClose,
  onSave,
}) => {
  if (!isOpen || !field) return null;

  const [activeTab, setActiveTab] = useState<
    'general' | 'specific' | 'validation' | 'permissions' | 'logic' | 'automation'
  >('general');

  const [formData, setFormData] = useState<FormFieldConfig>({
    ...field,
    validation: field.validation || {},
    permissions: field.permissions || {
      whoCanView: ['user', 'professional', 'admin', 'sub_account'],
      whoCanEdit: ['user', 'professional', 'admin'],
      whoCanApprove: ['professional', 'admin'],
    },
    conditionalRules: field.conditionalRules || [],
    notificationTrigger: field.notificationTrigger || {
      enabled: false,
      timing: 'immediate',
      recipient: 'user',
      messageTemplate: 'Field updated: {{value}}',
    },
    reminder: field.reminder || {
      enabled: false,
      advanceDays: 1,
      timeOfDay: '09:00',
      recurring: false,
    },
    attachProof: field.attachProof || {
      enabled: false,
      proofType: 'photo',
      mandatoryForApproval: false,
    },
    auditLogEnabled: field.auditLogEnabled ?? true,
    specificConfig: field.specificConfig || {},
  });

  const handleAddChoiceOption = () => {
    const currentOptions = formData.specificConfig?.options || [];
    const newOpt: FieldChoiceOption = {
      id: `opt_${Date.now()}`,
      label: `Option ${currentOptions.length + 1}`,
      value: `option_${currentOptions.length + 1}`,
    };
    setFormData({
      ...formData,
      specificConfig: {
        ...formData.specificConfig,
        options: [...currentOptions, newOpt],
      },
    });
  };

  const handleRemoveChoiceOption = (id: string) => {
    const currentOptions = formData.specificConfig?.options || [];
    setFormData({
      ...formData,
      specificConfig: {
        ...formData.specificConfig,
        options: currentOptions.filter((opt) => opt.id !== id),
      },
    });
  };

  const handleAddConditionalRule = () => {
    const otherFields = allFields.filter((f) => f.id !== field.id);
    if (otherFields.length === 0) return;
    const newRule: ConditionalRule = {
      id: `rule_${Date.now()}`,
      sourceFieldId: otherFields[0].id,
      operator: 'equals',
      value: '',
      action: 'show',
    };
    setFormData({
      ...formData,
      conditionalRules: [...(formData.conditionalRules || []), newRule],
    });
  };

  const handleRemoveConditionalRule = (id: string) => {
    setFormData({
      ...formData,
      conditionalRules: (formData.conditionalRules || []).filter((r) => r.id !== id),
    });
  };

  const tabs = [
    { id: 'general', label: 'General & Display', icon: Settings },
    { id: 'specific', label: 'Field Specifics', icon: Sliders },
    { id: 'validation', label: 'Validation & Limits', icon: CheckSquare },
    { id: 'permissions', label: 'Permissions (RBAC)', icon: Shield },
    { id: 'logic', label: 'Conditional Logic', icon: Sparkles },
    { id: 'automation', label: 'Alerts, Proof & Audit', icon: Bell },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-[#151528] rounded-3xl border border-[#E6E0F2] dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E0F2] dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold">
              ⚙️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Field Settings</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-mono border border-purple-200 dark:border-purple-900">
                  {formData.type}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure behavior, validation, permissions, and smart triggers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E6E0F2] dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 overflow-x-auto scrollbar-none px-4 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-800/60 rounded-t-xl'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* 1. General & Display */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Field Label (User Facing Title)
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    System Identifier Name (Key)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={formData.placeholder || ''}
                  placeholder="e.g. Enter dosage, address, or select from list..."
                  onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description / Helper Instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  placeholder="Explain why this field is needed or instructions for the user..."
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.required}
                    onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Required Field
                    </span>
                    <span className="text-[10px] text-slate-500">Mandatory to submit</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hidden || false}
                    onChange={(e) => setFormData({ ...formData, hidden: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Hidden Field
                    </span>
                    <span className="text-[10px] text-slate-500">Hidden from user UI</span>
                  </div>
                </label>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Layout Mode Tier
                  </label>
                  <select
                    value={formData.tierLevel || 'standard'}
                    onChange={(e) => setFormData({ ...formData, tierLevel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="simple">Simple (Essential only)</option>
                    <option value="standard">Standard (Recommended)</option>
                    <option value="expert">Expert (Advanced full)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. Field Specifics */}
          {activeTab === 'specific' && (
            <div className="space-y-4">
              {/* Date Specifics */}
              {formData.type === 'date' && (
                <div className="space-y-3 p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                  <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300">
                    Date Configuration & Subtype
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'single', label: 'Single Date' },
                      { id: 'date_range', label: 'Start + End Range' },
                      { id: 'recurring', label: 'Recurring Date' },
                      { id: 'deadline', label: 'Strict Deadline' },
                      { id: 'expiry', label: 'Expiration Date' },
                      { id: 'review_date', label: 'Review Date' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            specificConfig: {
                              ...formData.specificConfig,
                              dateSubtype: st.id as any,
                            },
                          })
                        }
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          formData.specificConfig?.dateSubtype === st.id
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Money Specifics */}
              {formData.type === 'money' && (
                <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    Financial Currency & Tax Rules
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Currency
                      </label>
                      <select
                        value={formData.specificConfig?.currency || 'USD'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specificConfig: {
                              ...formData.specificConfig,
                              currency: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="AED">AED (د.إ)</option>
                        <option value="SGD">SGD (S$)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        value={formData.specificConfig?.taxRate ?? 5}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specificConfig: {
                              ...formData.specificConfig,
                              taxRate: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Choice / Dropdown Options */}
              {(formData.type === 'choice' || formData.type === 'dropdown') && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Options List
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddChoiceOption}
                      className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(formData.specificConfig?.options || []).map((opt, idx) => (
                      <div
                        key={opt.id}
                        className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                      >
                        <span className="text-xs font-mono text-slate-400 w-5">{idx + 1}.</span>
                        <input
                          type="text"
                          value={opt.label}
                          placeholder="Option Label"
                          onChange={(e) => {
                            const updated = [...(formData.specificConfig?.options || [])];
                            updated[idx].label = e.target.value;
                            updated[idx].value = e.target.value.toLowerCase().replace(/\s+/g, '_');
                            setFormData({
                              ...formData,
                              specificConfig: { ...formData.specificConfig, options: updated },
                            });
                          }}
                          className="flex-1 px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveChoiceOption(opt.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Field Prompt */}
              {formData.type === 'ai_field' && (
                <div className="space-y-3 p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                  <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>AI Prompt Directive</span>
                  </h4>
                  <textarea
                    rows={3}
                    value={formData.specificConfig?.aiPrompt || ''}
                    placeholder="e.g. Analyze all symptom entries, calculate risk score, and generate standardized clinical guidance..."
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specificConfig: {
                          ...formData.specificConfig,
                          aiPrompt: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
              )}
            </div>
          )}

          {/* 3. Validation & Limits */}
          {activeTab === 'validation' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Minimum Value / Length
                  </label>
                  <input
                    type="number"
                    value={formData.validation?.min ?? ''}
                    placeholder="e.g. 0 or min characters"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validation: {
                          ...formData.validation,
                          min: e.target.value === '' ? undefined : Number(e.target.value),
                          minLength: e.target.value === '' ? undefined : Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Maximum Value / Character Limit
                  </label>
                  <input
                    type="number"
                    value={formData.validation?.max ?? ''}
                    placeholder="e.g. 100 or max characters"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validation: {
                          ...formData.validation,
                          max: e.target.value === '' ? undefined : Number(e.target.value),
                          maxLength: e.target.value === '' ? undefined : Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Custom Validation Error Message
                </label>
                <input
                  type="text"
                  value={formData.validation?.customErrorMessage || ''}
                  placeholder="e.g. Please provide a valid registration code"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      validation: {
                        ...formData.validation,
                        customErrorMessage: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                />
              </div>
            </div>
          )}

          {/* 4. Permissions (RBAC) */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Role-Based Access Governance (RBAC)</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Restrict who can view, fill/edit, or approve this field across personas.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Who Can View this Field:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['user', 'professional', 'admin', 'sub_account'] as PersonaRole[]).map((role) => {
                        const canView = formData.permissions?.whoCanView.includes(role);
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              const current = formData.permissions?.whoCanView || [];
                              const updated = canView
                                ? current.filter((r) => r !== role)
                                : [...current, role];
                              setFormData({
                                ...formData,
                                permissions: { ...formData.permissions!, whoCanView: updated },
                              });
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              canView
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            {role.replace('_', ' ').toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Who Can Edit / Fill this Field:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['user', 'professional', 'admin'] as PersonaRole[]).map((role) => {
                        const canEdit = formData.permissions?.whoCanEdit.includes(role);
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              const current = formData.permissions?.whoCanEdit || [];
                              const updated = canEdit
                                ? current.filter((r) => r !== role)
                                : [...current, role];
                              setFormData({
                                ...formData,
                                permissions: { ...formData.permissions!, whoCanEdit: updated },
                              });
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              canEdit
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            {role.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Conditional Logic */}
          {activeTab === 'logic' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Conditional Display Rules
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Dynamically show, hide, or require this field based on other inputs
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddConditionalRule}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Rule</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.conditionalRules || []).map((rule, idx) => (
                  <div
                    key={rule.id}
                    className="p-3 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                        Rule #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveConditionalRule(rule.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-1">If Field:</label>
                        <select
                          value={rule.sourceFieldId}
                          onChange={(e) => {
                            const updated = [...(formData.conditionalRules || [])];
                            updated[idx].sourceFieldId = e.target.value;
                            setFormData({ ...formData, conditionalRules: updated });
                          }}
                          className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        >
                          {allFields
                            .filter((f) => f.id !== formData.id)
                            .map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.label}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 block mb-1">Operator:</label>
                        <select
                          value={rule.operator}
                          onChange={(e) => {
                            const updated = [...(formData.conditionalRules || [])];
                            updated[idx].operator = e.target.value as any;
                            setFormData({ ...formData, conditionalRules: updated });
                          }}
                          className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="equals">Equals (=)</option>
                          <option value="not_equals">Does Not Equal (≠)</option>
                          <option value="contains">Contains</option>
                          <option value="greater_than">Greater Than (&gt;)</option>
                          <option value="less_than">Less Than (&lt;)</option>
                          <option value="is_empty">Is Empty</option>
                          <option value="is_not_empty">Is Filled</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 block mb-1">Value Match:</label>
                        <input
                          type="text"
                          value={rule.value || ''}
                          placeholder="e.g. injection, Paid, Yes"
                          onChange={(e) => {
                            const updated = [...(formData.conditionalRules || [])];
                            updated[idx].value = e.target.value;
                            setFormData({ ...formData, conditionalRules: updated });
                          }}
                          className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 block mb-1">Action:</label>
                        <select
                          value={rule.action}
                          onChange={(e) => {
                            const updated = [...(formData.conditionalRules || [])];
                            updated[idx].action = e.target.value as any;
                            setFormData({ ...formData, conditionalRules: updated });
                          }}
                          className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-purple-700 dark:text-purple-300"
                        >
                          <option value="show">SHOW THIS FIELD</option>
                          <option value="hide">HIDE THIS FIELD</option>
                          <option value="require">MAKE REQUIRED</option>
                          <option value="disable">DISABLE FIELD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {(formData.conditionalRules || []).length === 0 && (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    No conditional rules configured. This field will show according to standard layout mode.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 6. Automation & Proof */}
          {activeTab === 'automation' && (
            <div className="space-y-4">
              {/* Attach Proof */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.attachProof?.enabled || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attachProof: {
                          ...formData.attachProof!,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Require Proof / Evidence for this Field
                  </span>
                </label>

                {formData.attachProof?.enabled && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1">Proof Type</label>
                      <select
                        value={formData.attachProof.proofType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attachProof: {
                              ...formData.attachProof!,
                              proofType: e.target.value as any,
                            },
                          })
                        }
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                      >
                        <option value="photo">Photo / Camera Snap</option>
                        <option value="document">Document / PDF</option>
                        <option value="gps">GPS Geofence Timestamp</option>
                        <option value="signature">Digital Signature</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 mt-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.attachProof.mandatoryForApproval}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attachProof: {
                              ...formData.attachProof!,
                              mandatoryForApproval: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 accent-purple-600 rounded"
                      />
                      <span className="text-xs text-slate-700 dark:text-slate-300">
                        Mandatory for Approval
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Audit Log */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.auditLogEnabled ?? true}
                    onChange={(e) => setFormData({ ...formData, auditLogEnabled: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Enable Field Audit Log
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Record every change, actor timestamp, and prior value in history
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E6E0F2] dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(formData);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Field Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
