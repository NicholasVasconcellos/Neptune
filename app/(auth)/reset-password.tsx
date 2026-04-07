import { View, Keyboard, Pressable, Platform } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Button, TextInput, Text, LoadingIndicator } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { alertLog } from "@/utils/alertLog";

export default function ResetPassword() {
  const router = useRouter();
  const { session } = useAuth();
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

  async function handleUpdatePassword() {
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
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      alertLog("Error", error.message);
    } else {
      alertLog("Password Updated", "Your password has been changed successfully.");
      router.replace("/(tabs)");
    }
    setLoading(false);
  }

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center">
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
      accessible={false}
    >
      <View className="mt-10 p-3 gap-1" accessibilityRole={"form" as any}>
        <Text className="text-on-surface mb-2">
          Enter your new password.
        </Text>
        <TextInput
          label="New Password"
          placeholder="Enter new password"
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
        />
        <TextInput
          label="Confirm Password"
          placeholder="Re-enter new password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          error={!!passwordError}
          errorMessage={passwordError}
        />
        <Button
          onPress={handleUpdatePassword}
          disabled={loading || !!passwordError}
          loading={loading}
        >
          Update Password
        </Button>
      </View>
    </Pressable>
  );
}
