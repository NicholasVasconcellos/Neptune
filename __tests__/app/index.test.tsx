import React from "react";
import { render, screen } from "@testing-library/react-native";
import Home from "@/app/index";
import { useAuth } from "@/context/AuthContext";

// Type the mocked useAuth for easy manipulation
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("App Entry (index)", () => {
  it("shows loading indicator when auth is loading", () => {
    mockedUseAuth.mockReturnValue({ session: null, loading: true });

    const { UNSAFE_getByType } = render(<Home />);
    const { ActivityIndicator } = require("react-native");
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it("renders welcome screen when not loading and no session", () => {
    mockedUseAuth.mockReturnValue({ session: null, loading: false });

    render(<Home />);
    expect(screen.getByText("Welcome to Neptune Swim")).toBeTruthy();
  });

  it("renders login and register buttons when no session", () => {
    mockedUseAuth.mockReturnValue({ session: null, loading: false });

    render(<Home />);
    expect(screen.getByText("Login To Account")).toBeTruthy();
    expect(screen.getByText("Create new Account")).toBeTruthy();
  });

  it("does not render welcome content when loading", () => {
    mockedUseAuth.mockReturnValue({ session: null, loading: true });

    render(<Home />);
    expect(screen.queryByText("Welcome to Neptune Swim")).toBeNull();
  });

  it("renders null when session exists and loading is false", () => {
    const mockSession = {
      access_token: "test-token",
      refresh_token: "test-refresh",
      user: { id: "123", email: "test@test.com" },
    } as any;
    mockedUseAuth.mockReturnValue({ session: mockSession, loading: false });

    const { toJSON } = render(<Home />);
    // When session exists, component returns null (after useEffect redirect)
    expect(toJSON()).toBeNull();
  });
});
