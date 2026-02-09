import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import Button from "../../../components/Button";

const addData = () => {
  return (
    <View>
      <Text>addData</Text>
      <Text>Add any new Data Here</Text>
      <Text>Select Object to add (todo) will list the icons</Text>
      {/* After selecting Icons, will selectively populate input forms */}
      {/* input forms will have typeahed, and will detect when an entry is new and put a "new" tag */}
      {/* if Creating a new object, any required fields will be further populated as dropdown */}
      {/* Upon Form submission Log message appears to say Created blablabla */}

      
      <Button href={"/"}>Back Home</Button>
    </View>
  );
};

export default addData;

const styles = StyleSheet.create({});
