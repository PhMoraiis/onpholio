import { Prisma } from '@/database/index'

interface GetTechRequest {
  id: string
}

export async function getAllTechs() {
  const techs = await Prisma.tech.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  
  return {
    techs,
  }
}

export async function getTechByID({ id }: GetTechRequest) {
  const tech = await Prisma.tech.findUnique({
    where: {
      id: id,
    },
  })

  return {
    tech,
  }
}
