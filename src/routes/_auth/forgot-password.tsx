import { createFileRoute } from "@tanstack/react-router"

import { Logo } from "@/components/logo"
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"
import { APP_INSTITUSI, APP_NAME } from "@/lib/constant"

export const Route = createFileRoute("/_auth/forgot-password")({
  head: () => ({ meta: [{ title: `${APP_NAME} - ${APP_INSTITUSI}` }] }),
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Logo />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Lupa Kata Sandi?</h1>
        <p className="text-xs text-muted-foreground">
          Masukkan email Anda, kami akan mengirim tautan untuk mengatur ulang
          kata sandi.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
