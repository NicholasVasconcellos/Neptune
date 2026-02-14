import { useColorScheme, View, ViewProps, StyleProp, ViewStyle } from "react-native";
import { Colors } from "../Styles/Theme";

interface CardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

const Card = ({ style, ...args }: CardProps) => {
  // Get The Color scheme from the device
  // Get the Styles of that theme
  // Colors is an object and theme is a string, use it as the key
  const currTheme = Colors[useColorScheme() ?? "light"];

  return (
    <View
      style={[
        {
          backgroundColor: currTheme.backgroundCard,
          borderRadius: 5,
          padding: 20,
        },
        style,
      ]}
      {...args}
    ></View>
  );
};

export default Card;
