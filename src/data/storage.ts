// Low-level key/value persistence adapter. This is the ONLY place that
// touches `localStorage` directly. Swapping to a real backend later means
// writing a new class that implements `DataStore` (e.g. backed by fetch()
// calls) and pointing `repository.ts` at it instead.

export interface DataStore {
  load<T>(key: string): Promise<T | null>;
  save<T>(key: string, value: T): Promise<void>;
}

export class LocalStorageStore implements DataStore {
  async load<T>(key: string): Promise<T | null> {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async save<T>(key: string, value: T): Promise<void> {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}
