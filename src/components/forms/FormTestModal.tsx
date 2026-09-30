import React, { useState } from 'react';
import {
  FormSchema,
  FormLayoutMode,
  PersonaRole,
  PreviewDevice,
  FormSubmissionEntry,
} from '../../types/formEngine';
import { UniversalFormRenderer } from './UniversalFormRenderer';
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  Sun,
  Moon,
  User,
  ShieldCheck,
  Stethoscope,
  Users,
  Eye,
  CheckCircle,
  Code,
  Sparkles,
} from 'lucide-react';

interface FormTestModalProps {
  isOpen: boolean;
  schema: FormSchema | null;
  onClose: () => void;
  onPublish?: () => void;
}

export const FormTestModal: React.FC<FormTestModalProps> = ({
  isOpen,
  schema,
  onClose,
  onPublish,
}) => {
  if (!isOpen || !schema) return null;

  const [device, setDevice] = useState<PreviewDevice>('mobile');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [persona, setPersona] = useState<PersonaRole>('user');
  const [layoutMode, setLayoutMode] = useState<FormLayoutMode>(schema.layoutMode || 'standard');
  const [lastSubmission, setLastSubmission] = useState<FormSubmissionEntry | null>(null);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  const getDeviceWidthClass = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[420px]';
      case 'tablet':
        return 'max-w-[680px]';
      case 'desktop':
        return 'max-w-4xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[94vh] animate-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-600/30">
              🧪
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black truncate max-w-xs sm:max-w-sm">
                Interactive Preview & Test: {schema.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {schema.serviceCategory} • Version {schema.version}.0
              </p>
            </div>
          </div>

          {/* Quick Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Device Switcher */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded-lg transition-all ${
                  device === 'mobile' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile Preview (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDevice('tablet')}
                className={`p-1.5 rounded-lg transition-all ${
                  device === 'tablet' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet Preview (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded-lg transition-all ${
                  device === 'desktop' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop Preview (Full Width)"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* Persona Switcher */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              {[
                { id: 'user', label: 'User', icon: User },
                { id: 'professional', label: 'Pro/Doctor', icon: Stethoscope },
                { id: 'admin', label: 'Admin', icon: ShieldCheck },
                { id: 'sub_account', label: 'Sub-Account', icon: Users },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = persona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPersona(p.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mode Switcher */}
            <select
              value={layoutMode}
              onChange={(e) => setLayoutMode(e.target.value as any)}
              className="bg-slate-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="simple">Simple Mode</option>
              <option value="standard">Standard Mode</option>
              <option value="expert">Expert Mode</option>
            </select>

            {/* Light / Dark Mode toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Test Stage Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-900/90 flex flex-col items-center justify-start">
          <div
            className={`w-full ${getDeviceWidthClass()} transition-all duration-300 shadow-2xl rounded-3xl overflow-hidden border ${
              theme === 'dark'
                ? 'bg-[#121224] text-white border-slate-800'
                : 'bg-[#FCFAFF] text-slate-900 border-[#E6E0F2]'
            } p-5 sm:p-7 space-y-6`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Live Test Sandbox • {persona.toUpperCase()} VIEW
                </span>
              </div>
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
                Mode: {layoutMode}
              </span>
            </div>

            {/* Dynamic Form Instance */}
            <UniversalFormRenderer
              schema={schema}
              layoutMode={layoutMode}
              persona={persona}
              onSubmitSuccess={(submission) => {
                setLastSubmission(submission);
              }}
            />

            {/* Test Submission JSON Output Inspector */}
            {lastSubmission && (
              <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 border border-emerald-900/60 text-xs font-mono space-y-2 animate-in fade-in duration-300">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Test Form Submission Payload:</span>
                  </span>
                  <span>{new Date(lastSubmission.submittedAt).toLocaleTimeString()}</span>
                </div>
                <pre className="overflow-x-auto max-h-44 p-2 bg-black/60 rounded-xl scrollbar-none text-[11px] leading-relaxed">
                  {JSON.stringify(lastSubmission, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Validated against Blessikaa Life-Care & OCR specifications
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
            >
              Done Testing
            </button>
            {onPublish && (
              <button
                type="button"
                onClick={() => {
                  onPublish();
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish Schema to Ecosystem</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
