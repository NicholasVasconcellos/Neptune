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

export default function Register() {
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
    if (error) {
      alertLog("Shii Bro:", error.message);
    } else if (!session) {
      alertLog("Check inbox for Email Verification!");
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
          formTitle="Set Password"
          placeholder="Create New Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          onClick={signUpWithEmail}
          disabled={loading}
          loading={loading}
          icon="account-plus"
        >
          Create Account
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
