# Login Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the login page as a split layout (decorative left panel, form right) per the reference screenshot, using existing shadcn tokens/components only.

**Architecture:** `_auth/route.tsx` becomes a two-column shell (left decorative panel hidden below `lg`, `<Outlet />` right). `_auth/login.tsx` renders the form with `Field`, `InputGroup`, `FieldSeparator`, `Button`. Only state: password visibility.

**Tech Stack:** TanStack Start/Router, React 19, Tailwind 4, shadcn (radix-lyra, mauve), lucide-react.

## Global Constraints

- UI only: no auth, validation, or new dependencies.
- Colors: existing theme tokens only; do NOT modify `src/styles.css`.
- Language: Indonesian; brand text from `APP_NAME` (`@/lib/constant`).
- Methods: username/email + password + Google button. No LinkedIn.
- "Lupa password?" and "Buat akun" are `href="#"`; carousel dots are static.
- No test framework exists in the project; verify with `npm run typecheck`, `npm run lint`, and the dev server.
- Imports use `cn` from `"cn"` and `@/` aliases, double quotes, no semicolons (match existing files).

---

### Task 1: Logo uses APP_NAME and auth split layout

**Files:**
- Modify: `src/components/logo.tsx`
- Modify: `src/routes/_auth/route.tsx` (full rewrite)

**Interfaces:**
- Produces: `AuthLayout` rendering `<Outlet />` in the right column. Task 2's page renders inside it and must not add its own full-page wrapper.

- [ ] **Step 1: Update logo text**

In `src/components/logo.tsx`, add `import { APP_NAME } from "@/lib/constant"` after the `cn` import, and replace `<span className="text-sm font-medium">ReUI</span>` with `<span className="text-sm font-medium">{APP_NAME}</span>`.

- [ ] **Step 2: Rewrite the auth layout**

Replace the whole of `src/routes/_auth/route.tsx` with:

```tsx
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
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: no errors in these files.

- [ ] **Step 4: Commit**

```bash
git add src/components/logo.tsx src/routes/_auth/route.tsx
git commit -m "feat: split auth layout and APP_NAME logo"
```

### Task 2: Login form

**Files:**
- Modify: `src/routes/_auth/login.tsx` (full rewrite)

**Interfaces:**
- Consumes: `Logo` from `@/components/logo`, `GoogleIcon` from `@/components/icons/google`, `Field`, `FieldGroup`, `FieldLabel`, `FieldSeparator` from `@/components/ui/field`, `Input`, `InputGroup`/`InputGroupInput`/`InputGroupAddon`/`InputGroupButton` (size `icon-xs` exists, verified), `Button`.

- [ ] **Step 1: Rewrite the page**

Replace the whole of `src/routes/_auth/login.tsx` with:

```tsx
import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Eye, EyeOff } from "lucide-react"
import { APP_NAME, APP_INSTITUSI } from "@/lib/constant"

import { GoogleIcon } from "@/components/icons/google"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export const Route = createFileRoute("/_auth/login")({
  head: () => ({ meta: [{ title: `${APP_NAME} - ${APP_INSTITUSI}` }] }),
  component: LoginPage,
})

function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Logo />
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">
          Selamat datang di {APP_NAME}
        </p>
        <h1 className="text-xl font-semibold">Masuk ke akun Anda</h1>
      </div>
      <form className="flex flex-col gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="identifier">Username atau Email</FieldLabel>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Button type="submit" size="lg" className="w-full">
            Login
          </Button>
        </FieldGroup>
        <a
          href="#"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Lupa password?
        </a>
      </form>
      <FieldGroup>
        <FieldSeparator>Atau</FieldSeparator>
        <Button type="button" variant="outline" size="lg" className="w-full">
          <GoogleIcon />
          Masuk dengan Google
        </Button>
      </FieldGroup>
      <p className="text-xs text-muted-foreground">
        Belum punya akun?{" "}
        <a
          href="#"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Buat akun
        </a>
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors in `src/routes/_auth/*` or `src/components/logo.tsx`.

- [ ] **Step 3: Visual check**

Run: `npm run dev`, open `http://localhost:3000/login`.
Expected: split layout at desktop width; left panel hidden below 1024px; eye button toggles password visibility; no navy/orange colors (tokens only).

- [ ] **Step 4: Commit**

```bash
git add src/routes/_auth/login.tsx
git commit -m "feat: redesign login page"
```
