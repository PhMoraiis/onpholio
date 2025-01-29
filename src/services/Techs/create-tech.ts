import { Prisma } from '@/database/index'

interface CreateTechRequest {
  name: string
  image?: string
}

export async function createTech({ name, image }: CreateTechRequest) {
  try {
    const existingTech = await Prisma.tech.findFirst({
      where: {
        name,
      },
    })

    if (existingTech) {
      throw new Error('Tecnologia já existe')
    }

    const result = await Prisma.tech.create({
      data: {
        name,
        image,
      },
    })

    return {
      success: true,
      message: 'Tecnologia criada com sucesso',
      tech: result,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Erro ao criar a tecnologia: ${error.message}`)
    }
    throw new Error('Erro desconhecido ao criar a tecnologia')
  }
}
