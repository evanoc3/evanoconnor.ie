import { describe, expect, it } from "vitest";

import { generateGibberish, randInt } from "#/utils/rand-utils.ts";


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

  describe("generateGibberish()", () => {
    it("should return a string of the correct length", () => {
      expect(generateGibberish()).toHaveLength(5);
      expect(generateGibberish(100)).toHaveLength(100);
    });

    it("should only return alphanumeric characters", () => {
      expect(generateGibberish(100)).toMatch(/^[a-zA-Z0-9]{100}$/);
    });
  });

});
