"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette, Check } from "lucide-react"
import { themes } from "@/lib/themes"
import { useTheme } from "@/hooks/use-theme"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-10 h-10 rounded-full">
        <Palette className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full border-2 hover:scale-110 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
            borderColor: theme.primary,
          }}
        >
          <Palette className="h-5 w-5 text-white" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 animate-fade-in">
        <div className="p-2">
          <h4 className="font-medium text-sm mb-1">Color Themes</h4>
          <p className="text-xs text-muted-foreground mb-2">Select your preferred color scheme</p>
        </div>
        <div className="p-2 space-y-1">
          {themes.map((t) => (
            <DropdownMenuItem
              key={t.name}
              onClick={() => setTheme(t)}
              className="flex items-center justify-between cursor-pointer hover:bg-muted rounded-md p-2"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${t.primary} 0%, ${t.secondary} 100%)`,
                  }}
                ></div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
              </div>
              {theme.name === t.name && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
