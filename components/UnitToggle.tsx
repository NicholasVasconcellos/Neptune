import * as React from "react";
import { StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";

const UnitToggle = () => {
  const [value, setValue] = React.useState("");

  return (
    <SegmentedButtons
      style={styles.container}
      value={value}
      onValueChange={setValue}
      buttons={[
        {
          value: "meters",
          label: "Meters",
        },
        {
          value: "yards",
          label: "Yards",
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});

export default UnitToggle;
