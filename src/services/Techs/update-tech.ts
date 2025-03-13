import { Prisma } from '@/database/index'

interface UpdateTechRequest {
  id: string
  name: string
}

export async function updateTech({ id, name }: UpdateTechRequest) {
  try {
    const techExists = await Prisma.tech.findUnique({ where: { id } })

    if (!techExists) {
      return {
        success: false,
        statusCode: 404,
        message: 'Tecnologia não encontrada',
      }
    }

    const updatedTech = await Prisma.tech.update({
      where: { id },
      data: {
        ...(name && { name }),
      },
    })

    return {
      success: true,
      statusCode: 200,
      updatedTech,
    }
  } catch (error: unknown) {
    console.error('Erro ao atualizar a tecnologia:', error)
    return {
      success: false,
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}
