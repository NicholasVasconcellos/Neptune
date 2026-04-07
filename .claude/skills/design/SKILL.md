# Neptune UI System

## Design Principles

Every screen must feel **clean, distraction-free, and functionally dense**:

- **Minimalist**: Reduce cognitive load. Favor whitespace over decoration. One primary action per view.
- **High Contrast & Functional**: Prioritize readability and speed. Content first, chrome second.
- **Material/Modern**: Rounded containers, clear typography hierarchy, subtle press feedback (opacity).
- **Structured Simplicity**: Like a "second brain" — flexible, powerful, but never cluttered.
- **Adaptable**: Support light/dark mode automatically via CSS custom properties.

---

## Component Library (`components/ui/`)

**Always import from the barrel export:**

```tsx
import { Text, Button, Card, TextInput, ... } from "@/components/ui";
```

### Available Components

| Component          | Use For                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `Text`             | All text. Use `variant` prop: `body`, `body-sm`, `label`, `label-sm`, `title`, `headline`, `display` |
| `Button`           | Actions. Variants: `contained` (primary), `outlined` (secondary), `text` (tertiary)                  |
| `TextInput`        | Form fields. Supports `label`, `error`, `errorMessage`, `secureTextEntry`                            |
| `Card`             | Content containers with border and background                                                        |
| `Modal`            | Overlays with title bar and close button                                                             |
| `SearchBar`        | Filterable search with clear button                                                                  |
| `FAB`              | Floating action button — one per screen max                                                          |
| `Chip`             | Selectable tags, filters                                                                             |
| `SegmentedControl` | Toggle between 2-4 options                                                                           |
| `IconButton`       | Icon-only press targets                                                                              |
| `Divider`          | Section separator                                                                                    |
| `Snackbar`         | Transient feedback messages                                                                          |
| `EmptyState`       | Zero-data views with optional icon                                                                   |
| `LoadingIndicator` | Centered spinner — replaces raw ActivityIndicator                                                    |

**Never build ad-hoc versions of these.** If a component doesn't fit, extend it — don't duplicate it.

---

## Styling Rules

### Use NativeWind (Tailwind) classes via `className`

```tsx
// CORRECT
<View className="flex-row items-center gap-2 px-4 py-3">

// WRONG — no inline style objects for layout
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
```

### Colors — always use semantic tokens

```tsx
// CORRECT — resolves automatically for light/dark
className="bg-background text-foreground border-border"

// For native props (icon color, tab tint) use the hook:
const colors = useThemeColors();
<Ionicons color={colors.primary} />

// WRONG — never hardcode hex values
color="#4fc3f7"  // NO
style={{ backgroundColor: "rgba(0,0,0,0.5)" }}  // NO — use colors.overlay
```

### Key semantic color tokens

| Token                          | Purpose                  |
| ------------------------------ | ------------------------ |
| `bg-background`                | Screen background        |
| `bg-background-card`           | Card/container surfaces  |
| `bg-background-modal`          | Modal surfaces           |
| `text-foreground`              | Primary text             |
| `text-foreground-secondary`    | Secondary text           |
| `text-foreground-muted`        | Tertiary/hint text       |
| `border-border`                | Standard borders         |
| `bg-primary` / `text-primary`  | Brand accent             |
| `text-danger` / `text-success` | Status colors            |
| `bg-overlay`                   | Scrim behind modals      |
| `text-on-primary`              | Text/icons on primary bg |

### Spacing — use Tailwind scale

Standard: `gap-2`, `px-4`, `py-3`, `mt-2`, `mb-1`
Custom tokens available: `xs(4)`, `sm(8)`, `md(12)`, `lg(16)`, `xl(20)`, `xxl(24)`

---

## Screen Composition Pattern

```tsx
export default function NewScreen() {
  const colors = useThemeColors(); // only if needed for native props

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <Text variant="headline" className="text-center mt-6 mb-2">Title</Text>

      {/* Content */}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => ( /* use Card, Text variants */ )}
        ListEmptyComponent={<EmptyState message="Nothing here yet" icon="folder-open-outline" />}
      />

      {/* Primary action */}
      <FAB icon="add" label="Create" onPress={handleAdd} className="absolute right-4 bottom-4" />
    </View>
  );
}
```

---

## Checklist for New Pages

- [ ] Import components from `components/ui` barrel — don't rebuild
- [ ] Use `Text` with proper `variant` — never raw `<RNText>`
- [ ] Use `LoadingIndicator` for loading states
- [ ] Use `EmptyState` for zero-data views
- [ ] All colors via className tokens or `useThemeColors()` — zero hardcoded hex
- [ ] All interactive elements have `accessibilityRole` and `accessibilityLabel`
- [ ] One FAB max per screen, bottom-right
- [ ] `FlatList` for any list that can grow — never `ScrollView` for dynamic data

---

## Technical Stack

- **React Native 0.81** + **Expo SDK 54** + **Expo Router** (file-based)
- **NativeWind v4** (Tailwind CSS for React Native)
- **Supabase** backend (auth, database)
- **Icons**: `@expo/vector-icons/Ionicons` and `FontAwesome6`
- **Theme**: CSS custom properties in `global.css`, JS fallbacks in `Styles/Theme.ts`
- **All components are functional** — no class components, no StyleSheet.create()
