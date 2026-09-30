import {
  MenstrualCycleProfile,
  MenstrualDailyLog,
  CompletedPeriodRecord,
  CyclePrediction,
  CyclePhase,
} from '../types/menstrual';

const MENSTRUAL_STORAGE_KEYS = {
  PROFILE: 'blessikaa_menstrual_profile_v1',
  LOGS: 'blessikaa_menstrual_logs_v1',
  PERIOD_HISTORY: 'blessikaa_menstrual_periods_v1',
};

// Default initial state
export const DEFAULT_MENSTRUAL_PROFILE: MenstrualCycleProfile = {
  isConfigured: true,
  trackingMode: 'cycle_tracking',
  lastPeriodStartDate: '2026-08-18', // 12-13 days ago relative to 2026-08-30
  periodLengthDays: 5,
  cycleLengthDays: 28,
  isIrregular: false,
  shortestCycleDays: 24,
  longestCycleDays: 35,
  trackActualVariations: true,
  enabledTrackers: {
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
  },
  reminders: {
    periodApproaching: true,
    periodApproachingDaysBefore: 2,
    fertileWindow: true,
    ovulationEstimate: true,
    dailyReminder: false,
    dailyReminderTime: '20:00',
    latePeriodAlert: true,
    latePeriodDaysThreshold: 3,
  },
  privacy: {
    keepPrivate: true,
    requireAppLock: false,
    sharedWith: 'nobody',
  },
  ttcConfig: {
    monthsTrying: 2,
    lutealPhaseDays: 14,
    ovulationMethod: 'symptothermal',
    opkSensitivity: 'standard_25miu',
    bbtScale: 'celsius',
    targetBbtShift: 0.3,
    partnerName: 'Partner',
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
  },
  pregnancyConfig: {
    calculationMethod: 'lmp',
    dueDate: '2027-01-25',
    lastMenstrualPeriodDate: '2026-04-20',
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
  },
  postpartumConfig: {
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
  },
  customFields: [
    {
      id: 'field_cervical_mucus',
      name: 'Cervical Mucus',
      type: 'selection',
      options: ['Dry', 'Sticky', 'Creamy', 'Watery', 'Egg-white'],
      showOnDailyLog: true,
    },
  ],
};

// Initial default completed period records for realistic history
export const INITIAL_PERIOD_HISTORY: CompletedPeriodRecord[] = [
  {
    id: 'period_2026_05',
    startDate: '2026-05-24',
    endDate: '2026-05-29',
    durationDays: 6,
    cycleLengthDays: 29,
    notes: 'Mild cramps on Day 1',
  },
  {
    id: 'period_2026_06',
    startDate: '2026-06-22',
    endDate: '2026-06-26',
    durationDays: 5,
    cycleLengthDays: 28,
    notes: 'Normal flow, regular energy',
  },
  {
    id: 'period_2026_07',
    startDate: '2026-07-20',
    endDate: '2026-07-24',
    durationDays: 5,
    cycleLengthDays: 29,
    notes: 'Hydrated well, light exercise',
  },
  {
    id: 'period_2026_08',
    startDate: '2026-08-18',
    endDate: '2026-08-22',
    durationDays: 5,
    cycleLengthDays: 28,
    notes: 'Felt better after Day 3',
  },
];

// Starter daily logs for current cycle
export const INITIAL_DAILY_LOGS: Record<string, MenstrualDailyLog> = {
  '2026-08-18': {
    date: '2026-08-18',
    isPeriod: true,
    isPeriodStart: true,
    periodDayNumber: 1,
    flow: 'heavy',
    productUsed: 'pad',
    symptoms: ['Cramps', 'Fatigue', 'Back pain'],
    mood: 'low',
    energy: 'low',
    notes: 'Period started morning. Warm herbal tea helped.',
    updatedAt: new Date().toISOString(),
  },
  '2026-08-19': {
    date: '2026-08-19',
    isPeriod: true,
    periodDayNumber: 2,
    flow: 'heavy',
    productUsed: 'pad',
    symptoms: ['Cramps', 'Bloating', 'Fatigue'],
    mood: 'stressed',
    energy: 'low',
    updatedAt: new Date().toISOString(),
  },
  '2026-08-20': {
    date: '2026-08-20',
    isPeriod: true,
    periodDayNumber: 3,
    flow: 'medium',
    productUsed: 'tampon',
    symptoms: ['Headache', 'Fatigue'],
    mood: 'neutral',
    energy: 'normal',
    updatedAt: new Date().toISOString(),
  },
  '2026-08-21': {
    date: '2026-08-21',
    isPeriod: true,
    periodDayNumber: 4,
    flow: 'light',
    productUsed: 'pad',
    symptoms: ['Bloating'],
    mood: 'good',
    energy: 'normal',
    updatedAt: new Date().toISOString(),
  },
  '2026-08-22': {
    date: '2026-08-22',
    isPeriod: true,
    isPeriodEnd: true,
    periodDayNumber: 5,
    flow: 'spotting',
    productUsed: 'pad',
    symptoms: [],
    mood: 'good',
    energy: 'high',
    notes: 'Period finished. Felt refreshed.',
    updatedAt: new Date().toISOString(),
  },
  '2026-08-28': {
    date: '2026-08-28',
    isPeriod: false,
    symptoms: ['Acne'],
    mood: 'great',
    energy: 'high',
    cervicalMucus: 'Watery',
    updatedAt: new Date().toISOString(),
  },
  '2026-08-29': {
    date: '2026-08-29',
    isPeriod: false,
    symptoms: [],
    mood: 'great',
    energy: 'high',
    cervicalMucus: 'Egg-white',
    updatedAt: new Date().toISOString(),
  },
};

export class MenstrualEngine {
  public static loadProfile(): MenstrualCycleProfile {
    try {
      const data = localStorage.getItem(MENSTRUAL_STORAGE_KEYS.PROFILE);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_MENSTRUAL_PROFILE,
          ...parsed,
          reminders: {
            ...DEFAULT_MENSTRUAL_PROFILE.reminders,
            ...(parsed.reminders || {}),
          },
          privacy: {
            ...DEFAULT_MENSTRUAL_PROFILE.privacy,
            ...(parsed.privacy || {}),
          },
          ttcConfig: {
            ...DEFAULT_MENSTRUAL_PROFILE.ttcConfig!,
            ...(parsed.ttcConfig || {}),
            reminders: {
              ...DEFAULT_MENSTRUAL_PROFILE.ttcConfig!.reminders,
              ...(parsed.ttcConfig?.reminders || {}),
            },
          },
          pregnancyConfig: {
            ...DEFAULT_MENSTRUAL_PROFILE.pregnancyConfig!,
            ...(parsed.pregnancyConfig || {}),
          },
          postpartumConfig: {
            ...DEFAULT_MENSTRUAL_PROFILE.postpartumConfig!,
            ...(parsed.postpartumConfig || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Failed to load menstrual profile from localStorage', e);
    }
    return DEFAULT_MENSTRUAL_PROFILE;
  }

  public static saveProfile(profile: MenstrualCycleProfile): void {
    try {
      localStorage.setItem(MENSTRUAL_STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save menstrual profile to localStorage', e);
    }
  }

  public static loadDailyLogs(): Record<string, MenstrualDailyLog> {
    try {
      const data = localStorage.getItem(MENSTRUAL_STORAGE_KEYS.LOGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load daily logs from localStorage', e);
    }
    return INITIAL_DAILY_LOGS;
  }

  public static saveDailyLogs(logs: Record<string, MenstrualDailyLog>): void {
    try {
      localStorage.setItem(MENSTRUAL_STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed to save daily logs to localStorage', e);
    }
  }

  public static loadPeriodHistory(): CompletedPeriodRecord[] {
    try {
      const data = localStorage.getItem(MENSTRUAL_STORAGE_KEYS.PERIOD_HISTORY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load period history from localStorage', e);
    }
    return INITIAL_PERIOD_HISTORY;
  }

  public static savePeriodHistory(records: CompletedPeriodRecord[]): void {
    try {
      localStorage.setItem(MENSTRUAL_STORAGE_KEYS.PERIOD_HISTORY, JSON.stringify(records));
    } catch (e) {
      console.warn('Failed to save period history to localStorage', e);
    }
  }

  /**
   * Calculates the cycle status and predictions given the current profile and reference date
   */
  public static calculateCyclePrediction(
    profile: MenstrualCycleProfile,
    referenceDateStr: string = '2026-08-30'
  ): CyclePrediction {
    const refDate = new Date(referenceDateStr);
    const lastStart = new Date(profile.lastPeriodStartDate);
    
    // Day difference
    const diffTime = refDate.getTime() - lastStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const cycleLength = profile.cycleLengthDays || 28;
    const periodLength = profile.periodLengthDays || 5;

    // Cycle day index (1-based)
    const currentCycleDay = (diffDays >= 0 ? (diffDays % cycleLength) : 0) + 1;

    // Calculate Estimated Ovulation (typically cycleLength - 14 days)
    const ovulationOffsetDays = Math.max(10, cycleLength - 14);
    const estimatedOvulationDate = new Date(lastStart);
    estimatedOvulationDate.setDate(lastStart.getDate() + ovulationOffsetDays);

    // Fertile Window: 5 days before ovulation to 1 day after
    const fertileStart = new Date(estimatedOvulationDate);
    fertileStart.setDate(estimatedOvulationDate.getDate() - 5);

    const fertileEnd = new Date(estimatedOvulationDate);
    fertileEnd.setDate(estimatedOvulationDate.getDate() + 1);

    // Next period estimated start
    const estimatedNextPeriod = new Date(lastStart);
    estimatedNextPeriod.setDate(lastStart.getDate() + cycleLength);

    const daysUntilNextPeriod = Math.max(
      0,
      Math.ceil((estimatedNextPeriod.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    // Determine phase
    let currentPhase: CyclePhase = 'follicular';
    if (currentCycleDay <= periodLength) {
      currentPhase = 'menstrual';
    } else if (currentCycleDay >= ovulationOffsetDays - 2 && currentCycleDay <= ovulationOffsetDays + 1) {
      currentPhase = 'ovulation';
    } else if (currentCycleDay > ovulationOffsetDays + 1) {
      currentPhase = 'luteal';
    } else {
      currentPhase = 'follicular';
    }

    return {
      currentCycleDay,
      currentPhase,
      estimatedNextPeriodDate: estimatedNextPeriod.toISOString().split('T')[0],
      daysUntilNextPeriod,
      estimatedOvulationDate: estimatedOvulationDate.toISOString().split('T')[0],
      fertileWindowStart: fertileStart.toISOString().split('T')[0],
      fertileWindowEnd: fertileEnd.toISOString().split('T')[0],
      isEstimated: true,
      confidenceScore: profile.isIrregular ? 78 : 94,
    };
  }

  /**
   * Computes historical statistics (regularity score %, average cycle, average period)
   */
  public static calculateAnalytics(
    profile: MenstrualCycleProfile,
    history: CompletedPeriodRecord[],
    logs: Record<string, MenstrualDailyLog>
  ) {
    const totalPeriods = history.length;
    const avgPeriod =
      totalPeriods > 0
        ? Math.round(
            (history.reduce((acc, curr) => acc + curr.durationDays, 0) / totalPeriods) * 10
          ) / 10
        : profile.periodLengthDays;

    const recordedCycleLengths = history
      .map((h) => h.cycleLengthDays)
      .filter((c): c is number => typeof c === 'number' && c > 0);

    const avgCycle =
      recordedCycleLengths.length > 0
        ? Math.round(
            recordedCycleLengths.reduce((acc, curr) => acc + curr, 0) / recordedCycleLengths.length
          )
        : profile.cycleLengthDays;

    // Regularity score
    const variance =
      recordedCycleLengths.length > 1
        ? recordedCycleLengths.reduce((acc, c) => acc + Math.pow(c - avgCycle, 2), 0) /
          recordedCycleLengths.length
        : 1;
    const stdDev = Math.sqrt(variance);
    const regularityScore = Math.max(60, Math.min(98, Math.round(100 - stdDev * 4.5)));

    // Symptom frequency aggregation
    const symptomCounts: Record<string, number> = {};
    let totalLogsWithSymptoms = 0;

    Object.values(logs).forEach((log) => {
      if (log.symptoms && log.symptoms.length > 0) {
        totalLogsWithSymptoms += 1;
        log.symptoms.forEach((s) => {
          symptomCounts[s] = (symptomCounts[s] || 0) + 1;
        });
      }
    });

    const symptomFrequencies = Object.entries(symptomCounts)
      .map(([symptom, count]) => ({
        symptom,
        count,
        percentage: Math.min(
          100,
          Math.round((count / Math.max(1, totalLogsWithSymptoms || history.length * 5)) * 100)
        ),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      avgPeriodDays: avgPeriod,
      avgCycleDays: avgCycle,
      regularityScore,
      symptomFrequencies,
      lastRecordedCycles: history.slice(-6),
    };
  }

  /**
   * Helper to format human friendly dates (e.g. "Aug 18 – Aug 22")
   */
  public static formatDateRange(startDateStr: string, endDateStr: string): string {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endMonth = end.toLocaleString('default', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} – ${end.getDate()}`;
    }
    return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}`;
  }
}
