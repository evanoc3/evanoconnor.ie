export class LruCache<T> {
  public readonly capacity: number;
  private readonly storage = new Map<string, T>();


  constructor(capacity: number) {
    this.capacity = capacity;
  }

  public get(key: string): T | undefined {
    const value = this.storage.get(key);
    if (value) {
      this.storage.delete(key);
      this.storage.set(key, value);
    }
    return value;
  }

  public set(key: string, value: T): void {
    if (this.storage.has(key)) {
      this.storage.delete(key);
    }
    if (this.size >= this.capacity) {
      const oversizeCount = this.size - this.capacity + 1;
      this.evict(oversizeCount);
    }
    this.storage.set(key, value);
  }

  public get size(): number {
    return this.storage.size;
  }

  private evict(n: number): void {
    for (let i = 0; i < n; i++) {
      const oldestKey = this.storage.keys().next().value;
      if (oldestKey) {
        this.storage.delete(oldestKey);
      }
    }
  }
}
