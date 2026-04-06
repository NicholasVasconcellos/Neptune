/**
 * Jest setup file
 * Mocks for Supabase, expo-router, vector icons, and other native modules.
 *
 * Note: jest.mock() calls are hoisted above imports by babel-jest,
 * so they execute before any module code regardless of source order.
 * Variables referenced inside jest.mock() factories must be prefixed
 * with "mock" to pass the scope check.
 */
import React from "react";

// ---------------------------------------------------------------------------
// Shared icon mock factory (prefixed with "mock" for jest.mock scope rules)
// ---------------------------------------------------------------------------
function mockIconFactory(iconName: string) {
  const React = require("react");
  const { Text } = require("react-native");
  return (props: any) =>
    React.createElement(
      Text,
      { testID: `icon-${iconName}`, ...props },
      props.name ?? iconName,
    );
}

// ---------------------------------------------------------------------------
// Mock: Supabase client
// ---------------------------------------------------------------------------
jest.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      signUp: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      startAutoRefresh: jest.fn(),
      stopAutoRefresh: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

// ---------------------------------------------------------------------------
// Mock: expo-router
// ---------------------------------------------------------------------------
jest.mock("expo-router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(false),
  }),
  useLocalSearchParams: jest.fn().mockReturnValue({}),
  useSegments: jest.fn().mockReturnValue([]),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  Link: ({ children }: { children: React.ReactNode }) => children,
  Tabs: Object.assign(
    ({ children }: { children: React.ReactNode }) => children,
    {
      Screen: ({ children }: { children?: React.ReactNode }) => children ?? null,
    },
  ),
  Stack: Object.assign(
    ({ children }: { children: React.ReactNode }) => children,
    {
      Screen: ({ children }: { children?: React.ReactNode }) => children ?? null,
    },
  ),
}));

// ---------------------------------------------------------------------------
// Mock: @expo/vector-icons
// ---------------------------------------------------------------------------
jest.mock("@expo/vector-icons", () => ({
  Ionicons: mockIconFactory("Ionicons"),
  FontAwesome5: mockIconFactory("FontAwesome5"),
  FontAwesome6: mockIconFactory("FontAwesome6"),
  MaterialCommunityIcons: mockIconFactory("MaterialCommunityIcons"),
}));

jest.mock("@expo/vector-icons/Ionicons", () => mockIconFactory("Ionicons"));
jest.mock("@expo/vector-icons/FontAwesome5", () => mockIconFactory("FontAwesome5"));
jest.mock("@expo/vector-icons/FontAwesome6", () => mockIconFactory("FontAwesome6"));

// ---------------------------------------------------------------------------
// Mock: expo-sqlite/localStorage/install (used by supabase.ts)
// ---------------------------------------------------------------------------
jest.mock("expo-sqlite/localStorage/install", () => {});

// ---------------------------------------------------------------------------
// Mock: AuthContext
// ---------------------------------------------------------------------------
jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn().mockReturnValue({
    session: null,
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// ---------------------------------------------------------------------------
// Mock: Image assets
// ---------------------------------------------------------------------------
jest.mock("../assets/NeptuneAppIcon.png", () => "mocked-logo");

// ---------------------------------------------------------------------------
// Suppress noisy warnings during tests
// ---------------------------------------------------------------------------
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("nativewind") || args[0].includes("var(--"))
  ) {
    return;
  }
  originalWarn(...args);
};
