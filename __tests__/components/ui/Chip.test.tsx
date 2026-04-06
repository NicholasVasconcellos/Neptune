import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import Chip from "../../../components/ui/Chip";

describe("Chip", () => {
  it("renders with a label", () => {
    render(<Chip label="Freestyle" />);
    expect(screen.getByText("Freestyle")).toBeTruthy();
  });

  it("renders with children instead of label", () => {
    render(<Chip>Custom Content</Chip>);
    expect(screen.getByText("Custom Content")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<Chip label="N1" onPress={onPress} />);
    fireEvent.press(screen.getByText("N1"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders in selected state", () => {
    render(<Chip label="Selected" selected />);
    // Should render -- className-based styling is applied
    expect(screen.getByText("Selected")).toBeTruthy();
  });

  it("renders in unselected state", () => {
    render(<Chip label="Unselected" selected={false} />);
    expect(screen.getByText("Unselected")).toBeTruthy();
  });

  it("calls onClose when close icon is pressed", () => {
    const onClose = jest.fn();
    render(<Chip label="Removable" onClose={onClose} />);

    // The close icon is an Ionicons rendered with testID "icon-Ionicons"
    const closeIcon = screen.getByTestId("icon-Ionicons");
    fireEvent.press(closeIcon);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render close icon when onClose is not provided", () => {
    render(<Chip label="No Close" />);
    expect(screen.queryByTestId("icon-Ionicons")).toBeNull();
  });

  it("renders in compact mode", () => {
    render(<Chip label="Compact" compact />);
    expect(screen.getByText("Compact")).toBeTruthy();
  });
});
