# RELEASE CHECKPOINT 10: HOME SCREEN ACTION BUTTONS STANDARDIZATION & SHORTCUTS STREAMLINING

## Summary
- **Target Component**: `HomeScreen.tsx`.
- **User Request**:
  1. Removed the item marked in red: **Universal Smart Forms** card removed from the Home Screen.
  2. Redesigned the items marked in blue: **Daily Lucky Wheel** and **Day X Scratch Card / Daily Habit Action** redesigned to match the exact size, layout, styling, and typography of the **Challenges** and **Services** buttons above them.
- **Button System Consistency**:
  - All four primary action buttons (`Challenges`, `Services`, `Daily Lucky Wheel`, and `Day X Scratch Card / Action`) now share:
    - Same rounded-3xl container with dual border highlight (`border-2 border-purple-200/80 hover:border-purple-500`).
    - Signature purple/indigo gradient vector badge (`w-14 h-14 rounded-2xl shadow-md shadow-purple-600/20`) with dedicated Lucide vector icons (`Compass`, `Layers`, `FerrisWheel`, `Gift`/`Sprout`).
    - Standardized typography with bold titles and purple metadata subtitles.
    - Right-side circular action arrow button (`w-10 h-10 rounded-2xl bg-purple-50 group-hover:bg-purple-600 group-hover:text-white text-purple-700`).
- **Verification**: Verified cleanly with `compile_applet` and `lint_applet`.
