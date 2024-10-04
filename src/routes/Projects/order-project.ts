import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { updateMultipleProjectOrders } from '../../services/Projects/order-project'

export const updateProjectOrderRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/projects/order',
    {
      schema: {
        body: z.object({
          projects: z.array(
            z.object({
              id: z.string(),
              order: z.number(),
            })
          ),
        }),
      },
      preHandler: [app.authenticate],
    },
    async request => {
      const { projects } = request.body

      await updateMultipleProjectOrders(projects)
    }
  )
}
