import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { updateTech } from '@/services/Techs/update-tech'

export const updateTechRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/techs/:id',
    {
      schema: {
        body: z.object({
          name: z.string().optional(),
          image: z.string().optional(),
        }),
      },
      preHandler: [app.authenticate],
    },
    async request => {
      const { name, image } = request.body
      const { id } = request.params as { id: string }

      await updateTech({
        id: id,
        name,
        image,
      })
    }
  )
}
