# Workflow Specification: Infinite Habit Continuum & Post-30-Day Progression

## 1. Context & Objective
Provides an infinite progression state machine allowing users to seamlessly transition from 21-day habit initiation into years of daily practice without hitting any hardcoded visual or logical limits.

---

## 2. State Transition Machine

```
[Challenge Enrolled (Days 1–21)]
          │
          ▼  (User completes Day 21)
[Milestone 21 Celebration & Habit Bridge]
          │
          ▼
[Habit Continuum Mode (Days 22+)]
   ├── Cycle 1 (Days 1–30): Foundation & Genesis
   ├── Cycle 2 (Days 31–60): Subconscious Solidification
   ├── Cycle 3 (Days 61–90): Discipline & Identity Shift
   ├── Cycle 4 (Days 91–120): Centurion Automaticity
   ├── Cycle 5 (Days 121–180): Habit Fortress & Half-Year
   ├── Cycle 6 (Days 181–365): Annual Sovereign Flow
   └── Cycle 7 (Days 366–1000): Lifelong Continuum Legacy
```

---

## 3. Step-by-Step Execution Sequence

### Workflow A: Completing a Post-30-Day Mission
1. **User Input**: Completes required tasks in `DailyChallengeTaskScreen` for Day $N$ (where $N \ge 30$).
2. **Validation**: Check that at least 1 task is completed.
3. **State Transition**:
   - `dayLogs[N].completed = true`
   - `streak += 1`
   - `totalPoints += 100`
   - `currentDay = max(N + 1, currentDay)`
4. **Reward Modal Trigger**: Display XP/Coin claim modal with direct `Advance to Day N+1 →` button.
5. **Next Day Render**: On tap, load `HabitContinuationEngine.generateDayPlan(challenge, N + 1)` and immediately transition screen without forcing user to exit back to dashboard.

---

### Workflow B: Timeline Grid Cycle Switching
1. **User Action**: Taps Cycle 2 (Days 31–60) or Cycle 3 (Days 61–90) in `ChallengePathwayScreen` or `MatrixJourney`.
2. **State Transition**:
   - `selectedCycleIndex = targetCycleIndex`
   - Calculate grid boundaries: `[startDay, endDay] = CONTINUUM_CYCLES[targetCycleIndex].range`
3. **Render**:
   - Days rendered from `startDay` to `endDay`.
   - Milestones dynamically flagged (`[30, 50, 75, 100, 180, 365, 500, 1000]`).
   - Active day highlighted with pulsing beacon.

---

### Workflow C: Future Day Roadmap Inspection & Early Practice
1. **User Action**: Clicks any future day node ($D_{future} > D_{active}$) in Pathway Timeline or Matrix.
2. **Modal Launch**: Opens `FutureDayPreviewModal` or `LockedDayModal` with neuroscience context.
3. **User Choice**:
   - Choice A: "Close" / "Got It" -> Dismisses modal.
   - Choice B: "Practice Day Early Today" -> Sets `selectedDay = D_{future}`, launching task workspace in early mode.
