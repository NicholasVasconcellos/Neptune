import React from "react";
import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  return (
    <View
      className={`flex-row items-center gap-2 rounded-lg bg-background-input border border-border px-3 py-2 m-3 ${className}`}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color="var(--color-foreground-muted)"
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="var(--color-placeholder)"
        className="flex-1 text-sm text-foreground py-1"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <Ionicons
            name="close-circle"
            size={18}
            color="var(--color-foreground-muted)"
          />
        </Pressable>
      )}
    </View>
  );
}
