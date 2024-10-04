import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllTechs, getTechByID } from '../../services/Techs/get-tech'

export const getAllTechsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/techs',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { sortBy, sortOrder, filterBy } = request.query as {
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
        filterBy?: string
      }

      const techs = await getAllTechs({ sortBy, sortOrder, filterBy })
      reply.send(techs)
    }
  )
}

export const getTechByIDRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/techs/:id',
    {
      preHandler: [app.authenticate],
    },
    async request => {
      const { id } = request.params as { id: string }

      await getTechByID({
        id: id,
      })
    }
  )
}
