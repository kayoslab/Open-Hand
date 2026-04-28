import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(() => {
    const resolved = getSystemTheme();
    applyTheme(resolved);
    return resolved;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    function onChange(e: MediaQueryListEvent) {
      const next = e.matches ? 'dark' : 'light';
      setTheme(next);
      applyTheme(next);
    }
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return theme;
}
