"use client"

import { createContext, useContext, type ReactNode } from "react"

// Simple fixed theme for now
const fixedTheme = {
  name: "Cosmic Indigo",
  description: "Elegant purples and blues for a professional look",
  primary: "#6366f1",
  secondary: "#06b6d4",
  accent: "#f59e0b",
  success: "#10b981",
  background: "#ffffff",
  foreground: "#0f172a",
  muted: "#f8fafc",
  border: "#e2e8f0",
}

type ThemeContextType = {
  theme: typeof fixedTheme
}

const ThemeContext = createContext<ThemeContextType>({
  theme: fixedTheme,
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeContext.Provider value={{ theme: fixedTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
