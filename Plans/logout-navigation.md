# Logout Navigation Bug

## Problem

Pressing "Log Out" on the Home tab causes a `GO_BACK` navigation error and leaves the app in an unusable state (tabs visible, session null, "Logged in as" with no email).

## Current Flow

1. User taps "Log Out" → calls `supabase.auth.signOut()`
2. AuthContext sets `session` to `null`
3. `useEffect` in `app/(tabs)/index.tsx:15-19` fires `router.replace("../" as any)`
4. `../` resolves as a GO_BACK action — no screen in the stack to go back to → error
5. App stays on the tabs screen in a broken state

## Root Cause

`app/(tabs)/index.tsx` uses a relative path `"../"` to navigate on logout. Since `(tabs)` was reached via `router.replace("/(tabs)")` from `app/index.tsx`, there's no prior screen in the Stack history. The relative path becomes a GO_BACK with nowhere to go.

## Approaches Tried

### 1. Absolute path: `router.replace("/")`

**Change:** `app/(tabs)/index.tsx:17` — `"../"` → `"/"`

**Result:** No error thrown, but navigation doesn't actually happen. The app stays on the tabs screen showing null session state. Imperative `router.replace` from inside a nested tab navigator doesn't reliably navigate to the root Stack screen.

### 2. Declarative `<Redirect>` in tabs layout

**Change:** Added auth gate in `app/(tabs)/_layout.tsx`:
```tsx
const { session } = useAuth();
if (!session) return <Redirect href="/" />;
```
Removed the `useEffect` guard from `app/(tabs)/index.tsx`.

**Result:** Infinite render loop. The Stack still has `(tabs)` mounted, so:
1. Tabs layout sees no session → Redirect to "/"
2. Root index renders
3. Stack re-renders `(tabs)` layout (still in navigator tree)
4. Tabs layout sees no session → Redirect again
5. `Maximum update depth exceeded` error

### 3. Explicit navigation in logout handler

**Change:** Made logout button `await signOut()` then `router.replace("/")`:
```tsx
onPress={async () => {
  await supabase.auth.signOut();
  router.replace("/");
}}
```

**Result:** Same as approach 1 — `router.replace("/")` from inside the nested tabs navigator doesn't navigate. The Stack doesn't process the replace to its own `index` screen.

## Approaches Still To Try

### A. `router.dismissAll()` + `router.replace("/")`
Clear the navigation stack first, then replace. May work around the nested navigator issue.

### B. Root-level auth gate using `useSegments`
Move auth routing logic into a component inside `_layout.tsx` (child of AuthProvider) using Expo Router's `useSegments` + `useRootNavigationState` to detect the current segment and redirect at the root level, avoiding nested navigator issues.

```tsx
// Inside _layout.tsx, as a child of AuthProvider
function AuthGate() {
  const { session } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inProtected = segments[0] === '(tabs)';
    if (!session && inProtected) {
      router.replace('/');
    } else if (session && !inProtected) {
      router.replace('/(tabs)');
    }
  }, [session, segments]);

  return null;
}
```

### C. Navigate before signing out
Navigate away first, then sign out — avoids reactive navigation entirely:
```tsx
onPress={async () => {
  router.replace("/");
  await supabase.auth.signOut();
}}
```

### D. Use `CommonActions.reset` via `useNavigation`
Bypass Expo Router's `router` and use React Navigation directly to reset the entire navigator state:
```tsx
import { CommonActions, useNavigation } from '@react-navigation/native';
navigation.dispatch(
  CommonActions.reset({ index: 0, routes: [{ name: 'index' }] })
);
```

## Architecture Reference

```
app/_layout.tsx (Stack + AuthProvider)
  ├── app/index.tsx         ← auth gate: redirects to (tabs) if session, else shows login/register
  ├── app/(tabs)/_layout.tsx (Tabs)
  │   ├── index.tsx         ← Home tab with logout button
  │   ├── viewData.tsx
  │   ├── addTraining.tsx
  │   └── viewTraining.tsx
  ├── app/(auth)/login.tsx
  ├── app/(auth)/register.tsx
  ├── app/(auth)/forgot-password.tsx
  ├── app/(auth)/reset-password.tsx
  └── app/athlete/[id].tsx
```
