import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllTechs, getTechByID } from '@/services/Techs/get-tech'

export const getAllTechsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/techs',
    async (request, reply) => {
      const techs = await getAllTechs()
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
