import { useEffect } from "react"
import { DARK_MEDIA_QUERY, applyTheme } from "../apply-theme"
import { useThemeStore } from "../store"

export function ThemeSync() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    applyTheme(theme)
    if (theme !== "system") return

    const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY)
    const handleChange = () => applyTheme(theme)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  return null
}
