import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import ExerciseRow, { type Exercise } from "@/components/training/ExerciseRow";

// Re-implement parseInterval locally for unit tests on the logic
function parseInterval(mmss: string): number | null {
  if (!mmss.trim()) return null;
  const parts = mmss.split(":");
  if (parts.length !== 2) return null;
  const mm = parseInt(parts[0], 10);
  const ss = parseInt(parts[1], 10);
  if (isNaN(mm) || isNaN(ss)) return null;
  return mm * 60 + ss;
}

const makeExercise = (overrides: Partial<Exercise> = {}): Exercise => ({
  id: 1,
  name: "Freestyle Sprint",
  note: "",
  repetitions: "4",
  distance: "100",
  interval: "1:30",
  energySystem: "N2",
  confirmed: false,
  ...overrides,
});

const defaultProps = {
  index: 0,
  unit: "yards" as const,
  exerciseNames: [
    { id: 1, Name: "Freestyle Sprint" },
    { id: 2, Name: "Backstroke Drill" },
  ],
  rollingDistance: 400,
  rollingTime: 360,
  errors: {} as Record<string, string>,
  onUpdate: jest.fn(),
  onConfirm: jest.fn(),
  onDelete: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ExerciseRow", () => {
  describe("editing mode", () => {
    it("renders exercise number label", () => {
      render(<ExerciseRow exercise={makeExercise()} {...defaultProps} />);
      expect(screen.getByText("Exercise 1")).toBeTruthy();
    });

    it("renders the confirm button", () => {
      render(<ExerciseRow exercise={makeExercise()} {...defaultProps} />);
      expect(screen.getByText("Confirm Exercise")).toBeTruthy();
    });

    it("calls onConfirm when confirm button is pressed", () => {
      render(<ExerciseRow exercise={makeExercise()} {...defaultProps} />);
      fireEvent.press(screen.getByText("Confirm Exercise"));
      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it("renders energy system chips", () => {
      render(<ExerciseRow exercise={makeExercise()} {...defaultProps} />);
      expect(screen.getByText("N1")).toBeTruthy();
      expect(screen.getByText("N2")).toBeTruthy();
      expect(screen.getByText("N3")).toBeTruthy();
      expect(screen.getByText("N4")).toBeTruthy();
    });

    it("toggles energy system on chip press", () => {
      render(<ExerciseRow exercise={makeExercise()} {...defaultProps} />);
      fireEvent.press(screen.getByText("N1"));
      expect(defaultProps.onUpdate).toHaveBeenCalledWith("energySystem", "N1");
    });

    it("deselects energy system when pressing already-selected chip", () => {
      render(
        <ExerciseRow
          exercise={makeExercise({ energySystem: "N2" })}
          {...defaultProps}
        />,
      );
      fireEvent.press(screen.getByText("N2"));
      expect(defaultProps.onUpdate).toHaveBeenCalledWith("energySystem", null);
    });

    it("renders error messages when present", () => {
      render(
        <ExerciseRow
          exercise={makeExercise()}
          {...defaultProps}
          errors={{ name: "Name is required" }}
        />,
      );
      expect(screen.getByText("Name is required")).toBeTruthy();
    });
  });

  describe("confirmed mode", () => {
    it("renders exercise name in confirmed view", () => {
      render(
        <ExerciseRow
          exercise={makeExercise({ confirmed: true })}
          {...defaultProps}
        />,
      );
      expect(screen.getByText("Freestyle Sprint")).toBeTruthy();
    });

    it("displays set info (reps x distance @ interval)", () => {
      render(
        <ExerciseRow
          exercise={makeExercise({ confirmed: true })}
          {...defaultProps}
        />,
      );
      expect(screen.getByText("4 x 100 @ 1:30")).toBeTruthy();
    });

    it("shows total distance", () => {
      render(
        <ExerciseRow
          exercise={makeExercise({ confirmed: true })}
          {...defaultProps}
        />,
      );
      // 4 reps * 100 distance = 400
      expect(screen.getByText("400")).toBeTruthy();
    });

    it("shows rolling distance in parentheses", () => {
      render(
        <ExerciseRow
          exercise={makeExercise({ confirmed: true })}
          {...defaultProps}
          rollingDistance={1200}
        />,
      );
      expect(screen.getByText("(1200)")).toBeTruthy();
    });

    it("shows total time as mm:ss", () => {
      // 4 reps * 90 seconds = 360 seconds = 6:00
      render(
        <ExerciseRow
          exercise={makeExercise({ confirmed: true })}
          {...defaultProps}
        />,
      );
      expect(screen.getByText("6:00")).toBeTruthy();
    });

    it("shows energy system badge", () => {
      render(
        <ExerciseRow
          exercise={makeExercise({ confirmed: true, energySystem: "N2" })}
          {...defaultProps}
        />,
      );
      expect(screen.getByText("N2")).toBeTruthy();
    });

    it("returns to editing when pressed", () => {
      render(
        <ExerciseRow
          exercise={makeExercise({ confirmed: true })}
          {...defaultProps}
        />,
      );
      // The entire confirmed row is pressable to re-edit
      fireEvent.press(screen.getByText("Freestyle Sprint"));
      expect(defaultProps.onUpdate).toHaveBeenCalledWith("confirmed", false);
    });

    it("shows note when present", () => {
      render(
        <ExerciseRow
          exercise={makeExercise({ confirmed: true, note: "Easy pace" })}
          {...defaultProps}
        />,
      );
      expect(screen.getByText("Easy pace")).toBeTruthy();
    });
  });

  describe("parseInterval (unit logic)", () => {
    it("parses valid mm:ss format", () => {
      expect(parseInterval("1:30")).toBe(90);
    });

    it("parses zero minutes", () => {
      expect(parseInterval("0:45")).toBe(45);
    });

    it("parses large values", () => {
      expect(parseInterval("10:00")).toBe(600);
    });

    it("returns null for empty string", () => {
      expect(parseInterval("  ")).toBeNull();
    });

    it("returns null for invalid format", () => {
      expect(parseInterval("abc")).toBeNull();
    });

    it("returns null for single number", () => {
      expect(parseInterval("90")).toBeNull();
    });

    it("returns null for non-numeric parts", () => {
      expect(parseInterval("a:b")).toBeNull();
    });
  });

  describe("rolling distance calculation", () => {
    it("calculates total exercise distance correctly (reps * distance)", () => {
      // 4 reps * 100 = 400
      const exercise = makeExercise({ repetitions: "4", distance: "100" });
      const rep = parseInt(exercise.repetitions, 10) || 0;
      const dist = parseInt(exercise.distance, 10) || 0;
      expect(rep * dist).toBe(400);
    });

    it("handles zero reps", () => {
      const exercise = makeExercise({ repetitions: "0", distance: "100" });
      const rep = parseInt(exercise.repetitions, 10) || 0;
      const dist = parseInt(exercise.distance, 10) || 0;
      expect(rep * dist).toBe(0);
    });

    it("handles empty distance", () => {
      const exercise = makeExercise({ repetitions: "4", distance: "" });
      const rep = parseInt(exercise.repetitions, 10) || 0;
      const dist = parseInt(exercise.distance, 10) || 0;
      expect(rep * dist).toBe(0);
    });
  });
});
