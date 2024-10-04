import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import {
  deleteAllTechs,
  deleteTechById,
} from '../../services/Techs/delete-tech'

export const deleteAllTechsRoute: FastifyPluginAsyncZod = async app => {
  app.delete('/techs', { preHandler: [app.authenticate] }, async () => {
    await deleteAllTechs()
  })
}

export const deleteTechByIdRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/techs/:id',
    {
      preHandler: [app.authenticate],
    },
    async request => {
      const { id } = request.params as { id: string }

      await deleteTechById({
        id: id,
      })
    }
  )
}
