# React Native & Expo Best Practices

> Generated via Context7 docs for React Native, Expo SDK/Router, and React Native Paper.

---

## Component Patterns

- Use **functional components** exclusively — no class components
- Use `Pressable` over `TouchableOpacity` for press interactions
- Use `FlatList` / `SectionList` for any list that can grow — **never** `ScrollView` for long lists
- Wrap screen roots in `SafeAreaView` from `react-native-safe-area-context`

---

## Styling

- Always use `StyleSheet.create()` — defined once outside the component, sent to native once
- Place all `StyleSheet.create()` calls at the bottom of the file
- Use style arrays for overrides: `style={[styles.base, isActive && styles.active]}`
- Flexbox default direction is **column** (not row like web)
- No CSS cascade — styles don't inherit to children (except within nested `Text`)
- Android does **not** support negative margins

---

## Performance

- **Test performance in release builds** — dev mode is significantly slower
- Remove all `console.*` before production (use `babel-plugin-transform-remove-console`)
- FlatList optimization checklist:
  - `keyExtractor` with stable unique ID (never array index)
  - `getItemLayout` for fixed-height items (30-50% scroll perf improvement)
  - `renderItem` defined outside JSX and wrapped in `useCallback`
  - List items wrapped in `React.memo`
  - `windowSize={7}` for memory-constrained devices
  - `removeClippedSubviews={true}`
- Animate with `transform: [{scale}]` instead of changing `width`/`height` directly
- Always set `useNativeDriver: true` for `transform` and `opacity` animations
- Use `InteractionManager.runAfterInteractions()` for heavy post-animation work

---

## Animations

- Use `useNativeDriver: true` for any animation on `transform` or `opacity`
- Prefer **React Native Reanimated 3** for complex/gesture-driven animations (runs on UI thread)
- Animation types: `Animated.timing()` (default), `Animated.spring()` (bouncy), `Animated.decay()` (momentum)
- Compose: `sequence`, `parallel`, `stagger`, `loop`

---

## TypeScript

- Use `interface` for component Props, `type` for unions/intersections
- Enable `strict: true` in tsconfig
- Create a typed theme hook: `export const useAppTheme = () => useTheme<AppTheme>()`
- Use path aliases (`@components/*`, `@hooks/*`) for large projects

---

## Platform-Specific

- Use `Platform.select({ ios, android, default })` for inline differences
- Use `.ios.tsx` / `.android.tsx` file extensions for full implementation divergence
- iOS: Human Interface Guidelines — swipe-back, subtle shadows, rounded corners
- Android: Material Design — ripple feedback, bold typography, vibrant elevation shadows

---

## Expo Router - Navigation

### File Structure
```
src/app/
├── _layout.tsx          # Root layout — providers, fonts, splash
├── index.tsx            # "/" route
├── (tabs)/              # Route group — no URL effect
│   ├── _layout.tsx      # Tab navigator
│   ├── index.tsx
│   └── settings.tsx
├── modal.tsx
└── profile/[userId].tsx # Dynamic route
```

### Key Rules
- `src/app/` is **exclusively** for route definitions — no business logic
- Route groups `(name)/` don't affect the URL
- Always call `SplashScreen.preventAutoHideAsync()` before loading assets/fonts

### Root Layout Pattern
```tsx
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ ... });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </PaperProvider>
  );
}
```

### Protected Routes
```tsx
<Stack>
  <Stack.Protected guard={isLoggedIn}>
    <Stack.Screen name="(tabs)" />
  </Stack.Protected>
  <Stack.Protected guard={!isLoggedIn}>
    <Stack.Screen name="sign-in" />
  </Stack.Protected>
</Stack>
```

### Navigation API
```tsx
router.push('/profile/123');   // push to stack
router.replace('/home');       // replace, no back button
router.back();                 // go back
router.navigate('/feed');      // smart navigate
<Link href="/profile/123">View</Link>
```

---

## Project Folder Structure

```
src/
├── app/          # Routes ONLY
├── components/   # Reusable UI (colocate .test.tsx files)
├── screens/      # Page-specific complex UI
├── hooks/        # Custom React hooks
├── utils/        # Pure helper functions
├── constants/    # Theme colors, sizes, config
└── types/        # Shared TypeScript interfaces
```

---

## React Native Paper

### Setup
```tsx
// _layout.tsx root
<PaperProvider theme={MD3LightTheme}>
  <App />
</PaperProvider>
```

### Custom Theme
```tsx
const lightTheme = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, primary: '#6750A4' },
  roundness: 3,
};
export type AppTheme = typeof lightTheme;
export const useAppTheme = () => useTheme<AppTheme>();
```

### Dark/Light Toggle
```tsx
const [isThemeDark, setIsThemeDark] = useState(false);
const theme = isThemeDark ? darkTheme : lightTheme;
```

### Modal Context Fix
Components inside React Native `Modal` lose Paper theme context — re-wrap:
```tsx
<Modal>
  <ThemeProvider theme={theme}>
    <ModalContent />
  </ThemeProvider>
</Modal>
```

### Common Components
```tsx
// Buttons
<Button mode="contained" onPress={fn}>Primary</Button>
<Button mode="outlined" onPress={fn}>Secondary</Button>
<Button mode="text" onPress={fn}>Tertiary</Button>

// TextInput
<TextInput label="Email" mode="outlined" value={email} onChangeText={setEmail} />

// Snackbar
<Snackbar visible={visible} onDismiss={() => setVisible(false)} duration={3000}>
  Message
</Snackbar>
```

---

## State Management

| State Type | Solution |
|---|---|
| UI-only (input, toggle) | `useState` — keep local |
| Shared between siblings | Lift to parent |
| Global app state | Zustand or Context |
| Server/async data | TanStack Query |
| Complex transitions | `useReducer` |
| Form state | `react-hook-form` |

- Never mutate state directly — always spread or use functional updates
- `useCallback` for functions passed to memoized children
- `useMemo` for expensive computations (only when profiler shows bottleneck)
- Avoid `useEffect` with state in deps that sets that same state → infinite loop

---

## Expo Go vs Development Builds

**Use Expo Go** for: learning, prototyping, Expo SDK-only apps.

**Switch to Development Builds** when:
- Any library with custom native code (maps, payments, biometrics)
- Push notifications
- OAuth / deep linking with API keys passed to native
- Approaching production

---

## Common Pitfalls

| Pitfall | Fix |
|---|---|
| `ScrollView` for long lists | `FlatList` / `SectionList` |
| Inline `renderItem` in FlatList | Extract + `useCallback` |
| Array index as `keyExtractor` | Use stable `item.id` |
| Animating `width`/`height` | Use `transform: [{scale}]` |
| `useNativeDriver: false` | Set to `true` whenever possible |
| `console.log` in production | `babel-plugin-transform-remove-console` |
| Business logic in route files | Move to `screens/` or `hooks/` |
| Missing `SafeAreaView` | Wrap screen root |
| Modal losing Paper theme | Re-wrap with `ThemeProvider` |
| Hardcoded API keys | `expo-constants` + EAS Secrets |
| Testing push notifications in Expo Go | Use a development build |
