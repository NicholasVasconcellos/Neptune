import {
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
  useColorScheme,
  TextInput,
} from "react-native";
import Button from "../../components/Button.jsx";
import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Colors } from "../../Styles/Theme";

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
      if (Platform.OS === "web") {
        window.alert("Shii Bro: " + error.message);
      } else {
        Alert.alert("Shii Bro:", error.message);
      }
    } else if (!session) {
      if (Platform.OS === "web") {
        window.alert("Check inbox for Email Verification! 📩");
      } else {
        Alert.alert("Check inbox for Email Verification! 📩");
      }
    }
    setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} acessible={false}>
      <View style={styles.container} accessibilityRole="form">
        <Text style={[styles.label, { color: theme.text }]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            { color: theme.text, borderBlockColor: theme.text },
          ]}
          placeholder="email@domain.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={[styles.label, { color: theme.text }]}>Set Password</Text>
        <TextInput
          style={[
            styles.input,
            { color: theme.text, borderBlockColor: theme.text },
          ]}
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
