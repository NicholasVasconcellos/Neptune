# Forgot Password Feature

## Context
The login screen (`app/(auth)/login.tsx`) has no way to recover a forgotten password. We need to add a "Forgot Password?" link on login that navigates to a new screen where the user enters their email and receives a Supabase password reset link.

## Plan

### 1. Add "Forgot Password?" link to login screen
**File:** `app/(auth)/login.tsx`
- Import `useRouter` from `expo-router`
- Add a `Button variant="text"` between the password input (line 47) and the Sign In button (line 48)
- The button navigates to `/(auth)/forgot-password` and passes the current `email` state as a route param so it's pre-filled

### 2. Create the forgot password screen
**File:** `app/(auth)/forgot-password.tsx` (new)
- Mirror the structure of `login.tsx` — same Pressable/keyboard-dismiss wrapper, same View with `mt-10 p-3 gap-1`
- Read `email` from `useLocalSearchParams()` to pre-fill the input
- Brief instruction text: "Enter your email and we'll send you a link to reset your password."
- Email `TextInput` + "Send Reset Link" `Button`
- On submit: call `supabase.auth.resetPasswordForEmail(email)`
- Always show a generic success message via `alertLog()` (never reveal if email exists)
- Navigate back to login with `router.back()`

### 3. Register the route in the root layout
**File:** `app/_layout.tsx`
- Add a `Stack.Screen` entry for `(auth)/forgot-password` after the register entry (line 38), with the same `headerShown: true, headerTransparent: true, headerTitle: ""` pattern — this gives us a free back button

## Files to modify
| File | Action |
|------|--------|
| `app/(auth)/forgot-password.tsx` | Create |
| `app/(auth)/login.tsx` | Add router import + "Forgot Password?" button |
| `app/_layout.tsx` | Add Stack.Screen entry |

## Verification
1. Run `npx expo start` and navigate to login
2. Confirm "Forgot Password?" link appears below the password field
3. Type an email on login, tap "Forgot Password?" — confirm the email carries over
4. Tap "Send Reset Link" — confirm success alert appears and navigates back to login
5. Check Supabase dashboard to verify the reset email was sent
