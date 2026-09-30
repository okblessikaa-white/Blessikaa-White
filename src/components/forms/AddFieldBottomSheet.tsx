import React, { useState } from 'react';
import { FieldType, FormFieldConfig } from '../../types/formEngine';
import { ALL_FIELD_TYPE_DEFINITIONS, FieldTypeDefinition } from '../../data/formTemplates';
import {
  Search,
  X,
  Plus,
  Sparkles,
  Type,
  Hash,
  Calendar,
  CheckSquare,
  MapPin,
  Camera,
  Layers,
  Shield,
  Clock,
  DollarSign,
  User,
  Zap,
} from 'lucide-react';

interface AddFieldBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFieldType: (def: FieldTypeDefinition) => void;
  onOpenTemplatePicker: () => void;
}

export const AddFieldBottomSheet: React.FC<AddFieldBottomSheetProps> = ({
  isOpen,
  onClose,
  onSelectFieldType,
  onOpenTemplatePicker,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Fields', icon: Layers },
    { id: 'basic_text', label: 'Text', icon: Type },
    { id: 'numbers_finance', label: 'Numbers & Money', icon: DollarSign },
    { id: 'date_time', label: 'Date & Time', icon: Calendar },
    { id: 'selection_choices', label: 'Choices & Select', icon: CheckSquare },
    { id: 'contact_location', label: 'Contact & Location', icon: MapPin },
    { id: 'media_capture', label: 'Media & Uploads', icon: Camera },
    { id: 'domain_entities', label: 'Entities & Life-Care', icon: User },
    { id: 'workflow_governance', label: 'Workflows & AI', icon: Shield },
  ];

  const filteredFields = ALL_FIELD_TYPE_DEFINITIONS.filter((field) => {
    const matchesSearch =
      field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || field.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-all">
      <div className="w-full max-w-2xl bg-white dark:bg-[#151528] rounded-t-3xl sm:rounded-3xl border border-[#E6E0F2] dark:border-slate-800 shadow-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Top Handle / Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E0F2] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Add Universal Smart Field
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose from 38+ standardized, reusable field engines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTemplatePicker}
              className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-200 transition-all flex items-center gap-1.5 border border-purple-200 dark:border-purple-800"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ From Template</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#E6E0F2] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search field types (e.g., money, signature, prescription, ocr, gps)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-[#E6E0F2] dark:border-slate-800 hover:border-purple-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Field List Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredFields.map((fieldDef) => (
            <button
              key={fieldDef.type}
              onClick={() => {
                onSelectFieldType(fieldDef);
                onClose();
              }}
              className="p-3 rounded-2xl border border-[#E6E0F2] dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-purple-400 hover:shadow-md hover:bg-purple-50/20 dark:hover:bg-purple-950/20 transition-all text-left flex items-start gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 group-hover:bg-purple-100 dark:group-hover:bg-purple-950 transition-all">
                {fieldDef.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                    {fieldDef.label}
                  </h4>
                  <Plus className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition-all" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {fieldDef.description}
                </p>
              </div>
            </button>
          ))}

          {filteredFields.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No matching field types found
              </p>
              <p className="text-xs text-slate-400 mt-1">Try another search keyword</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
