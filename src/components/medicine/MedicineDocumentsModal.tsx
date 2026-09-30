import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileText,
  UploadCloud,
  Plus,
  CheckCircle2,
  Share2,
  Trash2,
  Download,
  Filter,
} from 'lucide-react';
import { MOCK_MEDICINE_DOCUMENTS } from '../../data/pharmacyData';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MedicineDocumentsModalProps {
  onClose: () => void;
}

export const MedicineDocumentsModal: React.FC<MedicineDocumentsModalProps> = ({ onClose }) => {
  const [documents, setDocuments] = useState(MOCK_MEDICINE_DOCUMENTS);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Prescription');

  const filteredDocs =
    selectedFilter === 'All'
      ? documents
      : documents.filter((d) => d.type.toLowerCase().includes(selectedFilter.toLowerCase()));

  const handleAddDoc = () => {
    if (!newTitle.trim()) return;
    soundManager.playSuccess();
    triggerHaptic('heavy');

    const doc = {
      id: `doc_${Date.now()}`,
      title: newTitle,
      date: new Date().toISOString().slice(0, 10),
      type: newType,
      doctor: 'Uploaded by Patient',
      facility: 'Blessikaa Health Vault',
      size: '1.5 MB',
      verified: true,
    };

    setDocuments([doc, ...documents]);
    setNewTitle('');
    setShowUploadForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1A3D] w-full max-w-xl rounded-3xl border border-purple-200/90 dark:border-[#382F6A] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 dark:border-[#2F2763] bg-purple-50/50 dark:bg-[#191535] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Medical Document & Rx Vault
              </h3>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
                Prescriptions, lab reports, receipts & clinical notes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2B2358] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['All', 'Prescription', 'Lab Report', 'Receipt'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  setSelectedFilter(filter);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#16122E] text-slate-600 dark:text-slate-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Add Doc Button or Form */}
          {showUploadForm ? (
            <div className="p-4 bg-purple-50/60 dark:bg-[#1C173B] rounded-2xl border border-purple-200 dark:border-[#382F6A] space-y-3 text-xs">
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Upload New Health Document
              </h4>
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Dr. Jenkins Follow-up Summary"
                  className="w-full px-3 py-2 bg-white dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl font-bold"
                >
                  <option value="Prescription">Prescription</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Receipt / Insurance">Receipt / Insurance</option>
                  <option value="Doctor Note">Doctor Note</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAddDoc}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black cursor-pointer shadow-xs"
                >
                  Save Document
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundManager.playTick();
                setShowUploadForm(true);
              }}
              className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 dark:bg-[#201A47] text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-[#382F6A] rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>+ Upload Health Document or Rx</span>
            </button>
          )}

          {/* Document Cards */}
          <div className="space-y-2">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 bg-white dark:bg-[#1E1A3D] rounded-2xl border border-purple-200/80 dark:border-[#352F63] shadow-xs flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-black shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 dark:text-white line-clamp-1">
                      {doc.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {doc.type} • {doc.date} • {doc.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      alert(`Document "${doc.title}" downloaded.`);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-[#251E4E] cursor-pointer"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-100 dark:border-[#2F2763] bg-purple-50/40 dark:bg-[#191535] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
