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
