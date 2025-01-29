import { Prisma } from '@/database/index'

interface GetTechRequest {
  id: string
}

export async function getAllTechs() {
  try {
    const techs = await Prisma.tech.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return {
      techs,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Erro ao obter todas as tecnologias: ${error.message}`)
    }
    throw new Error('Erro desconhecido ao obter todas as tecnologias')
  }
}

export async function getTechByID({ id }: GetTechRequest) {
  try {
    const tech = await Prisma.tech.findUnique({
      where: {
        id,
      },
    })

    if (!tech) {
      throw new Error('Tecnologia não encontrada')
    }

    return {
      tech,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Erro ao obter a tecnologia: ${error.message}`)
    }
    throw new Error('Erro desconhecido ao obter a tecnologia')
  }
}
