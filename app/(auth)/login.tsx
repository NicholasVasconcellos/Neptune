import {
  View,
  Keyboard,
  Pressable,
  Platform,
  StyleSheet,
} from "react-native";
import Button from "../../components/Button";
import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { alertLog } from "../../utils/alertLog";
import ThemedInput from "../../components/ThemedInput";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alertLog("Error signing in big dog", error.message);
    }
    setLoading(false);
  }

  return (
    <Pressable onPress={() => Platform.OS !== "web" && Keyboard.dismiss()} accessible={false}>
      <View style={styles.container} accessibilityRole={"form" as any}>
        <ThemedInput
          formTitle="Email"
          placeholder="email@domain.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <ThemedInput
          formTitle="Password"
          placeholder="Enter Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          onClick={signInWithEmail}
          disabled={loading}
          loading={loading}
          icon="login"
        >
          Sign In
        </Button>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
    gap: 4,
  },
});
