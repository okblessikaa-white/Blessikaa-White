import { ALL_69_CHALLENGES } from './all69Challenges';
import { INITIAL_COMMUNITY_CHALLENGES } from './communityChallengesData';
import { COMMON_DRUG_DATABASE, INITIAL_MEDICINES } from './pharmacyData';

export interface AIKnowledgeContext {
  appName: string;
  formerName: string;
  version: string;
  corePhilosophy: string;
  neuroplasticityFormula: string;
  totalBlessikaChallenges: number;
  totalCommunityChallenges: number;
  servicesCatalogCount: number;
  modesSupported: ('simple' | 'professional')[];
  pharmacyModule: {
    simpleModeFields: string[];
    professionalModeFields: string[];
    aiScanSupport: boolean;
    drugInteractionEngine: boolean;
  };
}

export const IKAA_AI_KNOWLEDGE_BASE = {
  systemOverview: {
    name: 'iKAA',
    formerName: 'Blessikaa',
    aiEngineName: 'iKAA AI',
    tagline: 'Build a blessed life',
    vision:
      'A comprehensive life-care, service, personal management, and habit transformation ecosystem built on 21-day neuroplasticity milestones, habit stacking, and 69+ real-world services with dual Simple & Professional modes.',
    architecture: {
      twoModeSystem: {
        description:
          'Every service within the iKAA ecosystem supports a dual-mode interface: Simple Mode (streamlined for patients, families, and everyday users) and Professional Mode (advanced clinical and administrative parameters for pharmacists, clinicians, and specialists).',
        configurability:
          'All fields are modular, optional, and user-configurable. User preferences are automatically remembered.',
      },
      navigationFlow: [
        'Home Screen: Header with audio/theme/notification controls, combined welcome card with daily affirmations & neuroplasticity tips, and four prominent standardized action buttons: Challenges, Services, Daily Lucky Wheel, and Day X Action / Scratch Card.',
        'Challenges Menu (Challenges Hub): Big Hero button for Blessika Challenges (68+ curated catalog), and two equal-width buttons for Community Challenges and Create Your Challenges.',
        'Blessika Challenges Screen: 69+ master habit pathways displayed as clean, standardized buttons identical in size, appearance, and purple Lucide vector icons to the Home Screen action buttons, with streamlined single-tap start.',
        'Community Challenges Screen: Community curated challenges with creators, participant counts, ratings, and instant 21-day enrollment.',
        'Create Challenge Screen: Manual 21-day builder with "apply to all" speed shortcut, AI challenge architect, icon selector, and audience sharing.',
        'Services Hub: 69+ personal life services displayed as standardized buttons matching Home Screen buttons in size, appearance, and purple Lucide vector icons, with a streamlined zero-clutter top search bar and integrated back navigation.',
        'Unified Dashboards & Sub-Services: Standardized button system applied across all personal service dashboards (Menstrual Cycle, Personal Finance, Pharmacy & Rx) featuring dual-border containers, gradient vector icon badges, bold typography, subtitles, and right-hand action arrows.',
        'Pharmacy & Rx System: Comprehensive medication management with 1-tap adherence logging, drug interaction checks, low-stock reorder triggers, and dual Simple/Pro forms.',
      ],
    },
  },
  challengesCount: ALL_69_CHALLENGES.length,
  communityCount: INITIAL_COMMUNITY_CHALLENGES.length,
  pharmacyService: {
    name: 'Medicine & Rx Management Service',
    status: 'ACTIVE_PRODUCTION',
    rolesSupported: ['personal', 'caregiver', 'doctor', 'pharmacist', 'clinic'],
    progressiveArchitecture: {
      designPhilosophy: 'Simple on the surface, powerful underneath.',
      workspaceEngine: {
        personal: 'Clean card-based personal cabinet, 1-tap taken logger, quick snooze, refill manager, side effect reporter',
        caregiver: 'Multi-profile dependent management (Children, Elderly Parents, Pets/Veterinary with species & weight)',
        doctor: 'Clinical practitioner dashboard, active patient roster, ICD-10 Rx builder with digital signature',
        pharmacist: 'Licensed pharmacy dispensing queue with verification workflow, FEFO batch expiry and reorder thresholds',
        clinic: 'Institutional multi-bed / multi-patient management with vital tracking and care team communication',
      },
      addMedicineSmartWizard: {
        architecture: 'Unified Blessikaa Medicine Engine with Dynamic Form Builder & Rule Engine (Mode Select -> Form Customizer -> Progressive Filling -> Review)',
        modes: [
          'Simple (🌱 5-10 essential fields, 30-60s fast add for personal tracking)',
          'Advanced (👨‍👩‍👧 Caregivers, dependents, allergy alerts, cabinet stock & storage)',
          'Expert (🩺 Doctors, pharmacists, ICD-10 coding, lab monitoring & regulatory batches)',
          'Custom (⚙️ User-configured field selections and conditional triggers)',
        ],
        presets: ['Personal', 'Caregiver', 'Doctor', 'Pharmacist', 'Hospital/Clinic', 'Custom'],
        ruleEngine: [
          'Injectable Formulation -> Automatically reveals Route of Admin & Cold Storage (2-8°C)',
          'Tapering Course -> Automatically activates Step-Down Schedule Protocol',
          'Controlled Substance (Schedule H/H1/X) -> Enforces Rx Number and Prescriber credentials',
          'Therapeutic Drug Monitoring (IV/Biologics) -> Activates Target Biomarker Lab Panels',
        ],
        builderCategories: [
          'Basic Medication Info (Name, Strength, Form, Variant, Batch, Schedule Category)',
          'Patient & Family Care (Blue Dependent Picker, Age, Gender, Allergies, Emergency Contact)',
          'Prescription & Clinical (Condition, Doctor, Rx ID, ICD-10 Diagnosis, Off-label Justification)',
          'Dosage & Schedule (Amount, Unit, Frequency, Specific Times, Meal Timing, Route, Titration)',
          'Course & Duration (Start Date, Duration, End Date, Regimen Type, Step-down Schedule)',
          'Safety & Storage (Storage Conditions, Missed Dose Protocol, Black Box Warning, Food Precautions)',
          'Monitoring & Labs (Required Lab Tests, Test Frequency, TDM Target Range, Review Date)',
          'Cabinet & Inventory (Current Stock, Low Stock Threshold, Reorder Quantity, Cabinet Location)',
          'Billing & Insurance (Cost Per Unit, Insurance Covered, Pharmacy Name)',
          'Reminders & Alerts (Dose Chimes, Advance Notice Minutes, Missed Dose Alert, Refill Alert)',
        ],
        autosaveDraftEngine: 'Real-time localStorage draft persistence with one-tap restore and timestamp indicator',
        blueFamilyPopupIntegration: 'Clean blue modal for seamless dependent and pet assignment',
      },
      detailViewTabs: [
        '1. Overview (Dose instructions, food timing, doctor info, rapid 1-tap logger)',
        '2. Schedule (Specific times, next dose countdown, full duration tracker)',
        '3. Safety & Interactions (Drug-drug cross-match, contraindications, food/alcohol rules)',
        '4. Lab & Monitoring (Target biomarkers, e.g. HbA1c, BP, Renal function panels)',
        '5. Documents (Uploaded Rx scans, lab reports, discharge summaries)',
        '6. History (Full timestamped dose compliance & streak audit log)',
        '7. Cost & Refill (Insurance copay, price comparison, pharmacy auto-refill order)',
        '8. Care Team Sharing (Export PDF audit report, grant caregiver access)',
      ],
    },
    aiAgentTools: [
      {
        name: 'log_medication_dose',
        description: 'Log a scheduled medication dose as taken or skipped with timestamp',
        parameters: { medicineId: 'string', status: 'taken | skipped', note: 'string?' },
      },
      {
        name: 'check_drug_interactions',
        description: 'Cross-reference active medications against contraindications and adverse reactions',
        parameters: { medicineIds: 'string[]', newDrugName: 'string' },
      },
      {
        name: 'request_pharmacy_refill',
        description: 'Trigger a reorder request to the preferred pharmacy when stock is below threshold',
        parameters: { medicineId: 'string', quantity: 'number', pharmacyId: 'string?' },
      },
      {
        name: 'report_side_effect',
        description: 'Record an adverse symptom reaction and trigger emergency/clinical alerts if severe',
        parameters: { medicineId: 'string', symptom: 'string', severity: 'Mild | Moderate | Severe' },
      },
    ],
    sampleDatabaseItems: COMMON_DRUG_DATABASE.length,
  },
  infiniteHabitEngine: {
    name: '21-Day Challenge → Infinite Habit Continuum Engine',
    philosophy: '21 days to start. A lifetime to continue. Zero artificial ceilings.',
    architecture: {
      singleObjectContinuum: 'Challenge -> Milestone 21 -> Habit Continuum (Days 22 to 1,000+) stored in a single persistent UserChallengeProgress record with on-demand DayPlan generation.',
      phases: {
        phaseA_Formation: 'Days 1–21: Foundation wiring with scratch cards, daily logs, and reflection notes.',
        phaseB_Continuum: 'Days 22+: Habit Mode with configurable Habit Rules, interactive checklists, photo proofs, mood tracking, and landmark milestones.',
      },
      post30DayInfiniteContinuum: {
        problemResolved: 'Eliminated static 30-day array clamps that previously prevented progression past Day 30.',
        continuumCycles: [
          { id: 'cycle-1', label: 'Days 1–30', range: [1, 30], title: 'Foundation & Genesis', badge: '🌱' },
          { id: 'cycle-2', label: 'Days 31–60', range: [31, 60], title: 'Subconscious Solidification', badge: '⚡' },
          { id: 'cycle-3', label: 'Days 61–90', range: [61, 90], title: 'Discipline & Identity Shift', badge: '🎯' },
          { id: 'cycle-4', label: 'Days 91–120', range: [91, 120], title: 'Centurion Automaticity', badge: '💎' },
          { id: 'cycle-5', label: 'Days 121–180', range: [121, 180], title: 'Habit Fortress & Half-Year', badge: '👑' },
          { id: 'cycle-6', label: 'Days 181–365', range: [181, 365], title: 'Annual Sovereign Flow', badge: '🌟' },
          { id: 'cycle-7', label: 'Days 366–1000', range: [366, 1000], title: 'Lifelong Continuum Legacy', badge: '🌌' },
        ],
        displayModes: {
          cycleMode: 'Paginates habits in structured 30-to-60 day neuroplasticity cycles with clear milestone focus.',
          streamMode: 'Continuous infinite scroll stream with "+ Load Next 30 Days" dynamic horizon expansion.',
        },
        autoAdvancementEngine: {
          completionModal: 'Direct "Advance to Day X →" action instantly steps the mission workspace forward upon task completion.',
          rewardModal: 'Immediate one-tap leap forward from coin/XP claim dialog to the subsequent day plan.',
          heroPathwayCard: 'Dynamic CTA button that automatically switches from "Complete Today" to "Advance to Day X →" once current day is finished.',
          dayPlanSynthesis: 'HabitContinuationEngine mathematically generates contextualized titles, neuroscience insights, and actionable task checklists for any integer day (1 to 1000+).',
        },
        futureDayAccess: {
          futurePreviewModal: 'Allows inspecting upcoming day roadmaps, neuroscience rationales, and provides a "Practice Early Today" bypass.',
          lockedDayModal: 'Gracefully informs users of locked progression while permitting intentional early training.',
        },
      },
      milestones: [
        { day: 21, title: 'Habit Formation', badge: '🏆', xp: 200 },
        { day: 30, title: 'First Month Consistency', badge: '🌱', xp: 300 },
        { day: 50, title: 'Routine Solidified', badge: '⚡', xp: 500 },
        { day: 75, title: 'Discipline Master', badge: '🎯', xp: 750 },
        { day: 100, title: 'Centurion Habit', badge: '💎', xp: 1000 },
        { day: 180, title: 'Half-Year Mastery', badge: '👑', xp: 1800 },
        { day: 365, title: 'One Year Legend', badge: '🌟', xp: 3650 },
        { day: 500, title: 'Unshakable Identity', badge: '🏛️', xp: 5000 },
        { day: 1000, title: 'Lifelong Transmutation', badge: '🌌', xp: 10000 },
      ],
      streakProtection: {
        shieldsPerHabit: 2,
        restDaysSupported: true,
        missedDayBehaviors: ['Flexible (Grace Days)', 'Strict'],
        recoveryOptions: ['Complete Missed Day', 'Mark as Rest Day 🌙', 'Use Streak Shield 🛡️'],
      },
      views: ['Timeline / Infinite Grid', 'Monthly Execution Calendar Matrix', 'Performance Analytics', 'Milestones List', 'Habit Rules Configuration'],
      dailyTaskScreenUX: {
        scratchCardPlacement: 'Skip scratch and Share buttons located immediately beneath the scratch card',
        checklistDensity: 'Compact viewport-optimized checklist with uniform checkbox dimensions (20x20px)',
        moodEnergyPrompt: 'Interactive modal pop-up triggered automatically upon clicking a day box to set mood and time investment',
        nestedScrollableSection: 'Time spent chip picker and optional photo proof integrated into scrollable action checklist card container',
      },
    },
    aiAgentTools: [
      {
        name: 'transition_challenge_to_habit',
        description: 'Transition a completed 21-day challenge into infinite habit mode and unlock Day 22',
        parameters: { challengeId: 'string' },
      },
      {
        name: 'log_habit_day',
        description: 'Record completion of day 22+ habit step with checklist items, duration, and mood',
        parameters: { challengeId: 'string', day: 'number', completedTasks: 'string[]', mood: 'string', minutes: 'number' },
      },
      {
        name: 'advance_to_next_habit_day',
        description: 'Step the user forward to the next unlocked day plan in the infinite continuum',
        parameters: { challengeId: 'string', targetDay: 'number' },
      },
      {
        name: 'get_continuum_cycle_data',
        description: 'Retrieve milestone info and day plans for a specific 30-day continuum cycle',
        parameters: { cycleId: 'string', challengeId: 'string' },
      },
      {
        name: 'practice_future_day_early',
        description: 'Unlock and open an early preview session for an upcoming habit day',
        parameters: { challengeId: 'string', day: 'number' },
      },
      {
        name: 'use_streak_shield',
        description: 'Apply an active streak shield to protect streak from a missed day',
        parameters: { challengeId: 'string', day: 'number' },
      },
      {
        name: 'update_habit_rules',
        description: 'Customize frequency, preferred time, minimum minutes, and rest day allowances',
        parameters: { challengeId: 'string', rules: 'HabitRules' },
      },
    ],
  },
  wheelCustomizerSystem: {
    name: 'Blessikaa Gamified Wheels & Triangle Customizer Engine',
    philosophy: 'Dynamic gamification with customizable positive incentives and compassionate accountability penalties.',
    architecture: {
      wheelTypes: {
        positiveWheel: {
          description: 'Spin for daily bonus rewards, coins, streak shields, XP boosts, and celebration tokens.',
          defaultTriangles: 8,
          range: '4 to 12 triangles',
          rewardTypes: ['coins', 'xp', 'streak_shield', 'badge', 'custom'],
        },
        penaltyWheel: {
          description: 'Fair play accountability wheel activated on missed daily commitments or habit slip-ups.',
          defaultTriangles: 8,
          range: '4 to 12 triangles',
          penaltyTypes: ['task', 'reflection', 'workout', 'coin_deduct', 'custom'],
        },
      },
      triangleItemSchema: {
        id: 'string (unique item identifier)',
        title: 'string (label on wheel segment)',
        icon: 'string (visual emoji or icon symbol)',
        value: 'number (coins/xp/minutes or numerical weight)',
        type: 'string (category / action tag)',
        color: 'string (hex or CSS color for the slice gradient)',
      },
      settingsAccess: {
        entryPoints: [
          'Settings icon button located directly ahead or beside the Coins pill on Navbar',
          'Settings icon button beside Coins in Daily Challenge Task Screen header',
          'Settings icon button beside Coins in Challenge Pathway Screen header',
          'Wheel Customizer button inside Daily Wheel Screen top-right toolbar',
          'Direct click on the Coins display pill across screens opens Settings with Wheel Customizer tab',
        ],
        tabs: ['Wheels (Positive & Penalty)', 'Preferences', 'Data & APK'],
      },
    },
    aiAgentTools: [
      {
        name: 'get_wheel_configuration',
        description: 'Retrieve current custom positive and penalty wheel configurations including triangle count and slices',
        parameters: { wheelType: 'positive | penalty' },
      },
      {
        name: 'update_wheel_triangles',
        description: 'Update the number of triangles (4-12) or edit text, icon, and colors of wheel triangles',
        parameters: {
          wheelType: 'positive | penalty',
          triangleCount: 'number (4-12)',
          items: 'WheelTriangleItem[]',
        },
      },
      {
        name: 'spin_gamified_wheel',
        description: 'Execute a verified random spin on either positive or penalty wheel and apply outcome',
        parameters: { wheelType: 'positive | penalty' },
      },
    ],
  },
  menstrualCycleService: {
    name: 'Menstrual Cycle Tracker',
    icon: '🌸',
    category: 'Personal Services (Health & Wellness)',
    philosophy: 'Simple on the surface, powerful underneath. Where am I in my cycle, what do I need to record today, and what is coming next?',
    entryFlow: 'BLESSIKAA HOME → Main Menu → Personal Services → 🌸 Menstrual Cycle',
    designSystem: {
      primary: '#6C3FE8 / #8F67F5 (Lavenders & Purples)',
      backgroundDay: '#FAF7FD / #FFFFFF',
      backgroundDark: '#120F24 / #1E1A3D',
      components: 'Rounded-3xl cards, soft shadows, large touch targets, minimal charts, unified Blessikaa navigation',
    },
    architecture: {
      firstUseWizard: {
        nonBlocking: true,
        steps: [
          '1. Last Period Start Date (Interactive Calendar)',
          '2. Period Duration (2, 3, 5, 6, 7, or custom length)',
          '3. Typical Cycle Length (21, 24, 28, 30, 35, or Irregular)',
          '4. Irregular Cycle Setup (Shortest & Longest cycle variation limits)',
          '5. Tracking Preferences (Period, Flow, Symptoms, Mood, Energy, Sleep, Cervical Mucus, BBT, Sex, Meds, Notes)',
          '6. Cycle Reminders (Approaching period, fertile window, ovulation, daily reminder time)',
          '7. Privacy Setup (Private by default, app lock, role-based sharing: Nobody, Partner, Caregiver, Doctor)',
        ],
      },
      dashboardModules: [
        'Current Cycle Hero Card (Cycle Day, Horizontal phase timeline, countdown to next period)',
        'Log Today Quick Action (Period, Flow, Symptoms, Mood, Energy, Notes)',
        'Cycle Calendar (Color-coded markers for period 🩸, fertile window 🟣, ovulation ⭐)',
        'Cycle & Symptom Insights (Average cycle, period length, regularity score %, symptom clustering)',
        'Mood & Cycle Correlation Matrix',
        'Period History & Manual Record Correction',
        'Pregnancy / TTC Mode (Weeks/Days gestation, EDD, prenatal vitals)',
        'Clinical Summary & PDF Export for Doctors',
        'Granular Partner / Family Sharing with Instant Revocation',
      ],
      aiAgentTools: [
        {
          name: 'log_cycle_daily_entry',
          description: 'Log daily period flow, symptoms, mood, energy, and notes for the active cycle',
          parameters: { date: 'string', isPeriod: 'boolean', flow: 'string?', symptoms: 'string[]', mood: 'string?', notes: 'string?' },
        },
        {
          name: 'get_cycle_predictions',
          description: 'Calculate statistical predictions for next period start, ovulation day, and fertile window',
          parameters: { userId: 'string', includeConfidenceInterval: 'boolean' },
        },
        {
          name: 'switch_tracking_mode',
          description: 'Switch between Cycle Tracking, TTC, Pregnancy, Postpartum, or Paused modes',
          parameters: { mode: 'cycle_tracking | ttc | pregnancy | postpartum | paused', metadata: 'object?' },
        },
        {
          name: 'generate_clinical_cycle_report',
          description: 'Compile an exportable PDF/JSON health summary of recorded cycles, symptoms, and vitals',
          parameters: { rangeMonths: 'number', includeNotes: 'boolean', includeSymptoms: 'boolean' },
        },
      ],
    },
  },
  universalFormEngine: {
    name: 'Universal Form Builder & Smart Field Engine',
    status: 'ACTIVE_PRODUCTION',
    architecture: {
      philosophy: 'Single schema-driven form engine powering all 69+ ecosystem services instead of duplicate components',
      supportedFieldTypesCount: 38,
      categories: [
        'basic_text',
        'numbers_finance',
        'date_time',
        'selection_choices',
        'contact_location',
        'media_capture',
        'domain_entities',
        'workflow_governance',
      ],
      layoutModes: ['simple', 'standard', 'expert', 'custom'],
      rolesSupported: ['user', 'professional', 'admin', 'sub_account'],
      features: [
        'Standardized 38+ input components with integrated validations',
        'Real-time conditional logic engine (equals, contains, greater_than, is_empty, etc.)',
        'Multi-device simulator (Mobile 375px, Tablet 768px, Desktop)',
        'Theme tester (Light/Dark mode)',
        'Role-Based Access Control (RBAC who can view, edit, approve)',
        'Automated proof attachment (photo, document, GPS coordinates, signature)',
        'Immutable submission audit logging',
        'One-tap Smart Template group insertion (Medicine, Property, Tasks, Payments, etc.)',
      ],
      aiAgentTools: [
        {
          name: 'create_universal_form_schema',
          description: 'Generate or update a dynamic service form schema with custom fields, validation rules, and conditional logic',
          parameters: { title: 'string', serviceCategory: 'string', fields: 'FormFieldConfig[]', layoutMode: 'string' },
        },
        {
          name: 'evaluate_form_conditional_logic',
          description: 'Compute reactive visibility, requirement, and disabled states for a set of form values',
          parameters: { schemaId: 'string', formValues: 'object' },
        },
        {
          name: 'submit_universal_form_entry',
          description: 'Validate and persist an entry for any configured form schema into the encrypted audit vault',
          parameters: { formId: 'string', values: 'object', persona: 'string', proofs: 'object[]?' },
        },
      ],
    },
  },
  personalFinanceService: {
    name: 'Personal Finance & Wealth Management System',
    status: 'ACTIVE_PRODUCTION',
    modes: ['simple', 'standard', 'expert', 'custom'],
    capabilities: [
      'Universal Net Worth Live Calculation (Assets - Liabilities)',
      'Multi-Account Financial Ledger (Bank, Digital Wallet, Cash, Credit Card, Brokerage)',
      'Universal Finance Adder Modal with 18 categorized financial record types',
      'AI OCR Receipt & Bill Scanner with human verification safeguards',
      'Monthly Budgeting Engine with 70%, 90%, 100% threshold alert notifications',
      'Recurring Subscription & Auto-Pay Bill Tracking',
      'Milestone-Driven Savings Goals with monthly deposit simulator',
      'Peer-to-Peer Lending & Borrowing (Owed to Me vs I Owe tracker)',
      'Loan Facilities & Mortgage EMI Tracking',
      'Investment Portfolio & Physical Tangible Asset Registry',
      'Family Allowances & Dependent Stipends with payment receipt logging',
      'Financial Health Indicator (78/100 composite index)',
      'Immutable Audit Log & Multi-Format Data Portability (PDF, CSV, JSON)',
    ],
    aiTools: [
      {
        name: 'log_financial_transaction',
        description: 'Log an income, expense, or transfer with optional split items, tax, and OCR verification',
        parameters: { type: 'income|expense|transfer', amount: 'number', category: 'string', accountId: 'string', merchant: 'string?', date: 'string?' },
      },
      {
        name: 'scan_financial_receipt_ocr',
        description: 'Extract merchant, line items, tax, and total amount from receipt photo with human confirmation',
        parameters: { receiptImage: 'string', targetAccountId: 'string' },
      },
      {
        name: 'calculate_net_worth_breakdown',
        description: 'Compute liquid accounts, investments, physical assets, loans and net worth for a profile',
        parameters: { profileId: 'string' },
      },
      {
        name: 'check_budget_adherence',
        description: 'Evaluate category spending against monthly budget limits and trigger warnings',
        parameters: { month: 'string', category: 'string?' },
      },
    ],
  },
  neuroplasticityScience: {
    day1to7: 'Phase 1: Overcoming Inertia & Resistance - High cognitive friction as basal ganglia begins encoding the new loop.',
    day8to14: 'Phase 2: Synaptic Strengthening & Consolidation - Lower friction, automaticity begins taking over from prefrontal control.',
    day15to21: 'Phase 3: Automaticity & Identity Integration - The behavior becomes your default baseline routine.',
    day22plus: 'Phase 4: Infinite Habit Continuum - Consolidation into permanent identity where skipping becomes harder than performing.',
  },
  categories: [
    'Personal Growth',
    'Health',
    'Learning',
    'Lifestyle',
    'Productivity',
    'Mental Health',
    'Relationships',
    'Self Love',
    'Positivity',
    'Adventure',
    'Fitness',
    'Finance',
    'Creativity',
  ],
};

// Export backward compatibility alias
export const BLESSIKAA_AI_KNOWLEDGE_BASE = IKAA_AI_KNOWLEDGE_BASE;
