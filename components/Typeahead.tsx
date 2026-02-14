import { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Platform } from "react-native";

import { TextInput, List, Surface, Chip, ActivityIndicator } from "react-native-paper";

interface TypeaheadProps {
  array: Record<string, any>[];
  propertyName: string;
  formTitle?: string;
  placeholderText?: string;
  onSelect?: (item: Record<string, any>) => void;
  onChangeText?: (text: string) => void;
  loading?: boolean;
  value?: string;
}

const Typeahead = ({
  array,
  propertyName,
  formTitle,
  placeholderText,
  onSelect,
  onChangeText: onChangeTextProp,
  loading,
  value,
}: TypeaheadProps) => {
  const [inputValue, setInputValue] = useState(value ?? "");

  useEffect(() => {
    if (value !== undefined) setInputValue(value);
  }, [value]);

  const [filteredArray, setFilteredArray] = useState<Record<string, any>[]>([]);
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const onChangeText = (currText: string) => {
    // Update Input Value (queue for next tick)
    setInputValue(currText);
    onChangeTextProp?.(currText);

    // if no Text input set to initial state
    if (!currText || currText.trim() === "") {
      setFilteredArray([]);
      setIsDisplayed(false); // Hide Display
      setIsNew(false);
      return;
    }

    // Get lowecase input
    const currTextLower = currText.toLowerCase();
    //// Update the Filtered list with the entry and check and update exact match if any
    // For each entry in array include it if it contains currText (case insensitive)
    let exactMatch = false;
    const currArray = array.filter((entry) => {
      // Get Lowercase entry
      const entryLower = entry[propertyName].toLowerCase();
      // Check if exact match (case insensitive)
      if (entryLower === currTextLower) exactMatch = true;
      // Include if it contains lowe
      return entryLower.includes(currTextLower);
    });

    setFilteredArray(currArray);
    setIsNew(!exactMatch);

    // if no Match
    if (currArray.length === 0) {
      setIsDisplayed(false);
      return;
    }

    // set Display to true
    setIsDisplayed(true); // Display
  };

  const onOptionClick = (item: Record<string, any>) => {
    setInputValue(item[propertyName]); // Update Input value
    setIsDisplayed(false); // Hide list
    setIsNew(false); // not a new value

    // Call the parent callback function if it exists
    onSelect?.(item);
  };

  return (
    <View
      {...(Platform.OS === "web"
        ? { onSubmit: (e: any) => e.preventDefault() }
        : {})}
      style={[styles.container, isDisplayed && styles.containerActive]}
    >
      <View>
        <TextInput
          label={formTitle}
          value={inputValue}
          onChangeText={onChangeText}
          // Dismis the list when out of focus (delay so that onSelect can run first)
          onBlur={() => setTimeout(() => setIsDisplayed(false), 100)}
          placeholder={placeholderText}
          mode="outlined"
          right={
            loading ? (
              <TextInput.Icon
                icon={() => <ActivityIndicator size="small" />}
              />
            ) : undefined
          }
        />
        {isNew && (
          <Chip mode="flat" style={styles.newChip} compact>
            New
          </Chip>
        )}
      </View>
      {isDisplayed && (
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
          />
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
  newChip: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: "-50%" }],
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
