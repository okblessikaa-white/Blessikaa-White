# BLESSIKAA MENSTRUAL CYCLE TRACKER SERVICE — SYSTEM SPECIFICATION & WORKFLOWS

## 1. Service Identity & Core Philosophy
- **Service Name**: Menstrual Cycle Tracker (`🌸`)
- **Service Category**: Personal Services (`Health & Wellness`)
- **Core Principle**: *Simple on the surface, powerful underneath.* Progressive disclosure (Simple → Customize → Advanced/Expert). The first screen answers: *"Where am I in my cycle, what do I need to record today, and what is coming next?"*
- **Design System Alignment**:
  - Primary: Light purple / Lavender (`#6C3FE8`, `#8F67F5`, `#F9F7FD`)
  - Accent: Deeper Purple (`#1E1A3D`, `#352F63`)
  - Day Mode: Very light lavender/white background (`#FAF7FD`) with rounded cards (`rounded-3xl`), soft shadows, and clean typography
  - Dark Mode: Deep purple-black background (`#120F24`) with muted lavender cards (`#1E1A3D`)
  - Standard Blessikaa top navigation and bottom navigation bar

---

## 2. Comprehensive Navigation Hierarchy

```
BLESSIKAA HOME
       │
       ▼
Main Menu
       │
       ▼
Personal Services
       │
       ├── Water Tracker
       ├── Medicine
       ├── Sleep
       ├── Exercise
       ├── Yoga & Meditation
       ├── Mood
       ├── 🌸 Menstrual Cycle (Tap to open)
       ├── Habit Builder
       ├── Journal
       ├── Screen Time
       ├── Goals & Tasks
       └── ...
                    │
                    ▼
          Menstrual Health Home (or First-Use Setup Wizard)
```

---

## 3. First-Use Experience & Non-Blocking Setup Wizard
- **First-Use Screen**: Friendly introductory greeting (*"Understand Your Cycle: Track your periods, symptoms, moods and cycle patterns in one private place"*).
  - Primary Action: `[ SET UP MY CYCLE ]`
  - Secondary Non-Blocking Action: `Set up later` (Enters service in basic exploratory mode).
- **Setup Wizard Stages**:
  1. **Last Period Date Picker**: Interactive calendar selection of the first day of last period.
  2. **Period Duration**: Average period length (stepper or radio buttons: 2, 3, 5, 6, 7, Other custom manual entry).
  3. **Cycle Length**: Typical cycle length (stepper or radio buttons: 21, 24, 28, 30, 35, Irregular).
  4. **Irregular Cycle Sub-Configuration**: Conditional inputs for Shortest Cycle (e.g. 24 days) and Longest Cycle (e.g. 35 days) with dynamic variation tracking.
  5. **Tracking Preferences (Select-What-You-Need Philosophy)**:
     - Core: Period, Flow, Symptoms, Mood, Energy, Sleep.
     - Extended: Cervical Mucus, Basal Body Temperature (BBT), Sexual Activity, Medication, Notes.
  6. **Cycle Reminders**: Configurable push/audio alerts for period approaching (e.g. 2 days before), fertile window opening, ovulation estimate, and optional daily evening logging reminder (e.g. 8:00 PM).
  7. **Privacy & Access Control**: Private-by-default switch, app lock protection, and multi-role sharing configuration (`Nobody`, `Partner`, `Family Member`, `Caregiver`, `Doctor`, `Custom Person`).

---

## 4. Menstrual Health Home Dashboard Architecture
The home screen is strictly organized into progressive cards:
1. **Current Cycle Hero Card**:
   - Current Cycle Day indicator (e.g. *Day 13 of ~28*).
   - Horizontal phase progress bar with node checkpoints (*Period → Follicular → Ovulation → Luteal → Next Period*).
   - Next period countdown (e.g. *~15 days*).
2. **Quick Log Action Card (`🌸 LOG TODAY`)**:
   - Fast access to 1-tap logging for Period status, Flow intensity, Symptoms, Mood, Energy, and Notes.
3. **Module Grid**:
   - `📅 Cycle Calendar`: Full month view with color-coded markers (🩸 Period, 🟣 Fertile Window, ⭐ Estimated Ovulation).
   - `📊 Insights & Analytics`: Cycle length trends, period regularity score, symptom frequencies, and mood correlations.
   - `🔔 Smart Reminders`: Upcoming alerts banner.
   - `💗 Pregnancy / TTC Mode`: Seamless mode transformation for Trying to Conceive, Pregnancy tracking (weeks/days, EDD, prenatal vitals), Postpartum, or Paused tracking.

---

## 5. Daily Logging Engine & Sub-Modules
- **Log Today Form**:
  - **Period Toggle**: No Period / Period Active.
    - If toggled active on Day 1: Prompts *"Is this the start of your period? [Yes, Start Period] [No, Continuing]"*.
    - If ending: Prompts *"Is your period finished? [End Period]"*.
  - **Flow Intensity**: None, Spotting, Light, Medium, Heavy, Very Heavy (with optional product used: Pad, Tampon, Menstrual Cup, Period Underwear, Other).
  - **Symptom Tracker**:
    - Common: Cramps, Headache, Bloating, Acne, Fatigue, Back pain, Nausea, Breast tenderness.
    - Extended: Dizziness, Food cravings, Insomnia, Constipation, Diarrhea, Pelvic pain, + Add Custom Symptom.
  - **Mood Picker**: Emoji-based single-tap selection (😄 Great, 🙂 Good, 😐 Neutral, 😔 Low, 😣 Stressed/Irritable).
  - **Energy Level**: Low, Normal, High.
  - **Custom Field Engine**: Dynamically injected user-defined trackers (e.g. Cervical Mucus selection, Basal Temperature numeric inputs, Pain scale 1-10).

---

## 6. Prediction Engine & Medical Disclaimers
- **Prediction Logic**:
  - Calculates rolling weighted averages across historical cycle records.
  - Identifies estimated Fertile Window ($Ovulation - 5\text{ days}$ to $Ovulation + 1\text{ day}$) and Ovulation Day ($CycleLength - 14\text{ days}$ standard or customized based on luteal phase).
- **Uncertainty & Safety**:
  - Always rendered as **"Estimated / Predicted"** rather than guaranteed dates.
  - Includes clear clinical disclaimers stating predictions are informational and not diagnostic or contraceptive guarantees.

---

## 7. Analytics & Correlation Engine
- **Cycle Regularity Score**: Percentage score based on standard deviation of cycle lengths across the last 3 to 12 cycles.
- **Symptom Distribution Charts**: Bar charts highlighting frequency percentages (e.g. Cramps 72%, Fatigue 51%) and common phase clustering (Days 1–2).
- **Mood-Cycle Correlation Matrix**: Day-by-day mood mappings uncovering subconscious emotional and physical patterns.

---

## 8. Exporting & Role-Based Sharing
- **Doctor / Clinical Summary**:
  - Configurable timeframe (Last cycle, Last 3 cycles, Last 6 months, Custom range).
  - Selectable data inclusions (Cycle dates, Flow, Symptoms, Mood, Notes, Vitals).
  - One-tap secure PDF generation & export.
- **Partner / Family Sharing**:
  - Role-based permissions (`View Only`, `View + Contribute`, `Full Access`).
  - Optional expiration timestamps with instant 1-tap revocation.

---

## 9. Reusable Service Architecture
Implemented using Blessikaa's centralized modular engines:
1. `Profile Engine`: User cycle preferences, irregular flags, baseline numbers.
2. `Cycle Engine`: Cycle boundary detection, start/end dates, day indexing.
3. `Period Engine`: Flow logging, products, intensity tracking.
4. `Symptom Engine`: Multi-select tagged symptoms with custom extension hooks.
5. `Mood Engine`: Emotional state mapping and correlation matrices.
6. `Prediction Engine`: Statistical estimation of ovulation and fertile windows.
7. `Reminder Engine`: Audio, push, and notification triggers.
8. `Calendar Engine`: Monthly visual grid with multi-layer marker overlays.
9. `Analytics Engine`: Regularity scores, bar visualizers, trend lines.
10. `Sharing & Privacy Engine`: Granular permissions, PIN/App-lock protection, PDF report compilation.
11. `Custom Field Engine`: Configurable schema extensions (ratings, dropdowns, numbers, booleans).
