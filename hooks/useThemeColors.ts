import { useColorScheme } from "react-native";
import { Colors } from "../Styles/Theme";

/**
 * Returns resolved theme colors for use in native props (icon color, tabBarStyle, etc.)
 * where CSS variables like var(--color-foreground) cannot be used.
 *
 * For className-based styling, continue using Tailwind classes directly.
 */
export function useThemeColors() {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return {
    foreground: theme.text,
    foregroundMuted: theme.textMuted,
    foregroundDisabled: theme.textDisabled,
    background: theme.background,
    backgroundCard: theme.backgroundCard,
    backgroundModal: theme.backgroundModal,
    placeholder: theme.placeholder,
    border: theme.border,
    primary: Colors.primary,
    danger: Colors.danger,
    success: Colors.success,
  };
}
