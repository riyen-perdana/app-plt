import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { APP_NAME, APP_INSTITUSI } from "@/lib/constant"
import { ThemeSync } from "@/features/theme/components/theme-sync"
import { themeScript } from "@/features/theme/theme-script"

import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${APP_NAME} · ${APP_INSTITUSI}` },
      {
        name: "description",
        content:
          "Aplikasi internal Universitas Islam Negeri Sultan Syarif Kasim Riau.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:site_name", content: `${APP_NAME}` },
      { property: "og:locale", content: "id_ID" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: `${APP_INSTITUSI}` },
      {
        property: "og:description",
        content:
          "Aplikasi internal Universitas Islam Negeri Sultan Syarif Kasim Riau.",
      },
    ],

    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],

    scripts: [{ children: themeScript }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <ThemeSync />
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
