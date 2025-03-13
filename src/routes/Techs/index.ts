import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createTech } from '@/services/Techs/create-tech'
import { deleteAllTechs, deleteTechById } from '@/services/Techs/delete-tech'
import { getAllTechs, getTechByID } from '@/services/Techs/get-tech'
import { updateTech } from '@/services/Techs/update-tech'
import type { Tech } from '@/services/Techs/types'

export const techRoute: FastifyPluginAsyncZod = async app => {
  // Create Endpoint
  app.post(
    '/techs',
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          name: z
            .string()
            .min(1, 'Name must have at least 1 character')
            .max(255, 'Name must have at most 255 characters'),
        }),
        tags: ['Techs'],
        summary: 'Create a tech',
        response: {
          201: z.object({
            message: z.string(),
            tech: z.object({
              id: z.string(),
              name: z.string(),
              createdAt: z.coerce.date(),
              updatedAt: z.coerce.date(),
            }),
          }),
          400: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body

      const result = await createTech({ name })

      return reply.code(result.statusCode).send({
        message: result.message,
        ...(result.tech && { tech: result.tech }), // Só adiciona `tech` se existir
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
        summary: 'Delete all techs',
        response: {
          200: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (_, reply) => {
      const result = await deleteAllTechs()
      return reply.code(result.statusCode).send({ message: result.message })
    }
  )

  app.delete(
    '/techs/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Techs'],
        summary: 'Delete a tech',
        response: {
          200: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const result = await deleteTechById({ id })
      return reply.code(result.statusCode).send({ message: result.message })
    }
  )

  // Get Endpoints
  app.get(
    '/techs',
    {
      schema: {
        tags: ['Techs'],
        summary: 'Get all techs',
        querystring: z.object({
          orderBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(), // `orderBy` opcional
        }),
        response: {
          200: z.object({
            techs: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              })
            ),
          }),
          400: z.object({ message: z.string().optional() }),
          500: z.object({ message: z.string().optional() }),
        },
      },
    },
    async (request, reply) => {
      const { orderBy } = request.query // Pode ser `undefined` se não for enviado

      const result = await getAllTechs(orderBy)

      if (!result.success) {
        return reply.code(result.statusCode).send({ message: result.message })
      }

      return reply.code(result.statusCode).send({
        techs: (result.techs ?? []).map((tech: Tech) => ({
          ...tech,
          createdAt: new Date(tech.createdAt),
          updatedAt: new Date(tech.updatedAt),
        })),
      })
    }
  )

  app.get(
    '/techs/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Techs'],
        summary: 'Get a tech',
        response: {
          200: z.object({
            tech: z.object({
              id: z.string(),
              name: z.string(),
              createdAt: z.coerce.date(),
              updatedAt: z.coerce.date(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const result = await getTechByID({ id })

      if (!result.tech) {
        return reply.code(404).send({ message: 'Tech not found' })
      }
      return reply.code(result.statusCode).send({ tech: result.tech })
    }
  )

  // Update Endpoint
  app.put(
    '/techs/:id',
    {
      schema: {
        body: z.object({
          name: z.string(),
        }),
        response: {
          200: z.object({
            updatedTech: z.object({
              id: z.string(),
              name: z.string(),
            }),
          }),
          400: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
        params: z.object({
          id: z.string(),
        }),
        tags: ['Techs'],
        summary: 'Update a tech',
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { name } = request.body
      const { id } = request.params as { id: string }

      const result = await updateTech({ id, name })

      return reply.code(result.statusCode).send(
        result.success
          ? {
              updatedTech: result.updatedTech as {
                name: string
                image: string
                id: string
              },
            }
          : { message: result.message || 'Erro desconhecido' }
      )
    }
  )
}
