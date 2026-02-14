import { StyleProp, ViewStyle } from "react-native";
import React, { ReactNode } from "react";
import { Button as PaperButton } from "react-native-paper";
import { useRouter } from "expo-router";

interface ButtonProps {
  onClick?: () => void;
  href?: string;
  icon?: string;
  children?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
  loading?: boolean;
}

const Button = ({
  onClick,
  href,
  containerStyle,
  icon,
  children,
  disabled,
  mode = "contained",
  loading,
}: ButtonProps) => {
  const router = useRouter();

  function handlePress() {
    if (onClick) onClick();
    if (href != null) router.push(href as any);
  }

  return (
    <PaperButton
      mode={mode}
      onPress={handlePress}
      icon={icon}
      disabled={disabled}
      loading={loading}
      style={[{ marginVertical: 6, borderRadius: 8 }, containerStyle]}
      contentStyle={{ paddingVertical: 6, flexDirection: "row", gap: 8 }}
      labelStyle={{ fontSize: 16, fontWeight: "600" }}
    >
      {children}
    </PaperButton>
  );
};

export default Button;
