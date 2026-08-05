import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom does not implement matchMedia, which MUI components use for
// responsive behavior.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// The localStorage global exposed by this Node/jsdom combination is
// unreliable, so use a deterministic in-memory implementation for tests.
// This is a workaround: re-evaluate if vitest or jsdom are upgraded.
class LocalStorageMock implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

const localStorageMock = new LocalStorageMock();
Object.defineProperty(window, "localStorage", {
  writable: true,
  value: localStorageMock,
});
Object.defineProperty(globalThis, "localStorage", {
  writable: true,
  value: localStorageMock,
});
