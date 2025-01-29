import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createProject } from '@/services/Projects/create-project'
import { ImageSize, ImageTheme, Stats } from '@prisma/client'
import { deleteProjectAndReorder } from '@/services/Projects/delete-project'
import { getAllProjects, getProjectByID } from '@/services/Projects/get-project'
import { updateProject } from '@/services/Projects/update-project'
import { updateProjectOrder } from '@/services/Projects/order-project'

type ConvertedImage = {
  fileBuffer: Buffer
  theme: 'LIGHT' | 'DARK'
  size: 'DESKTOP' | 'MOBILE'
}

export const projectRoute: FastifyPluginAsyncZod = async app => {
  // Create Project Endpoint
  app.post(
    '/projects',
    {
      schema: {
        body: z.object({
          title: z.string(),
          description: z.string(),
          href: z.string().url(),
          status: z.nativeEnum(Stats),
          images: z.array(
            z.object({
              fileBuffer: z.string(), // Recebe o fileBuffer como string
              theme: z.nativeEnum(ImageTheme),
              size: z.nativeEnum(ImageSize),
            })
          ),
          techs: z.array(
            z.object({
              id: z.string(),
            })
          ),
        }),
        tags: ['Projects'],
        summary: 'Create a project',
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      try {
        const { title, description, images, href, status, techs } = request.body

        // Converte o fileBuffer de string para Buffer antes de passar para o service
        const convertedImages = images.map(image => ({
          ...image,
          fileBuffer: Buffer.from(image.fileBuffer, 'base64'),
        }))

        // Chama o serviço para criar o projeto
        const { project } = await createProject({
          title,
          description,
          href,
          status,
          techs,
          images: convertedImages,
        })

        return reply.code(201).send({
          message: 'Project created successfully',
          project,
        })
      } catch (error) {
        console.error('Error creating project:', error)
        return reply.code(500).send({
          message: 'Internal server error while creating project',
        })
      }
    }
  )

  // Delete Project Endpoint
  app.delete(
    '/projects/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Projects'],
        summary: 'Delete a project',
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }

      try {
        // Chama o service para deletar o projeto e reordenar os projetos
        const { success, message } = await deleteProjectAndReorder({ id })

        if (success) {
          return reply.code(200).send({
            message,
          })
        }

        // Caso o serviço não tenha sucesso
        return reply.code(500).send({
          message: 'Internal server error while deleting project',
        })
      } catch (error) {
        console.error('Error deleting project:', error)
        return reply.code(500).send({
          message: 'Internal server error while deleting project',
        })
      }
    }
  )

  // Get All Projects Endpoint
  app.get(
    '/projects',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Projects'],
        summary: 'Get all projects',
      },
    },
    async (request, reply) => {
      try {
        const { projects } = await getAllProjects()
        return reply.code(200).send(projects)
      } catch (error) {
        console.error('Error fetching projects:', error)
        return reply.code(500).send({
          message: 'Internal server error while fetching projects',
        })
      }
    }
  )

  // Get Project by ID Endpoint
  app.get(
    '/projects/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Projects'],
        summary: 'Get a project',
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }

      try {
        const { project } = await getProjectByID({ id })
        if (!project) {
          return reply.code(404).send({
            message: 'Project not found',
          })
        }
        return reply.code(200).send(project)
      } catch (error) {
        console.error('Error fetching project by ID:', error)
        return reply.code(500).send({
          message: 'Internal server error while fetching project',
        })
      }
    }
  )

  // Update Project Endpoint
  app.patch(
    '/projects/:id',
    {
      schema: {
        body: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          images: z
            .array(
              z.object({
                fileBuffer: z.string(), // Recebe o fileBuffer como string
                theme: z.nativeEnum(ImageTheme),
                size: z.nativeEnum(ImageSize),
              })
            )
            .optional(),
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
        summary: 'Update a project',
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { title, description, images, href, status, techs } = request.body
      const { id } = request.params as { id: string }

      try {
        // Define e converte as imagens, se necessário
        let convertedImages: ConvertedImage[] | undefined
        if (images) {
          convertedImages = images.map(image => ({
            fileBuffer: Buffer.from(image.fileBuffer, 'base64'),
            theme: image.theme,
            size: image.size,
          }))
        }

        const updatedProject = await updateProject({
          id,
          title,
          description,
          images: convertedImages,
          href,
          status,
          techs,
        })

        if (!updatedProject) {
          return reply.code(404).send({
            message: 'Project not found',
          })
        }

        return reply.code(200).send({
          message: 'Project updated successfully',
          project: updatedProject,
        })
      } catch (error) {
        console.error('Error updating project:', error)
        return reply.code(500).send({
          message: 'Internal server error while updating project',
        })
      }
    }
  )

  app.put(
    '/projects/:id/order/:newOrder',
    {
      schema: {
        params: z.object({
          id: z.string().min(1, 'O ID do projeto é obrigatório'),
          newOrder: z
            .number()
            .min(1, 'A nova ordem deve ser maior ou igual a 1'),
        }),
        tags: ['Projects'],
        summary: 'Update project order',
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      try {
        const { id: projectId, newOrder } = request.params

        const result = await updateProjectOrder(projectId, Number(newOrder))

        return reply.send(result)
      } catch (error) {
        console.error('Erro na atualização da ordem do projeto:', error)
        return reply
          .status(500)
          .send({ message: 'Erro interno ao atualizar a ordem do projeto' })
      }
    }
  )
}
