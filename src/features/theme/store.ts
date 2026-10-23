import { create } from "zustand"
import { persist } from "zustand/middleware"
import { THEME_STORAGE_KEY } from "@/lib/constant"
import { isTheme } from "./types"
import type { Theme } from "./types"

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({ theme: state.theme }),
      merge: (persisted, current) => {
        const theme = (persisted as Partial<ThemeState> | undefined)?.theme
        return { ...current, theme: isTheme(theme) ? theme : current.theme }
      },
    }
  )
)
