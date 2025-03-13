import { Prisma } from '@/database/index'

interface UpdateProjectRequest {
  id: string
  title: string
  description: string
  href: string
  initial_date: Date
  final_date: Date
  icon: string
  image: string
  techs: {
    id: string
  }[]
}

export async function updateProject({
  id,
  title,
  description,
  href,
  initial_date,
  final_date,
  icon,
  image,
  techs,
}: UpdateProjectRequest) {
  try {
    // Atualizar o projeto com os dados fornecidos
    const updatedProject = await Prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(href && { href }),
        ...(initial_date && { initial_date }),
        ...(final_date && { final_date }),
        ...(icon && { icon }),
        ...(image && { image }),
        ...(techs && {
          techs: {
            set: [], // Remove as tecnologias antigas
            connect: techs, // Adiciona as novas tecnologias
          },
        }),
      },
      include: {
        techs: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return {
      updatedProject,
    }
  } catch (error) {
    console.error('Erro ao atualizar o projeto:', error)
    throw error
  }
}
