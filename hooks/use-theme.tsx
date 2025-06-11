'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { themes, type ThemeColors } from '@/lib/themes';

type ThemeContextType = {
  theme: ThemeColors;
  setTheme: (theme: ThemeColors) => void;
};

const defaultTheme = themes[0];

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeColors>(defaultTheme);
  const [isMounted, setIsMounted] = useState(false);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        const themeExists = themes.some(t => t.name === parsedTheme.name);
        if (themeExists) {
          setThemeState(parsedTheme);
        }
      } catch (e) {
        console.error('Failed to parse saved theme', e);
      }
    }
    setIsMounted(true);
  }, []);

  // Update CSS variables when theme changes
  useEffect(() => {
    if (!isMounted) return;
    
    // Update CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--success', theme.success);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', theme.foreground);
    root.style.setProperty('--muted', theme.muted);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--error', theme.error);

    // Save to localStorage
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme, isMounted]);

  const setTheme = (newTheme: ThemeColors) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
