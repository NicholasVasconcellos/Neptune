import { StyleSheet, View, Image, useColorScheme } from "react-native";
import React from "react";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import ThemedText from "../../../components/ThemedText";
import { Colors } from "../../../Styles/Theme";
import { useAuth } from "../../../context/AuthContext";
import Logo from "../../../assets/NeptuneAppIcon.png";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Home = () => {
  const theme = Colors[useColorScheme()] || Colors.light;
  const { session } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
        href={"/(protected)/(tabs)/addData"}
      >
        Log Data
      </Button>

      <Button
        icon={
          <FontAwesome6 name="chart-line" size={24} color={theme.text} />
        }
        href={"/(protected)/(tabs)/viewData"}
      >
        View Metrics
      </Button>

      <Button
        icon={
          <FontAwesome6 name="scroll" size={24} color={theme.text} />
        }
        href={"/(protected)/(tabs)/addTraining"}
      >
        Add New Training
      </Button>

      <Button
        icon={
          <FontAwesome6 name="play" size={24} color={theme.text} />
        }
        href={"/(protected)/(tabs)/viewTraining"}
      >
        Start Training
      </Button>
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
