import { View, Keyboard, Pressable, Platform } from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button, TextInput, Text } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { alertLog } from "@/utils/alertLog";

export default function ForgotPassword() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(emailParam ?? "");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "myneptune://reset-password",
    });
    alertLog(
      "Check your email",
      "If an account exists with that email, you'll receive a password reset link."
    );
    setLoading(false);
    router.back();
  }

  return (
    <Pressable
      onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
      accessible={false}
    >
      <View className="mt-10 p-3 gap-1" accessibilityRole={"form" as any}>
        <Text className="text-on-surface mb-2">
          Enter your email and we'll send you a link to reset your password.
        </Text>
        <TextInput
          label="Email"
          placeholder="email@domain.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button
          onPress={handleResetPassword}
          disabled={loading}
          loading={loading}
        >
          Send Reset Link
        </Button>
      </View>
    </Pressable>
  );
}
