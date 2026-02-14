import { Platform, Alert } from "react-native";

export function alertLog(...messages: string[]) {
  const text = messages.join(" ");
  if (Platform.OS === "web") {
    window.alert(text);
  } else {
    Alert.alert(messages[0], messages.slice(1).join(" ") || undefined);
  }
}
