import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_URL: z.url({ error: "APP_URL harus berupa URL yang valid" }),
})

export type Env = z.infer<typeof envSchema>

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error)

    const details = Object.entries(fieldErrors)
      .map(([name, messages]) => `- ${name}: ${messages.join(", ")}`)
      .join("\n")

    throw new Error(`Konfigurasi environment tidak valid:\n${details}`)
  }

  return result.data
}

export const env = parseEnv()
