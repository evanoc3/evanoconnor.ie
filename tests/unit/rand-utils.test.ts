import { describe, it, expect } from "vitest";
import { randInt, gibberish } from "@/utils/rand-utils";

describe("rand-utils", () => {

  describe("randInt()", () => {
    it("should return a number between the given min and max", () => {
      for(let i = 0; i < 100; i++) {
        const min = 1;
        const max = 10;
        const result = randInt(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
      }
    });
  });

  describe("gibberish()", () => {
    it("should return a string of the correct length", () => {
      expect(gibberish()).toHaveLength(5);
      expect(gibberish(100)).toHaveLength(100);
    });

    it("should only return alphanumeric characters", () => {
      expect(gibberish(100)).toMatch(/^[a-zA-Z0-9]{100}$/);
    });
  });

});
