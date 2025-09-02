import { describe, it, expect } from "vitest";
import { LruCache } from "@/components/playground/go/LruCache";

describe("LruCache", () => {

  it("returns the correct size", () => {
    const cache = new LruCache<string>(3);
    expect(cache.size).toBe(0);
    cache.set("a", "A");
    expect(cache.size).toBe(1);
    cache.set("b", "B");
    expect(cache.size).toBe(2);
    cache.set("c", "C");
    expect(cache.size).toBe(3);
  });

  it("maintains the correct capacity", () => {
    let cache: LruCache<string> = new LruCache(1);
    expect(cache.capacity).toBe(1);
    expect(cache.size).toBe(0);

    cache.set("a", "A");
    expect(cache.size).toBe(1);
    cache.set("b", "B");
    expect(cache.size).toBe(1);

    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBe("B");
  });

});
