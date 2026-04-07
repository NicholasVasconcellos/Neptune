# Plan: Global Data Cache with Prefetch & Auto-Refresh

## Context
Every screen in Neptune fetches its own data from Supabase on mount — no caching, no deduplication. Navigating between Views, forms, and athlete detail triggers redundant queries every time. This plan introduces a single `DataContext` that prefetches all core tables after auth, serves them to consumers from memory, and auto-refreshes after mutations or pull-to-refresh.

## Architecture: Single DataContext

One `DataContext` provider caching 4 tables: **Athletes, Teams, Times, Trainings**.
- Exercises stay on-demand (always filtered by Training ID, only used in addTraining).
- Context exposes: `athletes`, `teams`, `times`, `trainings`, `loading`, `refreshing`, `refreshAll()`, `refreshTable(tableName)`.
- Custom hook: `useData()`.

## Implementation Steps

### Step 1: Add mutation listener system to `backendData.ts`
**File:** `utils/backendData.ts`

Add a simple pub/sub so the DataContext auto-refreshes after any mutation:
```
- Module-level: listeners Set + onMutation(callback) → unsubscribe
- notifyListeners(tableName) called at end of postData, updateData, deleteData, deleteByFilter (only after success)
```

### Step 2: Create `context/DataContext.tsx` (new file)
- Reads `useAuth()` for session
- On session available → `Promise.all` fetching all 4 tables via `getData()`
- `loading` = true during initial prefetch, false after
- `refreshing` = true during pull-to-refresh
- `refreshAll()` — re-fetches all 4 tables in parallel
- `refreshTable(tableName)` — re-fetches one table by name
- Subscribes to `onMutation()` from backendData — auto-calls `refreshTable` for cached tables, ignores others (e.g. Exercises)
- Clears data on logout (session → null)

### Step 3: Wire DataProvider into `app/_layout.tsx`
Wrap inside `AuthProvider`, outside `SafeAreaProvider`:
```
<AuthProvider>
  <DataProvider>
    <SafeAreaProvider>...
```

### Step 4: Update `components/ListView.tsx`
- Import `useData` + `RefreshControl` from react-native
- Replace `fetchData()` / `useEffect` with reads from `useData()` — map `tableName` prop to cache key
- Build FK lookups from `data.teams` / `data.athletes` instead of separate `getData()` calls
- Replace local `loading` with `data.loading`
- Add `RefreshControl` to FlatList (`refreshing={data.refreshing}`, `onRefresh={data.refreshAll}`)
- Simplify `handleFormSuccess` — remove `fetchData()` call (auto-refresh handles it)
- Simplify `handleModalSelect` — remove `fetchData()` call after `updateData`
- `handleEmptyCellPress` — read modal options from cache instead of `getData()`

### Step 5: Update `app/athlete/[id].tsx`
- Import `useData` + `RefreshControl`
- Replace `fetchData` with `useMemo` derivations from cache:
  - `athlete` = `data.athletes.find(a => a.id === Number(id))`
  - `times` = `data.times.filter(t => t["Athlete ID"] === Number(id))`
  - `teamName` = lookup from `data.teams`
- Use `data.loading` for initial spinner
- Add `RefreshControl` to FlatList
- Simplify `handleFormSuccess` — remove `fetchData()` call

### Step 6: Update `components/InputForms/AthleteForm.tsx`
- Replace `useEffect` fetch of athletes + teams with `useData()`
- Remove local `athleteData`, `teamData` state
- Use `data.athletes` / `data.teams` directly
- Remove post-submit `fetchAthletes()` / `fetchTeams()` calls

### Step 7: Update `components/InputForms/TeamForm.tsx`
- Same pattern as AthleteForm — replace fetch with `useData()`
- Remove local state for athletes/teams

### Step 8: Update `components/InputForms/TimeForm.tsx`
- Replace `useEffect` fetch of athletes with `useData()`
- Remove local `athleteData` state

### Step 9: Update `app/(tabs)/addTraining.tsx`
- `TrainingListView`: read `data.trainings` from cache, remove `refreshKey` prop and the `useEffect` that fetches
- Form: read `data.teams` from cache instead of `getData("Teams")`
- Keep `getData("Exercises")` calls as-is (filtered, not cached)
- Remove all `setListRefreshKey(k => k + 1)` calls after mutations

## Files Changed

| File | Change |
|------|--------|
| `context/DataContext.tsx` | **NEW** — DataProvider + useData hook |
| `utils/backendData.ts` | Add ~15 lines: mutation listener pub/sub |
| `app/_layout.tsx` | Add `<DataProvider>` wrapper (2 lines) |
| `components/ListView.tsx` | Replace getData with useData, add RefreshControl |
| `app/athlete/[id].tsx` | Replace getData with useMemo from cache, add RefreshControl |
| `components/InputForms/AthleteForm.tsx` | Replace fetch with useData |
| `components/InputForms/TeamForm.tsx` | Replace fetch with useData |
| `components/InputForms/TimeForm.tsx` | Replace fetch with useData |
| `app/(tabs)/addTraining.tsx` | TrainingListView + form read from cache |

## Verification
1. Start the app — confirm data loads once after login (no repeated Supabase calls)
2. Navigate between Athletes/Groups/Times tabs — confirm instant display, no loading spinner
3. Pull down on any list — confirm refresh indicator appears and data re-fetches
4. Add an athlete via FAB — confirm list updates automatically without manual refresh
5. Add a time from athlete detail — confirm times list updates automatically
6. Add a training — confirm training list updates automatically
7. Log out and back in — confirm data clears and re-fetches
