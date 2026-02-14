import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors } from "../../Styles/Theme";
import { useColorScheme } from "react-native";

// Allow Overwrite of Size or Color, if none provided will use
// Size 24 and color the theme's default

export default function FireIcon({ size = 24, color }: { size?: number; color?: string }) {
  const theme = Colors[useColorScheme() ?? "light"];
  // Apply the text color to be theme.text
  return <FontAwesome5 name="fire-alt" size={size} color={color ?? theme.text} />;
}
