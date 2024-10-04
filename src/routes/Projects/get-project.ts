import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllProjects, getProjectByID } from '@/services/Projects/get-project'

export const getAllProjectsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/projects',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { sortBy, sortOrder, filterBy } = request.query as {
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
        filterBy?: string
      }

      const projects = await getAllProjects({ sortBy, sortOrder, filterBy })
      reply.send(projects)
    }
  )
}

export const getProjectByIDRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/projects/:id',
    {
      preHandler: [app.authenticate],
    },
    async request => {
      const { id } = request.params as { id: string }

      await getProjectByID({
        id: id,
      })
    }
  )
}
