import { View, Keyboard, Pressable, Platform } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Button, TextInput } from "../../components/ui";
import { supabase } from "../../lib/supabase";
import { alertLog } from "../../utils/alertLog";

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
          label="Password"
          placeholder="Enter Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          onPress={signInWithEmail}
          disabled={loading}
          loading={loading}
          icon={<Ionicons name="log-in-outline" size={20} color="#fff" />}
        >
          Sign In
        </Button>
      </View>
    </Pressable>
  );
}
