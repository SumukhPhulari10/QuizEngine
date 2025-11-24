"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    console.log("[v0] Theme toggle clicked. Current:", theme, "New:", newTheme)
    setTheme(newTheme)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 relative z-10">
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="w-9 h-9 relative z-10 cursor-pointer"
      type="button"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
      ) : (
        <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
