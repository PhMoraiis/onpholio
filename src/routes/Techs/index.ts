import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createTech } from '@/services/Techs/create-tech'
import { deleteAllTechs, deleteTechById } from '@/services/Techs/delete-tech'
import { getAllTechs, getTechByID } from '@/services/Techs/get-tech'
import { updateTech } from '@/services/Techs/update-tech'

export const techRoute: FastifyPluginAsyncZod = async app => {
  // Create Endpoint
  app.post(
    '/techs',
    {
      schema: {
        body: z.object({
          name: z.string(),
          image: z.string().optional(),
        }),
        tags: ['Techs'],
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

  // Delete Endpoints
  app.delete(
    '/techs',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Techs'],
      },
    },
    async () => {
      await deleteAllTechs()
    }
  )

  app.delete(
    '/techs/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Techs'],
      },
    },
    async request => {
      const { id } = request.params as { id: string }

      await deleteTechById({
        id: id,
      })
    }
  )

  // Get Endpoints
  app.get(
    '/techs',
    {
      schema: {
        tags: ['Techs'],
      },
    },
    async (request, reply) => {
      const techs = await getAllTechs()
      reply.send(techs)
    }
  )

  app.get(
    '/techs/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Techs'],
      },
    },
    async request => {
      const { id } = request.params as { id: string }

      await getTechByID({
        id: id,
      })
    }
  )

  // Update Endpoint
  app.patch(
    '/techs/:id',
    {
      schema: {
        body: z.object({
          name: z.string().optional(),
          image: z.string().optional(),
        }),
        tags: ['Techs'],
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
