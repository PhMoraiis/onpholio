import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getUsers } from '../../services/Users/get-user'

export const getUsersRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/users',
    {
      preHandler: [app.authenticate],
    },
    getUsers
  )
}
