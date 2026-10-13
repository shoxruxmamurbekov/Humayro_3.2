// Cache entries shared by every serverless instance on Netlify, with a per-instance memory copy.
// Callers keep their own TTL logic: getEntry returns the entry even when it is stale, because
// several services fall back to a stale value when the upstream request fails.

export interface CacheEntry<T> {
  at: number;
  data: T;
}

export interface KvBackend {
  get(key: string): Promise<unknown | undefined>;
  set(key: string, value: unknown): Promise<void>;
}

let backend: KvBackend | null = null;

export function setCacheBackend(next: KvBackend | null): void {
  backend = next;
}

export class SharedCache<T> {
  private readonly memory = new Map<string, CacheEntry<T>>();

  constructor(private readonly namespace: string) {}

  private storageKey(key: string): string {
    return `${this.namespace}/${encodeURIComponent(key)}`;
  }

  async getEntry(key: string): Promise<CacheEntry<T> | undefined> {
    if (backend) {
      try {
        const value = await backend.get(this.storageKey(key));
        return value === undefined || value === null ? undefined : (value as CacheEntry<T>);
      } catch (err) {
        console.warn(`[cache:${this.namespace}] shared read failed, using memory:`, err);
      }
    }
    return this.memory.get(key);
  }

  async setEntry(key: string, entry: CacheEntry<T>): Promise<void> {
    this.memory.set(key, entry);
    if (!backend) return;
    try {
      await backend.set(this.storageKey(key), entry);
    } catch (err) {
      console.warn(`[cache:${this.namespace}] shared write failed, kept in memory:`, err);
    }
  }

  // Number of keys this instance has written. The shared store is not counted.
  localSize(): number {
    return this.memory.size;
  }
}
