export type ThemeColors = {
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  error: string;
};

export const themes: ThemeColors[] = [
  {
    name: 'Cosmic Indigo',
    description: 'Elegant purples and blues for a professional look',
    primary: '#6366f1',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    success: '#10b981',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f8fafc',
    border: '#e2e8f0',
    error: '#ef4444',
  },
  {
    name: 'Emerald Oasis',
    description: 'Refreshing greens and teals for a calm experience',
    primary: '#059669',
    secondary: '#0d9488',
    accent: '#0ea5e9',
    success: '#84cc16',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f0fdf4',
    border: '#d1fae5',
    error: '#ef4444',
  },
  {
    name: 'Sunset Blaze',
    description: 'Warm oranges and reds for an energetic vibe',
    primary: '#e11d48',
    secondary: '#f97316',
    accent: '#eab308',
    success: '#84cc16',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#fff7ed',
    border: '#fee2e2',
    error: '#ef4444',
  },
  {
    name: 'Midnight Galaxy',
    description: 'Deep blues and purples for a cosmic experience',
    primary: '#7c3aed',
    secondary: '#2563eb',
    accent: '#c026d3',
    success: '#10b981',
    background: '#020617',
    foreground: '#f8fafc',
    muted: '#1e293b',
    border: '#334155',
    error: '#ef4444',
  },
  {
    name: 'Bubblegum Pop',
    description: 'Playful pinks and purples for a fun atmosphere',
    primary: '#d946ef',
    secondary: '#ec4899',
    accent: '#f43f5e',
    success: '#14b8a6',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#fdf4ff',
    border: '#fce7f3',
    error: '#ef4444',
  },
];

export const defaultTheme = themes[0];
