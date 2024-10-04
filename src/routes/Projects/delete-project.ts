import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { deleteAllProjects, deleteProjectById } from '../../services/Projects/delete-project'

export const deleteAllProjectsRoute: FastifyPluginAsyncZod = async app => {
  app.delete('/projects', { preHandler: [app.authenticate] }, async () => {
    await deleteAllProjects()
  })
}

export const deleteProjectByIdRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/projects/:id',
    {
      preHandler: [app.authenticate],
    },
    async request => {
      const { id } = request.params as { id: string }

      await deleteProjectById({
        id: id,
      })
    }
  )
}
