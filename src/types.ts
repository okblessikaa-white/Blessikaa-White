export type ThemeMode = 'dark' | 'light';

export type AppTheme =
  | 'purple' // Blessikaa Master Purple
  | 'peach' // Peach Blossom
  | 'sunset' // Sunset Gold
  | 'ocean' // Ocean Blue
  | 'emerald' // Forest Emerald
  | 'midnight'; // Midnight Dark

export type GenderType = 'Male' | 'Female' | 'Other';

export interface AvatarConfig {
  gender: GenderType;
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  eyeType: string;
  eyeColor: string;
  faceShape: string;
  noseType: string;
  earType: string;
  clothesType: string;
  clothesColor: string;
  facialHair: string;
  accessory: string;
}

export type ChallengeCategory =
  | 'personal_growth'
  | 'health'
  | 'learning'
  | 'lifestyle'
  | 'productivity'
  | 'mental_health'
  | 'adventure'
  | 'relationships'
  | 'self_love'
  | 'positivity'
  | 'mindfulness'
  | 'fitness'
  | 'finance'
  | 'creativity';

export type ChallengeIntensity = 'beginner' | 'intermediate' | 'advanced' | 'gentle' | 'medium' | 'intense';

export interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface DayPlan {
  day: number;
  title: string;
  description: string;
  tasks: string[];
  tip: string;
  estimatedMinutes: number;
  suggestedTimerMinutes?: number;
  actionChecklist?: string[];
  psychologyTip?: string;
  timer?: number; // in minutes
}

export interface ChallengeNotificationConfig {
  challengeId: string;
  enabled: boolean;
  time: string; // "08:00"
  sound?: boolean;
  vibration?: boolean;
  motivationalNudge?: boolean;
  audioSound?: string;
  frequency?: string;
  mode?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory | string;
  intensity: ChallengeIntensity | string;
  iconName?: string;
  icon?: string;
  coverImage?: string;
  tags?: string[];
  milestone7?: string;
  milestone14?: string;
  milestone21?: string;
  days: DayPlan[];
  isCustom?: boolean;
  isCommunity?: boolean;
  isAiGenerated?: boolean;
  author?: string;
  createdAt?: string;
  creatorName?: string;
  creatorAvatar?: string;
  creatorRole?: string;
  isVerifiedCreator?: boolean;
  participantCount?: number;
  rating?: number;
  reviewsCount?: number;
  trendingBadge?: string;
  communityLikes?: number;
}

export type DayStatus =
  | 'LOCKED'
  | 'AVAILABLE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'MISSED'
  | 'SKIPPED'
  | 'REST_DAY'
  | 'EXCUSED';

export type ChallengeLifecycleStatus =
  | 'draft'
  | 'not_started'
  | 'active'
  | 'completed_21_days'
  | 'continuation_offered'
  | 'habit_mode'
  | 'paused'
  | 'resumed'
  | 'archived';

export interface HabitGoalItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface DayLog {
  completed: boolean;
  completedAt?: string;
  completedTasks: string[]; // task IDs or texts
  reflectionNote?: string;
  mood?: '🔥 Unstoppable' | '⚡ Energized' | '🌱 Steady' | '🧘 Calm' | '💪 Challenged' | '☀️ Unstoppable' | '🌙 Energized' | '💚 Steady' | '🦋 Calm' | string;
  timeSpentMinutes?: number;
  scratched?: boolean;
  status?: DayStatus;
  isRestDay?: boolean;
  isMissed?: boolean;
  shieldUsed?: boolean;
  photoUrl?: string;
  customGoals?: HabitGoalItem[];
}

export interface HabitRules {
  frequency: 'Daily' | 'Weekdays' | '3x/week' | 'Custom';
  preferredTime: string; // e.g. '07:00 AM'
  minCompletionMinutes: number;
  targetMinutes: number;
  allowRestDays: boolean;
  graceDays: number;
  missedDayBehavior: 'Flexible' | 'Strict';
  reminderEnabled: boolean;
  reminderTime: string;
  motivationalNotification: boolean;
  streakProtection: 'None' | '1 day/month' | '2 days/month' | 'Shields';
  streakShields: number;
}

export interface ChallengeMilestone {
  day: number;
  badge: string;
  title: string;
  subtitle: string;
  xp: number;
  desc: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'elite' | 'legendary';
}

export interface UserChallengeProgress {
  challengeId: string;
  startedAt: string;
  currentDay: number; // 1-21, or 22+ in habit mode
  dayLogs: Record<number, DayLog>; // 1 -> DayLog
  isCompleted: boolean;
  completedAt?: string;
  streak: number;
  highestStreak: number;
  totalPoints: number;
  status?: ChallengeLifecycleStatus;
  challengeDuration?: number; // default 21
  continuationEnabled?: boolean;
  continuationStartedAt?: string;
  habitRules?: HabitRules;
  unlockedMilestones?: number[];
  streakShields?: number;
}

export interface HabitCheckIn {
  date: string; // ISO date string (YYYY-MM-DD)
  completedAt: string;
  status: 'completed' | 'missed';
  note?: string;
}

export interface Habit {
  id: string;
  challengeId?: string;
  name: string;
  category: ChallengeCategory | string;
  icon: string;
  startedAt: string;
  totalDays: number;
  streak: number;
  longestStreak: number;
  lastPerformed?: string;
  isActive: boolean;
  checkIns: HabitCheckIn[];
  targetDays?: number;
}

export interface WheelReward {
  id: number;
  icon: string;
  label: string;
  color: string;
  type: 'xp' | 'streak_freeze' | 'spin' | 'badge' | 'premium' | 'boost' | 'coins';
  value: number | string;
}

export interface WheelTriangleItem {
  id: number;
  label: string;
  icon: string;
  color: string;
  type?: 'xp' | 'streak_freeze' | 'spin' | 'badge' | 'premium' | 'boost' | 'coins' | 'penalty' | 'custom';
  value?: number | string;
  penaltyIntensity?: 'light' | 'moderate' | 'strict';
}

export interface CustomWheelConfig {
  segmentCount: number; // 4 to 12
  triangles: WheelTriangleItem[];
}

export interface ServiceItem {
  id: string;
  icon: string;
  label: string;
  color: string;
  description: string;
  category: string;
  actionText: string;
  subItems?: string[];
}

export interface RecentDocItem {
  id: string | number;
  name: string;
  icon: string;
  date: string;
  size?: string;
  type?: string;
  category?: string;
  url?: string;
  verified?: boolean;
  pinProtected?: boolean;
  notes?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'streak' | 'completion' | 'special' | 'milestone';
  requirement: string;
  xp?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'reminder' | 'motivation' | 'milestone' | 'streak' | 'level_up' | 'reward';
}

export interface AppSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reminderEnabled: boolean;
  reminderTime: string; // e.g. "08:00"
  userName: string;
  userGender: GenderType;
  userBio?: string;
  theme: AppTheme;
  themeMode: ThemeMode;
  notificationSound: boolean;
  streakFreezes: number;
  lastSpinDate?: string;
  userLevel: number;
  coins: number;
  onboardingCompleted: boolean;
  tutorialCompleted: boolean;
  ageVerified: boolean;
  avatar: AvatarConfig;
  hiddenChallengeIds: string[];
  activeChallengeIds: string[];
  gamificationMode: 'scratch' | 'wheel' | 'alternate';
  alternateDayCount: number;
  purchasedThemes: string[];
  purchasedAvatarItems: string[];
  challengeNotificationConfigs: Record<string, ChallengeNotificationConfig>;
  customPositiveWheel?: CustomWheelConfig;
  customPenaltyWheel?: CustomWheelConfig;
}

export interface MotivationBoost {
  quote: string;
  message: string;
  actionableNudge: string;
  affirmation: string;
}

export interface CustomPenalty {
  id: string;
  title: string;
  category: 'physical' | 'financial' | 'digital' | 'discipline' | 'custom';
  description: string;
  icon: string;
  intensity: 'mild' | 'moderate' | 'strict';
  isAutoApplied?: boolean;
  timesEnforced: number;
  lastEnforced?: string;
}

export interface CustomReward {
  id: string;
  title: string;
  category: 'treat' | 'entertainment' | 'leisure' | 'purchase' | 'experience' | 'custom';
  description: string;
  icon: string;
  costXp?: number;
  timesClaimed: number;
  lastClaimed?: string;
  isUnlocked?: boolean;
}

export interface ServiceRecord {
  id: string;
  serviceId: string;
  title: string;
  details: string;
  date: string;
  status: 'active' | 'completed' | 'pending';
  category?: string;
  tags?: string[];
  amount?: string;
  referenceNumber?: string;
  documentName?: string;
  documentSize?: string;
  verified?: boolean;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  timestamp: string;
  challengeTitle?: string;
  challengeDay?: number;
  content: string;
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  comments?: CommunityComment[];
  tag?: string;
  isPinned?: boolean;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  text: string;
  likesCount: number;
}

export type MedicineMode = 'simple' | 'professional';
export type MedicineWorkspaceRole = 'personal' | 'caregiver' | 'doctor' | 'pharmacist' | 'clinic';

export interface FamilyCareProfile {
  id: string;
  name: string;
  relation: 'Me' | 'Mother' | 'Father' | 'Child' | 'Pet';
  isPet?: boolean;
  species?: string;
  avatar: string;
  medicinesCount: number;
  permissions?: string[];
}

export interface DoctorPatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  allergies: string[];
  vitals: {
    bp: string;
    heartRate: number;
    temp: string;
    weight: string;
  };
  currentMeds: string[];
  medicalHistory: string[];
  recentReports: string[];
  notes?: string;
}

export interface PharmacyRxOrder {
  id: string;
  patientName: string;
  doctorName: string;
  prescriptionId: string;
  date: string;
  medicines: {
    name: string;
    quantity: number;
    refillsLeft: number;
  }[];
  status: 'pending' | 'ready' | 'dispensed' | 'clarification' | 'rejected';
}

export interface PharmacyInventoryItem {
  id: string;
  name: string;
  strength: string;
  stock: number;
  reorderLevel: number;
  expiryDays: number;
  expiryDate: string;
  batchNumber: string;
  supplier: string;
  storage: string;
  unitPrice?: number;
}

export interface MedicationDoseLog {
  date: string;
  time: string;
  scheduledTime: string;
  status: 'taken' | 'skipped' | 'missed';
  note?: string;
}

export interface DrugInteractionInfo {
  drug: string;
  severity: 'Major' | 'Moderate' | 'Minor';
  note: string;
}

export interface SymptomNote {
  date: string;
  note: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
}

export interface MedicineItem {
  id: string;
  name: string;
  genericName?: string;
  strength: string;
  strengthUnit?: string;
  form: string; // 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'IV' | 'Patch' | 'Ointment' | 'Cream' | 'Inhaler' | 'Spray' | 'Drops' | 'Suppository' | 'Gel' | 'Lotion' | 'Powder' | 'Sachet' | 'Pre-filled syringe'
  formVariant?: string;
  packaging?: string;
  quantityPerPack?: number;
  batchNumber?: string;
  mfgDate?: string;
  expiryDate?: string;
  manufacturer?: string;
  mrp?: number;
  hsnCode?: string;
  scheduleCategory?: 'OTC' | 'Schedule H' | 'Schedule H1' | 'Schedule X' | 'Prescription Only';

  // Patient & Professional Profile
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  patientPhone?: string;
  patientEmail?: string;
  patientAddress?: string;
  emergencyContact?: string;
  allergies?: string[];
  medicalHistory?: string[];
  currentMedications?: string[];
  previousAdverseReactions?: string[];
  familyMedicalHistory?: string[];

  // Prescription Details
  prescriptionNumber?: string;
  prescriptionDate?: string;
  prescriptionType?: 'New' | 'Renewal' | 'Emergency' | 'Follow-up';
  consultationType?: 'In-person' | 'Telemedicine' | 'Home visit';
  doctorName?: string;
  doctorSpeciality?: string;
  condition?: string; // What it is prescribed for
  primaryDiagnosis?: string;
  secondaryDiagnosis?: string;
  icd10Code?: string;
  offLabelJustification?: string;

  // Dosing Schedule
  dosageQuantity: number; // e.g. 1
  dosageUnit: string; // e.g. 'tablet(s)', 'ml', 'drops'
  frequency: string; // 'Once daily' | 'Twice daily' | 'Thrice daily' | '4 times daily' | 'Every 4 hours' | 'Every 6 hours' | 'Every 8 hours' | 'Every 12 hours' | 'Weekly' | 'Monthly' | 'PRN / As needed' | 'Continuous infusion' | 'Tapering' | 'Titration'
  timesPerDay: number;
  specificTimes: string[]; // e.g. ['08:00', '20:00']
  mealTiming: 'With food' | 'Empty stomach' | 'After meals' | 'Before bed' | 'Anytime';
  routeOfAdministration?: string;
  adminInstructions?: string;
  loadingDose?: string;
  maintenanceDose?: string;
  maxDailyDose?: string;
  minEffectiveDose?: string;
  doseAdjustmentCriteria?: string;

  // Course Details
  courseType?: 'Single course' | 'Recurring course' | 'Lifelong' | 'PRN / As needed' | 'Titration course' | 'Tapering course' | 'Rotational' | 'Seasonal' | 'Pulse therapy';
  startDate: string;
  durationDays: number | 'ongoing';
  endDate?: string;
  totalDoses?: number;
  stepDownSchedule?: string;
  planBAlternatives?: string;

  // Special Instructions & Safety
  foodRestrictions?: string[];
  activityRestrictions?: string[];
  storageConditions?: 'Room temperature' | 'Refrigerate (2-8°C)' | 'Protect from light' | 'Protect from moisture' | 'Do not freeze';
  handlingPrecautions?: string;
  missedDoseAction?: string;
  overdoseAction?: string;
  emergencyProtocols?: string;
  drugInteractions?: DrugInteractionInfo[];
  contraindications?: string[];
  precautions?: string[];
  sideEffectsCommon?: string[];
  sideEffectsSerious?: string[];
  blackBoxWarning?: string;

  // Monitoring & Labs
  labTestsRequired?: string[];
  testFrequency?: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  tdmTargetRange?: string;
  vitalSignsMonitoring?: string[];
  reviewDate?: string;

  // Financial & Billing
  costPerUnit?: number;
  costPerDose?: number;
  costPerDay?: number;
  totalCourseCost?: number;
  insuranceCovered?: boolean;
  insurancePolicyNumber?: string;
  copayAmount?: number;
  pharmacyName?: string;
  billNumber?: string;
  paymentMethod?: 'Cash' | 'Card' | 'UPI' | 'Insurance';
  discountApplied?: number;
  taxGst?: number;

  // Inventory Management
  currentStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  supplierDetails?: string;
  stockLocation?: string;
  expiryAlertDays?: number;

  // Reminders & Status
  reminderBeforeMinutes?: number;
  remindMissedDose?: boolean;
  remindRefill?: boolean;
  reminderChannels?: string[];
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  prescriptionPhotoUrl?: string;
  medicinePhotoUrl?: string;
  adherenceRate?: number;
  streakDays?: number;
  symptomNotes?: SymptomNote[];
  dosesLogged: MedicationDoseLog[];
}

