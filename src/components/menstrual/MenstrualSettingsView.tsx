import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Lock,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Sparkles,
  Sliders,
  Save,
  Baby,
  Heart,
  Thermometer,
  Activity,
  Calendar,
  Clock,
  Droplet,
  UserCheck,
  Stethoscope,
  Smile,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  MenstrualCycleProfile,
  TrackingMode,
  CustomTrackingField,
  TTCConfig,
  PregnancyConfig,
  PostpartumConfig,
} from '../../types/menstrual';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface MenstrualSettingsViewProps {
  profile: MenstrualCycleProfile;
  onUpdateProfile: (updated: MenstrualCycleProfile) => void;
  onResetData: () => void;
  onBackToHome?: () => void;
}

export const MenstrualSettingsView: React.FC<MenstrualSettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onResetData,
}) => {
  // Master Tracking Mode
  const [trackingMode, setTrackingMode] = useState<TrackingMode>(profile.trackingMode || 'cycle_tracking');

  // ==========================================
  // 1. 🌸 CYCLE TRACKING STATE
  // ==========================================
  const [periodLength, setPeriodLength] = useState(profile.periodLengthDays || 5);
  const [cycleLength, setCycleLength] = useState(profile.cycleLengthDays || 28);
  const [isIrregular, setIsIrregular] = useState(profile.isIrregular || false);
  const [shortestCycle, setShortestCycle] = useState(profile.shortestCycleDays || 24);
  const [longestCycle, setLongestCycle] = useState(profile.longestCycleDays || 35);
  const [remindApproaching, setRemindApproaching] = useState(
    profile.reminders?.periodApproaching ?? true
  );
  const [daysBefore, setDaysBefore] = useState(
    profile.reminders?.periodApproachingDaysBefore ?? 2
  );
  const [remindFertile, setRemindFertile] = useState(
    profile.reminders?.fertileWindow ?? true
  );
  const [remindOvulation, setRemindOvulation] = useState(
    profile.reminders?.ovulationEstimate ?? true
  );
  const [remindLatePeriod, setRemindLatePeriod] = useState(
    profile.reminders?.latePeriodAlert ?? true
  );
  const [latePeriodDays, setLatePeriodDays] = useState(
    profile.reminders?.latePeriodDaysThreshold ?? 3
  );
  const [dailyReminder, setDailyReminder] = useState(
    profile.reminders?.dailyReminder ?? false
  );
  const [dailyReminderTime, setDailyReminderTime] = useState(
    profile.reminders?.dailyReminderTime || '20:00'
  );

  // Active trackers toggle
  const [trackers, setTrackers] = useState(
    profile.enabledTrackers || {
      period: true,
      flow: true,
      symptoms: true,
      mood: true,
      energy: true,
      sleep: true,
      cervicalMucus: true,
      basalTemperature: false,
      sexualActivity: false,
      medication: true,
      notes: true,
    }
  );

  // ==========================================
  // 2. 👶 TRYING TO CONCEIVE (TTC) STATE
  // ==========================================
  const ttcInit: TTCConfig = profile.ttcConfig || {
    monthsTrying: 2,
    lutealPhaseDays: 14,
    ovulationMethod: 'symptothermal',
    opkSensitivity: 'standard_25miu',
    bbtScale: 'celsius',
    targetBbtShift: 0.3,
    partnerName: '',
    partnerEmail: '',
    partnerSyncAlerts: true,
    reminders: {
      fertileWindowOpening: true,
      peakOvulationSurge: true,
      morningBbtReminder: true,
      morningBbtTime: '06:30',
      opkTestReminder: true,
      opkTestTime: '11:00',
      twoWeekWaitTestAlert: true,
      timedIntercourseRecommendation: true,
    },
  };

  const [ttcMonthsTrying, setTtcMonthsTrying] = useState(ttcInit.monthsTrying);
  const [ttcLutealPhase, setTtcLutealPhase] = useState(ttcInit.lutealPhaseDays);
  const [ttcOvulationMethod, setTtcOvulationMethod] = useState(ttcInit.ovulationMethod);
  const [ttcOpkSensitivity, setTtcOpkSensitivity] = useState(ttcInit.opkSensitivity);
  const [ttcBbtScale, setTtcBbtScale] = useState(ttcInit.bbtScale);
  const [ttcTargetBbtShift, setTtcTargetBbtShift] = useState(ttcInit.targetBbtShift);
  const [ttcPartnerName, setTtcPartnerName] = useState(ttcInit.partnerName || '');
  const [ttcPartnerEmail, setTtcPartnerEmail] = useState(ttcInit.partnerEmail || '');
  const [ttcPartnerSync, setTtcPartnerSync] = useState(ttcInit.partnerSyncAlerts);

  // TTC Reminders
  const [ttcFertileOpeningAlert, setTtcFertileOpeningAlert] = useState(
    ttcInit.reminders?.fertileWindowOpening ?? true
  );
  const [ttcPeakOvulationAlert, setTtcPeakOvulationAlert] = useState(
    ttcInit.reminders?.peakOvulationSurge ?? true
  );
  const [ttcMorningBbtAlert, setTtcMorningBbtAlert] = useState(
    ttcInit.reminders?.morningBbtReminder ?? true
  );
  const [ttcMorningBbtTime, setTtcMorningBbtTime] = useState(
    ttcInit.reminders?.morningBbtTime || '06:30'
  );
  const [ttcOpkTestAlert, setTtcOpkTestAlert] = useState(
    ttcInit.reminders?.opkTestReminder ?? true
  );
  const [ttcOpkTestTime, setTtcOpkTestTime] = useState(
    ttcInit.reminders?.opkTestTime || '11:00'
  );
  const [ttcTwoWeekWaitAlert, setTtcTwoWeekWaitAlert] = useState(
    ttcInit.reminders?.twoWeekWaitTestAlert ?? true
  );
  const [ttcTimedIntercourseAlert, setTtcTimedIntercourseAlert] = useState(
    ttcInit.reminders?.timedIntercourseRecommendation ?? true
  );

  // ==========================================
  // 3. 🤰 PREGNANCY MODE STATE
  // ==========================================
  const pregInit: PregnancyConfig = profile.pregnancyConfig || {
    calculationMethod: 'lmp',
    dueDate: '2027-01-25',
    lastMenstrualPeriodDate: '2026-04-20',
    conceptionDate: '2026-05-04',
    pregnancyType: 'singleton',
    doctorClinicName: 'St. Jude Women’s Health',
    bloodType: 'O+',
    fetalKickCountEnabled: true,
    targetKicks: 10,
    prenatalVitaminsReminder: true,
    prenatalVitaminsTime: '08:30',
    weeklyMilestoneAlert: true,
    trimesterMilestoneAlert: true,
    hydrationAlert: true,
    hydrationTargetLiters: 2.5,
    doctorAppointmentAlerts: true,
  };

  const [pregCalcMethod, setPregCalcMethod] = useState(pregInit.calculationMethod);
  const [pregDueDate, setPregDueDate] = useState(pregInit.dueDate);
  const [pregLmpDate, setPregLmpDate] = useState(pregInit.lastMenstrualPeriodDate);
  const [pregConceptionDate, setPregConceptionDate] = useState(pregInit.conceptionDate || '');
  const [pregType, setPregType] = useState(pregInit.pregnancyType);
  const [pregClinicName, setPregClinicName] = useState(pregInit.doctorClinicName || '');
  const [pregBloodType, setPregBloodType] = useState(pregInit.bloodType || 'O+');

  // Pregnancy Reminders
  const [pregKickCount, setPregKickCount] = useState(pregInit.fetalKickCountEnabled ?? true);
  const [pregTargetKicks, setPregTargetKicks] = useState(pregInit.targetKicks || 10);
  const [pregVitaminsAlert, setPregVitaminsAlert] = useState(
    pregInit.prenatalVitaminsReminder ?? true
  );
  const [pregVitaminsTime, setPregVitaminsTime] = useState(
    pregInit.prenatalVitaminsTime || '08:30'
  );
  const [pregWeeklyMilestoneAlert, setPregWeeklyMilestoneAlert] = useState(
    pregInit.weeklyMilestoneAlert ?? true
  );
  const [pregTrimesterAlert, setPregTrimesterAlert] = useState(
    pregInit.trimesterMilestoneAlert ?? true
  );
  const [pregHydrationAlert, setPregHydrationAlert] = useState(pregInit.hydrationAlert ?? true);
  const [pregHydrationLiters, setPregHydrationLiters] = useState(
    pregInit.hydrationTargetLiters || 2.5
  );
  const [pregAppointmentAlerts, setPregAppointmentAlerts] = useState(
    pregInit.doctorAppointmentAlerts ?? true
  );

  // ==========================================
  // 4. 🤱 POSTPARTUM RECOVERY STATE
  // ==========================================
  const postInit: PostpartumConfig = profile.postpartumConfig || {
    deliveryDate: '2026-07-15',
    deliveryType: 'vaginal',
    feedingMethod: 'breastfeeding',
    pediatricianName: 'Dr. Sarah Mitchell, MD',
    sixWeekCheckupDate: '2026-08-26',
    sixWeekCheckupReminder: true,
    pelvicFloorRehabReminder: true,
    pelvicFloorRehabTime: '10:00',
    lochiaTrackingEnabled: true,
    mentalWellnessCheckin: true,
    mentalWellnessFrequency: 'weekly',
    lactationHydrationAlert: true,
    periodReturnAwareness: true,
  };

  const [postDeliveryDate, setPostDeliveryDate] = useState(postInit.deliveryDate);
  const [postDeliveryType, setPostDeliveryType] = useState(postInit.deliveryType);
  const [postFeedingMethod, setPostFeedingMethod] = useState(postInit.feedingMethod);
  const [postPediatrician, setPostPediatrician] = useState(postInit.pediatricianName || '');
  const [postSixWeekDate, setPostSixWeekDate] = useState(postInit.sixWeekCheckupDate || '');

  // Postpartum Reminders
  const [postSixWeekAlert, setPostSixWeekAlert] = useState(postInit.sixWeekCheckupReminder ?? true);
  const [postPelvicFloorAlert, setPostPelvicFloorAlert] = useState(
    postInit.pelvicFloorRehabReminder ?? true
  );
  const [postPelvicFloorTime, setPostPelvicFloorTime] = useState(
    postInit.pelvicFloorRehabTime || '10:00'
  );
  const [postLochiaAlert, setPostLochiaAlert] = useState(postInit.lochiaTrackingEnabled ?? true);
  const [postMentalCheckinAlert, setPostMentalCheckinAlert] = useState(
    postInit.mentalWellnessCheckin ?? true
  );
  const [postMentalFrequency, setPostMentalFrequency] = useState(
    postInit.mentalWellnessFrequency || 'weekly'
  );
  const [postLactationHydrationAlert, setPostLactationHydrationAlert] = useState(
    postInit.lactationHydrationAlert ?? true
  );
  const [postPeriodReturnAlert, setPostPeriodReturnAlert] = useState(
    postInit.periodReturnAwareness ?? true
  );

  // ==========================================
  // GENERAL & PRIVACY STATE
  // ==========================================
  const [requireAppLock, setRequireAppLock] = useState(profile.privacy?.requireAppLock || false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Custom field modal state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<'yes_no' | 'rating' | 'number' | 'text' | 'selection'>('selection');
  const [fieldOptions, setFieldOptions] = useState('Dry, Sticky, Creamy, Watery, Egg-white');

  // Master Save Handler
  const handleSave = () => {
    soundManager.playSuccess();
    triggerHaptic('heavy');

    const updatedProfile: MenstrualCycleProfile = {
      ...profile,
      trackingMode,
      periodLengthDays: periodLength,
      cycleLengthDays: cycleLength,
      isIrregular,
      shortestCycleDays: shortestCycle,
      longestCycleDays: longestCycle,
      enabledTrackers: trackers,
      reminders: {
        ...profile.reminders,
        periodApproaching: remindApproaching,
        periodApproachingDaysBefore: daysBefore,
        fertileWindow: remindFertile,
        ovulationEstimate: remindOvulation,
        dailyReminder,
        dailyReminderTime,
        latePeriodAlert: remindLatePeriod,
        latePeriodDaysThreshold: latePeriodDays,
      },
      ttcConfig: {
        monthsTrying: ttcMonthsTrying,
        lutealPhaseDays: ttcLutealPhase,
        ovulationMethod: ttcOvulationMethod,
        opkSensitivity: ttcOpkSensitivity,
        bbtScale: ttcBbtScale,
        targetBbtShift: ttcTargetBbtShift,
        partnerName: ttcPartnerName,
        partnerEmail: ttcPartnerEmail,
        partnerSyncAlerts: ttcPartnerSync,
        reminders: {
          fertileWindowOpening: ttcFertileOpeningAlert,
          peakOvulationSurge: ttcPeakOvulationAlert,
          morningBbtReminder: ttcMorningBbtAlert,
          morningBbtTime: ttcMorningBbtTime,
          opkTestReminder: ttcOpkTestAlert,
          opkTestTime: ttcOpkTestTime,
          twoWeekWaitTestAlert: ttcTwoWeekWaitAlert,
          timedIntercourseRecommendation: ttcTimedIntercourseAlert,
        },
      },
      pregnancyConfig: {
        calculationMethod: pregCalcMethod,
        dueDate: pregDueDate,
        lastMenstrualPeriodDate: pregLmpDate,
        conceptionDate: pregConceptionDate,
        pregnancyType: pregType,
        doctorClinicName: pregClinicName,
        bloodType: pregBloodType,
        fetalKickCountEnabled: pregKickCount,
        targetKicks: pregTargetKicks,
        prenatalVitaminsReminder: pregVitaminsAlert,
        prenatalVitaminsTime: pregVitaminsTime,
        weeklyMilestoneAlert: pregWeeklyMilestoneAlert,
        trimesterMilestoneAlert: pregTrimesterAlert,
        hydrationAlert: pregHydrationAlert,
        hydrationTargetLiters: pregHydrationLiters,
        doctorAppointmentAlerts: pregAppointmentAlerts,
      },
      postpartumConfig: {
        deliveryDate: postDeliveryDate,
        deliveryType: postDeliveryType,
        feedingMethod: postFeedingMethod,
        pediatricianName: postPediatrician,
        sixWeekCheckupDate: postSixWeekDate,
        sixWeekCheckupReminder: postSixWeekAlert,
        pelvicFloorRehabReminder: postPelvicFloorAlert,
        pelvicFloorRehabTime: postPelvicFloorTime,
        lochiaTrackingEnabled: postLochiaAlert,
        mentalWellnessCheckin: postMentalCheckinAlert,
        mentalWellnessFrequency: postMentalFrequency,
        lactationHydrationAlert: postLactationHydrationAlert,
        periodReturnAwareness: postPeriodReturnAlert,
      },
      privacy: {
        ...profile.privacy,
        requireAppLock,
      },
    };

    onUpdateProfile(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleAddCustomField = () => {
    if (fieldName.trim()) {
      soundManager.playSuccess();
      triggerHaptic('medium');
      const newField: CustomTrackingField = {
        id: `field_${Date.now()}`,
        name: fieldName.trim(),
        type: fieldType,
        options:
          fieldType === 'selection'
            ? fieldOptions.split(',').map((s) => s.trim()).filter(Boolean)
            : undefined,
        showOnDailyLog: true,
      };

      const updated = {
        ...profile,
        customFields: [...(profile.customFields || []), newField],
      };
      onUpdateProfile(updated);
      setFieldName('');
      setShowCustomModal(false);
    }
  };

  const handleDeleteCustomField = (id: string) => {
    soundManager.playTick();
    triggerHaptic('light');
    const updated = {
      ...profile,
      customFields: (profile.customFields || []).filter((f) => f.id !== id),
    };
    onUpdateProfile(updated);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-16">
      {/* 1. Master Mode Selector */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
            Active Life Stage & Mode
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold border border-purple-200/80 dark:border-purple-700/60">
            Adapts Alerts & Forms
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              id: 'cycle_tracking',
              label: 'Cycle Tracking',
              emoji: '🌸',
              subtitle: 'Periods & hormonal cycle',
            },
            {
              id: 'ttc',
              label: 'Trying to Conceive',
              emoji: '👶',
              subtitle: 'Fertility & ovulation surge',
            },
            {
              id: 'pregnancy',
              label: 'Pregnancy Mode',
              emoji: '🤰',
              subtitle: 'Trimesters & baby growth',
            },
            {
              id: 'postpartum',
              label: 'Postpartum Mode',
              emoji: '🤱',
              subtitle: 'Recovery & lochia healing',
            },
          ].map((m) => {
            const isSelected = trackingMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setTrackingMode(m.id as TrackingMode);
                  soundManager.playTick();
                  triggerHaptic('light');
                }}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 text-left transition-all transform active:scale-98 flex items-center gap-2.5 sm:gap-3 cursor-pointer w-full ${
                  isSelected
                    ? 'blessikaa-inner-embossed bg-purple-50 dark:bg-purple-950/60 border-purple-600 ring-2 ring-purple-500/40'
                    : 'blessikaa-inner-embossed hover:bg-purple-50/50 dark:hover:bg-[#282154] hover:border-purple-500 dark:hover:border-purple-400'
                }`}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
                  {m.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight truncate">
                    {m.label}
                  </span>
                  <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold truncate block mt-0.5">
                    {m.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODE-SPECIFIC CONFIGURATION & SMART ALERTS                             */}
      {/* ========================================================================= */}

      {/* MODE A: 🌸 CYCLE TRACKING MODE */}
      {trackingMode === 'cycle_tracking' && (
        <>
          {/* Cycle Parameters */}
          <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Menstrual Cycle Parameters
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 block mb-1.5">
                  Period Duration (Days)
                </label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(Number(e.target.value))}
                  className="w-full p-3 rounded-2xl blessikaa-inner-embossed text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-400/20"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 block mb-1.5">
                  Typical Cycle Length (Days)
                </label>
                <input
                  type="number"
                  min="20"
                  max="50"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="w-full p-3 rounded-2xl blessikaa-inner-embossed text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-400/20"
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068]">
              <input
                type="checkbox"
                checked={isIrregular}
                onChange={(e) => setIsIrregular(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <div>
                <span className="block font-black text-slate-900 dark:text-white">My cycle is irregular</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                  Calculate predictions using dynamic statistical variations
                </span>
              </div>
            </label>

            {isIrregular && (
              <div className="grid grid-cols-2 gap-3 pt-1 animate-fadeIn">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Shortest Cycle (Days)
                  </label>
                  <input
                    type="number"
                    value={shortestCycle}
                    onChange={(e) => setShortestCycle(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl blessikaa-inner-embossed text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Longest Cycle (Days)
                  </label>
                  <input
                    type="number"
                    value={longestCycle}
                    onChange={(e) => setLongestCycle(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl blessikaa-inner-embossed text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cycle Smart Alerts & Notifications */}
          <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Cycle Smart Alerts & Reminders
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Period Approaching */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Period Approaching Alert</div>
                  <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    Heads-up alert {daysBefore} days prior to expected bleeding
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={daysBefore}
                    onChange={(e) => setDaysBefore(Number(e.target.value))}
                    className="text-[11px] font-bold bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] text-slate-900 dark:text-white rounded-xl px-2 py-1 shadow-xs"
                  >
                    <option value={1}>1 day</option>
                    <option value={2}>2 days</option>
                    <option value={3}>3 days</option>
                    <option value={5}>5 days</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setRemindApproaching(!remindApproaching);
                    }}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      remindApproaching ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>

              {/* Fertile Window Alert */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Fertile Window Notification</div>
                  <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    Notifies when natural fertile window opens
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setRemindFertile(!remindFertile);
                  }}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                    remindFertile ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Ovulation Day Alert */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Estimated Ovulation Day</div>
                  <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    Alert on predicted egg release peak
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setRemindOvulation(!remindOvulation);
                  }}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                    remindOvulation ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Late Period Alert */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Cycle Delay & Anomaly Alert</div>
                  <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    Alert if period is overdue by {latePeriodDays} days
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={latePeriodDays}
                    onChange={(e) => setLatePeriodDays(Number(e.target.value))}
                    className="text-[11px] font-bold bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] text-slate-900 dark:text-white rounded-xl px-2 py-1 shadow-xs"
                  >
                    <option value={2}>2 days</option>
                    <option value={3}>3 days</option>
                    <option value={5}>5 days</option>
                    <option value={7}>7 days</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setRemindLatePeriod(!remindLatePeriod);
                    }}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      remindLatePeriod ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>

              {/* Daily Log Reminder */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Daily Evening Check-in</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Prompt to log mood, flow & energy
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {dailyReminder && (
                    <input
                      type="time"
                      value={dailyReminderTime}
                      onChange={(e) => setDailyReminderTime(e.target.value)}
                      className="text-[11px] font-bold bg-white dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-slate-900 dark:text-white rounded-lg px-2 py-1"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setDailyReminder(!dailyReminder);
                    }}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      dailyReminder ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODE B: 👶 TRYING TO CONCEIVE (TTC) MODE */}
      {trackingMode === 'ttc' && (
        <>
          {/* TTC Fertility Parameters */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 sm:p-5 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Baby className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                TTC Fertility & Ovulation Inputs
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Months Trying to Conceive
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={ttcMonthsTrying}
                  onChange={(e) => setTtcMonthsTrying(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Luteal Phase (Days)
                </label>
                <input
                  type="number"
                  min="9"
                  max="18"
                  value={ttcLutealPhase}
                  onChange={(e) => setTtcLutealPhase(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Primary Ovulation Tracking Method
              </label>
              <select
                value={ttcOvulationMethod}
                onChange={(e: any) => setTtcOvulationMethod(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-600"
              >
                <option value="symptothermal">Symptothermal (BBT + Cervical Mucus + LH)</option>
                <option value="opk_strips">Ovulation Predictor Kits (LH Surge Strips)</option>
                <option value="bbt">Basal Body Temperature (Thermal Shift Only)</option>
                <option value="calendar">Standard Calendar Rhythm Estimation</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  OPK Test Sensitivity
                </label>
                <select
                  value={ttcOpkSensitivity}
                  onChange={(e: any) => setTtcOpkSensitivity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="standard_25miu">Standard (25 mIU/mL)</option>
                  <option value="high_10miu">High Sensitivity (10 mIU/mL)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  BBT Temp Scale
                </label>
                <select
                  value={ttcBbtScale}
                  onChange={(e: any) => setTtcBbtScale(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="celsius">Celsius (°C, 0.01° prec.)</option>
                  <option value="fahrenheit">Fahrenheit (°F, 0.1° prec.)</option>
                </select>
              </div>
            </div>

            {/* Partner Conception Sync */}
            <div className="p-3 rounded-2xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Partner Conception Sync & Alerts
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setTtcPartnerSync(!ttcPartnerSync);
                  }}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                    ttcPartnerSync ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {ttcPartnerSync && (
                <div className="grid grid-cols-2 gap-2 pt-1 animate-fadeIn">
                  <input
                    type="text"
                    placeholder="Partner Name"
                    value={ttcPartnerName}
                    onChange={(e) => setTtcPartnerName(e.target.value)}
                    className="p-2 rounded-xl bg-white dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <input
                    type="email"
                    placeholder="Partner Email"
                    value={ttcPartnerEmail}
                    onChange={(e) => setTtcPartnerEmail(e.target.value)}
                    className="p-2 rounded-xl bg-white dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* TTC Smart Alerts & Reminders */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 sm:p-5 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                TTC Conception Smart Alerts
              </span>
            </div>

            <div className="space-y-2.5">
              {/* High Fertility Window Opening */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Fertile Window Opening Alert</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Notifies 5 days before ovulation for timed intercourse
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setTtcFertileOpeningAlert(!ttcFertileOpeningAlert);
                  }}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                    ttcFertileOpeningAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Peak Ovulation Surge */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Peak LH Surge & Ovulation Alert</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Immediate prompt during 24-36h peak fertile window
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setTtcPeakOvulationAlert(!ttcPeakOvulationAlert);
                  }}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                    ttcPeakOvulationAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Morning BBT Reminder */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Morning BBT Wake-up Alarm</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Prompt to measure basal temp before rising
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ttcMorningBbtAlert && (
                    <input
                      type="time"
                      value={ttcMorningBbtTime}
                      onChange={(e) => setTtcMorningBbtTime(e.target.value)}
                      className="text-[11px] font-bold bg-white dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-slate-900 dark:text-white rounded-lg px-2 py-1"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setTtcMorningBbtAlert(!ttcMorningBbtAlert);
                    }}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      ttcMorningBbtAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>

              {/* OPK Test Strip Reminder */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Daily LH Strip Test Reminder</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Recommended mid-day testing window
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ttcOpkTestAlert && (
                    <input
                      type="time"
                      value={ttcOpkTestTime}
                      onChange={(e) => setTtcOpkTestTime(e.target.value)}
                      className="text-[11px] font-bold bg-white dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-slate-900 dark:text-white rounded-lg px-2 py-1"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setTtcOpkTestAlert(!ttcOpkTestAlert);
                    }}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      ttcOpkTestAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>

              {/* 2-Week Wait Pregnancy Test Milestone */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Two-Week Wait (2WW) HCG Alert</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Notification at 12–14 DPO (Days Past Ovulation)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setTtcTwoWeekWaitAlert(!ttcTwoWeekWaitAlert);
                  }}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                    ttcTwoWeekWaitAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODE C: 🤰 PREGNANCY MODE */}
      {trackingMode === 'pregnancy' && (
        <>
          {/* Gestational Parameters */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 sm:p-5 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Pregnancy & Gestational Inputs
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Due Date Calculation Method
              </label>
              <select
                value={pregCalcMethod}
                onChange={(e: any) => setPregCalcMethod(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-600"
              >
                <option value="lmp">Last Menstrual Period (LMP Date)</option>
                <option value="edd">Estimated Due Date (EDD)</option>
                <option value="conception">Exact Conception / Ovulation Date</option>
                <option value="ultrasound">First Trimester Ultrasound Dating</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Estimated Due Date (EDD)
                </label>
                <input
                  type="date"
                  value={pregDueDate}
                  onChange={(e) => setPregDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Last Period (LMP Date)
                </label>
                <input
                  type="date"
                  value={pregLmpDate}
                  onChange={(e) => setPregLmpDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pregnancy Type
                </label>
                <select
                  value={pregType}
                  onChange={(e: any) => setPregType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="singleton">Singleton (1 Baby)</option>
                  <option value="twins">Twins (2 Babies)</option>
                  <option value="multiples">Multiple (Triplets+)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Maternal Blood Type
                </label>
                <select
                  value={pregBloodType}
                  onChange={(e) => setPregBloodType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O- Rh neg)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A- Rh neg)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B- Rh neg)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB- Rh neg)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                OB-GYN Provider / Maternity Clinic
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Emily Watson, Mercy Maternity Center"
                value={pregClinicName}
                onChange={(e) => setPregClinicName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Pregnancy Smart Alerts & Reminders */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 sm:p-5 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Pregnancy Care Smart Alerts
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Weekly Baby Development */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Weekly Baby Growth Milestone</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Weekly fruit/veggie size comparison & anatomical guide
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setPregWeeklyMilestoneAlert(!pregWeeklyMilestoneAlert);
                  }}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                    pregWeeklyMilestoneAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Daily Prenatal Vitamin */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Prenatal Vitamins & Folic Acid</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Daily reminder for essential maternal micronutrients
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pregVitaminsAlert && (
                    <input
                      type="time"
                      value={pregVitaminsTime}
                      onChange={(e) => setPregVitaminsTime(e.target.value)}
                      className="text-[11px] font-bold bg-white dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-slate-900 dark:text-white rounded-lg px-2 py-1"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setPregVitaminsAlert(!pregVitaminsAlert);
                    }}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      pregVitaminsAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>

              {/* Fetal Kick Counter (3rd Trimester) */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Fetal Kick Counting Session</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Target: {pregTargetKicks} kicks within 2 hours
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setPregKickCount(!pregKickCount);
                  }}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                    pregKickCount ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Pregnancy Hydration */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Maternal Hydration Goal</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Target: {pregHydrationLiters} Liters/day for amniotic fluid
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={pregHydrationLiters}
                    onChange={(e) => setPregHydrationLiters(Number(e.target.value))}
                    className="text-[11px] font-bold bg-white dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-slate-900 dark:text-white rounded-lg px-2 py-1"
                  >
                    <option value={2.0}>2.0 L</option>
                    <option value={2.5}>2.5 L</option>
                    <option value={3.0}>3.0 L</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setPregHydrationAlert(!pregHydrationAlert);
                    }}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      pregHydrationAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODE D: 🤱 POSTPARTUM RECOVERY MODE */}
      {trackingMode === 'postpartum' && (
        <>
          {/* Postpartum Recovery Parameters */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 sm:p-5 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Postpartum & Maternal Recovery Inputs
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Baby's Delivery Date
                </label>
                <input
                  type="date"
                  value={postDeliveryDate}
                  onChange={(e) => setPostDeliveryDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Delivery Method
                </label>
                <select
                  value={postDeliveryType}
                  onChange={(e: any) => setPostDeliveryType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="vaginal">Vaginal Delivery (Intact)</option>
                  <option value="vaginal_tear">Vaginal (Perineal Tear/Episiotomy)</option>
                  <option value="c_section">Cesarean Section (C-Section)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Feeding Method
                </label>
                <select
                  value={postFeedingMethod}
                  onChange={(e: any) => setPostFeedingMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="breastfeeding">Exclusive Breastfeeding</option>
                  <option value="pumping">Exclusive Pumping</option>
                  <option value="formula">Formula Feeding</option>
                  <option value="combo">Combination (Nursing + Formula)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  6-Week Checkup Date
                </label>
                <input
                  type="date"
                  value={postSixWeekDate}
                  onChange={(e) => setPostSixWeekDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Pediatrician / Postpartum Care Physician
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Sarah Mitchell, Pediatric Health"
                value={postPediatrician}
                onChange={(e) => setPostPediatrician(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Postpartum Smart Alerts & Reminders */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 sm:p-5 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Postpartum Smart Alerts & Milestones
              </span>
            </div>

            <div className="space-y-2.5">
              {/* 6-Week Postpartum Visit Alert */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">6-Week OB-GYN Clinical Checkup</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Comprehensive pelvic & incision recovery clearance
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setPostSixWeekAlert(!postSixWeekAlert);
                  }}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                    postSixWeekAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Pelvic Floor & Core Rehab Reminder */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Daily Pelvic Floor & Core Rehab</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Gentle breathing & transverse abdominis activation
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {postPelvicFloorAlert && (
                    <input
                      type="time"
                      value={postPelvicFloorTime}
                      onChange={(e) => setPostPelvicFloorTime(e.target.value)}
                      className="text-[11px] font-bold bg-white dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-slate-900 dark:text-white rounded-lg px-2 py-1"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setPostPelvicFloorAlert(!postPelvicFloorAlert);
                    }}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      postPelvicFloorAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>

              {/* Lochia Bleeding Stage Progression */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Lochia Healing Progression</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Monitor transitions: Rubra → Serosa → Alba
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setPostLochiaAlert(!postLochiaAlert);
                  }}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                    postLochiaAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Maternal Mental Wellness Checkin (Edinburgh Scale) */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Maternal Mental Wellness Check-in</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {postMentalFrequency === 'weekly' ? 'Weekly' : 'Bi-weekly'} screening for baby blues & PPD
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={postMentalFrequency}
                    onChange={(e: any) => setPostMentalFrequency(e.target.value)}
                    className="text-[11px] font-bold bg-white dark:bg-[#15112E] border border-purple-200 dark:border-[#383068] text-slate-900 dark:text-white rounded-lg px-2 py-1"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setPostMentalCheckinAlert(!postMentalCheckinAlert);
                    }}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                      postMentalCheckinAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>

              {/* First Period Return Awareness */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-[#383068] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">First Postpartum Period Watch</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Fertility resumption & ovulatory cycle tracking
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setPostPeriodReturnAlert(!postPeriodReturnAlert);
                  }}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                    postPeriodReturnAlert ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. CUSTOM TRACKERS & BIO-METRICS                                          */}
      {/* ========================================================================= */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Custom Symptom & Bio-Trackers
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="group px-3 py-1.5 rounded-2xl blessikaa-inner-embossed text-xs font-black text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Create Custom Tracker</span>
          </button>
        </div>

        {profile.customFields && profile.customFields.length > 0 ? (
          <div className="space-y-2">
            {profile.customFields.map((field) => (
              <div
                key={field.id}
                className="p-3.5 sm:p-4 rounded-2xl blessikaa-inner-embossed flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-black text-slate-900 dark:text-white block text-xs sm:text-sm">{field.name}</span>
                  <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold capitalize">
                    Type: {field.type.replace('_', ' ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCustomField(field.id)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">No custom trackers created yet.</p>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. PRIVACY & SECURITY                                                     */}
      {/* ========================================================================= */}
      <div className="blessikaa-section-embossed rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Privacy & App Shielding
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl blessikaa-inner-embossed flex items-center justify-between">
          <div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Require Biometric / App PIN</div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
              Lock menstrual vault on backgrounding
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              setRequireAppLock(!requireAppLock);
            }}
            className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
              requireAppLock ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MASTER SAVE BUTTON (ANDROID OPTIMIZED)                                 */}
      {/* ========================================================================= */}
      <button
        type="button"
        id="menstrual-save-settings-btn"
        onClick={handleSave}
        className="w-full group rounded-3xl p-5 sm:p-6 blessikaa-section-embossed hover:bg-purple-50/50 dark:hover:bg-[#282154] hover:border-purple-500 dark:hover:border-purple-400 text-left hover:shadow-lg hover:shadow-purple-500/10 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
            {savedSuccess ? (
              <Check className="w-7 h-7 text-emerald-300 stroke-[2.5]" />
            ) : (
              <Save className="w-7 h-7 stroke-[2.5]" />
            )}
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-300 block tracking-tight">
              {savedSuccess ? 'PREFERENCES & SMART ALERTS SAVED' : 'SAVE SETTINGS & SMART ALERTS'}
            </span>
            <span className="text-xs text-purple-700 dark:text-purple-300 font-bold block mt-0.5">
              {savedSuccess ? 'All configurations stored securely' : 'Save life stage, notifications & cycle parameters'}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/40 group-hover:bg-purple-600 group-hover:text-white text-purple-700 dark:text-purple-300 flex items-center justify-center transition-colors shrink-0">
          <Check className="w-5 h-5 stroke-[2.5]" />
        </div>
      </button>

      {/* ========================================================================= */}
      {/* 6. RESET DATA                                                             */}
      {/* ========================================================================= */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all menstrual cycle logs, historical periods, and settings to factory defaults?')) {
              onResetData();
            }
          }}
          className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center justify-center gap-1 mx-auto cursor-pointer p-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Menstrual Service Data to Defaults</span>
        </button>
      </div>

      {/* Create Custom Tracker Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-[#1E1A3D] rounded-3xl p-5 shadow-2xl border-2 border-purple-200/80 dark:border-[#383068] space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Create Custom Tracker</h3>

            <div>
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 block mb-1.5">Tracker Name</label>
              <input
                type="text"
                placeholder="e.g. Water intake, Basal temp"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white shadow-xs focus:outline-hidden focus:border-purple-600"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 block mb-1.5">Input Type</label>
              <select
                value={fieldType}
                onChange={(e: any) => setFieldType(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] text-xs font-bold text-slate-900 dark:text-white shadow-xs focus:outline-hidden focus:border-purple-600"
              >
                <option value="selection">Selection list (Dropdown/Chips)</option>
                <option value="yes_no">Yes / No Toggle</option>
                <option value="rating">Rating (1 to 5 Stars)</option>
                <option value="number">Numeric value</option>
                <option value="text">Short Text</option>
              </select>
            </div>

            {fieldType === 'selection' && (
              <div>
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 block mb-1.5">
                  Options (Comma separated)
                </label>
                <input
                  type="text"
                  value={fieldOptions}
                  onChange={(e) => setFieldOptions(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white dark:bg-[#15112E] border-2 border-purple-200/80 dark:border-[#383068] text-xs font-medium text-slate-900 dark:text-white shadow-xs focus:outline-hidden focus:border-purple-600"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="py-2.5 px-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 text-xs font-black border border-purple-200 dark:border-[#383068] cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="flex-1 group rounded-2xl p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white text-xs font-black shadow-md hover:from-purple-700 hover:to-indigo-700 cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Save Tracker</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
