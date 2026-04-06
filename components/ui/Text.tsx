import React from "react";
import { Text as RNText, type TextProps as RNTextProps } from "react-native";

const variantClasses = {
  body: "text-sm text-foreground",
  "body-sm": "text-xs text-foreground",
  label: "text-xs text-foreground-muted uppercase tracking-wide",
  "label-sm": "text-[11px] text-foreground-muted",
  title: "text-lg font-semibold text-foreground",
  headline: "text-2xl font-bold text-foreground",
  display: "text-5xl font-bold text-foreground",
} as const;

export type TextVariant = keyof typeof variantClasses;

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  className?: string;
}

export default function Text({
  variant = "body",
  className = "",
  ...props
}: TextProps) {
  return (
    <RNText
      className={`${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
