import { Prisma } from '@/database/index'
import { uploadImageToCloudinary } from '@/services/Upload'
import type { Stats } from '@prisma/client'

interface CreateProjectRequest {
  title: string
  description: string
  href: string
  status: Stats
  images: {
    fileBuffer: Buffer
    theme: 'LIGHT' | 'DARK'
    size: 'DESKTOP' | 'MOBILE'
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
  return await Prisma.$transaction(async transaction => {
    try {
      // Determina a ordem do novo projeto
      const maxOrderProject = await transaction.project.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      })

      const newOrder = maxOrderProject ? maxOrderProject.order + 1 : 1

      // Cria o projeto no banco
      const project = await transaction.project.create({
        data: {
          title,
          description,
          href,
          status,
          order: newOrder,
          techs: {
            connect: techs,
          },
        },
      })

      // Faz o upload das imagens
      const uploadedImages = await Promise.all(
        images.map(({ fileBuffer, theme, size }) =>
          uploadImageToCloudinary(
            fileBuffer,
            'projects',
            theme,
            size,
            project.id
          )
        )
      )

      // Atualiza o projeto com as imagens carregadas
      await transaction.project.update({
        where: { id: project.id },
        data: {
          images: {
            connect: uploadedImages.map(image => ({ id: image.id })),
          },
        },
      })

      return { project }
    } catch (error) {
      console.error('Erro ao criar o projeto:', error)
      throw error
    }
  })
}
