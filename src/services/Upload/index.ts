import { env } from '@/lib/env'
import { v2 as cloudinary } from 'cloudinary'
import { Prisma } from '@/database/index'
import type { ImageSize, ImageTheme } from '@prisma/client'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

// Função para fazer o upload da imagem para o Cloudinary
import type { Image } from '@prisma/client'

export const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  folder: string,
  theme: ImageTheme,
  size: ImageSize,
  projectId: string
): Promise<Image> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      async (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          try {
            const image = await Prisma.image.create({
              data: {
                url: result.secure_url,
                theme,
                size,
                project: { connect: { id: projectId } },
              },
            })
            resolve(image)
          } catch (dbError) {
            reject(dbError)
          }
        } else {
          reject(new Error('Upload failed: result is undefined'))
        }
      }
    )

    const stream = require('node:stream')
    const bufferStream = new stream.PassThrough()
    bufferStream.end(fileBuffer)
    bufferStream.pipe(uploadStream)
  })
}

export async function deleteImageFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    if (result.result !== 'ok') {
      throw new Error(`Erro ao remover imagem: ${result.result}`)
    }
    return result
  } catch (error) {
    console.error('Erro ao excluir imagem no Cloudinary:', error)
    throw error
  }
} 