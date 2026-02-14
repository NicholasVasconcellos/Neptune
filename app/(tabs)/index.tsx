import { StyleSheet, View, Image, useColorScheme, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import Card from "../../components/Card";
import Button from "../../components/Button";
import ThemedText from "../../components/ThemedText";
import { Colors } from "../../Styles/Theme";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import Logo from "../../assets/NeptuneAppIcon.png";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Home = () => {
  const theme = Colors[useColorScheme() ?? "light"];
  const { session } = useAuth();

  useEffect(() => {
    if (!session) {
      router.replace("../" as any);
    }
  }, [session]);

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <Card>
        <ThemedText style={styles.title}>Welcome to Neptune Swim</ThemedText>
      </Card>
      <Image source={Logo} style={styles.image} resizeMode="contain" />

      <Card>
        <ThemedText style={styles.title}>Welcome to Neptune Swim</ThemedText>
        <ThemedText>Logged in as {session?.user?.email}</ThemedText>
      </Card>

      <Button
        icon={
          <FontAwesome6 name="add" size={24} color={theme.text} />
        }
        href={"/addData"}
      >
        Log Data
      </Button>

      <Button
        icon={
          <FontAwesome6 name="chart-line" size={24} color={theme.text} />
        }
        href={"/viewData"}
      >
        View Metrics
      </Button>

      <Button
        icon={
          <FontAwesome6 name="scroll" size={24} color={theme.text} />
        }
        href={"/addTraining"}
      >
        Add New Training
      </Button>

      <Button
        icon={
          <FontAwesome6 name="play" size={24} color={theme.text} />
        }
        href={"/viewTraining"}
      >
        Start Training
      </Button>

      <Button
        icon={
          <FontAwesome6 name="right-from-bracket" size={24} color={theme.text} />
        }
        onClick={() => supabase.auth.signOut()}
      >
        Log Out
      </Button>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    alignItems: "stretch",
    gap: 4,
    paddingVertical: 20,
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
