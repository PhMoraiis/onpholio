import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createProject } from '@/services/Projects/create-project'
import { Stats } from '@prisma/client'
import { deleteAllProjects, deleteProjectById } from '@/services/Projects/delete-project'
import { getAllProjects, getProjectByID } from '@/services/Projects/get-project'
import { updateProject } from '@/services/Projects/update-project'

export const projectRoute: FastifyPluginAsyncZod = async app => {
  // Create Endpoint
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
          ),
        }),
        tags: ['Projects'],
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

  // Delete Endpoints
  app.delete(
    '/projects',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Projects'],
      },
    },
    async () => {
      await deleteAllProjects()
    }
  )

   app.delete(
    '/projects/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Projects'],
      },
    },
    async request => {
      const { id } = request.params as { id: string }

      await deleteProjectById({
        id: id,
      })
    }
  )

  // Get Endpoints
  app.get(
    '/projects',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Projects'],
      },
    },
    async (request, reply) => {
      const projects = await getAllProjects()
      reply.send(projects)
    }
  )

  app.get(
    '/projects/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Projects'],
      },
    },
    async request => {
      const { id } = request.params as { id: string }

      await getProjectByID({
        id: id,
      })
    }
  )

  // Patch Endpoint
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
        tags: ['Projects'],
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
