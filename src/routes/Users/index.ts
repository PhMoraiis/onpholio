import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getUsers } from '@/services/Users/get-user'
import { z } from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { loginUser } from '@/services/Users/login-user'
import { logout } from '@/services/Users/logout-user'
import { createUser } from '@/services/Users/create-user'

export const usersRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/users',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Users'],
      },
    },
    getUsers
  )

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
        tags: ['Users'],
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
        tags: ['Users'],
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

  app.delete(
    '/logout',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Users'],
      },
    },
    logout
  )
}
