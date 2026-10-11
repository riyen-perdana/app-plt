import { createFileRoute } from "@tanstack/react-router"

import { GoogleIcon } from "@/components/icons/google"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldSeparator } from "@/components/ui/field"
import { LoginForm } from "@/features/auth/components/login-form"
import { APP_INSTITUSI, APP_NAME } from "@/lib/constant"

export const Route = createFileRoute("/_auth/login")({
  head: () => ({ meta: [{ title: `${APP_NAME} - ${APP_INSTITUSI}` }] }),
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Logo />
      <div className="flex flex-col gap-0">
        <p className="text-2xl font-semibold">Selamat datang</p>
        <h1 className="-mt-1 text-lg font-semibold">Masuk ke akun Anda</h1>
      </div>
      <LoginForm />
      <FieldGroup>
        <FieldSeparator>Atau</FieldSeparator>
        <Button type="button" variant="outline" size="lg" className="w-full">
          <GoogleIcon />
          Masuk dengan Google Workspace
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
