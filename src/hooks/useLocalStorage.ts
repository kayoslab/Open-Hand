import { useState, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  validate?: (val: unknown) => val is T,
): [T, (val: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultValue;
      const parsed = JSON.parse(raw) as unknown;
      if (validate && !validate(parsed)) {
        window.localStorage.removeItem(key);
        return defaultValue;
      }
      return parsed as T;
    } catch {
      try { window.localStorage.removeItem(key); } catch { /* ignore */ }
      return defaultValue;
    }
  });

  const setValue = useCallback((val: T) => {
    setStoredValue(val);
    try {
      window.localStorage.setItem(key, JSON.stringify(val));
    } catch { /* ignore quota / security errors */ }
  }, [key]);

  return [storedValue, setValue];
}
