import React from "react";
import {
  Modal as RNModal,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "./Text";
import { useThemeColors } from "../../hooks/useThemeColors";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
  className = "",
}: ModalProps) {
  const colors = useThemeColors();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1 justify-center bg-black/50 p-6"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          className={`rounded-2xl bg-background-card p-4 max-h-[85%] ${className}`}
        >
          {title && (
            <View className="flex-row items-center justify-between mb-2">
              <Text variant="title">{title}</Text>
              <Pressable
                onPress={onClose}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.foreground}
                />
              </Pressable>
            </View>
          )}
          {children}
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
