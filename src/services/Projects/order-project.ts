import { Prisma } from '@/database/index'

export async function updateProjectOrder(projectId: string, newOrder: number) {
  try {
    const updatedProject = await Prisma.project.update({
      where: { id: projectId },
      data: { order: newOrder },
    })

    return {
      updatedProject,
    }
  } catch (error) {
    console.error('Erro ao atualizar a ordem do projeto:', error)
    throw error
  }
}