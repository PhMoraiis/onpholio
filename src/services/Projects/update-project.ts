import { Prisma } from '@/database/index'
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from '@/services/Upload'
import type { Stats, Image } from '@prisma/client'

interface UpdateProjectRequest {
  id: string
  title?: string
  description?: string
  href?: string
  status?: Stats
  images?: {
    fileBuffer: Buffer
    theme: 'LIGHT' | 'DARK'
    size: 'DESKTOP' | 'MOBILE'
    id?: string // ID da imagem existente, se aplicável
  }[]
  techs?: {
    id: string
  }[]
}

export async function updateProject({
  id,
  title,
  description,
  href,
  status,
  images,
  techs,
}: UpdateProjectRequest) {
  return await Prisma.$transaction(async transaction => {
    try {
      // Obter imagens existentes associadas ao projeto
      const existingImages = await transaction.image.findMany({
        where: { projectId: id }, // Ajustado para o nome do campo correto
      })

      let uploadedImages: Image[] = []

      // Processar novas imagens
      if (images) {
        // Identificar IDs das imagens novas para comparação
        const newImageIds = images.map(img => img.id).filter(Boolean)
        const imagesToRemove = existingImages.filter(
          img => !newImageIds.includes(img.id)
        )

        // Desconectar as imagens obsoletas do projeto
        await transaction.project.update({
          where: { id },
          data: {
            images: {
              disconnect: imagesToRemove.map(img => ({ id: img.id })),
            },
          },
        })

        // Excluir as imagens do Cloudinary que foram removidas
        await Promise.all(
          imagesToRemove.map(
            img => deleteImageFromCloudinary(img.id) // Usar o `id` da imagem, ajuste conforme necessário
          )
        )

        // Fazer upload das novas imagens
        uploadedImages = await Promise.all(
          images
            .filter(img => !img.id) // Apenas as imagens novas (sem `id`)
            .map(({ fileBuffer, theme, size }) =>
              uploadImageToCloudinary(fileBuffer, 'projects', theme, size, id)
            )
        )
      }

      // Atualizar o projeto com os dados fornecidos
      const updatedProject = await transaction.project.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(href && { href }),
          ...(status && { status }),
          ...(images && {
            images: {
              connect: uploadedImages.map(image => ({ id: image.id })),
            },
          }),
          ...(techs && {
            techs: {
              set: [], // Remove as tecnologias antigas
              connect: techs, // Adiciona as novas tecnologias
            },
          }),
        },
      })

      return {
        success: true,
        updatedProject,
        uploadedImages,
      }
    } catch (error) {
      console.error('Erro ao atualizar o projeto:', error)
      throw error
    }
  })
}
