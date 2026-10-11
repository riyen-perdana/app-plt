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

import { useForm } from "@tanstack/react-form"
import { loginSchema } from "@/lib/schemas/auth"


export const Route = createFileRoute("/_auth/login")({
  head: () => ({ meta: [{ title: `${APP_NAME} - ${APP_INSTITUSI}` }] }),
  component: LoginPage,
})

function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const form = useForm({
    defaultValues: { username: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      console.log(value)
    }
  })


  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Logo />
      <div className="flex flex-col gap-0">
        <p className="text-2xl font-semibold">Selamat datang</p>
        <h1 className="-mt-1 text-lg font-semibold">Masuk ke akun Anda</h1>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.Field name="username">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Nama Pengguna</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Nama Pengguna"
                  autoComplete="username"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Kata Sandi</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="Kata Sandi"
                    autoComplete="current-password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      aria-label={
                        showPassword
                          ? "Sembunyikan Kata Sandi"
                          : "Tampilkan Kata Sandi"
                      }
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            )}
          </form.Field>
          <Button type="submit" size="lg" className="w-full">
            Masuk
          </Button>
        </FieldGroup>
        <a
          href="#"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Lupa Kata Sandi?
        </a>
      </form>
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
