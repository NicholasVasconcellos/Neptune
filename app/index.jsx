import {
  StyleSheet,
  Text,
  View,
  Image,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { Link, router } from "expo-router";
import Card from "../components/Card";
import Button from "../components/Button";
import ThemedText from "../components/ThemedText";
import Logo from "../assets/NeptuneAppIcon.png";

import { useAuth } from "../context/AuthContext";

import { Colors } from "../Styles/Theme";

// Icons
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import FireIcon from "../components/Icons/FireIcon";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

/* Home Page */
const Home = () => {
  // Get the Curr Color Theme
  const theme = Colors[useColorScheme()] || Colors.light;
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) {
      router.replace("/(tabs)");
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

      {/* <Button
        icon={
          <MaterialCommunityIcons
            name="timer-outline"
            size={24}
            color={theme.text}
          />
        }
        href={"/addData"}
      >
        Add new Times
      </Button>

      <Button
        icon={<FontAwesome6 name="book" size={24} color={theme.text} />}
        href={"/addTraining"}
      >
        Enter New Training
      </Button>

      <Button
        icon={<AntDesign name="line-chart" size={24} color={theme.text} />}
        href={"/viewData"}
      >
        Metrics Dashboard
      </Button>

      <Button
        icon={<FontAwesome5 name="swimmer" size={24} color={theme.text} />}
        href={"/viewTraining"}
      >
        Start a Training
      </Button> */}

      <Button icon={<FireIcon />}>This is a button</Button>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    // Cross Axis:
    // Center this child with the parent
    alignSelf: "center", // center on Parent
    alignItems: "stretch", // Stretch children to full width of parent
    flex: 1,
    gap: 4,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  card: {
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 5,
    boxShadow: "4px 4px rba(0,0,0,0.1)",
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: 20,
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
});
