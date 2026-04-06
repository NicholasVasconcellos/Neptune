import React, { useEffect } from "react";
import { View, Animated } from "react-native";
import Text from "./Text";

interface SnackbarProps {
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

export default function Snackbar({
  visible,
  onDismiss,
  duration = 3000,
  children,
  className = "",
}: SnackbarProps) {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, duration);

      return () => clearTimeout(timer);
    } else {
      opacity.setValue(0);
    }
  }, [visible, duration, onDismiss, opacity]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{ opacity, position: "absolute", bottom: 24, left: 16, right: 16 }}
    >
      <View className={`rounded-lg bg-foreground px-4 py-3 ${className}`}>
        <Text className="text-background text-sm">{children}</Text>
      </View>
    </Animated.View>
  );
}
