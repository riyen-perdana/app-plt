import type { Theme } from "./types"

export const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)"

export function applyTheme(theme: Theme) {
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia(DARK_MEDIA_QUERY).matches)
  document.documentElement.classList.toggle("dark", isDark)
}
