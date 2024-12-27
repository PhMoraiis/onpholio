import { Prisma } from '@/database/index'
import type { Stats } from '@prisma/client'

interface CreateProjectRequest {
  title: string
  description: string
  href: string
  status: Stats
  images: {
    id: string
  }[]
  techs: {
    id: string
  }[]
}

export async function createProject({
  title,
  description,
  href,
  status,
  techs,
  images,
}: CreateProjectRequest) {
  try {
    const maxOrderProject = await Prisma.project.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const newOrder = maxOrderProject ? maxOrderProject.order + 1 : 1 // Se não houver projetos, começa com 1

    const project = await Prisma.project.create({
      data: {
        title,
        description,
        href,
        status,
        order: newOrder,
        images: {
          connect: images,
        },
        techs: {
          connect: techs,
        },
      },
    })

    return {
      project,
    }
  } catch (error) {
    console.error('Erro ao criar o projeto:', error)
    throw error
  }
}
