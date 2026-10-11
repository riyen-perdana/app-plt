import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { useAppForm } from "@/features/auth/hooks/use-app-form"
import { forgotPasswordSchema } from "@/features/auth/schemas/auth"

export function ForgotPasswordForm() {
  const form = useAppForm({
    defaultValues: { email: "" },
    validators: { onSubmit: forgotPasswordSchema },
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
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Email"
              placeholder="Email Anda"
              autoComplete="email"
            />
          )}
        </form.AppField>
        <Button type="submit" size="lg" className="w-full">
          Kirim
        </Button>
      </FieldGroup>
      <Link
        to="/login"
        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        Kembali ke halaman masuk
      </Link>
    </form>
  )
}
