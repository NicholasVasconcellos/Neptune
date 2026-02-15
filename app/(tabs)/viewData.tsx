import { StyleSheet, View } from "react-native";
import React from "react";
import Title from "../../components/Title";
import ListView from "../../components/ListView";
import AthleteForm from "../../components/InputForms/AthleteForm";

export default function viewData() {
  return (
    <View style={styles.container}>
      <Title>View Data</Title>
      <ListView
        tableName="Athletes"
        createForm={<AthleteForm />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
