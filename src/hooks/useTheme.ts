import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme | null {
  try {
    const raw = window.localStorage.getItem('openhand:theme');
    if (raw === '"light"' || raw === '"dark"') return JSON.parse(raw) as Theme;
  } catch { /* ignore */ }
  return null;
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = getStoredTheme();
    const resolved = stored ?? getSystemTheme();
    applyTheme(resolved);
    return resolved;
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { window.localStorage.setItem('openhand:theme', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  useEffect(() => {
    const stored = getStoredTheme();
    if (stored !== null) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    function onChange(e: MediaQueryListEvent) {
      const next = e.matches ? 'dark' : 'light';
      setTheme(next);
      applyTheme(next);
    }
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return [theme, toggleTheme];
}
