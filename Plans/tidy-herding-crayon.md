# Default Unit to Meters

## Context
The unit default is inconsistent: `TimeForm` defaults to "yards" while `addTraining` already defaults to "meters". User wants "meters" as the default everywhere.

## Changes

### `components/InputForms/TimeForm.tsx`
1. **Line 26**: Change `useState("yards")` → `useState("meters")`
2. **Lines 215-218**: Reorder SegmentedControl options to list "Meters" first (matching `addTraining.tsx` order)

### No changes needed
- `app/(tabs)/addTraining.tsx` — already defaults to `"meters"`
- `components/training/ExerciseRow.tsx` — receives unit as prop, no default

## Verification
- Open the "Add Time" form and confirm "Meters" is selected by default
- Open the "Add Training" form and confirm "Meters" is still selected by default
- Confirm distance options update correctly for meters
