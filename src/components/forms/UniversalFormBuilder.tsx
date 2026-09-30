import React, { useState } from 'react';
import {
  FormSchema,
  FormFieldConfig,
  FormLayoutMode,
  SmartTemplateGroup,
} from '../../types/formEngine';
import { FormEngineStorage, DEFAULT_FORM_SCHEMAS } from '../../data/formSchemas';
import { ALL_FIELD_TYPE_DEFINITIONS, FieldTypeDefinition } from '../../data/formTemplates';
import { AddFieldBottomSheet } from './AddFieldBottomSheet';
import { FieldConfigModal } from './FieldConfigModal';
import { SmartTemplatePickerModal } from './SmartTemplatePickerModal';
import { FormTestModal } from './FormTestModal';
import { UniversalFormRenderer } from './UniversalFormRenderer';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';
import {
  Plus,
  Sparkles,
  Layers,
  ArrowLeft,
  Settings,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  Play,
  Save,
  Copy,
  Download,
  Upload,
  CheckCircle,
  FileCode,
  Shield,
  Tag,
  Share2,
  Smartphone,
  Sliders,
  Pill,
  Home,
  DollarSign,
  CheckSquare,
  Zap,
} from 'lucide-react';

interface UniversalFormBuilderProps {
  onBack: () => void;
  initialSchemaId?: string;
  onNavigateTab?: (tab: any) => void;
}

export const UniversalFormBuilder: React.FC<UniversalFormBuilderProps> = ({
  onBack,
  initialSchemaId,
  onNavigateTab,
}) => {
  const [schemas, setSchemas] = useState<FormSchema[]>(() => FormEngineStorage.getSchemas());
  const [activeSchemaId, setActiveSchemaId] = useState<string>(() => {
    if (initialSchemaId && FormEngineStorage.getSchemas().some((s) => s.id === initialSchemaId)) {
      return initialSchemaId;
    }
    return FormEngineStorage.getSchemas()[0]?.id || 'schema_med_intake';
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'schemas_library'>('editor');
  const [showAddFieldSheet, setShowAddFieldSheet] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [editingField, setEditingField] = useState<FormFieldConfig | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [saveBannerMessage, setSaveBannerMessage] = useState<string | null>(null);

  const currentSchema =
    schemas.find((s) => s.id === activeSchemaId) || schemas[0] || DEFAULT_FORM_SCHEMAS[0];

  // Save current schema changes
  const handleUpdateCurrentSchema = (updated: Partial<FormSchema>) => {
    const nextSchema: FormSchema = {
      ...currentSchema,
      ...updated,
      updatedAt: new Date().toISOString(),
    };
    const nextList = schemas.map((s) => (s.id === nextSchema.id ? nextSchema : s));
    setSchemas(nextList);
    FormEngineStorage.saveSchemas(nextList);
  };

  // Add field
  const handleSelectFieldType = (fieldDef: FieldTypeDefinition) => {
    const newField: FormFieldConfig = {
      id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: fieldDef.type,
      name: `${fieldDef.type}_${Date.now().toString().slice(-4)}`,
      label: fieldDef.defaultLabel,
      icon: fieldDef.icon,
      placeholder: fieldDef.defaultPlaceholder,
      required: false,
      tierLevel: 'standard',
      layoutSpan: 'full',
      auditLogEnabled: true,
      permissions: {
        whoCanView: ['user', 'professional', 'admin', 'sub_account'],
        whoCanEdit: ['user', 'professional', 'admin'],
        whoCanApprove: ['professional', 'admin'],
      },
    };

    const nextFields = [...currentSchema.fields, newField];
    handleUpdateCurrentSchema({ fields: nextFields });
    soundManager.playSuccess();
    triggerHaptic('light');

    // Automatically open configuration modal
    setEditingField(newField);
  };

  // Add from Smart Template group
  const handleAddTemplateGroup = (template: SmartTemplateGroup) => {
    // Generate fresh IDs for each field
    const clonedFields: FormFieldConfig[] = template.fields.map((f) => ({
      ...f,
      id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    }));

    const nextFields = [...currentSchema.fields, ...clonedFields];
    handleUpdateCurrentSchema({ fields: nextFields });
    soundManager.playCelebration();
    triggerHaptic('success');

    setSaveBannerMessage(`Added ${clonedFields.length} fields from "${template.title}" template!`);
    setTimeout(() => setSaveBannerMessage(null), 3000);
  };

  // Reorder field
  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentSchema.fields.length) return;

    const nextFields = [...currentSchema.fields];
    const [moved] = nextFields.splice(index, 1);
    nextFields.splice(targetIdx, 0, moved);

    handleUpdateCurrentSchema({ fields: nextFields });
    triggerHaptic('light');
  };

  // Delete field
  const handleDeleteField = (fieldId: string) => {
    const nextFields = currentSchema.fields.filter((f) => f.id !== fieldId);
    handleUpdateCurrentSchema({ fields: nextFields });
    triggerHaptic('medium');
  };

  // Duplicate field
  const handleDuplicateField = (field: FormFieldConfig) => {
    const cloned: FormFieldConfig = {
      ...field,
      id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${field.name}_copy`,
      label: `${field.label} (Copy)`,
    };
    const nextFields = [...currentSchema.fields, cloned];
    handleUpdateCurrentSchema({ fields: nextFields });
    soundManager.playSuccess();
  };

  // Create new schema
  const handleCreateNewSchema = () => {
    const newSchema: FormSchema = {
      id: `schema_custom_${Date.now()}`,
      title: 'New Custom Universal Form',
      serviceCategory: 'General Services',
      description: 'Custom standardized smart form configured for Blessikaa life-care workflows.',
      icon: 'Sparkles',
      version: 1,
      layoutMode: 'standard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCustom: true,
      fields: [
        {
          id: `field_init_title`,
          type: 'text',
          name: 'record_title',
          label: 'Record Title',
          icon: 'Type',
          placeholder: 'Enter title...',
          required: true,
          tierLevel: 'simple',
        },
      ],
      tags: ['Custom', 'User Form'],
      submissionsCount: 0,
    };

    const nextList = [newSchema, ...schemas];
    setSchemas(nextList);
    setActiveSchemaId(newSchema.id);
    FormEngineStorage.saveSchemas(nextList);
    setActiveTab('editor');
    soundManager.playSuccess();
    triggerHaptic('success');
  };

  return (
    <div className="w-full space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#E6E0F2] dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900 transition-all hover:scale-105 active:scale-95"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                Universal Architecture
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Universal Form Builder & Smart Field Engine
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCreateNewSchema}
            className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 border border-purple-200 dark:border-purple-900 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Form</span>
          </button>

          <button
            onClick={() => setShowTestModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test Form</span>
          </button>
        </div>
      </div>

      {/* Save Alert Banner */}
      {saveBannerMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{saveBannerMessage}</span>
        </div>
      )}

      {/* Main Lifecycle Tabs: Build / Preview / Schema Library */}
      <div className="flex items-center justify-between border-b border-[#E6E0F2] dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'editor', label: '1. Build Schema', icon: Layers },
            { id: 'preview', label: '2. Live Preview', icon: Eye },
            { id: 'schemas_library', label: '3. Form Registry (Schemas)', icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-[#E6E0F2] dark:border-slate-800 hover:border-purple-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Active:</span>
          <select
            value={activeSchemaId}
            onChange={(e) => setActiveSchemaId(e.target.value)}
            className="p-1.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-xs max-w-[200px] truncate"
          >
            {schemas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. BUILD SCHEMA TAB */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          {/* Schema Metadata Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#E6E0F2] dark:border-slate-800 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Form Title
                </label>
                <input
                  type="text"
                  value={currentSchema.title}
                  onChange={(e) => handleUpdateCurrentSchema({ title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Service Category
                </label>
                <input
                  type="text"
                  value={currentSchema.serviceCategory}
                  onChange={(e) => handleUpdateCurrentSchema({ serviceCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description / Purpose
                </label>
                <input
                  type="text"
                  value={currentSchema.description}
                  onChange={(e) => handleUpdateCurrentSchema({ description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Layout Mode Configuration
                </label>
                <select
                  value={currentSchema.layoutMode}
                  onChange={(e) =>
                    handleUpdateCurrentSchema({ layoutMode: e.target.value as FormLayoutMode })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-purple-700 dark:text-purple-300"
                >
                  <option value="simple">Simple (Essential fields)</option>
                  <option value="standard">Standard (Recommended)</option>
                  <option value="expert">Expert (Full configurable)</option>
                  <option value="custom">Custom Configuration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fields List Container */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Standardized Fields</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono">
                    {currentSchema.fields.length} fields
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Drag, configure, set conditional logic rules, or add from smart templates
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowTemplatePicker(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-all flex items-center gap-1 border border-purple-200 dark:border-purple-900"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Template Group</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddFieldSheet(true)}
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center gap-1"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Add Field</span>
                </button>
              </div>
            </div>

            {/* Field Rows */}
            <div className="space-y-2.5">
              {currentSchema.fields.map((field, idx) => {
                const fieldDef = ALL_FIELD_TYPE_DEFINITIONS.find((d) => d.type === field.type);
                const hasLogic = field.conditionalRules && field.conditionalRules.length > 0;
                const isRequired = field.required;

                return (
                  <div
                    key={field.id}
                    className="p-3.5 rounded-2xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm group"
                  >
                    {/* Left: Reorder + Icon + Label & Type */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Up/Down buttons */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveField(idx, 'up')}
                          className="p-0.5 text-slate-400 hover:text-purple-600 disabled:opacity-20"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === currentSchema.fields.length - 1}
                          onClick={() => handleMoveField(idx, 'down')}
                          className="p-0.5 text-slate-400 hover:text-purple-600 disabled:opacity-20"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg flex-shrink-0">
                        {fieldDef?.emoji || '🔤'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                            {field.label}
                          </h4>
                          {isRequired && (
                            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded">
                              Required
                            </span>
                          )}
                          {hasLogic && (
                            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Conditional</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono truncate">
                          {field.name} • type: <span className="text-purple-600">{field.type}</span> • tier: {field.tierLevel || 'standard'}
                        </p>
                      </div>
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleDuplicateField(field)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingField(field)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-all flex items-center gap-1 border border-purple-200 dark:border-purple-900"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Settings</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteField(field.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {currentSchema.fields.length === 0 && (
                <div className="p-8 rounded-2xl border-2 border-dashed border-[#E6E0F2] dark:border-slate-800 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    No fields added yet to this form
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddFieldSheet(true)}
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow hover:bg-purple-700"
                    >
                      + Add First Field
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTemplatePicker(true)}
                      className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 text-xs font-bold hover:bg-purple-200"
                    >
                      + From Smart Template
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. LIVE PREVIEW TAB */}
      {activeTab === 'preview' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#E6E0F2] dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Reactive Preview
              </h3>
              <p className="text-xs text-slate-500">
                Fill inputs to verify conditional logic branches and validations in real time
              </p>
            </div>
            <button
              onClick={() => setShowTestModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Full Screen Device Simulator</span>
            </button>
          </div>

          <UniversalFormRenderer
            schema={currentSchema}
            layoutMode={currentSchema.layoutMode}
            onSubmitSuccess={(sub) => {
              setSaveBannerMessage(`Test submission generated with ID: ${sub.id}`);
              setTimeout(() => setSaveBannerMessage(null), 3500);
            }}
          />
        </div>
      )}

      {/* 3. SCHEMAS LIBRARY / REGISTRY TAB */}
      {activeTab === 'schemas_library' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Blessikaa Universal Schemas Library
              </h3>
              <p className="text-xs text-slate-500">
                Pre-configured schemas powering medicine, property, tasks, finances, and habits
              </p>
            </div>
            <button
              onClick={handleCreateNewSchema}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Schema</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {schemas.map((s) => {
              const isCurrent = s.id === activeSchemaId;
              return (
                <div
                  key={s.id}
                  className={`p-5 rounded-3xl border transition-all space-y-3 ${
                    isCurrent
                      ? 'bg-purple-50/40 dark:bg-purple-950/30 border-purple-400 shadow-md ring-2 ring-purple-500/20'
                      : 'bg-white dark:bg-slate-900 border-[#E6E0F2] dark:border-slate-800 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {s.serviceCategory}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                        {s.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      v{s.version}.0
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-slate-500">
                      {s.fields.length} standardized fields
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSchemaId(s.id);
                          setShowTestModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-100 transition-all flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Test</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSchemaId(s.id);
                          setActiveTab('editor');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all flex items-center gap-1"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Edit Schema</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Field Bottom Sheet */}
      <AddFieldBottomSheet
        isOpen={showAddFieldSheet}
        onClose={() => setShowAddFieldSheet(false)}
        onSelectFieldType={handleSelectFieldType}
        onOpenTemplatePicker={() => {
          setShowAddFieldSheet(false);
          setShowTemplatePicker(true);
        }}
      />

      {/* Smart Template Picker Modal */}
      <SmartTemplatePickerModal
        isOpen={showTemplatePicker}
        onClose={() => setShowTemplatePicker(false)}
        onSelectTemplate={handleAddTemplateGroup}
      />

      {/* Field Configuration Mini Modal */}
      <FieldConfigModal
        isOpen={!!editingField}
        field={editingField}
        allFields={currentSchema.fields}
        onClose={() => setEditingField(null)}
        onSave={(updated) => {
          const nextFields = currentSchema.fields.map((f) =>
            f.id === updated.id ? updated : f
          );
          handleUpdateCurrentSchema({ fields: nextFields });
          setEditingField(null);
          soundManager.playSuccess();
        }}
      />

      {/* Multi-Device Interactive Test Modal */}
      <FormTestModal
        isOpen={showTestModal}
        schema={currentSchema}
        onClose={() => setShowTestModal(false)}
        onPublish={() => {
          setSaveBannerMessage(`Schema "${currentSchema.title}" published and live across all services!`);
          setTimeout(() => setSaveBannerMessage(null), 4000);
        }}
      />
    </div>
  );
};
