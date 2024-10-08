import { Prisma } from '@/database/index'

interface UpdateTechRequest {
  id: string
  name?: string
  image?: string
}

export async function updateTech({ id, name, image }: UpdateTechRequest) {
  const updateTech = await Prisma.tech.update({
    where: {
      id: id,
    },
    data: {
      ...(name && { name }),
      ...(image && { image }),
    },
  })

  return {
    updateTech,
  }
}
