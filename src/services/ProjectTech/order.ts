import { Prisma } from '@/database/index'

interface TechOrder {
  techId: string
  projectId: string
  order: number
}

export async function updateMultipleTechOrders(techs: TechOrder[]) {
  const updatePromises = techs.map(tech =>
    Prisma.projectTech.updateMany({
      where: {
        techId: tech.techId,
        projectId: tech.projectId,
      },
      data: { order: tech.order },
    })
  )

  await Promise.all(updatePromises)
}
