import { useState } from "react";
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import ThemedText from "./ThemedText";
import ThemedInput from "./ThemedInput";
import { Colors } from "../Styles/Theme";

const Typeahead = ({
  array,
  propertyName,
  formTitle,
  placeholderText,
  onSelect,
}) => {
  const theme = Colors[useColorScheme()] ?? Colors.light;
  const styles = getStyles(theme);
  const [inputValue, setInputValue] = useState("");
  const [filteredArray, setFilteredArray] = useState([]);
  const [isDisplayed, setIsDisplayed] = useState(false);

  const onChangeText = (currText) => {
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

  const onOptionClick = (item) => {
    setInputValue(item[propertyName]);
    setIsDisplayed(false);
    // Call the parent callback function if it exists
    onSelect?.(item);
  };

  return (
    <View
      style={[styles.container, isDisplayed && styles.containerActive]}
      accessibilityRole="form"
    >
      <ThemedInput
        formTitle={formTitle}
        value={inputValue}
        onChangeText={onChangeText}
        placeholder={placeholderText}
      ></ThemedInput>
      {isDisplayed && filteredArray.length > 0 && (
        <FlatList
          style={styles.suggestionsContainer}
          data={filteredArray}
          renderItem={({ item }) => (
            <Pressable
              style={styles.suggestionItem}
              onPress={() => onOptionClick(item)}
            >
              <ThemedText>{item[propertyName]}</ThemedText>
            </Pressable>
          )}
          keyExtractor={(entry) => String(entry.id)}
        ></FlatList>
      )}
    </View>
  );
};

export default Typeahead;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 12,
      zIndex: 1,
    },
    containerActive: {
      zIndex: 10,
    },
    suggestionsContainer: {
      position: "absolute",
      top: "100%",
      left: 12,
      right: 12,
      maxHeight: 200,
      borderWidth: 1,
      borderColor: theme.border,
      borderTopWidth: 0,
      backgroundColor: theme.backgroundSuggestion,
      zIndex: 2,
    },
    suggestionItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
  });
