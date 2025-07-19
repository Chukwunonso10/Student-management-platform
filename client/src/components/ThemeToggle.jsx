"use client"

import { useTheme } from "../contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle({ size = "default" }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size={size}
      onClick={toggleTheme}
      className="relative bg-transparent"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
