import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors } from "../../Styles/Theme";
import { useColorScheme } from "react-native";

// Allow Overwrite of Size or Color, if none provided will use
// Size 24 and color the theme's default

export default function FireIcon(size = 24, color) {
  const theme = Colors[useColorScheme()] || Colors["light"];
  // Apply the text color to be theme.text
  return <FontAwesome5 name="fire-alt" size={24} color={theme.text} />;
}
