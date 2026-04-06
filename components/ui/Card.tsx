import React from "react";
import { View } from "react-native";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <View
      className={`my-1.5 rounded-md bg-background-card p-4 border border-border-light ${className}`}
    >
      {children}
    </View>
  );
}
