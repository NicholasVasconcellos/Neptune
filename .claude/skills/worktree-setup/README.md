# Worktree Setup Skill

Create and configure a git worktree for Neptune with a working iOS build environment.

## Steps

### 1. Create Worktree

```bash
git worktree add ../Neptune-<name> -b <branch-name>
```

- Replace `<name>` with the worktree purpose (e.g. `test`, `feature-x`)
- Creates a new branch and checks it out in a sibling directory

### 2. Copy Environment Variables

```bash
cp /Users/nicholas/Developer/Neptune/.env ../Neptune-<name>/.env
```

- `.env` is gitignored so it never transfers to worktrees automatically
- Contains `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **App will crash at launch without this step**

### 3. Install Dependencies

```bash
cd ../Neptune-<name>
npm install
```

### 4. Prebuild Native Project

```bash
npx expo prebuild --platform ios
```

- Generates the `ios/` directory with CocoaPods installed
- Add `--platform android` for Android or omit the flag for both

### 5. Build & Run on Simulator

```bash
npx expo run:ios --device "iPhone 17 Pro"
```

- Compiles, signs, installs, and launches on the specified simulator
- Simulator must be booted first (use `xcrun simctl boot "iPhone 17 Pro"` if needed)
