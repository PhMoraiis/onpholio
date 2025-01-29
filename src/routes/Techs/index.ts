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
        summary: 'Create a tech',
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { name, image } = request.body

      // Chama a função createTech
      const result = await createTech({
        name,
        image,
      })

      if (!result.success) {
        // Retorna o erro caso a criação da tecnologia falhe
        return reply.code(400).send({
          message: result.message,
        })
      }

      // Retorna o sucesso se a tecnologia foi criada corretamente
      return reply.code(201).send({
        message: result.message,
        tech: result.tech,
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
      },
    },
    async (request, reply) => {
      try {
        const result = await deleteAllTechs()

        if (!result.success) {
          return reply.code(400).send({ message: result.message })
        }

        return reply.code(200).send({ message: result.message })
      } catch (error) {
        console.error('Erro ao deletar todas as tecnologias:', error)
        return reply.code(500).send({
          message: 'Erro interno ao tentar deletar todas as tecnologias',
        })
      }
    }
  )

  app.delete(
    '/techs/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Techs'],
        summary: 'Delete a tech',
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }

      try {
        const result = await deleteTechById({ id })

        if (!result.success) {
          return reply.code(404).send({ message: result.message })
        }

        return reply.code(200).send({ message: result.message })
      } catch (error) {
        console.error('Erro ao deletar a tecnologia:', error)
        return reply.code(500).send({
          message: 'Erro interno ao tentar deletar a tecnologia',
        })
      }
    }
  )

  // Get Endpoints
  app.get(
    '/techs',
    {
      schema: {
        tags: ['Techs'],
        summary: 'Get all techs',
      },
    },
    async (request, reply) => {
      try {
        const { techs } = await getAllTechs()
        return reply.code(200).send(techs)
      } catch (error) {
        console.error('Erro ao obter as tecnologias:', error)
        return reply.code(500).send({
          message: 'Erro interno ao tentar obter as tecnologias',
        })
      }
    }
  )

  app.get(
    '/techs/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Techs'],
        summary: 'Get a tech',
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }

      try {
        const { tech } = await getTechByID({ id })
        return reply.code(200).send(tech)
      } catch (error) {
        console.error('Erro ao obter a tecnologia:', error)
        return reply.code(404).send({
          message: 'Tecnologia não encontrada',
        })
      }
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
        summary: 'Update a tech',
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { name, image } = request.body
      const { id } = request.params as { id: string }

      try {
        const { updatedTech } = await updateTech({
          id: id,
          name,
          image,
        })
        return reply.code(200).send(updatedTech)
      } catch (error) {
        console.error('Erro ao atualizar a tecnologia:', error)
        return reply.code(400).send({
          message: 'Erro ao atualizar a tecnologia',
        })
      }
    }
  )
}
