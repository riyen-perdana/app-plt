import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[2fr_3fr]">
      <aside className="relative hidden flex-col items-center justify-center gap-8 overflow-hidden bg-gradient-to-br from-muted via-background to-muted p-12 lg:flex">
        <div
          aria-hidden="true"
          className="h-56 w-56 border border-border bg-muted"
        />
        <div className="flex max-w-sm flex-col items-center gap-3 text-center">
          <h2 className="text-lg font-semibold">Pelatihan Digital</h2>
          <p className="text-xs/relaxed text-muted-foreground">
            Akses pelatihan dan materi pembelajaran kapan saja dan di mana
            saja melalui satu akun UIN Suska.
          </p>
        </div>
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-primary" />
          <span className="size-1.5 rounded-full bg-muted-foreground/40" />
        </div>
      </aside>
      <main className="flex items-center justify-center px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}
