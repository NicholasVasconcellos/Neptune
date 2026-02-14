import {
  StyleSheet,
  View,
  Image,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import Card from "../components/Card";
import Button from "../components/Button";
import ThemedText from "../components/ThemedText";
import Logo from "../assets/NeptuneAppIcon.png";

import { useAuth } from "../context/AuthContext";

import { Colors } from "../Styles/Theme";

// Icons
import FireIcon from "../components/Icons/FireIcon";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

/* Home Page */
const Home = () => {
  // Get the Curr Color Theme
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
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (session) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card>
        <ThemedText style={styles.title}>Welcome to Neptune Swim</ThemedText>
      </Card>
      <Image source={Logo} style={styles.image} resizeMode="contain" />

      <Button
        icon={
          <MaterialCommunityIcons
            name="timer-outline"
            size={24}
            color={theme.text}
          />
        }
        href={"/login"}
      >
        Login To Account
      </Button>

      <Button
        icon={
          <MaterialCommunityIcons
            name="timer-outline"
            size={24}
            color={theme.text}
          />
        }
        href={"/register"}
      >
        Create new Account
      </Button>

      <Button icon={<FireIcon />}>This is a button</Button>
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
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: 20,
  },
});
