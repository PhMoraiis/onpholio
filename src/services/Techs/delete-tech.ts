import { Prisma } from '@/database/index'

interface DeleteTechRequest {
  id: string
}
export async function deleteAllTechs() {
  await Prisma.tech.deleteMany()

  return {
    success: true,
    message: 'All techs deleted',
  }
}

export async function deleteTechById({ id }: DeleteTechRequest) {
  await Prisma.tech.delete({
    where: {
      id: id,
    },
  })

  return {
    success: true,
    message: 'Tech deleted',
  }
}
