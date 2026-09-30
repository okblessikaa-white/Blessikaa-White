import React, { useState } from 'react';
import { SmartTemplateGroup } from '../../types/formEngine';
import { SMART_TEMPLATES } from '../../data/formTemplates';
import {
  X,
  Sparkles,
  Plus,
  Layers,
  Search,
  CheckCircle,
  Pill,
  Home,
  Car,
  DollarSign,
  User,
  Zap,
  CheckSquare,
  PenTool,
} from 'lucide-react';

interface SmartTemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: SmartTemplateGroup) => void;
}

export const SmartTemplatePickerModal: React.FC<SmartTemplatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = SMART_TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  const getTemplateIcon = (icon: string) => {
    switch (icon) {
      case 'Pill':
        return <Pill className="w-5 h-5 text-rose-500" />;
      case 'Home':
        return <Home className="w-5 h-5 text-amber-600" />;
      case 'Car':
        return <Car className="w-5 h-5 text-sky-600" />;
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-emerald-600" />;
      case 'User':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-purple-600" />;
      case 'CheckSquare':
        return <CheckSquare className="w-5 h-5 text-indigo-600" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-violet-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-[#151528] rounded-3xl border border-[#E6E0F2] dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E0F2] dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Add from Smart Template Group
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Insert pre-configured field bundles for instant service setup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#E6E0F2] dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates (e.g. medicine, rental, payment, task, habits)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-2xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all">
                  {getTemplateIcon(tpl.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {tpl.title}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
                      {tpl.fieldCount} fields
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tpl.fields.slice(0, 4).map((f) => (
                      <span
                        key={f.id}
                        className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
                      >
                        {f.label}
                      </span>
                    ))}
                    {tpl.fields.length > 4 && (
                      <span className="text-[10px] text-slate-400 font-semibold px-1 py-0.5">
                        +{tpl.fields.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectTemplate(tpl);
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Group ({tpl.fieldCount})</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
