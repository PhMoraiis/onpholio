import { Prisma } from '@/database/index'

interface ProjectOrder {
  id: string
  order: number
}

export async function updateMultipleProjectOrders(projects: ProjectOrder[]) {
  const updatePromises = projects.map(project =>
    Prisma.project.update({
      where: { id: project.id },
      data: { order: project.order },
    })
  )

  await Promise.all(updatePromises)
}
