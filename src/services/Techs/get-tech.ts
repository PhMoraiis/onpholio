import { Prisma } from '@/database/index'

interface GetTechRequest {
  id: string
}

export async function getAllTechs() {
  try {
    const techs = await Prisma.tech.findMany({
      orderBy: { name: 'asc' },
    })

    return {
      success: true,
      statusCode: 200,
      techs,
    }
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error! Failed to get all techs.',
    }
  }
}

export async function getTechByID({ id }: GetTechRequest) {
  try {
    const tech = await Prisma.tech.findUnique({ where: { id } })

    if (!tech) {
      return {
        success: false,
        statusCode: 404,
        message: 'Tech not found! Verify the ID and try again.',
      }
    }

    return {
      success: true,
      statusCode: 200,
      tech,
    }
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}
