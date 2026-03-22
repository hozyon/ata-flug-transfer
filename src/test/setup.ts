/**
 * Vitest global test setup
 * Provides a proper in-memory localStorage mock for all tests.
 */

class LocalStorageMock {
    private store = new Map<string, string>();

    getItem(key: string): string | null {
        return this.store.get(key) ?? null;
    }
    setItem(key: string, value: string): void {
        this.store.set(key, value);
    }
    removeItem(key: string): void {
        this.store.delete(key);
    }
    clear(): void {
        this.store.clear();
    }
    get length(): number {
        return this.store.size;
    }
    key(index: number): string | null {
        return Array.from(this.store.keys())[index] ?? null;
    }
}

Object.defineProperty(globalThis, 'localStorage', {
    value: new LocalStorageMock(),
    writable: true,
});
