import { Toaster } from "@/components/ui/sonner"
import { useThemeStore } from "../store"

export function AppToaster() {
  const theme = useThemeStore((state) => state.theme)
  return <Toaster theme={theme} />
}
