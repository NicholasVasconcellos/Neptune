import { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
} from "react-native";

import { TextInput, List, Surface } from "react-native-paper";

interface TypeaheadProps {
  array: Record<string, any>[];
  propertyName: string;
  formTitle?: string;
  placeholderText?: string;
  onSelect?: (item: Record<string, any>) => void;
}

const Typeahead = ({
  array,
  propertyName,
  formTitle,
  placeholderText,
  onSelect,
}: TypeaheadProps) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredArray, setFilteredArray] = useState<Record<string, any>[]>([]);
  const [isDisplayed, setIsDisplayed] = useState(false);

  const onChangeText = (currText: string) => {
    // Update Input Value (for next tick)
    setInputValue(currText);

    // if no Text input set to initial state
    if (!currText || currText.trim() === "") {
      setFilteredArray([]);
      setIsDisplayed(false); // Hide Display
      return;
    }

    // Update the Filtered list
    // For each entry in array include it if it contains currText (case insensitive)
    const currArray = array.filter((entry) =>
      entry[propertyName].toLowerCase().includes(currText.toLowerCase()),
    );

    setFilteredArray(currArray);
    setIsDisplayed(true); // Display
  };

  const onOptionClick = (item: Record<string, any>) => {
    setInputValue(item[propertyName]);
    setIsDisplayed(false);
    // Call the parent callback function if it exists
    onSelect?.(item);
  };

  return (
    <View accessibilityRole={"form" as any} style={[styles.container, isDisplayed && styles.containerActive]}>
      <TextInput
        label={formTitle}
        value={inputValue}
        onChangeText={onChangeText}
        placeholder={placeholderText}
        mode="outlined"
      ></TextInput>
      {isDisplayed && filteredArray.length > 0 && (
        <Surface style={styles.suggestionsContainer} elevation={3}>
          <FlatList
            data={filteredArray}
            renderItem={({ item }) => (
              <List.Item
                title={[item[propertyName]]}
                onPress={() => onOptionClick(item)}
              />
            )}
            keyExtractor={(entry) => String(entry.id)}
            keyboardShouldPersistTaps="handled"
          ></FlatList>
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  containerActive: {
    zIndex: 10,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    maxHeight: 200,
    zIndex: 2,
  },
});

export default Typeahead;
