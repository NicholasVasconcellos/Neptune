import { View } from "react-native";
import { useState } from "react";
import ButtonGrid from "../../components/ButtonGrid";
import { Text } from "../../components/ui";
import ListView from "../../components/ListView";
import { OBJECT_MAP } from "../../constants/objectMap";

export default function viewData() {
  const [selectedTable, setSelectedTable] = useState<string | null>("Athletes");

  const metadata = selectedTable ? OBJECT_MAP[selectedTable] : null;
  const FormComponent = metadata?.formComponent;

  return (
    <View className="flex-1">
      <Text variant="headline" className="text-center mt-10 mb-4">
        View Data
      </Text>
      <ButtonGrid
        items={["Athletes", "Groups", "Times"]}
        selected={selectedTable}
        onSelectionChange={setSelectedTable}
      />
      {selectedTable && metadata && FormComponent && (
        <ListView
          tableName={metadata.tableName}
          displayName={metadata.label}
          createForm={<FormComponent />}
        />
      )}
    </View>
  );
}
