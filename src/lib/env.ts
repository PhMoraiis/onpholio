import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number(),
  JWT_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  NODE_ENV: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  ROOT_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)