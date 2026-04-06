# Logo Centralization Plan

## Context

The homescreen logo is not showing the updated `neptune-logo-no-bg.png`. Additionally, logo references are scattered across multiple files using different assets, making future updates error-prone. This plan centralizes all logo usage so updating the logo in one place propagates everywhere.

## Current State (all logo references)

| Location | File | Current Asset | Issue |
|----------|------|--------------|-------|
| Homescreen | `app/(tabs)/index.tsx:9` | `neptune-logo-no-bg.png` | Correct file, may need cache clear |
| Login screen | `app/index.tsx:6` | `NeptuneAppIcon.png` | Different logo file |
| App icon | `app.json:8` | `Icon - Neptune Swim - Andressa - No BG.png` | **File doesn't exist** |
| Splash screen | `app.json:12` | `Icon - Neptune Swim - Andressa - No BG.png` | **File doesn't exist** |
| Android adaptive icon | `app.json:22` | `Icon - Neptune Swim - Andressa - No BG.png` | **File doesn't exist** |
| Web favicon | `app.json:29` | `Icon - Neptune Swim - Andressa - No BG.png` | **File doesn't exist** |
| Test mock | `__tests__/setup.ts:127` | `NeptuneAppIcon.png` | References old logo |

## Plan

### Step 1: Create a centralized logo constants file

Create `constants/images.ts` that exports all logo references from one place:

```ts
export const AppLogo = require("@/assets/neptune-logo-no-bg.png");
```

This way, every screen imports `AppLogo` from this one file. When the logo changes, only this file (and the asset itself) need updating.

### Step 2: Update all in-code logo imports

- **`app/(tabs)/index.tsx`** — replace direct asset import with `import { AppLogo } from "@/constants/images"`
- **`app/index.tsx`** — replace `NeptuneAppIcon.png` import with `import { AppLogo } from "@/constants/images"`

### Step 3: Fix `app.json` references

Update all 4 broken references from `Icon - Neptune Swim - Andressa - No BG.png` to `./assets/neptune-logo-no-bg.png`.

> Note: `app.json` can't use JS imports, so these must remain direct paths. The constants file will have a comment documenting this.

### Step 4: Update test mock

In `__tests__/setup.ts`, update the mock path from `NeptuneAppIcon.png` to `neptune-logo-no-bg.png`.

### Step 5: Clear metro cache

Run `npx expo start --clear` to ensure the bundler picks up the new asset.

## Files to modify

- `constants/images.ts` (new) — centralized logo export
- `app/(tabs)/index.tsx` — update import
- `app/index.tsx` — update import
- `app.json` — fix 4 broken asset paths
- `__tests__/setup.ts` — update mock path

## Verification

1. Run `npx expo start --clear` and confirm the homescreen shows the correct logo
2. Navigate to the login screen and confirm the same logo appears
3. Run tests to confirm mock still works
