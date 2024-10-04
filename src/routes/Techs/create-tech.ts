import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createTech } from '@/services/Techs/create-tech'

export const createTechRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/techs',
    {
      schema: {
        body: z.object({
          name: z.string(),
          image: z.string().optional(),
        }),
      },
      preHandler: [app.authenticate],
    },
    async request => {
      const { name, image } = request.body

      await createTech({
        name: name,
        image: image,
      })
    }
  )
}
