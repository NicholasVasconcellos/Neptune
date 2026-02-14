import { StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import Title from "../../components/Title";

// Have this populate the trainign in real time
// Display the timer
// Display curr SEt and exercise

const viewTraining = () => {
  return (
    <View style={styles.container}>
      <Title>Start a Training Now</Title>
      <Text variant="bodyLarge">Select a training to begin</Text>
      {/* Display List of Trainign with search bar at top by name */}
      {/* Same Display on the view data for selecting */}
    </View>
  );
};

export default viewTraining;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
  },
});
