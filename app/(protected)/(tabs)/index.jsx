import { StyleSheet, View, useColorScheme } from "react-native";
import React from "react";
import Card from "../../../components/Card";
import ThemedText from "../../../components/ThemedText";
import { Colors } from "../../../Styles/Theme";
import { useAuth } from "../../../context/AuthContext";

const Home = () => {
  const theme = Colors[useColorScheme()] || Colors.light;
  const { session } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card>
        <ThemedText style={styles.title}>Welcome to Neptune Swim</ThemedText>
        <ThemedText>
          Logged in as {session?.user?.email}
        </ThemedText>
      </Card>
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
    marginBottom: 8,
  },
});
