import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createTech } from '@/services/Techs/create-tech'
import { deleteAllTechs, deleteTechById } from '@/services/Techs/delete-tech'
import { getAllTechs, getTechByID } from '@/services/Techs/get-tech'
import { updateTech } from '@/services/Techs/update-tech'
import { create } from 'qrcode'

export const techRoute: FastifyPluginAsyncZod = async app => {
  // Create Endpoint
  app.post(
    '/techs',
    {
      schema: {
        body: z.object({
          name: z
            .string()
            .min(1, 'Name must have at least 1 character')
            .max(255, 'Name must have at most 255 characters'),
          image: z.string().min(1, 'Image or Logo is required'),
        }),
        tags: ['Techs'],
        summary: 'Create a tech',
        response: {
          201: z.object({
            message: z.string(),
            tech: z.object({
              id: z.string(),
              name: z.string(),
              image: z.string(),
            }),
          }),
          400: z.object({
            message: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { name, image } = request.body

      const result = await createTech({ name, image })

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
        response: {
          200: {
            techs: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                image: z.string(),
                createdAt: z.date(),
                updatedAt: z.date(),
              })
            ),
          },
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await getAllTechs()

      if (!result.success) {
        return reply.code(result.statusCode).send({ message: result.message })
      }

      return reply.code(result.statusCode).send({ techs: result.techs })
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
          200: {
            tech: z.object({
              id: z.string(),
              name: z.string(),
              image: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          },
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const result = await getTechByID({ id })

      return reply.code(result.statusCode).send({ tech: result.tech })
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
        response: {
          200: z.object({
            updatedTech: z.object({
              id: z.string(),
              name: z.string(),
              image: z.string(),
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
      const { name, image } = request.body
      const { id } = request.params as { id: string }

      const result = await updateTech({ id, name, image })

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
