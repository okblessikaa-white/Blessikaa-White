export type TrackingMode = 'cycle_tracking' | 'ttc' | 'pregnancy' | 'postpartum' | 'paused';

export type FlowIntensity = 'none' | 'spotting' | 'light' | 'medium' | 'heavy' | 'very_heavy';

export type MenstrualProduct = 'pad' | 'tampon' | 'cup' | 'period_underwear' | 'other';

export type MoodType = 'great' | 'good' | 'neutral' | 'low' | 'stressed' | 'irritable' | 'anxious';

export type EnergyLevel = 'low' | 'normal' | 'high';

export type CyclePhase = 'menstrual' | 'period' | 'follicular' | 'ovulation' | 'luteal';

export interface CustomTrackingField {
  id: string;
  name: string;
  type: 'yes_no' | 'rating' | 'number' | 'text' | 'selection';
  options?: string[]; // For 'selection' type (e.g. ['Dry', 'Sticky', 'Creamy', 'Watery', 'Egg-white'])
  showOnDailyLog: boolean;
}

// 👶 Trying to Conceive (TTC) Configuration
export interface TTCConfig {
  monthsTrying: number;
  lutealPhaseDays: number;
  ovulationMethod: 'symptothermal' | 'opk_strips' | 'bbt' | 'calendar';
  opkSensitivity: 'standard_25miu' | 'high_10miu';
  bbtScale: 'celsius' | 'fahrenheit';
  targetBbtShift: number; // e.g. 0.3°C or 0.5°F
  partnerName?: string;
  partnerEmail?: string;
  partnerSyncAlerts: boolean;
  reminders: {
    fertileWindowOpening: boolean;
    peakOvulationSurge: boolean;
    morningBbtReminder: boolean;
    morningBbtTime: string; // e.g. '06:30'
    opkTestReminder: boolean;
    opkTestTime: string; // e.g. '11:00'
    twoWeekWaitTestAlert: boolean;
    timedIntercourseRecommendation: boolean;
  };
}

// 🤰 Pregnancy Mode Configuration
export interface PregnancyConfig {
  calculationMethod: 'edd' | 'lmp' | 'conception' | 'ultrasound';
  dueDate: string; // ISO date 'YYYY-MM-DD'
  lastMenstrualPeriodDate: string; // ISO date 'YYYY-MM-DD'
  conceptionDate?: string;
  ultrasoundDate?: string;
  pregnancyType: 'singleton' | 'twins' | 'multiples';
  doctorClinicName?: string;
  bloodType?: string;
  fetalKickCountEnabled: boolean;
  targetKicks: number;
  prenatalVitaminsReminder: boolean;
  prenatalVitaminsTime: string; // e.g. '08:30'
  weeklyMilestoneAlert: boolean;
  trimesterMilestoneAlert: boolean;
  hydrationAlert: boolean;
  hydrationTargetLiters: number;
  doctorAppointmentAlerts: boolean;
}

// 🤱 Postpartum Recovery Configuration
export interface PostpartumConfig {
  deliveryDate: string; // ISO date 'YYYY-MM-DD'
  deliveryType: 'vaginal' | 'vaginal_tear' | 'c_section';
  feedingMethod: 'breastfeeding' | 'pumping' | 'formula' | 'combo';
  pediatricianName?: string;
  sixWeekCheckupDate?: string;
  sixWeekCheckupReminder: boolean;
  pelvicFloorRehabReminder: boolean;
  pelvicFloorRehabTime: string; // e.g. '10:00'
  lochiaTrackingEnabled: boolean;
  mentalWellnessCheckin: boolean;
  mentalWellnessFrequency: 'weekly' | 'biweekly';
  lactationHydrationAlert: boolean;
  periodReturnAwareness: boolean;
}

export interface MenstrualCycleProfile {
  isConfigured: boolean;
  userName?: string;
  doctorReportNotes?: string;
  trackingMode: TrackingMode;
  lastPeriodStartDate: string; // ISO date 'YYYY-MM-DD'
  periodLengthDays: number; // e.g. 5
  cycleLengthDays: number; // e.g. 28
  isIrregular: boolean;
  shortestCycleDays?: number; // e.g. 24
  longestCycleDays?: number; // e.g. 35
  trackActualVariations?: boolean;
  enabledTrackers: {
    period: boolean;
    flow: boolean;
    symptoms: boolean;
    mood: boolean;
    energy: boolean;
    sleep: boolean;
    cervicalMucus: boolean;
    basalTemperature: boolean;
    sexualActivity: boolean;
    medication: boolean;
    notes: boolean;
  };
  reminders: {
    periodApproaching: boolean;
    periodApproachingDaysBefore: number; // e.g. 2
    fertileWindow: boolean;
    ovulationEstimate: boolean;
    dailyReminder: boolean;
    dailyReminderTime: string; // '20:00'
    latePeriodAlert?: boolean;
    latePeriodDaysThreshold?: number; // e.g. 3
  };
  privacy: {
    keepPrivate: boolean;
    requireAppLock: boolean;
    sharedWith: 'nobody' | 'partner' | 'family' | 'caregiver' | 'doctor' | 'custom';
    partnerEmail?: string;
    partnerPermission?: 'view_only' | 'view_contribute' | 'full_access';
    accessExpires?: string;
  };
  ttcConfig?: TTCConfig;
  pregnancyConfig?: PregnancyConfig;
  postpartumConfig?: PostpartumConfig;
  customFields?: CustomTrackingField[];
}

export interface MenstrualDailyLog {
  date: string; // 'YYYY-MM-DD'
  isPeriod: boolean;
  isPeriodStart?: boolean;
  isPeriodEnd?: boolean;
  periodDayNumber?: number;
  flow?: FlowIntensity;
  productUsed?: MenstrualProduct;
  symptoms: string[]; // e.g. ['cramps', 'headache', 'bloating']
  mood?: MoodType;
  energy?: EnergyLevel;
  sleepHours?: number;
  cervicalMucus?: string; // 'dry' | 'sticky' | 'creamy' | 'watery' | 'egg_white'
  basalBodyTemperature?: number; // e.g. 36.6 or 97.8
  sexualActivity?: {
    occurred: boolean;
    protected: boolean;
    orgasm?: boolean;
    conceptionAttempt?: boolean;
  };
  medicationsTaken?: string[];
  notes?: string;
  customValues?: Record<string, any>;
  
  // Mode specific log records
  ttcLogs?: {
    opkResult?: 'negative' | 'low' | 'high' | 'peak';
    cervicalPosition?: 'low_firm_closed' | 'medium' | 'high_soft_open';
    dpo?: number;
    pregnancyTestResult?: 'negative' | 'faint_positive' | 'positive';
  };
  pregnancyLogs?: {
    kickCountSessionKicks?: number;
    kickCountDurationMinutes?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    maternalWeightKg?: number;
    nauseaSeverity?: 'none' | 'mild' | 'moderate' | 'severe';
  };
  postpartumLogs?: {
    lochiaStage?: 'rubra' | 'serosa' | 'alba' | 'none';
    incisionPainRating?: number; // 1-10
    nursingSessionMinutes?: number;
    pumpedVolumeMl?: number;
    epdsMoodScore?: number;
  };
  
  updatedAt?: string;
}

export interface CompletedPeriodRecord {
  id: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  cycleLengthDays?: number;
  notes?: string;
}

export interface CyclePrediction {
  currentCycleDay: number;
  currentPhase: CyclePhase;
  estimatedNextPeriodDate: string;
  daysUntilNextPeriod: number;
  estimatedOvulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  confidenceScore: number; // 0 to 100
  isEstimated?: boolean;
}
