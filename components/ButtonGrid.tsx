import { View, Pressable } from "react-native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Text } from "./ui";
import { OBJECT_MAP } from "../constants/objectMap";
import { useThemeColors } from "../hooks/useThemeColors";

interface ButtonGridProps {
  items: string[];
  selected: string | null;
  onSelectionChange: (selected: string | null) => void;
}

export default function ButtonGrid({
  items,
  selected,
  onSelectionChange,
}: ButtonGridProps) {
  const colors = useThemeColors();

  function handlePress(tableName: string) {
    if (selected === tableName) {
      onSelectionChange(null);
    } else {
      onSelectionChange(tableName);
    }
  }

  return (
    <View className="flex-row flex-wrap gap-md mb-xl px-lg">
      {items.map((tableName) => {
        const metadata = OBJECT_MAP[tableName];
        if (!metadata) return null;

        const isSelected = selected === tableName;
        const IconComponent =
          metadata.iconSet === "fa5" ? FontAwesome5 : FontAwesome6;

        return (
          <Pressable
            key={tableName}
            onPress={() => handlePress(tableName)}
            className={`w-[30%] aspect-square rounded-md items-center justify-center gap-sm border-2 bg-background-card ${
              isSelected ? "border-primary" : "border-transparent"
            }`}
            style={({ pressed }) => (pressed ? { opacity: 0.5 } : undefined)}
          >
            <Text
              variant="body"
              className={`text-base font-semibold ${
                isSelected ? "text-primary" : "text-foreground"
              }`}
            >
              {metadata.label}
            </Text>
            <IconComponent
              name={metadata.icon as any}
              size={28}
              color={isSelected ? colors.primary : colors.foreground}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
