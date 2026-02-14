import {
  StyleSheet,
  View,
  Image,
  useColorScheme,
} from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import Card from "../components/Card";
import Button from "../components/Button";
import ThemedText from "../components/ThemedText";
import Logo from "../assets/NeptuneAppIcon.png";

import { useAuth } from "../context/AuthContext";

import { Colors } from "../Styles/Theme";

/* Home Page */
const Home = () => {
  const theme = Colors[useColorScheme() ?? "light"];
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) {
      router.replace("/(tabs)" as any);
    }
  }, [session, loading]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (session) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card>
        <ThemedText variant="titleLarge" style={{ fontWeight: "bold" }}>
          Welcome to Neptune Swim
        </ThemedText>
      </Card>
      <Image source={Logo} style={styles.image} resizeMode="contain" />

      <Button icon="login" href={"/login"}>
        Login To Account
      </Button>

      <Button icon="account-plus" href={"/register"} mode="outlined">
        Create new Account
      </Button>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    alignItems: "stretch",
    flex: 1,
    gap: 4,
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: 20,
  },
});
