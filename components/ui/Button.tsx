import React from "react";
import { Pressable, ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import Text from "./Text";
import { useThemeColors } from "../../hooks/useThemeColors";

type ButtonVariant = "contained" | "outlined" | "text";

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
  const colors = useThemeColors();

  function handlePress() {
    if (disabled || loading) return;
    onPress?.();
    if (href) router.push(href as any);
  }

  const isContained = variant === "contained";
  const isOutlined = variant === "outlined";

  const bgColor = isContained ? colors.primary : "transparent";
  const textColor = isContained ? colors.onPrimary : colors.primary;
  const borderStyle = isOutlined
    ? { borderWidth: 1, borderColor: colors.primary }
    : undefined;

  const baseClass = isContained || isOutlined
    ? "rounded-lg px-6 py-3"
    : "px-4 py-2";

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      className={`my-1.5 flex-row items-center justify-center gap-2 ${baseClass} ${disabled ? "opacity-40" : ""} ${className}`}
      style={({ pressed }) => ({
        backgroundColor: bgColor,
        ...borderStyle,
        ...(pressed && !disabled ? { opacity: 0.8 } : undefined),
      })}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          {typeof children === "string" ? (
            <Text
              className="font-semibold text-base"
              style={{ color: textColor, opacity: disabled ? 0.5 : 1 }}
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
