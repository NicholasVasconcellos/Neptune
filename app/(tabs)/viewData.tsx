import { StyleSheet, View } from "react-native";
import { useState } from "react";
import ButtonGrid from "../../components/ButtonGrid";
import Title from "../../components/Title";
import ListView from "../../components/ListView";
import { OBJECT_MAP } from "../../constants/objectMap";


export default function viewData() {
  const [selectedTable, setSelectedTable] = useState<string | null>("Athletes");

  const metadata = selectedTable ? OBJECT_MAP[selectedTable] : null;
  const FormComponent = metadata?.formComponent;

  return (
    <View style={styles.container}>
      <Title>View Data</Title>
      <ButtonGrid
        items={["Athletes", "Teams", "Times"]}
        selected={selectedTable}
        onSelectionChange={setSelectedTable}
      />
      {selectedTable && metadata && FormComponent && (
        <ListView
          tableName={metadata.tableName}
          createForm={<FormComponent />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
