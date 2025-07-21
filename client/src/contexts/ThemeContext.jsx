import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem("theme")
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

    const initialTheme = savedTheme || systemTheme
    setTheme(initialTheme)

    // Apply theme immediately to prevent flash
    applyTheme(initialTheme)
  }, [])

  useEffect(() => {
    if (!mounted) return
    applyTheme(theme)
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  const applyTheme = (newTheme) => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(newTheme)

    // Also set data attribute for additional styling options
    root.setAttribute("data-theme", newTheme)
  }

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
