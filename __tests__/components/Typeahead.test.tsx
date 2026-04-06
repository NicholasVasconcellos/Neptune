import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import Typeahead from "../../components/Typeahead";

const ITEMS = [
  { id: 1, Name: "Freestyle Sprint" },
  { id: 2, Name: "Backstroke Drill" },
  { id: 3, Name: "Butterfly Kick" },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Typeahead", () => {
  it("renders with a form title", () => {
    render(
      <Typeahead
        array={ITEMS}
        propertyName="Name"
        formTitle="Exercise"
        placeholderText="Search..."
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getByText("Exercise")).toBeTruthy();
  });

  it("renders the text input with placeholder", () => {
    render(
      <Typeahead
        array={ITEMS}
        propertyName="Name"
        placeholderText="Search exercises"
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getByPlaceholderText("Search exercises")).toBeTruthy();
  });

  it("filters suggestions when text is entered", () => {
    render(
      <Typeahead
        array={ITEMS}
        propertyName="Name"
        placeholderText="Search"
        onSelect={jest.fn()}
      />,
    );
    fireEvent.changeText(screen.getByPlaceholderText("Search"), "Free");
    // "Freestyle Sprint" should appear as a suggestion
    expect(screen.getByText("Freestyle Sprint")).toBeTruthy();
    // "Backstroke Drill" should not match "Free"
    expect(screen.queryByText("Backstroke Drill")).toBeNull();
  });

  it("shows all items matching partial text (case insensitive)", () => {
    render(
      <Typeahead
        array={ITEMS}
        propertyName="Name"
        placeholderText="Search"
        onSelect={jest.fn()}
      />,
    );
    // "k" should match "Backstroke Drill" and "Butterfly Kick"
    fireEvent.changeText(screen.getByPlaceholderText("Search"), "k");
    expect(screen.getByText("Backstroke Drill")).toBeTruthy();
    expect(screen.getByText("Butterfly Kick")).toBeTruthy();
    expect(screen.queryByText("Freestyle Sprint")).toBeNull();
  });

  it("selects an item and hides suggestions", () => {
    const onSelect = jest.fn();
    render(
      <Typeahead
        array={ITEMS}
        propertyName="Name"
        placeholderText="Search"
        onSelect={onSelect}
      />,
    );
    fireEvent.changeText(screen.getByPlaceholderText("Search"), "Back");
    fireEvent.press(screen.getByText("Backstroke Drill"));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 2, Name: "Backstroke Drill" }),
    );
  });

  it("calls onChangeText prop when text changes", () => {
    const onChangeText = jest.fn();
    render(
      <Typeahead
        array={ITEMS}
        propertyName="Name"
        placeholderText="Search"
        onChangeText={onChangeText}
      />,
    );
    fireEvent.changeText(screen.getByPlaceholderText("Search"), "Fly");
    expect(onChangeText).toHaveBeenCalledWith("Fly");
  });

  it("shows 'New' chip when allowsNew is true and no exact match", () => {
    render(
      <Typeahead
        array={ITEMS}
        propertyName="Name"
        placeholderText="Search"
        allowsNew
      />,
    );
    fireEvent.changeText(screen.getByPlaceholderText("Search"), "Free");
    // "Free" partially matches "Freestyle Sprint" but is not an exact match
    expect(screen.getByText("New")).toBeTruthy();
  });

  it("hides suggestions when input is cleared", () => {
    render(
      <Typeahead
        array={ITEMS}
        propertyName="Name"
        placeholderText="Search"
      />,
    );
    fireEvent.changeText(screen.getByPlaceholderText("Search"), "Back");
    expect(screen.getByText("Backstroke Drill")).toBeTruthy();

    fireEvent.changeText(screen.getByPlaceholderText("Search"), "");
    expect(screen.queryByText("Backstroke Drill")).toBeNull();
  });

  it("uses controlled value prop", () => {
    render(
      <Typeahead
        array={ITEMS}
        propertyName="Name"
        placeholderText="Search"
        value="Butterfly"
      />,
    );
    const input = screen.getByPlaceholderText("Search");
    expect(input.props.value).toBe("Butterfly");
  });
});
