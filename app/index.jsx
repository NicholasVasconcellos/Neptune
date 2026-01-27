import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import Card from "../Components/Card";

import Logo from "../assets/NeptuneAppIcon.png";

/* Home Page */
const Home = () => {
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.image}></Image>
      <Link href="/addTraining" style={styles.link}></Link>
      <Card>
        <Text>This is a card text</Text>
      </Card>
      <Text style={styles.title}>Welcome to Neptune Swim</Text>
      <Text style={styles.card}>Enter Data</Text>
      <Text style={styles.card}>View Data</Text>
      <Text style={styles.card}>Live Training</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
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
    marginVertical: 2,
    width: "50%",
    height: "50%",
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
});
