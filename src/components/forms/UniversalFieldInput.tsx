import React, { useState, useRef } from 'react';
import {
  FormFieldConfig,
  FieldChoiceOption,
  PersonaRole,
} from '../../types/formEngine';
import {
  Type,
  AlignLeft,
  FileText,
  Hash,
  DollarSign,
  BarChart2,
  Star,
  Timer,
  Calculator,
  Calendar,
  Clock,
  CalendarDays,
  Repeat,
  CheckSquare,
  CircleDot,
  ListFilter,
  ListChecks,
  Phone,
  Mail,
  Globe,
  MapPin,
  Navigation,
  Camera,
  Paperclip,
  Video,
  Mic,
  PenTool,
  Edit3,
  Scan,
  User,
  Home,
  Pill,
  Car,
  Dog,
  Package,
  Tag,
  Bell,
  Shield,
  Users,
  MessageSquare,
  ExternalLink,
  Sparkles,
  Check,
  AlertCircle,
  X,
  Upload,
} from 'lucide-react';

interface UniversalFieldInputProps {
  field: FormFieldConfig;
  value: any;
  onChange: (val: any) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  persona?: PersonaRole;
  allFormValues?: Record<string, any>;
}

export const UniversalFieldInput: React.FC<UniversalFieldInputProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  persona = 'user',
  allFormValues = {},
}) => {
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  // Icon selector mapping
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Type':
        return <Type className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'AlignLeft':
        return <AlignLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'FileText':
        return <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'Hash':
        return <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'DollarSign':
        return <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'BarChart2':
        return <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'Star':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-400" />;
      case 'Timer':
        return <Timer className="w-4 h-4 text-orange-500" />;
      case 'Calculator':
        return <Calculator className="w-4 h-4 text-teal-600" />;
      case 'Calendar':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'Clock':
        return <Clock className="w-4 h-4 text-cyan-600" />;
      case 'CheckSquare':
        return <CheckSquare className="w-4 h-4 text-emerald-600" />;
      case 'CircleDot':
        return <CircleDot className="w-4 h-4 text-purple-600" />;
      case 'ListFilter':
        return <ListFilter className="w-4 h-4 text-indigo-600" />;
      case 'ListChecks':
        return <ListChecks className="w-4 h-4 text-emerald-600" />;
      case 'Phone':
        return <Phone className="w-4 h-4 text-green-600" />;
      case 'Mail':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'Globe':
        return <Globe className="w-4 h-4 text-cyan-600" />;
      case 'MapPin':
        return <MapPin className="w-4 h-4 text-rose-600" />;
      case 'Camera':
        return <Camera className="w-4 h-4 text-pink-600" />;
      case 'Paperclip':
        return <Paperclip className="w-4 h-4 text-slate-600" />;
      case 'Video':
        return <Video className="w-4 h-4 text-red-600" />;
      case 'Mic':
        return <Mic className="w-4 h-4 text-violet-600" />;
      case 'PenTool':
        return <PenTool className="w-4 h-4 text-indigo-600" />;
      case 'Scan':
        return <Scan className="w-4 h-4 text-amber-600" />;
      case 'User':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'Home':
        return <Home className="w-4 h-4 text-amber-700" />;
      case 'Pill':
        return <Pill className="w-4 h-4 text-rose-500" />;
      case 'Car':
        return <Car className="w-4 h-4 text-sky-600" />;
      case 'Dog':
        return <Dog className="w-4 h-4 text-amber-600" />;
      case 'Package':
        return <Package className="w-4 h-4 text-amber-800" />;
      case 'Tag':
        return <Tag className="w-4 h-4 text-fuchsia-600" />;
      case 'Bell':
        return <Bell className="w-4 h-4 text-amber-500" />;
      case 'Shield':
        return <Shield className="w-4 h-4 text-emerald-600" />;
      case 'Users':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />;
      default:
        return <Type className="w-4 h-4 text-purple-600" />;
    }
  };

  // AI Field Generator helper
  const handleGenerateAI = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      setIsGeneratingAI(false);
      const prompt = field.specificConfig?.aiPrompt || 'Clinical summary';
      const simulatedText = `[AI Auto-Summary]: Based on current parameters, record shows standard operational compliance. Verified against Blessikaa Life-Care protocols at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Recommended next review in 14 days.`;
      onChange(simulatedText);
    }, 900);
  };

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const drawSignature = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.strokeStyle = '#3730A3';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawnSignature(false);
    onChange('');
  };

  return (
    <div className="w-full space-y-1.5 transition-all">
      {/* Header / Label */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
          <span className="p-1 rounded-md bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/40">
            {renderIcon(field.icon)}
          </span>
          <span>{field.label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        {field.tierLevel && (
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
              field.tierLevel === 'simple'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                : field.tierLevel === 'standard'
                ? 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300'
                : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 border border-amber-200/50'
            }`}
          >
            {field.tierLevel}
          </span>
        )}
      </div>

      {/* Description / Subtitle */}
      {field.description && (
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {field.description}
        </p>
      )}

      {/* Input Core Switcher */}
      <div className="relative">
        {/* 🔤 Short Text */}
        {field.type === 'text' && (
          <input
            type="text"
            value={value || ''}
            disabled={disabled}
            placeholder={field.placeholder || 'Enter text...'}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-rose-300 focus:ring-rose-400'
                : 'border-[#E6E0F2] dark:border-slate-800 focus:ring-purple-500/30 focus:border-purple-600'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          />
        )}

        {/* 📝 Long Text / Textarea */}
        {field.type === 'textarea' && (
          <textarea
            rows={3}
            value={value || ''}
            disabled={disabled}
            placeholder={field.placeholder || 'Enter notes or detailed description...'}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 resize-y transition-all ${
              error
                ? 'border-rose-300 focus:ring-rose-400'
                : 'border-[#E6E0F2] dark:border-slate-800 focus:ring-purple-500/30 focus:border-purple-600'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          />
        )}

        {/* 📄 Rich Text */}
        {field.type === 'rich_text' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-t-xl border border-b-0 border-[#E6E0F2] dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <span className="px-2 py-0.5 font-bold hover:bg-white dark:hover:bg-slate-700 rounded cursor-pointer">B</span>
              <span className="px-2 py-0.5 italic hover:bg-white dark:hover:bg-slate-700 rounded cursor-pointer">I</span>
              <span className="px-2 py-0.5 underline hover:bg-white dark:hover:bg-slate-700 rounded cursor-pointer">U</span>
              <span className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
              <span className="px-2 py-0.5 hover:bg-white dark:hover:bg-slate-700 rounded cursor-pointer">• Bullet List</span>
              <span className="px-2 py-0.5 hover:bg-white dark:hover:bg-slate-700 rounded cursor-pointer">1. Ordered</span>
            </div>
            <textarea
              rows={4}
              value={value || ''}
              disabled={disabled}
              placeholder={field.placeholder || 'Write formatted documentation or agreement terms...'}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-b-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        )}

        {/* 🔢 Number */}
        {field.type === 'number' && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={value !== undefined ? value : ''}
                step={field.specificConfig?.step || 1}
                disabled={disabled}
                placeholder={field.placeholder || '0'}
                onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
              {field.specificConfig?.numberUnit && (
                <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {field.specificConfig.numberUnit}
                </span>
              )}
            </div>
            {field.specificConfig?.numberDisplay === 'slider' && (
              <input
                type="range"
                min={field.validation?.min || 0}
                max={field.validation?.max || 100}
                value={value || 0}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-32 accent-purple-600"
              />
            )}
          </div>
        )}

        {/* 💰 Money */}
        {field.type === 'money' && (
          <div className="space-y-2">
            <div className="relative flex items-center">
              <span className="absolute left-3 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {field.specificConfig?.currency || 'USD'} $
              </span>
              <input
                type="number"
                step="0.01"
                value={value?.amount !== undefined ? value.amount : typeof value === 'number' ? value : ''}
                disabled={disabled}
                placeholder="0.00"
                onChange={(e) => {
                  const num = e.target.value === '' ? '' : Number(e.target.value);
                  if (typeof value === 'object' && value !== null) {
                    onChange({ ...value, amount: num });
                  } else {
                    onChange(num);
                  }
                }}
                className="w-full pl-20 pr-4 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
              />
            </div>

            {/* Optional Tax & Breakdown display */}
            {field.specificConfig?.includeTax && typeof value === 'number' && value > 0 && (
              <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-xs text-slate-600 dark:text-slate-300 flex justify-between items-center">
                <span>Tax ({field.specificConfig.taxRate || 5}%): ${(value * ((field.specificConfig.taxRate || 5) / 100)).toFixed(2)}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  Total Payable: ${(value * (1 + (field.specificConfig.taxRate || 5) / 100)).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 📊 Progress */}
        {field.type === 'progress' && (
          <div className="space-y-2 p-3 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Current Progress</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{value || 0}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={value || 0}
              disabled={disabled}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${value || 0}%` }}
              />
            </div>
          </div>
        )}

        {/* ⭐ Rating */}
        {field.type === 'rating' && (
          <div className="flex items-center gap-2 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={disabled}
                onClick={() => onChange(star)}
                className="p-1 rounded-lg hover:scale-110 active:scale-95 transition-all text-slate-300 dark:text-slate-700"
              >
                <Star
                  className={`w-7 h-7 ${
                    (value || 0) >= star
                      ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              {value ? `${value} / 5 Stars` : 'Rate'}
            </span>
          </div>
        )}

        {/* 📅 Date */}
        {field.type === 'date' && (
          <div className="relative">
            <input
              type="date"
              value={value || ''}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        )}

        {/* 🕐 Time */}
        {field.type === 'time' && (
          <input
            type="time"
            value={value || ''}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        )}

        {/* 📅🕐 Date & Time */}
        {field.type === 'datetime' && (
          <input
            type="datetime-local"
            value={value || ''}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        )}

        {/* 🔘 Choice (Radio / Pills) */}
        {field.type === 'choice' && (
          <div className="flex flex-wrap gap-2 pt-1">
            {(field.specificConfig?.options || [
              { id: 'opt_1', label: 'Option 1', value: 'option_1' },
              { id: 'opt_2', label: 'Option 2', value: 'option_2' },
            ]).map((opt: FieldChoiceOption) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(opt.value)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-600/30 scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-[#E6E0F2] dark:border-slate-800 hover:border-purple-300'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-white bg-white' : 'border-slate-400'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                  </div>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 📋 Dropdown */}
        {field.type === 'dropdown' && (
          <div className="relative">
            <select
              value={value || ''}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none pr-10"
            >
              <option value="">-- Select option --</option>
              {(field.specificConfig?.options || []).map((opt: FieldChoiceOption) => (
                <option key={opt.id} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-3 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
        )}

        {/* ☑️ Checkbox */}
        {field.type === 'checkbox' && (
          <label className="flex items-center gap-3 p-3 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:bg-purple-50/30 transition-all">
            <input
              type="checkbox"
              checked={!!value}
              disabled={disabled}
              onChange={(e) => onChange(e.target.checked)}
              className="w-5 h-5 rounded-md accent-purple-600 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
              {field.label}
            </span>
          </label>
        )}

        {/* 📋 Checklist */}
        {field.type === 'checklist' && (
          <div className="space-y-2 p-3 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900">
            {(field.specificConfig?.checklistItems || [
              { id: 'c1', text: 'Action Item 1' },
              { id: 'c2', text: 'Action Item 2' },
            ]).map((item) => {
              const currentList: string[] = Array.isArray(value) ? value : [];
              const isChecked = currentList.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isChecked) {
                      onChange(currentList.filter((id) => id !== item.id));
                    } else {
                      onChange([...currentList, item.id]);
                    }
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isChecked
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={`text-xs sm:text-sm ${isChecked ? 'line-through opacity-80' : ''}`}>
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* 📞 Phone */}
        {field.type === 'phone' && (
          <div className="relative flex items-center">
            <Phone className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              value={value || ''}
              disabled={disabled}
              placeholder={field.placeholder || '+1 (555) 000-0000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        )}

        {/* ✉️ Email */}
        {field.type === 'email' && (
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={value || ''}
              disabled={disabled}
              placeholder={field.placeholder || 'name@example.com'}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        )}

        {/* 🔗 Website */}
        {field.type === 'website' && (
          <div className="relative flex items-center">
            <Globe className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="url"
              value={value || ''}
              disabled={disabled}
              placeholder={field.placeholder || 'https://example.com'}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        )}

        {/* 📍 Location / Address */}
        {field.type === 'location' && (
          <div className="space-y-2">
            <div className="relative flex items-center">
              <MapPin className="absolute left-3.5 w-4 h-4 text-rose-500" />
              <input
                type="text"
                value={value || ''}
                disabled={disabled}
                placeholder={field.placeholder || '123 Main St, City, Country'}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
              <button
                type="button"
                onClick={() => onChange('37.7749° N, 122.4194° W (GPS Live Pin)')}
                className="absolute right-2 text-[10px] font-bold px-2 py-1 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 rounded-md border border-rose-200 dark:border-rose-900 hover:bg-rose-100"
              >
                📍 GPS Pin
              </button>
            </div>
          </div>
        )}

        {/* 🖼️ Photo */}
        {field.type === 'photo' && (
          <div className="space-y-2">
            {value ? (
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-purple-300 shadow-md group">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full shadow hover:scale-110"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChange(
                      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop'
                    )
                  }
                  className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-[#E6E0F2] dark:border-slate-800 hover:border-purple-400 bg-purple-50/30 dark:bg-purple-950/20 text-xs font-semibold text-purple-700 dark:text-purple-300"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Photo / Upload Image</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 📎 File Upload */}
        {field.type === 'file_upload' && (
          <div className="space-y-2">
            {value ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {typeof value === 'string' ? value : 'attached_document.pdf'}
                    </p>
                    <p className="text-[10px] text-slate-500">Verified & Ready</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1 hover:bg-purple-200 rounded text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onChange('official_medical_records_2026.pdf')}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-dashed border-[#E6E0F2] dark:border-slate-800 hover:border-purple-400 bg-white dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Click to attach PDF, Word or Excel file (Max 10MB)</span>
              </button>
            )}
          </div>
        )}

        {/* ✍️ Digital Signature */}
        {field.type === 'signature' && (
          <div className="space-y-2 p-3 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Digital Signature Canvas</span>
              <button
                type="button"
                onClick={clearSignature}
                className="text-[11px] font-bold text-rose-500 hover:underline"
              >
                Clear Signature
              </button>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50/50 dark:bg-slate-950 relative h-28">
              <canvas
                ref={signatureCanvasRef}
                width={360}
                height={112}
                onMouseDown={startDrawing}
                onMouseMove={drawSignature}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={drawSignature}
                onTouchEnd={stopDrawing}
                className="w-full h-full cursor-crosshair touch-none"
              />
              {!hasDrawnSignature && !value && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs italic">
                  ✍️ Sign with finger or stylus here
                </div>
              )}
            </div>
          </div>
        )}

        {/* 📷 Scan (Barcode / QR / OCR) */}
        {field.type === 'scan' && (
          <div className="space-y-2">
            <div className="relative flex items-center">
              <Scan className="absolute left-3.5 w-4 h-4 text-amber-600" />
              <input
                type="text"
                value={value || ''}
                disabled={disabled}
                placeholder={field.placeholder || 'Scanned code value...'}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-28 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
              <button
                type="button"
                onClick={() => onChange(`QR-BLESSIKAA-${Math.floor(100000 + Math.random() * 900000)}`)}
                className="absolute right-2 text-[10px] font-bold px-2.5 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 shadow-sm"
              >
                📷 Scan QR
              </button>
            </div>
          </div>
        )}

        {/* 👤 Person Selector */}
        {field.type === 'person' && (
          <select
            value={value || ''}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          >
            <option value="">-- Choose Assigned Person --</option>
            <option value="user_self">Alex Morgan (Primary User / Self)</option>
            <option value="person_sarah">Sarah Morgan (Spouse / Family)</option>
            <option value="person_dr_vance">Dr. Arthur Vance (Chief Physician)</option>
            <option value="person_emma">Emma Watson (Care Assistant)</option>
          </select>
        )}

        {/* 🤖 AI-Assisted Field */}
        {field.type === 'ai_field' && (
          <div className="space-y-2 p-3 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Blessikaa AI Copilot Assist</span>
              </span>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGeneratingAI}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold shadow hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isGeneratingAI ? 'Analyzing...' : 'Generate with AI'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={value || ''}
              disabled={disabled}
              placeholder={field.placeholder || 'AI summary or clinical notes will generate here...'}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none"
            />
          </div>
        )}

        {/* Fallback for other domain entities */}
        {['property', 'medicine', 'vehicle', 'pet', 'item_inventory', 'category_tag', 'reminder', 'permission', 'share_with', 'notes_comments', 'linked_field', 'calculated', 'duration', 'recurring_schedule', 'drawing', 'video', 'audio', 'map_route'].includes(
          field.type
        ) && (
          <input
            type="text"
            value={value || ''}
            disabled={disabled}
            placeholder={field.placeholder || `Enter ${field.label}...`}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E0F2] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1 text-xs text-rose-500 font-medium pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
