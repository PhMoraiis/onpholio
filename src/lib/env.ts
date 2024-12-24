import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number(),
  JWT_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  NODE_ENV: z.string(),
})

export const env = envSchema.parse(process.env)