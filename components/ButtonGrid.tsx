import { StyleSheet, View, Pressable, Text, useColorScheme } from "react-native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Colors, spacing, typography } from "../Styles/Theme";
import { OBJECT_MAP } from "../constants/objectMap";

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
  const themeName = useColorScheme();
  const theme = Colors[themeName ?? "light"];

  function handlePress(tableName: string) {
    if (selected === tableName) {
      onSelectionChange(null);
    } else {
      onSelectionChange(tableName);
    }
  }

  return (
    <View style={styles.grid}>
      {items.map((tableName) => {
        const metadata = OBJECT_MAP[tableName];
        if (!metadata) return null;

        const isSelected = selected === tableName;
        const iconColor = isSelected ? Colors.primary : theme.text;
        const IconComponent =
          metadata.iconSet === "fa5" ? FontAwesome5 : FontAwesome6;

        return (
          <Pressable
            key={tableName}
            onPress={() => handlePress(tableName)}
            style={({ pressed }) => [
              styles.gridItem,
              { backgroundColor: theme.backgroundCard },
              isSelected && styles.gridItemSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.gridLabel, { color: iconColor }]}>
              {metadata.label}
            </Text>
            <IconComponent
              name={metadata.icon as any}
              size={28}
              color={iconColor}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  gridItem: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  gridItemSelected: {
    borderColor: Colors.primary,
  },
  pressed: {
    opacity: 0.5,
  },
  gridLabel: {
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.semibold,
  },
});
