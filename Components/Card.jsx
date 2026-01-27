import { useColorScheme, View } from "react-native";

import { Colors } from "../Styles/Colors";

const Card = ({ style, ...args }) => {
  // Get The Color scheme from the device
  // Get the Styles of that theme
  // Colors is an object and theme is a string, use it as the key
  const currTheme = Colors[useColorScheme()] || Colors.light; // Put Light as fallback

  return (
    <View
      style={[
        {
          backgroundColor: currTheme.backgroundColor,
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
