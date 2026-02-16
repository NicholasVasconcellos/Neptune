import { View, Pressable, Keyboard, Platform } from "react-native";
import { useState } from "react";

import Title from "../../components/Title";
import ButtonGrid from "../../components/ButtonGrid";
import { OBJECT_MAP } from "../../constants/objectMap";

const ADD_DATA_TABLES = ["Athletes", "Teams", "Times"];

export default function addData() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const metadata = selectedType ? OBJECT_MAP[selectedType] : null;
  const FormComponent = metadata?.formComponent;

  return (
    <Pressable
      onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
      accessible={false}
    >
      <View>
        <Title>Add your Data</Title>
        <ButtonGrid
          items={ADD_DATA_TABLES}
          selected={selectedType}
          onSelectionChange={setSelectedType}
        />
        {FormComponent && <FormComponent />}
      </View>
    </Pressable>
  );
}
