import React from "react";
import { Pressable, ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import Text from "./Text";

const variantStyles = {
  contained: {
    base: "rounded-lg px-6 py-3",
    pressed: "opacity-80",
    text: "font-semibold text-base",
    textColor: "#ffffff",
    disabled: "opacity-40",
    bg: "#4fc3f7",
    borderStyle: undefined as any,
  },
  outlined: {
    base: "rounded-lg px-6 py-3",
    pressed: "opacity-80",
    text: "font-semibold text-base",
    textColor: "#4fc3f7",
    disabled: "opacity-40",
    bg: "transparent",
    borderStyle: { borderWidth: 1, borderColor: "#4fc3f7" } as any,
  },
  text: {
    base: "px-4 py-2",
    pressed: "opacity-80",
    text: "font-semibold text-base",
    textColor: "#4fc3f7",
    disabled: "opacity-40",
    bg: "transparent",
    borderStyle: undefined as any,
  },
} as const;

type ButtonVariant = keyof typeof variantStyles;

interface ButtonProps {
  onPress?: () => void;
  href?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  className?: string;
}

export default function Button({
  onPress,
  href,
  icon,
  children,
  disabled = false,
  loading = false,
  variant = "contained",
  className = "",
}: ButtonProps) {
  const router = useRouter();
  const styles = variantStyles[variant];

  function handlePress() {
    if (disabled || loading) return;
    onPress?.();
    if (href) router.push(href as any);
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      className={`my-1.5 flex-row items-center justify-center gap-2 ${styles.base} ${disabled ? styles.disabled : ""} ${className}`}
      style={({ pressed }) => ({
        backgroundColor: styles.bg,
        ...styles.borderStyle,
        ...(pressed && !disabled ? { opacity: 0.8 } : undefined),
      })}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "contained" ? "#fff" : "#4fc3f7"}
        />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          {typeof children === "string" ? (
            <Text
              className={styles.text}
              style={{ color: styles.textColor, opacity: disabled ? 0.5 : 1 }}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </>
      )}
    </Pressable>
  );
}
