import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useFieldContext } from "@/features/auth/hooks/form-context"

type PasswordFieldProps = Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "id" | "name" | "type" | "value" | "onChange" | "onBlur"
> & {
  label: string
}

export function PasswordField({ label, ...inputProps }: PasswordFieldProps) {
  const field = useFieldContext<string>()
  const [showPassword, setShowPassword] = React.useState(false)
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          {...inputProps}
          id={field.name}
          name={field.name}
          type={showPassword ? "text" : "password"}
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
              showPassword ? `Sembunyikan ${label}` : `Tampilkan ${label}`
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
}
