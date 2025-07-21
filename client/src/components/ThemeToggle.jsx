import { useTheme } from "../contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle({ size = "default", className = "" }) {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <Button
      variant="outline"
      size={size}
      onClick={toggleTheme}
      className={`relative ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
