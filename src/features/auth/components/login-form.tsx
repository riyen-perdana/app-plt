import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { useAppForm } from "@/features/auth/hooks/use-app-form"
import { loginSchema } from "@/features/auth/schemas/auth"

export function LoginForm() {
  const form = useAppForm({
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
        <form.AppField name="username">
          {(field) => (
            <field.TextField
              label="Nama Pengguna"
              placeholder="Nama Pengguna"
              autoComplete="username"
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.PasswordField
              label="Kata Sandi"
              placeholder="Kata Sandi"
              autoComplete="current-password"
            />
          )}
        </form.AppField>
        <Button type="submit" size="lg" className="w-full">
          Masuk
        </Button>
      </FieldGroup>
      <Link
        to="/forgot-password"
        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        Lupa Kata Sandi?
      </Link>
    </form>
  )
}
