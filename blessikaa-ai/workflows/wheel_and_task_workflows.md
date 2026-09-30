# Blessikaa AI Workflows: Daily Task Screen & Gamified Wheel Engine

## 1. Scratch Card Continuity (Days 1 to Infinity)
- **Start**: User selects a day from Pathway (Day 1 through Day 1,000+).
- **Evaluation**: Check `progress.dayLogs[day].scratched` or `completed`.
- **Render State**:
  - If Days 1–21 (Foundation): Canvas initializes with Lavender/Silver gradient (`#C4B5FD` -> `#A78BFA` -> `#8B5CF6`) and title "✨ Scratch Day {day} Challenge ✨".
  - If Days 22+ (Habit Continuum): Canvas initializes with Iridescent Cosmic gradient (`#8B5CF6` -> `#6366F1` -> `#10B981` -> `#F59E0B`) and title "♾️ Scratch Day {day} Habit Focus ♾️".
- **Interaction**:
  - Touch/Mouse drag scratches circular areas with `globalCompositeOperation = 'destination-out'`.
  - Scratch % accumulator: at $\ge 40\%$, auto-reveals full card, triggers celebration audio chime, and updates `dayLogs[day].scratched = true`.
  - Skip scratch button located directly below canvas provides zero-barrier entry.
  - Share button directly below canvas opens system share or copies daily link.

## 2. Today's Mood & Energy Auto-Popup State Machine
- **Trigger**: Opening any uncompleted day box in Pathway.
- **State Check**: `currentLog.completed === false` triggers `setShowMoodPopup(true)`.
- **User Selection**:
  - Mood options: 🔥 Unstoppable, ⚡ Energized, 🌱 Steady, 🧘 Calm, 💪 Challenged.
  - Time investment: 10m, 15m, 20m, 30m, 45m.
- **Action**: "Confirm & Begin Day" commits selected mood and minutes into state, triggers haptic + chime, and dismisses modal. Can be reopened anytime via the mood chip in the checklist header.

## 3. Compact Action Checklist & Zero-Scroll Layout
- **Checkbox Dimensions**: Strictly locked to `w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] shrink-0 rounded-md` across all items.
- **Internal Scroll Container**: Card constrained to `max-h-[220px] sm:max-h-[250px] overflow-y-auto` with smooth custom scrollbar.
- **Nested Scrollable Modules**:
  1. Personal and habit step items with toggle checks and delete capability.
  2. Quick personal step adder input.
  3. Time spent picker (10m - 45m).
  4. Upload proof module with image picker, live preview, and clear button.
- **Primary Completion Button**: Positioned below checklist for instant accessibility.

## 4. Gamified Wheel Customizer in Settings
- **Access Points**:
  - Settings button beside/ahead of Coins pill on Navbar.
  - Settings button beside Coins in Daily Challenge Task Screen.
  - Settings button beside Coins in Challenge Pathway Screen.
  - Customizer button in Daily Wheel Screen.
  - Direct tap on Coins pill opens Settings with Wheel Customizer tab.
- **Controls**:
  - Segment count slider / buttons: 4 to 12 triangles.
  - Slices array dynamically expands or contracts while preserving configured user items.
  - Each triangle slice supports: Title (text), Icon (emoji), Numerical value, Category type, and Hex color.
  - Instant live SVG preview showing accurate geometric wedge angles ($\theta = 360^\circ / N$).
  - Preset reset button to restore default balanced pools.
