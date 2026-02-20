import {
  View,
  Keyboard,
  Pressable,
  Platform,
  StyleSheet,
} from "react-native";
import { HelperText } from "react-native-paper";
import Button from "../../components/Button";
import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { alertLog } from "../../utils/alertLog";
import ThemedInput from "../../components/ThemedInput";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  function validatePasswords(pw: string, confirmPw: string): string {
    if (confirmPw.length === 0) return "";
    if (pw !== confirmPw) return "Passwords do not match";
    if (pw.length < 6) return "Password must be at least 6 characters";
    return "";
  }

  function handlePasswordChange(text: string) {
    setPassword(text);
    if (confirmPassword.length > 0) {
      setPasswordError(validatePasswords(text, confirmPassword));
    }
  }

  function handleConfirmPasswordChange(text: string) {
    setConfirmPassword(text);
    setPasswordError(validatePasswords(password, text));
  }

  async function signUpWithEmail() {
    if (confirmPassword.length === 0) {
      setPasswordError("Please confirm your password");
      return;
    }
    const validationError = validatePasswords(password, confirmPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

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
      alertLog(
        "Check Your Email",
        "We've sent a confirmation link to your inbox. Please verify your email to get started."
      );
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
          onChangeText={handlePasswordChange}
        />
        <ThemedInput
          formTitle="Confirm Password"
          placeholder="Re-enter Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
        />
        <HelperText type="error" visible={!!passwordError}>
          {passwordError}
        </HelperText>
        <Button
          onClick={signUpWithEmail}
          disabled={loading || !!passwordError}
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
