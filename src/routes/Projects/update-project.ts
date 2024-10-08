import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { updateProject } from '@/services/Projects/update-project'
import { Stats } from '@prisma/client'

export const updateProjectRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/projects/:id',
    {
      schema: {
        body: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          lightImageDesktop: z.string().optional(),
          darkImageDesktop: z.string().optional(),
          lightImageMobile: z.string().optional(),
          darkImageMobile: z.string().optional(),
          href: z.string().url().optional(),
          status: z.nativeEnum(Stats).optional(),
          techs: z
            .array(
              z.object({
                id: z.string(),
              })
            )
            .optional(),
        }),
      },
      preHandler: [app.authenticate],
    },
    async request => {
      const {
        title,
        description,
        lightImageDesktop,
        darkImageDesktop,
        lightImageMobile,
        darkImageMobile,
        href,
        status,
        techs,
      } = request.body
      const { id } = request.params as { id: string }

      await updateProject({
        id: id,
        title,
        description,
        lightImageDesktop,
        darkImageDesktop,
        lightImageMobile,
        darkImageMobile,
        href,
        status,
        techs,
      })
    }
  )
}
