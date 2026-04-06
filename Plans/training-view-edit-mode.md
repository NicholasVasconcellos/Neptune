# Plan: Training View/Edit Mode + Bug Fixes

## Context

Three bugs and a UX redesign:
1. **Alignment**: Reps/Distance/Interval fields misaligned because Typeahead lacks `my-1.5` that TextInput has
2. **Tab focus**: Tab from Reps doesn't focus Distance because Typeahead doesn't support ref forwarding
3. **Loading cosmetic**: Save button replaces text with spinner (jarring)
4. **UX redesign**: Clicking a training should open in read-only view mode first, with Edit button to enter edit mode

## Files to Modify

1. `components/Typeahead.tsx` — forwardRef + margin fix
2. `components/training/ExerciseRow.tsx` — wire up distRef + add readOnly prop
3. `components/ui/Button.tsx` — show text alongside loading spinner
4. `components/training/TrainingViewMode.tsx` — **new file**, read-only training view
5. `app/(tabs)/addTraining.tsx` — 4-mode view system + discard/save confirmation

---

## Step 1: Fix Typeahead — `components/Typeahead.tsx`

- Add `forwardRef` from React, rename `TextInput` import to `RNTextInput`
- Add `containerClassName?: string` prop
- Wrap component in `forwardRef<RNTextInput, TypeaheadProps>`
- Pass `ref` to inner `<RNTextInput>`
- Add `className={`my-1.5 ${containerClassName}`}` to outermost View (matches TextInput's wrapper)
- Add `displayName`

This fixes **both** the alignment issue (matching TextInput margin) and the tab focus issue (ref forwarding).

## Step 2: Fix ExerciseRow — `components/training/ExerciseRow.tsx`

- Add `ref={distRef}` to the Distance Typeahead — tab from Reps now focuses Distance
- Add `readOnly?: boolean` prop (default false)
- When `readOnly` is true on confirmed view: set `onPress={undefined}` and `disabled={true}` on the Pressable — tapping card does nothing

## Step 3: Button loading cosmetic — `components/ui/Button.tsx`

Change lines 65-81 so the spinner shows **next to** the text instead of replacing it:
```tsx
{loading && <ActivityIndicator size="small" color={textColor} />}
{!loading && icon && <View>{icon}</View>}
{typeof children === "string" ? (
  <Text className="font-semibold text-base"
    style={{ color: textColor, opacity: disabled ? 0.5 : loading ? 0.6 : 1 }}>
    {children}
  </Text>
) : children}
```

## Step 4: New TrainingViewMode — `components/training/TrainingViewMode.tsx`

Read-only training summary component. Receives all data as props:
- Training name as headline text
- Days + date as secondary text
- Group name (if present)
- Notes (if present, italic muted)
- Divider
- Exercise section header with count
- Column headers (Dist / Time)
- Each exercise rendered via `<ExerciseRow readOnly confirmed={true} />`
- Divider + Total distance and time footer

## Step 5: Rewrite addTraining.tsx modes

### 5a. Expand view state to `"list" | "view" | "edit" | "create"`

### 5b. Add `teamName` computed from `teamId` + `teams`

### 5c. Change `openForEdit` → navigate to `"view"` (not `"edit"`)

### 5d. Add long-press delete to TrainingListView
- New `onDelete` prop on TrainingListView
- `onLongPress={() => onDelete(item)}` on each list Pressable
- `handleDeleteFromList(training)` in AddTraining — Alert confirm → `deleteData` → refresh list

### 5e. Remove delete from edit mode, add discard
- Remove `confirmDeleteTraining` / `performDelete` functions
- Add `confirmDiscard()` — Alert "Discard all changes?" → reset form → back to list

### 5f. Add `confirmSave()` for edit mode
- Alert with 3 options: "Override" (calls updateTraining), "Save As Copy" (opens save-as modal), "Cancel"
- Web: `window.confirm` for override only (simpler)

### 5g. Rewrite top bar for 3 modes

**View mode**: `[← Back]` ... `[✏ Edit]`
**Edit mode**: `[🗑 Discard]` ... `[Save As] [Save]`
**Create mode**: `[← Back]` ... `[Save Training]` (unchanged)

### 5h. Add view mode rendering block
- Between list conditional and create/edit form
- Returns `<TrainingViewMode ...props />` with top bar
- Import TrainingViewMode

---

## Verification

1. **Alignment**: Open new training form → add exercise → Reps/Distance/Interval should be vertically aligned
2. **Tab focus**: Type in Reps → press tab/return → Distance field should focus
3. **Loading**: Save a training → button shows spinner + text, not just spinner
4. **View mode**: Tap existing training → read-only summary → exercises as compact cards → total at bottom
5. **Edit from view**: Tap Edit icon → form becomes editable with same data
6. **Save override**: Tap Save → Alert with Override/Save As/Cancel options
7. **Save As**: Tap Save As → modal with pre-filled name → creates copy
8. **Discard**: Tap trash/Discard → confirm → back to list
9. **Long-press delete**: Long-press training in list → confirm → deleted
10. **Create flow**: FAB → create form → save → appears in list (unchanged)
