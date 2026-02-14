import { StyleSheet, View, Pressable, Text, useColorScheme } from "react-native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Colors, spacing, typography } from "../Styles/Theme";

interface ButtonGridItem {
  key: string;
  label: string;
  icon: string;
  set: "fa5" | "fa6";
}

interface ButtonGridProps {
  items: ButtonGridItem[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
}

export default function ButtonGrid({
  items,
  selected,
  onSelectionChange,
}: ButtonGridProps) {
  const themeName = useColorScheme();
  const theme = Colors[themeName ?? "light"];

  function toggleItem(key: string) {
    if (selected.includes(key)) {
      onSelectionChange(selected.filter((k) => k !== key));
    } else {
      onSelectionChange([...selected, key]);
    }
  }

  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const isSelected = selected.includes(item.key);
        const iconColor = isSelected ? Colors.primary : theme.text;
        const IconComponent = item.set === "fa5" ? FontAwesome5 : FontAwesome6;

        return (
          <Pressable
            key={item.key}
            onPress={() => toggleItem(item.key)}
            style={({ pressed }) => [
              styles.gridItem,
              { backgroundColor: theme.backgroundCard },
              isSelected && styles.gridItemSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.gridLabel, { color: iconColor }]}>
              {item.label}
            </Text>
            <IconComponent name={item.icon as any} size={28} color={iconColor} />
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
