import {
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
  useColorScheme,
  Pressable,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Button from "../../components/Button.jsx";
import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Colors } from "../../Styles/Theme";
import ThemedInput from "../../components/ThemedInput.jsx";

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
      if (Platform.OS === "web") {
        window.alert(error.message);
      } else {
        Alert.alert("Error signing in big dog", error.message);
      }
    }
    setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} acessible={false}>
      <View style={styles.container} accessibilityRole="form">
        <Text style={[styles.label, { color: theme.text }]}>Email</Text>
        <ThemedInput
          styles={{ marginBottom: 20 }}
          placeholder="email@domain.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={[styles.label, { color: theme.text }]}>Password</Text>
        <ThemedInput
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
});
