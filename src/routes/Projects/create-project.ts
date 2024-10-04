import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createProject } from '../../services/Projects/create-project'
import { Stats } from '@prisma/client'

export const createProjectRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/projects',
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

      await createProject({
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
