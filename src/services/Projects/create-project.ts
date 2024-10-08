import { Prisma } from '@/database/index'
import type { Stats } from '@prisma/client'

interface CreateProjectRequest {
  title: string
  description: string
  lightImageDesktop: string
  darkImageDesktop?: string
  lightImageMobile: string
  darkImageMobile?: string
  href: string
  status: Stats
  techs: {
    id: string
  }[]
}

export async function createProject({
  title,
  description,
  lightImageDesktop,
  darkImageDesktop,
  lightImageMobile,
  darkImageMobile,
  href,
  status,
  techs,
}: CreateProjectRequest) {
  try {
    const project = await Prisma.project.create({
      data: {
        title,
        description,
        lightImageDesktop,
        darkImageDesktop,
        lightImageMobile,
        darkImageMobile,
        href,
        status,
        techs: {
          connect: techs
        }
      },
    })

    return {
      project,
    }
  } catch (error) {
    console.error('Erro ao criar o projeto:', error)
    throw error;
  }
}
