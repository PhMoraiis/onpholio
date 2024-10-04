import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { updateProject } from '../../services/Projects/update-project'
import { Stats } from '@prisma/client'

export const updateProjectRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/projects/:id',
    {
      schema: {
        body: z.object({
          title: z.string(),
          description: z.string(),
          imagesDesktop: z.array(z.string()),
          imagesMobile: z.array(z.string()),
          href: z.string().url(),
          order: z.number(),
          status: z.nativeEnum(Stats),
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
      const {
        title,
        description,
        imagesDesktop,
        imagesMobile,
        href,
        order,
        status,
        techs,
      } = request.body
      const { id } = request.params as { id: string }

      await updateProject({
        id: id,
        title,
        description,
        imagesDesktop,
        imagesMobile,
        href,
        order,
        status,
        techs,
      })
    }
  )
}
