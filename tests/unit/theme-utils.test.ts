import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getBrowserTheme,
  getSessionStorageTheme,
  setUserTheme,
  getUserTheme,
  toggleTheme,
  getCurrentTheme,
  isValidTheme,
  type Theme
} from "@/utils/theme-utils";


function mockWindowMatchMedia(mockImplementation: (query: string) => Partial<MediaQueryList>): void {
  vi.stubGlobal("matchMedia", vi.fn(mockImplementation));
}

function mockSessionStorage(mockImplementation: Partial<Storage>): void {
  vi.stubGlobal("sessionStorage", mockImplementation);
}


describe("theme-utils", () => {

  afterEach(() => {
    vi.restoreAllMocks();

    if(document.body.hasAttribute("data-theme")) {
      document.body.removeAttribute("data-theme");
    }
  });


  describe("getBrowserTheme()", () => {

    it("should return 'light' by default", () => {
      mockWindowMatchMedia(() => ({ matches: false }));
      expect(getBrowserTheme()).toBe("light");
    });

    it("should return 'dark' when prefers-color-scheme is dark", () => {
      mockWindowMatchMedia(query => ({ matches: true }));
      expect(getBrowserTheme()).toBe("dark");
    });
    
  });

  describe("getUserTheme()", () => {

    it.each([
      { datasetValue: "", expected: undefined },
      { datasetValue: "light", expected: "light" },
      { datasetValue: "dark", expected: "dark" }
    ])("should return $expected when body[data-theme=$datasetValue]", ({ datasetValue, expected }) => {
      document.body.dataset["theme"] = datasetValue;
      expect(getUserTheme()).toBe(expected);
    })

  });

  describe("setUserTheme()", () => {
    
    it("should remove theme from dataset and sessionStorage when newTheme matches browser theme", () => {
      mockWindowMatchMedia(() => ({ matches: true }));
      document.body.dataset["theme"] = "dark";
      mockSessionStorage({
        getItem: vi.fn(() => "dark"),
        removeItem: vi.fn()
      });

      setUserTheme("dark");

      expect(document.body.dataset["theme"]).toBeUndefined();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith("theme");
    });

    it("should set theme in dataset and sessionStorage when newTheme differs from browser", () => {
      mockWindowMatchMedia(() => ({ matches: false }));
      document.body.dataset["theme"] = "light";
      mockSessionStorage({
        getItem: vi.fn(),
        setItem: vi.fn()
      });

      setUserTheme("dark");

      expect(document.body.dataset["theme"]).toBe("dark");
      expect(sessionStorage.setItem).toHaveBeenCalledWith("theme", "dark");
    });
  });

  describe("getSessionStorageTheme()", () => {
    
    it.each([
      { storageValue: null, expected: undefined },
      { storageValue: "light", expected: "light" },
      { storageValue: "dark", expected: "dark" }
    ])("should return $expected when sessionStorage.theme=$storageValue", ({ storageValue, expected }) => {
      mockSessionStorage({ getItem: vi.fn(() => storageValue) });
      expect(getSessionStorageTheme()).toBe(expected);
    });

  });

  describe("getCurrentTheme()", () => {

    it("should return user theme when set", () => {
      document.body.dataset["theme"] = "light";
      expect(getCurrentTheme()).toBe("light");
    });

    it("should return browser theme when user theme not set", () => {
      mockWindowMatchMedia(() => ({ matches: true }));
      expect(getCurrentTheme()).toBe("dark");
    });

  });

  describe("toggleTheme()", () => {
    
    it.each<{ theme: Theme, expected: Theme }>([
      { theme: "light", expected: "dark" },
      { theme: "dark", expected: "light" }
    ])("should return $expected when theme=$theme", ({ theme, expected }) => {
      expect(toggleTheme(theme)).toBe(expected);
    });

  });

  describe("isValidTheme()", () => {
    
    it.each([
      { value: "light", expected: true },
      { value: "dark", expected: true },
      { value: "invalid", expected: false }
    ])("should return $expected when value=$value", ({ value, expected }) => {
      expect(isValidTheme(value)).toBe(expected);
    });

  });

});
