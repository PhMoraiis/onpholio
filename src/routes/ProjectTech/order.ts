import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { updateMultipleTechOrders } from '../../services/Techs/order-tech'

export const updateTechOrderRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/projects/:projectId/techs/order',
    {
      schema: {
        body: z.object({
          techs: z.array(
            z.object({
              techId: z.string(),
              order: z.number(),
            })
          ),
        }),
      },
      preHandler: [app.authenticate],
    },
    async request => {
      const { techs } = request.body
      const { projectId } = request.params as { projectId: string }

      // Adicionando projectId a cada item do array techs
      const techsWithProject = techs.map(tech => ({ ...tech, projectId }))

      await updateMultipleTechOrders(techsWithProject)
    }
  )
}
