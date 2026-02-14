import { StyleSheet, View, Image, useColorScheme, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { Divider } from "react-native-paper";
import Card from "../../components/Card";
import Button from "../../components/Button";
import ThemedText from "../../components/ThemedText";
import { Colors } from "../../Styles/Theme";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import Logo from "../../assets/NeptuneAppIcon.png";

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
        <ThemedText variant="titleLarge" style={{ fontWeight: "bold" }}>
          Welcome to Neptune Swim
        </ThemedText>
      </Card>
      <Image source={Logo} style={styles.image} resizeMode="contain" />

      <Card>
        <ThemedText variant="titleMedium" style={{ fontWeight: "bold" }}>
          Welcome to Neptune Swim
        </ThemedText>
        <ThemedText variant="bodyMedium">
          Logged in as {session?.user?.email}
        </ThemedText>
      </Card>

      <Divider style={{ marginVertical: 8 }} />

      <Button icon="plus" href={"/addData"}>
        Log Data
      </Button>

      <Button icon="chart-line" href={"/viewData"}>
        View Metrics
      </Button>

      <Button icon="script-text" href={"/addTraining"} mode="outlined">
        Add New Training
      </Button>

      <Button icon="play" href={"/viewTraining"} mode="outlined">
        Start Training
      </Button>

      <Button
        icon="logout"
        onClick={() => supabase.auth.signOut()}
        mode="text"
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
  image: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: 20,
  },
});
