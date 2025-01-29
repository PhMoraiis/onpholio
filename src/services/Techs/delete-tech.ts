import { Prisma } from '@/database/index'

interface DeleteTechRequest {
  id: string
}

export async function deleteAllTechs() {
  try {
    await Prisma.tech.deleteMany()

    return {
      success: true,
      message: 'Todas as tecnologias foram deletadas',
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Erro ao deletar todas as tecnologias: ${error.message}`)
    }
    throw new Error('Erro desconhecido ao deletar todas as tecnologias')
  }
}

export async function deleteTechById({ id }: DeleteTechRequest) {
  try {
    const tech = await Prisma.tech.findUnique({
      where: {
        id,
      },
    })

    if (!tech) {
      throw new Error('Tecnologia não encontrada')
    }

    await Prisma.tech.delete({
      where: {
        id,
      },
    })

    return {
      success: true,
      message: 'Tecnologia deletada com sucesso',
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Erro ao deletar a tecnologia: ${error.message}`)
    }
    throw new Error('Erro desconhecido ao deletar a tecnologia')
  }
}
