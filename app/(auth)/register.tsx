import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Keyboard,
  Pressable,
  Platform,
} from "react-native";
import Button from "../../components/Button";
import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { alertLog } from "../../utils/alertLog";
import { Colors } from "../../Styles/Theme";
import ThemedInput from "../../components/ThemedInput";

export default function Register() {
  // Create State Variables
  const theme = Colors[useColorScheme() ?? "light"];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    // if error show native popup Dialog
    if (error) {
      alertLog("Shii Bro:", error.message);
    } else if (!session) {
      alertLog("Check inbox for Email Verification! 📩");
    }
    setLoading(false);
  }

  return (
    <Pressable onPress={() => Platform.OS !== "web" && Keyboard.dismiss()} accessible={false}>
      <View style={styles.container} accessibilityRole={"form" as any}>
        <Text style={[styles.label, { color: theme.text }]}>Email</Text>
        <ThemedInput
          styles={{ marginBottom: 20 }}
          placeholder="email@domain.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={[styles.label, { color: theme.text }]}>Set Password</Text>

        <ThemedInput
          placeholder="Create New Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {/* if Loading disable, onClick callback is the signinWithemail */}
        <Button onClick={signUpWithEmail} disabled={loading}>
          Create Account
        </Button>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 12,
  },
});
