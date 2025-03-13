import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createProject } from '@/services/Projects/create-project'
import { deleteProjectAndReorder } from '@/services/Projects/delete-project'
import { getAllProjects, getProjectByID } from '@/services/Projects/get-project'
import { updateProject } from '@/services/Projects/update-project'
import { updateProjectOrder } from '@/services/Projects/order-project'

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
          initial_date: z.coerce.date(),
          final_date: z.coerce.date(),
          icon: z.string(),
          image: z.string(),
          techs: z.array(
            z.object({
              id: z.string(),
            })
          ),
        }),
        response: {
          201: z.object({
            message: z.string(),
            project: z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
              href: z.string(),
              initial_date: z.coerce.date(),
              final_date: z.coerce.date(),
              icon: z.string(),
              image: z.string(),
              techs: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                })
              ),
              createdAt: z.coerce.date(),
              updatedAt: z.coerce.date(),
            }),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
        tags: ['Projects'],
        summary: 'Create a project',
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      try {
        const {
          title,
          description,
          href,
          initial_date,
          final_date,
          icon,
          image,
          techs,
        } = request.body

        const { project } = await createProject({
          title,
          description,
          href,
          initial_date,
          final_date,
          icon,
          image,
          techs,
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
        response: {
          200: z.object({
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
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
              href: z.string(),
              initial_date: z.coerce.date(),
              final_date: z.coerce.date(),
              icon: z.string(),
              image: z.string(),
              techs: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                })
              ),
              createdAt: z.coerce.date(),
              updatedAt: z.coerce.date(),
            })
          ),
          500: z.object({
            message: z.string(),
          }),
        },
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
        response: {
          200: z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            href: z.string(),
            initial_date: z.coerce.date(),
            final_date: z.coerce.date(),
            icon: z.string(),
            image: z.string(),
            techs: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
              })
            ),
            createdAt: z.coerce.date(),
            updatedAt: z.coerce.date(),
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
  app.put(
    '/projects/:id',
    {
      schema: {
        body: z.object({
          title: z.string(),
          description: z.string(),
          href: z.string().url(),
          initial_date: z.coerce.date(),
          final_date: z.coerce.date(),
          icon: z.string(),
          image: z.string(),
          techs: z.array(
            z.object({
              id: z.string(),
            })
          ),
        }),
        tags: ['Projects'],
        summary: 'Update a project',
        response: {
          200: z.object({
            message: z.string(),
            project: z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
              href: z.string(),
              initial_date: z.coerce.date(),
              final_date: z.coerce.date(),
              icon: z.string(),
              image: z.string(),
              techs: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                })
              ),
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
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const {
        title,
        description,
        href,
        initial_date,
        final_date,
        icon,
        image,
        techs,
      } = request.body
      const { id } = request.params as { id: string }

      try {
        const { updatedProject } = await updateProject({
          id,
          title,
          description,
          href,
          initial_date,
          final_date,
          icon,
          image,
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
          newOrder: z.coerce
            .number()
            .min(1, 'A nova ordem deve ser maior ou igual a 1'),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
        tags: ['Projects'],
        summary: 'Update project order',
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      try {
        const { id: projectId, newOrder } = request.params

        const result = await updateProjectOrder(projectId, Number(newOrder))

        return reply.code(200).send(result)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro desconhecido'

        if (
          errorMessage === 'A nova ordem deve ser maior ou igual a 1' ||
          errorMessage === 'Projeto não encontrado'
        ) {
          return reply.code(400).send({ message: errorMessage })
        }

        return reply
          .code(500)
          .send({ message: 'Erro interno ao atualizar a ordem do projeto' })
      }
    }
  )
}
