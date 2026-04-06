import React from "react";
import { Pressable, ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import Text from "./Text";

const variantStyles = {
  contained: {
    base: "bg-primary rounded-lg px-6 py-3",
    pressed: "opacity-80",
    text: "text-white font-semibold text-base",
    disabled: "bg-primary/40",
  },
  outlined: {
    base: "border border-primary rounded-lg px-6 py-3 bg-transparent",
    pressed: "bg-primary/10",
    text: "text-primary font-semibold text-base",
    disabled: "border-primary/40",
  },
  text: {
    base: "px-4 py-2 bg-transparent",
    pressed: "bg-primary/10 rounded-lg",
    text: "text-primary font-semibold text-base",
    disabled: "opacity-40",
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
      className={`my-1.5 flex-row items-center justify-center gap-2 ${styles.base} ${disabled ? styles.disabled : ""} ${className}`}
      style={({ pressed }) =>
        pressed && !disabled ? { opacity: 0.8 } : undefined
      }
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
              className={`${styles.text} ${disabled ? "opacity-50" : ""}`}
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
