import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Stethoscope,
  Users,
  FilePlus,
  Activity,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  FileText,
  ShieldCheck,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { DoctorPatientRecord, MedicineItem } from '../../types';
import { MOCK_DOCTOR_PATIENTS, COMMON_DRUG_DATABASE } from '../../data/pharmacyData';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface DoctorWorkspaceProps {
  onIssuePrescription: (medicine: MedicineItem) => void;
}

export const DoctorWorkspace: React.FC<DoctorWorkspaceProps> = ({ onIssuePrescription }) => {
  const [patients, setPatients] = useState<DoctorPatientRecord[]>(MOCK_DOCTOR_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0].id);
  const [activeTab, setActiveTab] = useState<'patients' | 'new_rx' | 'appointments'>('patients');

  // New Rx form state
  const [rxForm, setRxForm] = useState({
    drugName: '',
    genericName: '',
    strength: '500mg',
    form: 'Tablet',
    frequency: 'Twice daily',
    route: 'Oral',
    durationDays: 14,
    mealTiming: 'With food' as const,
    diagnosis: 'Type 2 Diabetes Mellitus',
    icd10: 'E11.9',
    specialInstructions: 'Monitor morning fasting blood glucose and take after breakfast and dinner.',
  });

  const [prescriptionSuccess, setPrescriptionSuccess] = useState(false);

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleIssueRx = () => {
    if (!rxForm.drugName.trim()) {
      alert('Please enter medication name.');
      return;
    }

    soundManager.playCelebration();
    triggerHaptic('heavy');

    const newMed: MedicineItem = {
      id: `med_dr_${Date.now()}`,
      name: rxForm.drugName,
      genericName: rxForm.genericName || rxForm.drugName,
      strength: rxForm.strength,
      strengthUnit: 'mg',
      form: rxForm.form,
      dosageQuantity: 1,
      dosageUnit: 'tablet(s)',
      frequency: rxForm.frequency,
      timesPerDay: 2,
      specificTimes: ['08:00', '20:00'],
      mealTiming: rxForm.mealTiming,
      routeOfAdministration: rxForm.route,
      adminInstructions: rxForm.specialInstructions,
      startDate: new Date().toISOString().slice(0, 10),
      durationDays: Number(rxForm.durationDays) || 14,
      condition: rxForm.diagnosis,
      icd10Code: rxForm.icd10,
      doctorName: 'Dr. Sarah Jenkins, MD (Clinical Specialist)',
      patientName: selectedPatient.name,
      currentStock: 28,
      reorderLevel: 6,
      reorderQuantity: 30,
      status: 'active',
      dosesLogged: [],
    };

    onIssuePrescription(newMed);
    setPrescriptionSuccess(true);
    setTimeout(() => {
      setPrescriptionSuccess(false);
      setActiveTab('patients');
    }, 1800);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl text-white shadow-lg shadow-emerald-600/20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl">
              🩺
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                Clinical Practitioner Workspace
              </span>
              <h2 className="text-lg sm:text-xl font-black">
                Dr. Sarah Jenkins, MD
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Endocrinology & Internal Medicine • License #MD-88491
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playTick();
                setActiveTab('new_rx');
              }}
              className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <FilePlus className="w-4 h-4 text-emerald-600" />
              <span>+ New Prescription</span>
            </button>
          </div>
        </div>

        {/* Doctor Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/20 text-xs">
          <div className="bg-white/10 p-2.5 rounded-2xl">
            <span className="text-emerald-100 text-[10px] uppercase font-bold block">Active Patients</span>
            <span className="text-base font-black">28</span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl">
            <span className="text-emerald-100 text-[10px] uppercase font-bold block">Prescriptions Today</span>
            <span className="text-base font-black">6</span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl">
            <span className="text-emerald-100 text-[10px] uppercase font-bold block">Follow-ups Due</span>
            <span className="text-base font-black">3</span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl">
            <span className="text-emerald-100 text-[10px] uppercase font-bold block">Pending Labs</span>
            <span className="text-base font-black">2</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-100 dark:border-[#2F2763] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('patients')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'patients'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-[#1E1A3D] text-slate-600 dark:text-slate-300'
          }`}
        >
          Patient Records & Profiles
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('new_rx')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'new_rx'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-[#1E1A3D] text-slate-600 dark:text-slate-300'
          }`}
        >
          Prescription Builder (ICD-10)
        </button>
      </div>

      {/* Patient Directory View */}
      {activeTab === 'patients' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Patient List */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Assigned Patients
            </h4>
            <div className="space-y-2">
              {patients.map((pat) => (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setSelectedPatientId(pat.id);
                  }}
                  className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                    selectedPatientId === pat.id
                      ? 'bg-emerald-50 dark:bg-[#1C2C38] border-emerald-400 dark:border-emerald-600 shadow-xs'
                      : 'bg-white dark:bg-[#1E1A3D] border-purple-100 dark:border-[#2F2763] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {pat.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {pat.age}y • {pat.gender}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {pat.medicalHistory.join(', ')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Details & Vitals */}
          <div className="md:col-span-2 space-y-4">
            <div className="p-4 sm:p-5 bg-white dark:bg-[#1E1A3D] rounded-3xl border border-purple-200/80 dark:border-[#382F6A] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {selectedPatient.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Age {selectedPatient.age} • Gender: {selectedPatient.gender} • Patient ID: {selectedPatient.id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('new_rx')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer"
                >
                  + Write Rx
                </button>
              </div>

              {/* Allergies Highlight with Red Badge */}
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/40">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300 block mb-1">
                  ⚠️ Known Drug Allergies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPatient.allergies.map((all, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-rose-200/80 dark:bg-rose-900 text-rose-900 dark:text-rose-200 text-xs font-black rounded-lg"
                    >
                      {all}
                    </span>
                  ))}
                </div>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-[#16122E] rounded-xl border border-slate-200 dark:border-[#2F2763]">
                  <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {selectedPatient.vitals.bp}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-[#16122E] rounded-xl border border-slate-200 dark:border-[#2F2763]">
                  <span className="text-slate-400 block text-[10px]">Heart Rate</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {selectedPatient.vitals.heartRate} bpm
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-[#16122E] rounded-xl border border-slate-200 dark:border-[#2F2763]">
                  <span className="text-slate-400 block text-[10px]">Body Temp</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {selectedPatient.vitals.temp}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-[#16122E] rounded-xl border border-slate-200 dark:border-[#2F2763]">
                  <span className="text-slate-400 block text-[10px]">Weight</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {selectedPatient.vitals.weight}
                  </span>
                </div>
              </div>

              {/* Current Active Medicines */}
              <div className="space-y-1.5 text-xs">
                <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Current Regimen
                </h5>
                <div className="space-y-1">
                  {selectedPatient.currentMeds.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-purple-50/50 dark:bg-[#251E4E] rounded-xl border border-purple-100 dark:border-[#352F63] flex items-center justify-between"
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-200">{med}</span>
                      <span className="text-[10px] text-emerald-600 font-black">Active</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Notes */}
              {selectedPatient.notes && (
                <div className="p-3 bg-slate-50 dark:bg-[#16122E] rounded-2xl text-xs space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    Physician Observations
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {selectedPatient.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prescription Builder Tab */}
      {activeTab === 'new_rx' && (
        <div className="p-5 bg-white dark:bg-[#1E1A3D] rounded-3xl border border-purple-200/80 dark:border-[#382F6A] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 dark:border-[#2F2763] pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Clinical Prescription Form
              </h3>
              <p className="text-xs text-slate-500">
                Prescribing for: <strong>{selectedPatient.name}</strong> ({selectedPatient.age}y, {selectedPatient.gender})
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 rounded-xl text-xs font-black">
              E-Sign Enabled
            </span>
          </div>

          {prescriptionSuccess && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Prescription digitally signed & added to patient active profile!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Diagnosis (ICD-10)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rxForm.diagnosis}
                  onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })}
                  placeholder="e.g. Type 2 Diabetes Mellitus"
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl font-bold"
                />
                <input
                  type="text"
                  value={rxForm.icd10}
                  onChange={(e) => setRxForm({ ...rxForm, icd10: e.target.value })}
                  placeholder="E11.9"
                  className="w-20 px-2 py-2 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl text-center font-black uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Medication Name
              </label>
              <input
                type="text"
                value={rxForm.drugName}
                onChange={(e) => setRxForm({ ...rxForm, drugName: e.target.value })}
                placeholder="e.g. Metformin ER, Empagliflozin..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Strength & Form
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rxForm.strength}
                  onChange={(e) => setRxForm({ ...rxForm, strength: e.target.value })}
                  placeholder="500mg"
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl font-bold"
                />
                <select
                  value={rxForm.form}
                  onChange={(e) => setRxForm({ ...rxForm, form: e.target.value })}
                  className="w-28 px-2 py-2 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl font-bold"
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Frequency & Meal Timing
              </label>
              <div className="flex gap-2">
                <select
                  value={rxForm.frequency}
                  onChange={(e) => setRxForm({ ...rxForm, frequency: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl font-bold"
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="As needed (PRN)">As needed (PRN)</option>
                </select>
                <select
                  value={rxForm.mealTiming}
                  onChange={(e) => setRxForm({ ...rxForm, mealTiming: e.target.value as any })}
                  className="w-32 px-2 py-2 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl font-bold"
                >
                  <option value="With food">With food</option>
                  <option value="Empty stomach">Empty stomach</option>
                  <option value="Before bed">Before bed</option>
                  <option value="Anytime">Anytime</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
              Special Instructions to Patient & Dispensing Pharmacist
            </label>
            <textarea
              rows={2}
              value={rxForm.specialInstructions}
              onChange={(e) => setRxForm({ ...rxForm, specialInstructions: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#14112B] border border-purple-200 dark:border-[#352F63] rounded-xl text-xs font-medium"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-purple-100 dark:border-[#2F2763]">
            <span className="text-xs text-slate-500 font-medium">
              Digital Signature: Dr. Sarah Jenkins (Verified 🔒)
            </span>

            <button
              type="button"
              onClick={handleIssueRx}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Issue & Sign Prescription</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
