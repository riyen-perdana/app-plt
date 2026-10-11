import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Nama pengguna wajib diisi"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .pipe(z.email("Email tidak valid")),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
