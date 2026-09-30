# BLESSIKAA MASTER ARCHITECTURE & DEVELOPMENT BRAIN

## 1. Executive Summary & Core Philosophy
**Blessikaa** is a complete, unified life-care, service, organization, productivity, family, personal-management, and habit-transformation ecosystem.
- **Tagline**: Build a blessed life
- **Platforms**: Android Native App (Capacitor/Kotlin), Responsive Web App (React 18 + Tailwind), Admin Web Portal, and Future Blessikaa AI Agent Companion.
- **Core Engine**: 21-Day Neuroplasticity Loop (Resistance $\to$ Synaptic Strengthening $\to$ Automaticity) combined with 69+ real-world life services.

---

## 2. Master Feature & Screen Knowledge Base

### Screen 1: Home Dashboard (`HomeScreen.tsx`)
- **Status**: `PRODUCTION READY`
- **Layout & Structure**:
  - Header with Audio Synthesizer Toggle, Theme Dark/Light Switch, Notification Bell, and Settings Modal trigger.
  - Consolidated Welcome & Mindset Box: Displays dynamic greeting, user daily streak, integrated morning affirmation, and neuroplasticity guidance (without unnecessary segmented label clutter).
  - Two Primary Hub Triggers:
    - **Challenges Hub Button**: Leads to the 3-tier challenge selection matrix.
    - **Services Hub Button**: Leads to the 69+ ecosystem life services grid.
  - Floating Action Drawer: Exclusively displayed on the home screen to access penalties/rewards, notifications, and settings without overlapping sub-flows.

### Screen 2: Challenges Hub (`ChallengesHubScreen.tsx`)
- **Status**: `PRODUCTION READY`
- **Visual Hierarchy & Logic**:
  - **Big Hero Button**: **Blessika Challenges** (69+ Curated Master Pathways with distinct domain icons).
  - **Two Equal Secondary Buttons**:
    - **Community Challenges**: Explores user-shared and coach-created pathways with participant metrics.
    - **Create Your Challenges**: Launches the custom 21-day challenge architect with AI generation and manual step builders.
  - **Active Pathway Resume Box**: Shows active streak count and direct one-click continuation of current day progress.

### Screen 3: Blessika Challenges Catalog (`AllChallengesScreen.tsx`)
- **Status**: `PRODUCTION READY`
- **Components & Features**:
  - 69+ Expert-crafted transformation pathways with domain-specific icons (Health, Productivity, Mental Health, Relationships, Learning, Fitness, Finance).
  - Live search and filter pills.
  - Day 1 preview micro-box and direct 21-day pathway enrollment.

### Screen 4: Community Challenges Feed (`CommunityChallengesScreen.tsx`)
- **Status**: `PRODUCTION READY`
- **Components & Features**:
  - Peer pathways with creator avatars, verified badges, ratings, participant counters, and applaud/like mechanics.
  - Instant enrollment into community pathways with full 21-day milestone synchronizations.

### Screen 5: Challenge Builder (`CreateChallengeScreen.tsx`)
- **Status**: `PRODUCTION READY`
- **Features**:
  - Manual 21-day task builder with "Apply Task to All 21 Days" time-saving shortcut.
  - AI Challenge Architect modal for automated personalized curriculum generation.
  - Audience visibility toggle: Self-only, Community, or Both.

### Screen 6: 21-Day Interactive Pathway Journey (`ChallengePathwayScreen.tsx`)
- **Status**: `PRODUCTION READY`
- **Core State Machine & Mechanics**:
  - 21 interactive node circles across 3 distinct 7-day neuroplasticity phases.
  - Daily challenge task modal with countdown timer, audio synthesizer chimes, micro-journaling, and proof checklist.
  - Reward gamification: Scratch card unveil, Daily Wheel spin, and streak freeze protections.
  - Milestone unlock animations & celebration sounds.

### Screen 7: Services Hub (`ServicesHubScreen.tsx` & `ServiceModal.tsx`)
- **Status**: `PRODUCTION READY`
- **Features**:
  - 69+ Personal life services categorized under Legal, Financial, Health, Vehicle, Home, Digital, Career, etc.
  - OCR document scanner interface, verifiable credential vault, and encrypted record generator.

---

## 3. Future Blessikaa AI Agent — Tool Registry Specification
*(Designed for future zero-friction activation with Gemini API / LangChain / Function Calling)*

### Tool 1: `enroll_in_challenge`
- **Description**: Enrolls the user into a 21-day Blessikaa or Community pathway.
- **Inputs**: `challenge_id` (string), `custom_start_date` (optional string)
- **Permissions**: User authenticated
- **Confirmation Required**: False
- **Reversible**: True

### Tool 2: `log_daily_progress`
- **Description**: Marks the current day task as completed, records journal reflection, and calculates streak.
- **Inputs**: `challenge_id` (string), `day_number` (integer 1-21), `reflection_note` (optional string), `time_spent_minutes` (integer)
- **Permissions**: User ownership
- **Confirmation Required**: False
- **Side Effects**: Increments user streak, triggers milestone reward logic.

### Tool 3: `generate_ai_challenge_pathway`
- **Description**: Synthesizes a scientifically structured 21-day habit curriculum using neuroplasticity principles.
- **Inputs**: `goal_description` (string), `intensity` ('gentle' | 'medium' | 'intense'), `category` (string)
- **Outputs**: Complete 21-day curriculum with milestones for Days 7, 14, and 21.

### Tool 4: `query_services_vault`
- **Description**: Searches the user's 69+ life services vault and OCR document records.
- **Inputs**: `service_id` (string), `query` (string)
- **Permissions**: Strict user private access control

---

## 4. Architectural Decision Records (ADR)
1. **Decision: Home Screen Hierarchy Separation**:
   - *Reason*: Users needed clear separation between Habit Transformation Pathways and Personal Life Services. Replacing cluttered matrices with two dedicated entrance hubs improved visual hierarchy and reduced cognitive overload.
2. **Decision: 3-Tier Challenges Hub**:
   - *Reason*: Giving prominent focus to official Blessikaa Challenges while keeping Community and Create options equally accessible creates clear choice architecture without hiding capabilities.
3. **Decision: Parallel AI Knowledge Track**:
   - *Reason*: Building machine-readable schemas, tool registries, and workflow rules during frontend development ensures immediate AI agent integration without needing to reverse-engineer business logic later.
4. **Decision: Challenges Hub Symmetrical Left-Aligned Visual Balance**:
   - *Reason*: Challenge category cards in the Challenges Hub now utilize a unified left-aligned, vertically centered icon structure matching the active pathway box. Heavy boxed background arrows were replaced with clean inline link buttons, and redundant labels like "Official Catalog" were removed to maintain minimalist, high-contrast clarity.
5. **Decision: Daily Challenge Task Screen Compact Viewport & Modal Intention Flow**:
   - *Reason*: Users require a zero-scroll experience on mobile when performing their daily challenge tasks. The "Skip scratch" and "Share" buttons were relocated directly below the scratch card, checkboxes were standardized to uniform 20x20px dimensions, and the checklist padding was tightened. Mood and energy selection was transformed into an interactive modal pop-up triggered immediately upon clicking a day box. Time spent tracking and optional proof upload were nested as an integrated scrollable inner container within the Action Checklist card, preserving compact vertical rhythm.
