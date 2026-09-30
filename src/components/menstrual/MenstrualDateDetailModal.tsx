import React from 'react';
import {
  X,
  Edit2,
  Trash2,
  Calendar,
  Smile,
  Zap,
  Droplets,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import {
  MenstrualDailyLog,
  CyclePrediction,
  MenstrualCycleProfile,
} from '../../types/menstrual';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MenstrualDateDetailModalProps {
  date: string;
  log?: MenstrualDailyLog;
  prediction: CyclePrediction;
  profile: MenstrualCycleProfile;
  onEdit: (date: string) => void;
  onDelete: (date: string) => void;
  onClose: () => void;
}

export const MenstrualDateDetailModal: React.FC<MenstrualDateDetailModalProps> = ({
  date,
  log,
  prediction,
  profile,
  onEdit,
  onDelete,
  onClose,
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isFertile = date >= prediction.fertileWindowStart && date <= prediction.fertileWindowEnd;
  const isOvulation = date === prediction.estimatedOvulationDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-md bg-white dark:bg-[#1E1A3D] rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-purple-200/80 dark:border-[#383068] space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-purple-100 dark:border-[#383068] pb-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
              Day Record
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">{formattedDate}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase / Cycle Status */}
        <div className="flex items-center gap-2">
          {log?.isPeriod && (
            <span className="px-3 py-1 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 text-xs font-black flex items-center gap-1">
              <span>🩸</span>
              <span>Period (Flow: {log.flow || 'Normal'})</span>
            </span>
          )}
          {isOvulation && (
            <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-xs font-black flex items-center gap-1">
              <span>⭐</span>
              <span>Ovulation Day</span>
            </span>
          )}
          {isFertile && !isOvulation && (
            <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 text-xs font-black">
              🟣 Fertile Window
            </span>
          )}
          {!log?.isPeriod && !isFertile && (
            <span className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-xs font-bold">
              Standard Cycle Day
            </span>
          )}
        </div>

        {/* Logged details */}
        {log ? (
          <div className="space-y-3 bg-purple-50/50 dark:bg-[#15112E] p-4 rounded-2xl border border-purple-100 dark:border-[#383068] text-xs">
            {log.symptoms && log.symptoms.length > 0 && (
              <div>
                <span className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Symptoms Logged:</span>
                <div className="flex flex-wrap gap-1">
                  {log.symptoms.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {log.mood && (
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500 dark:text-slate-400">Mood:</span>
                <span className="font-black text-purple-900 dark:text-purple-200 capitalize flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  {log.mood}
                </span>
              </div>
            )}

            {log.energy && (
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500 dark:text-slate-400">Energy:</span>
                <span className="font-black text-purple-900 dark:text-purple-200 capitalize flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  {log.energy}
                </span>
              </div>
            )}

            {log.cervicalMucus && (
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500 dark:text-slate-400">Cervical Mucus:</span>
                <span className="font-bold text-purple-900 dark:text-purple-200">{log.cervicalMucus}</span>
              </div>
            )}

            {log.notes && (
              <div className="pt-1 border-t border-purple-100 dark:border-[#383068]">
                <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Notes:</span>
                <p className="text-slate-700 dark:text-slate-300 italic font-medium">{log.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 bg-purple-50/40 dark:bg-purple-950/20 rounded-2xl border border-dashed border-purple-200 dark:border-purple-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No symptoms or flow logged on this day.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {log && (
            <button
              type="button"
              onClick={() => {
                soundManager.playTick();
                onDelete(date);
              }}
              className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer border-2 border-rose-200/80 dark:border-rose-900/60 shadow-xs"
              title="Delete Log"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              onEdit(date);
            }}
            className="flex-1 group rounded-2xl p-3 bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md hover:shadow-lg transition-all flex items-center justify-between cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30 shrink-0">
                <Edit2 className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <span className="block font-black text-slate-900 dark:text-white text-xs tracking-tight truncate">
                  {log ? 'Edit Log Entry' : '+ Log This Day'}
                </span>
                <span className="block text-[10px] text-purple-600 dark:text-purple-300 font-medium truncate">
                  {log ? 'Update symptoms & notes' : 'Record symptoms & flow'}
                </span>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-700/60 text-purple-700 dark:text-purple-300 font-black text-[9px] uppercase tracking-wider group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
              {log ? 'Edit' : 'Add'}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
