// Color palette

export const Colors = {
  // Global / Shared Colors
  primary: "#4fc3f7",
  primaryDark: "#0288d1",
  success: "#00c853",
  danger: "#ff5252",
  warning: "#cc475a",
  borderFocused: "#4fc3f7",

  // Dark Theme Mode
  dark: {
    background: "#0c1929",
    backgroundSecondary: "rgba(0,0,0,0.2)",
    backgroundCard: "rgba(255,255,255,0.08)",
    backgroundInput: "rgba(255,255,255,0.08)",
    backgroundSuggestion: "#1a3a5c",
    text: "#fff",
    title: "#fff",
    textSecondary: "rgba(255,255,255,0.7)",
    textMuted: "rgba(255,255,255,0.6)",
    textDisabled: "rgba(255,255,255,0.4)",
    placeholder: "rgba(255,255,255,0.4)",
    border: "rgba(255,255,255,0.1)",
    borderLight: "rgba(255,255,255,0.15)",
    navBackground: "#201e2b",
    iconColor: "#9595a5",
    iconColorFocused: "#fff",
    uiBackground: "#2f2b3d",
    dangerLight: "rgba(255,82,82,0.3)",
    dangerBackground: "rgba(255,82,82,0.1)",
    inputFocusedBackground: "rgba(79,195,247,0.1)",
    unitActiveBackground: "rgba(79,195,247,0.2)",
  },

  // Light Theme Mode
  light: {
    background: "#f0f4f8",
    backgroundSecondary: "rgba(0,0,0,0.05)",
    backgroundCard: "#ffffff",
    backgroundInput: "#ffffff",
    backgroundSuggestion: "#e1f5fe",
    text: "#1a2b3c",
    title: "#201e2b",
    textSecondary: "rgba(26,43,60,0.7)",
    textMuted: "rgba(26,43,60,0.5)",
    textDisabled: "rgba(26,43,60,0.3)",
    placeholder: "rgba(26,43,60,0.3)",
    border: "rgba(0,0,0,0.1)",
    borderLight: "rgba(0,0,0,0.05)",
    navBackground: "#e8e7ef",
    iconColor: "#686477",
    iconColorFocused: "#201e2b",
    uiBackground: "#d6d5e1",
    dangerLight: "rgba(255,82,82,0.1)",
    dangerBackground: "rgba(255,82,82,0.05)",
    inputFocusedBackground: "rgba(79,195,247,0.05)",
    unitActiveBackground: "rgba(79,195,247,0.15)",
  },
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// Typography
export const typography = {
  // Font sizes
  sizes: {
    xs: 12,
    sm: 13,
    md: 14,
    l: 16,
    xl: 18,
    xxl: 24,
    giant: 48,
    veryGiant: 64,
  },

  // Font weights
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

// Border radii
export const radii = {
  sm: 10,
  md: 12,
  lg: 16,
};

// Shadows
export const shadows = {
  suggestion: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 20,
  },
};