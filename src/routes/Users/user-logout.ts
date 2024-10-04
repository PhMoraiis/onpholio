import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { logout } from '../../services/Users/logout-user'

export const userLogoutRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/login',
    {
      preHandler: [app.authenticate],
    },
    logout
  )
}
