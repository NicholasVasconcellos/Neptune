import {
  StyleSheet,
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

export default function Login() {
  // Create State Variables
  const theme = Colors[useColorScheme() ?? "light"];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // if error show native popup Dialog
    if (error) {
      alertLog("Error signing in big dog", error.message);
    }
    setLoading(false);
  }

  return (
    <Pressable onPress={() => Platform.OS !== "web" && Keyboard.dismiss()} accessible={false}>
      <View accessibilityRole={"form" as any}>
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
        {/*
          if Loading disable the button
          onClick callback is the signinWithemail
        */}
        <Button onClick={signInWithEmail} disabled={loading}>
          Sign In
        </Button>
      </View>
    </Pressable>
  );
}
