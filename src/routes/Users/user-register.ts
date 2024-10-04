import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createUser } from '../../services/Users/create-user'
import type { FastifyReply, FastifyRequest } from 'fastify'

export const registerUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/register',
    {
      schema: {
        body: z.object({
          name: z.string().optional(),
          email: z.string().email('Must be a valid email'),
          password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
              // Minimun one uppercase, one lowercase and one number and one special character
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
        }),
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, email, password } = request.body as Record<string, string>

      await createUser(
        {
          name,
          email,
          password,
        },
        reply
      )
    }
  )
}
