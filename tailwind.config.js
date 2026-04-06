/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand / static colors
        primary: { DEFAULT: "#4fc3f7", dark: "#0288d1" },
        success: "#00c853",
        danger: "#ff5252",
        warning: "#cc475a",

        // Semantic colors via CSS custom properties (auto-switch dark/light)
        background: {
          DEFAULT: "var(--color-background)",
          secondary: "var(--color-background-secondary)",
          card: "var(--color-background-card)",
          input: "var(--color-background-input)",
          suggestion: "var(--color-background-suggestion)",
        },
        surface: "var(--color-surface)",
        foreground: {
          DEFAULT: "var(--color-foreground)",
          secondary: "var(--color-foreground-secondary)",
          muted: "var(--color-foreground-muted)",
          disabled: "var(--color-foreground-disabled)",
        },
        placeholder: "var(--color-placeholder)",
        border: {
          DEFAULT: "var(--color-border)",
          light: "var(--color-border-light)",
          focused: "#4fc3f7",
        },
        nav: "var(--color-nav)",
        icon: {
          DEFAULT: "var(--color-icon)",
          focused: "var(--color-icon-focused)",
        },
        ui: "var(--color-ui)",
        "danger-light": "var(--color-danger-light)",
        "danger-bg": "var(--color-danger-bg)",
        "input-focused": "var(--color-input-focused)",
        "unit-active": "var(--color-unit-active)",
      },
      borderRadius: {
        sm: "10px",
        md: "12px",
        lg: "16px",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        xxl: "24px",
      },
    },
  },
  plugins: [],
};
