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

const Typeahead = ({ array, formTitle, placeholderText }) => {
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
      entry.toLowerCase().includes(currText.toLowerCase()),
    );

    setFilteredArray(currArray);
    setIsDisplayed(true); // Display
  };

  const onOptionClick = (option) => {
    // Update input to match selection
    setInputValue(option);
    // Hide the display
    setIsDisplayed(false);
  };

  return (
    <View style={styles.container} accessibilityRole="form">
      <ThemedText>{formTitle}</ThemedText>
      <ThemedInput
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
              onPress={() => {
                setInputValue(item);
                setIsDisplayed(false);
              }}
            >
              <ThemedText>{item}</ThemedText>
            </Pressable>
          )}
          keyExtractor={(entry) => entry}
        ></FlatList>
      )}
    </View>
  );
};

export default Typeahead;

const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 12,
  },
});

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 40,
      padding: 12,
    },
    suggestionsContainer: {
      maxHeight: 200,
      borderWidth: 1,
      borderColor: theme.border,
      borderTopWidth: 0,
      backgroundColor: theme.backgroundSuggestion,
    },
    suggestionItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
  });
