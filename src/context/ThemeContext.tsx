import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';
export type AccentKey = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

const STORAGE_KEY = 'studynova:theme:v1';

interface ThemeState {
  theme: ThemeMode;
  accent: AccentKey;
}

function loadTheme(): ThemeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { theme: 'dark', accent: 'primary', ...JSON.parse(raw) };
  } catch {
    /* ignore malformed storage */
  }
  return { theme: 'dark', accent: 'primary' };
}

interface ThemeContextValue extends ThemeState {
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeState>(loadTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
    document.documentElement.dataset.accent = state.accent;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: ThemeContextValue = {
    ...state,
    setTheme: (theme) => setState((s) => ({ ...s, theme })),
    setAccent: (accent) => setState((s) => ({ ...s, accent })),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
