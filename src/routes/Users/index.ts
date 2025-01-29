import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getUsers } from '@/services/Users/get-user'
import { z } from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { loginUser, type ILoginUserRequest } from '@/services/Users/login-user'
import { logout } from '@/services/Users/logout-user'
import {
  createUser,
  type ICreateUserRequest,
} from '@/services/Users/create-user'

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
        response: {
          200: z.object({
            success: z.literal(true),
            message: z.string(),
            accessToken: z.string(),
            name: z.string(),
          }),
          401: z.object({
            success: z.literal(false),
            message: z.string(),
          }),
          404: z.object({
            success: z.literal(false),
            message: z.string(),
          }),
          500: z.object({
            success: z.literal(false),
            message: z.string(),
          }),
        },
        tags: ['Users'],
        summary: 'Login a user',
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      await loginUser(request.body as ILoginUserRequest, reply, request)
    }
  )

  app.post(
    '/register',
    {
      schema: {
        body: z.object({
          name: z.string().min(1, 'Name is required'),
          email: z.string().email('Must be a valid email'),
          password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              'Password must contain at least one uppercase, one lowercase, one number, and one special character'
            ),
        }),
        response: {
          201: z.object({
            success: z.literal(true),
            message: z.string(),
            user: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string().email(),
            }),
          }),
          409: z.object({
            success: z.literal(false),
            message: z.string(),
          }),
          500: z.object({
            success: z.literal(false),
            message: z.string(),
          }),
        },
        tags: ['Users'],
        summary: 'Create a new user',
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      await createUser(request.body as ICreateUserRequest, reply)
    }
  )

  app.delete(
    '/logout',
    {
      schema: {
        tags: ['Users'],
        summary: 'Logout a user',
        response: {
          200: z.object({
            success: z.literal(true),
            message: z.string(),
          }),
          401: z.object({
            success: z.literal(false),
            message: z.string(),
          }),
        },
      },
    },
    logout
  )
}
