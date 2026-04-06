import { View, Keyboard, Pressable, Platform } from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button, TextInput, Text } from "../../components/ui";
import { supabase } from "../../lib/supabase";
import { alertLog } from "../../utils/alertLog";

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
    } = await supabase.auth.signUp({ email, password });
    if (error) {
      alertLog("Shii Bro:", error.message);
    } else if (!session) {
      alertLog(
        "Check Your Email",
        "We've sent a confirmation link to your inbox. Please verify your email to get started.",
      );
    }
    setLoading(false);
  }

  return (
    <Pressable
      onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
      accessible={false}
    >
      <View className="mt-10 p-3 gap-1" accessibilityRole={"form" as any}>
        <TextInput
          label="Email"
          placeholder="email@domain.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Set Password"
          placeholder="Create New Password"
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
        />
        <TextInput
          label="Confirm Password"
          placeholder="Re-enter Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          error={!!passwordError}
          errorMessage={passwordError}
        />
        <Button
          onPress={signUpWithEmail}
          disabled={loading || !!passwordError}
          loading={loading}
          icon={
            <Ionicons name="person-add-outline" size={20} color="#fff" />
          }
        >
          Create Account
        </Button>
      </View>
    </Pressable>
  );
}
