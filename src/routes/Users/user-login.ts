import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { loginUser } from '@/services/Users/login-user'
import type { FastifyReply, FastifyRequest } from 'fastify'

export const userLoginRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/login',
    {
      schema: {
        body: z.object({
          email: z.string().email('Must be a valid email'),
          password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
        }),
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
            accessToken: z.string(),
          }),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, password } = request.body as Record<string, string>

      const result = await loginUser({ email, password }, reply, request)

      if (result.success === false) {
        reply
          .status(result.code)
          .send({ success: false, message: result.message })
      } else {
        reply.send({
          success: true,
          message: 'Login successful',
          accessToken: result.accessToken,
        })
      }
    }
  )
}
