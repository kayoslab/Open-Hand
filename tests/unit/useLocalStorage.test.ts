import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Provide a localStorage polyfill for the jsdom environment
const storageMap = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, value: string) => { storageMap.set(key, value); },
  removeItem: (key: string) => { storageMap.delete(key); },
  clear: () => { storageMap.clear(); },
  get length() { return storageMap.size; },
  key: (index: number) => [...storageMap.keys()][index] ?? null,
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

// We'll import the hook after it's created
// For now, define the expected interface for test-first development
let useLocalStorage: <T>(key: string, defaultValue: T, validate?: (val: unknown) => val is T) => [T, (val: T) => void];

beforeEach(async () => {
  storageMap.clear();
  const mod = await import('../../src/hooks/useLocalStorage');
  useLocalStorage = mod.useLocalStorage;
});

afterEach(() => {
  storageMap.clear();
});

describe('useLocalStorage', () => {
  describe('default value behavior', () => {
    it('returns default value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      expect(result.current[0]).toBe('default');
    });

    it('returns default value for complex objects when localStorage is empty', () => {
      const defaultVal = { tiers: ['Open'], query: '' };
      const { result } = renderHook(() => useLocalStorage('test-key', defaultVal));
      expect(result.current[0]).toEqual(defaultVal);
    });
  });

  describe('reading stored values', () => {
    it('reads and returns a previously stored string value', () => {
      window.localStorage.setItem('test-key', JSON.stringify('stored-value'));
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      expect(result.current[0]).toBe('stored-value');
    });

    it('reads and returns a previously stored object value', () => {
      const stored = { tiers: ['Working', 'Deep'], query: 'feedback' };
      window.localStorage.setItem('test-key', JSON.stringify(stored));
      const { result } = renderHook(() => useLocalStorage('test-key', { tiers: [], query: '' }));
      expect(result.current[0]).toEqual(stored);
    });

    it('reads and returns a previously stored array value', () => {
      window.localStorage.setItem('test-key', JSON.stringify(['Open', 'Deep']));
      const { result } = renderHook(() => useLocalStorage('test-key', []));
      expect(result.current[0]).toEqual(['Open', 'Deep']);
    });
  });

  describe('writing values', () => {
    it('persists updated value to localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
      expect(JSON.parse(window.localStorage.getItem('test-key')!)).toBe('updated');
    });

    it('persists complex objects to localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', { count: 0 }));

      act(() => {
        result.current[1]({ count: 42 });
      });

      expect(JSON.parse(window.localStorage.getItem('test-key')!)).toEqual({ count: 42 });
    });
  });

  describe('corrupt/invalid JSON handling', () => {
    it('returns default value when localStorage contains invalid JSON', () => {
      window.localStorage.setItem('test-key', 'not-valid-json{{{');
      const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
      expect(result.current[0]).toBe('fallback');
    });

    it('returns default value when localStorage contains empty string', () => {
      window.localStorage.setItem('test-key', '');
      const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
      expect(result.current[0]).toBe('fallback');
    });

    it('clears the bad entry from localStorage on parse failure', () => {
      window.localStorage.setItem('test-key', 'corrupt!!!');
      renderHook(() => useLocalStorage('test-key', 'default'));
      expect(window.localStorage.getItem('test-key')).toBeNull();
    });
  });

  describe('validation function', () => {
    const isString = (val: unknown): val is string => typeof val === 'string';
    const isPositiveNumber = (val: unknown): val is number =>
      typeof val === 'number' && val > 0;

    it('returns stored value when validation passes', () => {
      window.localStorage.setItem('test-key', JSON.stringify('valid'));
      const { result } = renderHook(() => useLocalStorage('test-key', 'default', isString));
      expect(result.current[0]).toBe('valid');
    });

    it('returns default value when stored value fails validation', () => {
      window.localStorage.setItem('test-key', JSON.stringify(12345));
      const { result } = renderHook(() => useLocalStorage('test-key', 'default', isString));
      expect(result.current[0]).toBe('default');
    });

    it('returns default when stored number fails positive validation', () => {
      window.localStorage.setItem('test-key', JSON.stringify(-5));
      const { result } = renderHook(() => useLocalStorage('test-key', 1, isPositiveNumber));
      expect(result.current[0]).toBe(1);
    });

    it('clears bad entry from localStorage when validation fails', () => {
      window.localStorage.setItem('test-key', JSON.stringify({ wrong: 'type' }));
      renderHook(() => useLocalStorage('test-key', 'default', isString));
      expect(window.localStorage.getItem('test-key')).toBeNull();
    });
  });

  describe('localStorage unavailability', () => {
    it('returns default value when localStorage throws on getItem', () => {
      const originalGetItem = localStorageMock.getItem;
      localStorageMock.getItem = () => { throw new Error('SecurityError'); };

      const { result } = renderHook(() => useLocalStorage('test-key', 'safe-default'));
      expect(result.current[0]).toBe('safe-default');

      localStorageMock.getItem = originalGetItem;
    });

    it('does not throw when localStorage throws on setItem', () => {
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = () => { throw new Error('QuotaExceededError'); };

      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      expect(() => {
        act(() => {
          result.current[1]('new-value');
        });
      }).not.toThrow();

      // State still updates in memory even if localStorage write fails
      expect(result.current[0]).toBe('new-value');

      localStorageMock.setItem = originalSetItem;
    });
  });
});
