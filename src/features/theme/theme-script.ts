import { THEME_STORAGE_KEY } from "@/lib/constant"
import { DARK_MEDIA_QUERY } from "./apply-theme"

export const themeScript = `(function(){var t="system";try{var v=JSON.parse(localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})).state.theme;if(v==="light"||v==="dark")t=v}catch(e){}var d=t==="dark"||(t==="system"&&matchMedia(${JSON.stringify(DARK_MEDIA_QUERY)}).matches);document.documentElement.classList.toggle("dark",d)})()`
