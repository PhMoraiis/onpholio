import { Prisma } from '@/database/index'

interface UpdateTechRequest {
  id: string
  name?: string
  image?: string
}

export async function updateTech({ id, name, image }: UpdateTechRequest) {
  try {
    const techExists = await Prisma.tech.findUnique({
      where: { id },
    })

    if (!techExists) {
      throw new Error('Tecnologia não encontrada')
    }

    const updatedTech = await Prisma.tech.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
    })

    return {
      updatedTech,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Erro ao atualizar a tecnologia: ${error.message}`)
    }
    throw new Error('Erro desconhecido ao atualizar a tecnologia')
  }
}
