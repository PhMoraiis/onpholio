import { Prisma } from '@/database/index'

interface CreateProjectRequest {
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

export async function createProject({
  title,
  description,
  href,
  initial_date,
  final_date,
  icon,
  image,
  techs,
}: CreateProjectRequest) {
  try {
    const maxOrderProject = await Prisma.project.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const newOrder = maxOrderProject ? maxOrderProject.order + 1 : 1

    // Cria o projeto e retorna os dados completos das tecnologias associadas
    const project = await Prisma.project.create({
      data: {
        title,
        description,
        href,
        initial_date,
        final_date,
        icon,
        image,
        order: newOrder,
        techs: {
          connect: techs,
        },
      },
      include: {
        techs: {
          select: {
            id: true,
            name: true, // Inclui o nome da tecnologia
          },
        },
      },
    })

    return { project }
  } catch (error) {
    console.error('Error creating project:', error)
    throw new Error('Internal server error! Failed to create project.')
  }
}
