import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Text, Chip } from "./ui";
import { useThemeColors } from "@/hooks/useThemeColors";

interface TypeaheadProps {
  array: Record<string, any>[];
  propertyName: string;
  formTitle?: string;
  placeholderText?: string;
  onSelect?: (item: Record<string, any>) => void;
  onChangeText?: (text: string) => void;
  loading?: boolean;
  value?: string;
  allowsNew?: boolean;
  showOnEmpty?: boolean;
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
  allowsNew = true,
  showOnEmpty = false,
}: TypeaheadProps) => {
  const colors = useThemeColors();
  const [inputValue, setInputValue] = useState(value ?? "");

  useEffect(() => {
    if (value !== undefined) setInputValue(value);
  }, [value]);

  const [filteredArray, setFilteredArray] = useState<Record<string, any>[]>([]);
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [hasNoMatch, setHasNoMatch] = useState(false);

  const onFocus = () => {
    if (showOnEmpty && (!inputValue || inputValue.trim() === "")) {
      setFilteredArray(array);
      setIsDisplayed(array.length > 0);
    }
  };

  const onChangeText = (currText: string) => {
    setInputValue(currText);
    onChangeTextProp?.(currText);

    if (!currText || currText.trim() === "") {
      if (showOnEmpty) {
        setFilteredArray(array);
        setIsDisplayed(array.length > 0);
      } else {
        setFilteredArray([]);
        setIsDisplayed(false);
      }
      setIsNew(false);
      setHasNoMatch(false);
      return;
    }

    const currTextLower = currText.toLowerCase();
    let exactMatch = false;
    const currArray = array.filter((entry) => {
      const entryLower = entry[propertyName].toLowerCase();
      if (entryLower === currTextLower) exactMatch = true;
      return entryLower.includes(currTextLower);
    });

    setFilteredArray(currArray);
    setIsNew(!exactMatch && allowsNew);
    setHasNoMatch(!exactMatch && !allowsNew && currArray.length === 0);

    if (currArray.length === 0) {
      setIsDisplayed(false);
      return;
    }

    setIsDisplayed(true);
  };

  const onOptionClick = (item: Record<string, any>) => {
    setInputValue(item[propertyName]);
    setIsDisplayed(false);
    setIsNew(false);
    onSelect?.(item);
  };

  const borderClass = hasNoMatch
    ? "border-danger"
    : isDisplayed
      ? "border-border-focused"
      : "border-border";

  return (
    <View style={[{ zIndex: isDisplayed ? 10 : 1 }]}>
      <View>
        {formTitle && (
          <Text variant="label-sm" className="mb-1 ml-1">
            {formTitle}
          </Text>
        )}
        <View
          className={`flex-row items-center rounded-md border ${borderClass} bg-background-input px-3`}
        >
          <TextInput
            value={inputValue}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={() =>
              setTimeout(
                () => setIsDisplayed(false),
                Platform.OS === "ios" ? 300 : 100,
              )
            }
            placeholder={placeholderText}
            placeholderTextColor={colors.placeholder}
            className="flex-1 py-3 text-sm text-foreground"
          />
          {loading && <ActivityIndicator size="small" color={colors.primary} />}
          {isNew && <Chip label="New" compact className="ml-1" />}
        </View>
        {hasNoMatch && (
          <Text variant="body-sm" className="mt-1 ml-1 text-danger">
            No matching entry
          </Text>
        )}
      </View>
      {isDisplayed && (
        <View
          className="max-h-[200px] rounded-md border border-border mt-1"
          style={{ backgroundColor: colors.backgroundModal, zIndex: 2 }}
        >
          <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
            {filteredArray.map((item) => (
              <Pressable
                key={String(item.id)}
                onPress={() => onOptionClick(item)}
                className="px-4 py-3 border-b border-border-light"
                style={({ pressed }) =>
                  pressed ? { opacity: 0.7 } : undefined
                }
              >
                <Text>{item[propertyName]}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Typeahead;
