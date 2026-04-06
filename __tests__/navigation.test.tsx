import React from "react";
import { render } from "@testing-library/react-native";
import TabsLayout from "../app/(tabs)/_layout";

// FontAwesome5 and expo-font mocks are handled in __tests__/setup.ts

describe("Navigation", () => {
  describe("Tab Layout", () => {
    it("renders without crashing", () => {
      const { toJSON } = render(<TabsLayout />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe("Auth flow", () => {
    it("login screen module exists and exports a component", () => {
      const LoginModule = require("../app/(auth)/login");
      expect(LoginModule).toBeDefined();
      expect(LoginModule.default).toBeDefined();
      expect(typeof LoginModule.default).toBe("function");
    });

    it("register screen module exists and exports a component", () => {
      const RegisterModule = require("../app/(auth)/register");
      expect(RegisterModule).toBeDefined();
      expect(RegisterModule.default).toBeDefined();
      expect(typeof RegisterModule.default).toBe("function");
    });

    it("login screen renders without crashing", () => {
      const Login = require("../app/(auth)/login").default;
      const { toJSON } = render(<Login />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe("Tab screen modules", () => {
    it("home tab module exists", () => {
      const mod = require("../app/(tabs)/index");
      expect(mod).toBeDefined();
      expect(typeof mod.default).toBe("function");
    });

    it("viewData tab module exists", () => {
      const mod = require("../app/(tabs)/viewData");
      expect(mod).toBeDefined();
      expect(typeof mod.default).toBe("function");
    });

    it("addTraining tab module exists", () => {
      const mod = require("../app/(tabs)/addTraining");
      expect(mod).toBeDefined();
      expect(typeof mod.default).toBe("function");
    });

    it("viewTraining tab module exists", () => {
      const mod = require("../app/(tabs)/viewTraining");
      expect(mod).toBeDefined();
      expect(typeof mod.default).toBe("function");
    });
  });
});
