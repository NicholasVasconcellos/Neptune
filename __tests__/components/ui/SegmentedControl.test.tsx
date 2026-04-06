import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import SegmentedControl from "@/components/ui/SegmentedControl";

const OPTIONS = [
  { value: "meters", label: "Meters" },
  { value: "yards", label: "Yards" },
];

describe("SegmentedControl", () => {
  it("renders all segment labels", () => {
    render(
      <SegmentedControl
        options={OPTIONS}
        selected="meters"
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByText("Meters")).toBeTruthy();
    expect(screen.getByText("Yards")).toBeTruthy();
  });

  it("calls onChange with the correct value when a segment is pressed", () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl
        options={OPTIONS}
        selected="meters"
        onChange={onChange}
      />,
    );
    fireEvent.press(screen.getByText("Yards"));
    expect(onChange).toHaveBeenCalledWith("yards");
  });

  it("calls onChange when pressing the already-selected segment", () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl
        options={OPTIONS}
        selected="meters"
        onChange={onChange}
      />,
    );
    fireEvent.press(screen.getByText("Meters"));
    expect(onChange).toHaveBeenCalledWith("meters");
  });

  it("renders with three options", () => {
    const threeOptions = [
      { value: "a", label: "Alpha" },
      { value: "b", label: "Beta" },
      { value: "c", label: "Gamma" },
    ];
    render(
      <SegmentedControl
        options={threeOptions}
        selected="b"
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Beta")).toBeTruthy();
    expect(screen.getByText("Gamma")).toBeTruthy();
  });
});
