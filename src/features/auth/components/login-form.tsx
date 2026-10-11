import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { loginSchema } from "@/features/auth/schemas/auth"

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm({
    defaultValues: { username: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
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
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Nama Pengguna</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Nama Pengguna"
                  autoComplete="username"
                  aria-invalid={isInvalid}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Kata Sandi</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="Kata Sandi"
                    autoComplete="current-password"
                    aria-invalid={isInvalid}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
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
  )
}
