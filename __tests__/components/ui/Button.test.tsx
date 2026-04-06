import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import Button from "@/components/ui/Button";

// Access the mocked router for assertions
const mockRouter = require("expo-router").useRouter();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Button", () => {
  it("renders with text children", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Press</Button>);
    fireEvent.press(screen.getByText("Press"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    render(
      <Button onPress={onPress} disabled>
        Disabled
      </Button>,
    );
    fireEvent.press(screen.getByText("Disabled"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("renders contained variant by default", () => {
    render(<Button>Contained</Button>);
    // The text should render (variant is applied via className)
    expect(screen.getByText("Contained")).toBeTruthy();
  });

  it("renders outlined variant", () => {
    render(<Button variant="outlined">Outlined</Button>);
    expect(screen.getByText("Outlined")).toBeTruthy();
  });

  it("renders text variant", () => {
    render(<Button variant="text">Text Button</Button>);
    expect(screen.getByText("Text Button")).toBeTruthy();
  });

  it("shows ActivityIndicator when loading", () => {
    const { UNSAFE_getByType } = render(<Button loading>Loading</Button>);
    // When loading, children text should NOT render; ActivityIndicator should
    expect(screen.queryByText("Loading")).toBeNull();
    // ActivityIndicator is rendered
    const { ActivityIndicator } = require("react-native");
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it("does not call onPress when loading", () => {
    const onPress = jest.fn();
    const { UNSAFE_getByType } = render(
      <Button onPress={onPress} loading>
        Loading
      </Button>,
    );
    // When loading, the Pressable is disabled, so pressing the ActivityIndicator
    // (the only visible child) should not trigger onPress.
    const { ActivityIndicator } = require("react-native");
    const indicator = UNSAFE_getByType(ActivityIndicator);
    fireEvent.press(indicator);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("navigates when href is provided", () => {
    render(<Button href="/login">Go to Login</Button>);
    fireEvent.press(screen.getByText("Go to Login"));
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  it("renders with an icon", () => {
    const icon = <React.Fragment />;
    render(<Button icon={icon}>With Icon</Button>);
    expect(screen.getByText("With Icon")).toBeTruthy();
  });
});
