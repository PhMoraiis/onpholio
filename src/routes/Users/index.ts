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
        summary: 'Get all users',
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
        tags: ['Users'],
        summary: 'Login a user',
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, password } = request.body as Record<
        string,
        string
      >

      const result = await loginUser(
        { email, password },
        reply,
        request
      )

      if (result.success === false) {
        const statusCode = result.code === 403 ? 403 : 401
        reply
          .status(statusCode)
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
          name: z.string().min(1, 'Name is required'), // Tornando o nome obrigatório
          email: z.string().email('Must be a valid email'),
          password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              'Password must contain at least one uppercase, one lowercase, one number, and one special character'
            ),
        }),
        tags: ['Users'],
        summary: 'Create a user',
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, email, password } = request.body as Record<string, string>

      const result = await createUser({ name, email, password }, reply)

      return reply.code(201).send(result)
    }
  )

  app.delete(
    '/logout',
    {
      preHandler: [app.authenticate], // Verificar se o usuário está autenticado
      schema: {
        tags: ['Users'],
        summary: 'Logout a user',
      },
    },
    logout
  )
}
