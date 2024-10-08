import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createProject } from '@/services/Projects/create-project'
import { Stats } from '@prisma/client'

export const createProjectRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/projects',
    {
      schema: {
        body: z.object({
          title: z.string(),
          description: z.string(),
          lightImageDesktop: z.string(),
          darkImageDesktop: z.string().optional(),
          lightImageMobile: z.string(),
          darkImageMobile: z.string().optional(),
          href: z.string().url(),
          status: z.nativeEnum(Stats),
          techs: z.array(
            z.object({
              id: z.string(),
            })
          )
        }),
      },
      preHandler: [app.authenticate],
    },
    async request => {
      try {
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

        await createProject({
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
      } catch (error) {
        console.error('Error creating project:', error) // Adicionando log de erro
      }
    }
  )
}
