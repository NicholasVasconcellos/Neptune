import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import TextInput from "@/components/ui/TextInput";

describe("TextInput", () => {
  it("renders with a label", () => {
    render(<TextInput label="Email" />);
    expect(screen.getByText("Email")).toBeTruthy();
  });

  it("renders without a label when none provided", () => {
    render(<TextInput placeholder="type here" />);
    expect(screen.queryByText("Email")).toBeNull();
    expect(screen.getByPlaceholderText("type here")).toBeTruthy();
  });

  it("handles text change", () => {
    const onChangeText = jest.fn();
    render(
      <TextInput label="Name" onChangeText={onChangeText} placeholder="Enter name" />,
    );
    fireEvent.changeText(screen.getByPlaceholderText("Enter name"), "Alice");
    expect(onChangeText).toHaveBeenCalledWith("Alice");
  });

  it("shows error message when error is true", () => {
    render(
      <TextInput label="Email" error errorMessage="Invalid email address" />,
    );
    expect(screen.getByText("Invalid email address")).toBeTruthy();
  });

  it("does not show error message when error is false", () => {
    render(
      <TextInput
        label="Email"
        error={false}
        errorMessage="Invalid email address"
      />,
    );
    expect(screen.queryByText("Invalid email address")).toBeNull();
  });

  it("toggles password visibility", () => {
    render(
      <TextInput
        label="Password"
        secureTextEntry
        placeholder="Enter password"
      />,
    );
    const input = screen.getByPlaceholderText("Enter password");

    // Initially secure
    expect(input.props.secureTextEntry).toBe(true);

    // Find and press the eye icon toggle
    const toggle = screen.getByTestId("icon-Ionicons");
    fireEvent.press(toggle);

    // After toggle, secureTextEntry should be false (password visible)
    const inputAfter = screen.getByPlaceholderText("Enter password");
    expect(inputAfter.props.secureTextEntry).toBe(false);
  });

  it("toggles password back to hidden on second press", () => {
    render(
      <TextInput
        label="Password"
        secureTextEntry
        placeholder="Enter password"
      />,
    );
    const toggle = screen.getByTestId("icon-Ionicons");

    // Toggle to visible
    fireEvent.press(toggle);
    expect(screen.getByPlaceholderText("Enter password").props.secureTextEntry).toBe(false);

    // Toggle back to hidden
    fireEvent.press(toggle);
    expect(screen.getByPlaceholderText("Enter password").props.secureTextEntry).toBe(true);
  });

  it("does not show toggle when secureTextEntry is not set", () => {
    render(<TextInput label="Email" placeholder="Email" />);
    expect(screen.queryByTestId("icon-Ionicons")).toBeNull();
  });
});
