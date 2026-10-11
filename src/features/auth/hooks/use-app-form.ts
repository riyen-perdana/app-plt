import { createFormHook } from "@tanstack/react-form"

import { PasswordField } from "@/features/auth/components/fields/password-field"
import { TextField } from "@/features/auth/components/fields/text-field"
import { fieldContext, formContext } from "@/features/auth/hooks/form-context"

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, PasswordField },
  formComponents: {},
})
