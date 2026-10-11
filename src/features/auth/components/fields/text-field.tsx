import * as React from "react"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useFieldContext } from "@/features/auth/hooks/form-context"

type TextFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  "id" | "name" | "value" | "onChange" | "onBlur"
> & {
  label: string
}

export function TextField({ label, ...inputProps }: TextFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        {...inputProps}
        id={field.name}
        name={field.name}
        aria-invalid={isInvalid}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
