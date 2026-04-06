# Neptune UI & Schema Migration Log

## Overview
Full migration from React Native Paper (Material Design 3) to NativeWind v4 (Tailwind CSS), plus Supabase schema updates and a complete Add Training page rebuild.

---

## Milestone 1: NativeWind Setup & Configuration

**What changed:**
- Created `babel.config.js` — standard Expo babel preset
- Created `metro.config.js` — wraps Expo metro config with `withNativeWind`, pointing to `global.css`
- Created `tailwind.config.js` — NativeWind preset, content paths for `app/` and `components/`, theme colors mapped from `Styles/Theme.ts` using CSS custom properties
- Created `global.css` — Tailwind v3 directives (`@tailwind base/components/utilities`) plus CSS custom properties for light/dark mode via `@media (prefers-color-scheme: dark)`
- Created `nativewind-env.d.ts` — TypeScript `className` prop support
- Updated `app/_layout.tsx` — added `import "../global.css"`

**Key discovery:**
NativeWind v4.2.3 explicitly only supports Tailwind CSS v3 (confirmed by reading `nativewind/dist/metro/tailwind/index.js` which throws if not v3). The Context7 docs showed Tailwind v4 CSS import syntax (`@import "tailwindcss/theme.css"`) which does NOT work — `tailwindcss/theme.css` doesn't exist in v3. Used v3 `@tailwind` directives instead.

**Theme approach:**
CSS custom properties defined in `global.css` under `:root` (light) and `@media (prefers-color-scheme: dark)` (dark). Referenced in `tailwind.config.js` as `var(--color-*)`. This means components use single classes like `bg-background` and `text-foreground` without needing `dark:` prefixes — the variable values auto-switch.

---

## Milestone 2: NativeWind Component Library

**What changed:**
Created `components/ui/` with 12 components + barrel file:

| Component | File | Replaces |
|-----------|------|----------|
| Text | `ui/Text.tsx` | Paper Text, ThemedText |
| TextInput | `ui/TextInput.tsx` | Paper TextInput, ThemedInput |
| Button | `ui/Button.tsx` | Paper Button, components/Button |
| IconButton | `ui/IconButton.tsx` | Paper IconButton |
| Card | `ui/Card.tsx` | Paper Card, components/Card |
| Chip | `ui/Chip.tsx` | Paper Chip (supports `onClose`) |
| Divider | `ui/Divider.tsx` | Paper Divider |
| FAB | `ui/FAB.tsx` | Paper AnimatedFAB |
| Modal | `ui/Modal.tsx` | RN Modal wrapper |
| SearchBar | `ui/SearchBar.tsx` | Paper Searchbar |
| SegmentedControl | `ui/SegmentedControl.tsx` | Paper SegmentedButtons |
| Snackbar | `ui/Snackbar.tsx` | Paper Snackbar |

**Design decisions:**
- All components accept `className` prop for NativeWind overrides
- Icons: switched from Paper's Material icons to `@expo/vector-icons/Ionicons` (already available via Expo)
- Text variants: `body`, `body-sm`, `label`, `label-sm`, `title`, `headline`, `display`
- Button variants: `contained` (default), `outlined`, `text`
- TextInput includes built-in label, error state, and password toggle
- Chip supports both `label` prop and `children`, plus `onClose` for removable chips

---

## Milestone 3: Screen Migration (Paper → NativeWind)

**What changed:**
Rewrote every screen and component to use NativeWind classes + `components/ui/`:

**Screens migrated:**
- `app/_layout.tsx` — Removed `PaperProvider`, `SafeAreaView` uses `className="flex-1 bg-background"`
- `app/index.tsx` — Replaced Paper ActivityIndicator, Button, Text, Card
- `app/(auth)/login.tsx` — Uses ui/TextInput, ui/Button
- `app/(auth)/register.tsx` — Uses ui/TextInput, ui/Button, ui/Text (replaced Paper HelperText)
- `app/(tabs)/_layout.tsx` — Tabs colors now use CSS variable strings and hardcoded primary
- `app/(tabs)/index.tsx` — Full NativeWind, Ionicons for button icons
- `app/(tabs)/viewData.tsx` — Uses ui/Text for title
- `app/(tabs)/viewTraining.tsx` — Uses ui/Text

**Components migrated:**
- `components/Typeahead.tsx` — Replaced Paper TextInput/List/Surface/Chip/HelperText with NativeWind classes + ui components
- `components/ListView.tsx` — Replaced Paper Searchbar/FAB/IconButton/Surface/Text/Divider/TouchableRipple with ui components
- `components/ButtonGrid.tsx` — Replaced `StyleSheet.create()` with NativeWind classes, removed `Colors`/`spacing`/`typography` imports
- `components/InputForms/AthleteForm.tsx` — Uses ui components, ui/Snackbar
- `components/InputForms/TeamForm.tsx` — Uses ui components, ui/Snackbar
- `components/InputForms/TimeForm.tsx` — Uses ui/SegmentedControl instead of Paper SegmentedButtons

**Deleted files:**
- `components/ThemedText.tsx` (replaced by ui/Text)
- `components/ThemedInput.tsx` (replaced by ui/TextInput)
- `components/Button.tsx` (replaced by ui/Button)
- `components/Card.tsx` (replaced by ui/Card)
- `components/Title.tsx` (replaced by ui/Text with `variant="headline"`)
- `components/UnitToggle.tsx` (replaced by ui/SegmentedControl)
- `components/InputForms/oldAtheleteForm.tsx` (unused)
- `Styles/PaperTheme.ts` (no longer needed)

**Removed dependency:**
- `react-native-paper` removed from `package.json`

**Verified:** `grep -r "react-native-paper"` returns zero matches in source files.

---

## Milestone 4: Supabase Schema Migration

**What changed:**
- Created `supabase/migrations/20260405_schema_update.sql`
- Updated `constants/supabaseSchema.csv` to reflect new schema
- Updated `constants/objectMap.ts` — "Teams" key renamed to "Groups" (maps to Teams DB table with "Groups" label)
- Updated `app/(tabs)/viewData.tsx` — ButtonGrid items changed from `["Athletes", "Teams", "Times"]` to `["Athletes", "Groups", "Times"]`
- Updated `components/ListView.tsx` — removed "Group ID" from FK_TABLE_MAP
- Rewrote `components/InputForms/AthleteForm.tsx` — removed all Group state/logic
- Rewrote `components/InputForms/TeamForm.tsx` — removed sub-groups, relabeled "Team" → "Group"

**Schema changes (in migration SQL):**
1. `ALTER TABLE "Athletes" DROP COLUMN "Group ID"` — Groups table deleted
2. `DROP TABLE "Groups"` — deleted
3. `ALTER TABLE profiles ADD COLUMN "Team" text` — organization name
4. `CREATE TABLE "Trainings"` — id, Name, Notes, Team (FK→Teams), Date, Days (json), User ID
5. `CREATE TABLE "Exercises"` — id, Training ID (FK→Trainings), Name, Distance (bigint/meters), Repetitions, Energy System (text), Interval (bigint/seconds), Note, User ID
6. RLS policies on both new tables (SELECT/INSERT/UPDATE/DELETE scoped to `auth.uid()`)

**Semantic rename:**
- DB `Teams` table = "Groups" in the UI (swim groups like "Sprint", "Distance")
- `profiles.Team` = organization name (the swim team/club name)
- `Trainings.Team` = FK to `Teams` table (which group this training is for)

**To apply:** User needs to restore the Supabase project (currently INACTIVE), then run `supabase link` and `supabase db push` or apply the migration via the dashboard.

---

## Milestone 5: Add Training Page — Full Rebuild

**What changed:**
- Created `components/training/ExerciseRow.tsx` — inline-editable exercise with confirmed/editing states
- Rewrote `app/(tabs)/addTraining.tsx` — two-view architecture (list + create)

**Architecture:**
```
addTraining.tsx
├── TrainingListView (landing)  — fetches Trainings, displays list, FAB to create
└── Create View
    ├── Top bar (Back + Save)
    ├── Header section (name, unit, group, date, days, notes)
    └── Exercise section
        ├── ExerciseRow[] (inline editing)
        └── "Add Exercise" button
```

**ExerciseRow states:**
- **Editing:** Full input form with Name (typeahead from distinct Exercise names), Reps, Distance (typeahead from swimmingConstants), Interval (mm:ss), Energy System (N1-N4 chips), Note. Confirm button at bottom.
- **Confirmed:** Compact display showing set format (`3 x 100 @ 1:30`), energy system badge, computed distance (rep×dist), rolling cumulative distance, computed time, rolling cumulative time. Tap to re-edit.

**Key features:**
- Exercise name typeahead pulls distinct names from user's existing Exercises
- Distance typeahead shows standard distances based on unit toggle (yards/meters from swimmingConstants)
- Rolling distance/time: cumulative sum of `rep × dist` and `rep × interval` for all exercises up to current
- Validation: Training name required, ≥1 exercise, per-exercise name+distance+reps required, interval format check
- Erroring exercises get un-confirmed and shown in edit mode with red error messages
- Unit conversion on submit: yards distances multiplied by 0.9144 and rounded to integer meters

**Data flow on submit:**
1. POST to Trainings → get training ID
2. POST all Exercises with `"Training ID"` set to returned ID
3. If yards mode: `Math.round(distanceValue * 0.9144)` before saving

---

## Files Summary

### New files
```
babel.config.js
metro.config.js
tailwind.config.js
global.css
nativewind-env.d.ts
components/ui/Text.tsx
components/ui/TextInput.tsx
components/ui/Button.tsx
components/ui/IconButton.tsx
components/ui/Card.tsx
components/ui/Chip.tsx
components/ui/Divider.tsx
components/ui/FAB.tsx
components/ui/Modal.tsx
components/ui/SearchBar.tsx
components/ui/SegmentedControl.tsx
components/ui/Snackbar.tsx
components/ui/index.ts
components/training/ExerciseRow.tsx
supabase/migrations/20260405_schema_update.sql
migration.md
```

### Deleted files
```
components/ThemedText.tsx
components/ThemedInput.tsx
components/Button.tsx
components/Card.tsx
components/Title.tsx
components/UnitToggle.tsx
components/InputForms/oldAtheleteForm.tsx
Styles/PaperTheme.ts
```

### Modified files
```
app/_layout.tsx
app/index.tsx
app/(auth)/login.tsx
app/(auth)/register.tsx
app/(tabs)/_layout.tsx
app/(tabs)/index.tsx
app/(tabs)/viewData.tsx
app/(tabs)/viewTraining.tsx
app/(tabs)/addTraining.tsx
components/Typeahead.tsx
components/ListView.tsx
components/ButtonGrid.tsx
components/InputForms/AthleteForm.tsx
components/InputForms/TeamForm.tsx
components/InputForms/TimeForm.tsx
constants/objectMap.ts
constants/supabaseSchema.csv
package.json
```

## Testing Notes

- The app needs `npm install` after pulling (react-native-paper removed, nativewind+tailwind already installed)
- Clear metro cache after config changes: `npx expo start -c`
- Supabase project is currently INACTIVE — restore before testing DB features
- CSS custom properties in NativeWind: if colors don't render on native, the `var()` values may need to be replaced with direct color values in tailwind.config.js and `dark:` prefix approach used instead
- The `Styles/Theme.ts` file still exists as a reference but is no longer imported by any component
