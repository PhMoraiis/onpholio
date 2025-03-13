import { Prisma } from '@/database/index'

export async function updateProjectOrder(projectId: string, newOrder: number) {
  try {
    if (newOrder < 1) {
      throw new Error('A nova ordem deve ser maior ou igual a 1')
    }

    const project = await Prisma.project.findUnique({
      where: { id: projectId },
      select: { order: true },
    })

    if (!project) {
      throw new Error('Projeto não encontrado')
    }

    const currentOrder = project.order

    if (newOrder === currentOrder) {
      return { message: 'Ordem já está correta', updatedProject: project }
    }

    await Prisma.$transaction(async tx => {
      if (newOrder < currentOrder) {
        await tx.project.updateMany({
          where: { order: { gte: newOrder, lt: currentOrder } },
          data: { order: { increment: 1 } },
        })
      } else {
        await tx.project.updateMany({
          where: { order: { gt: currentOrder, lte: newOrder } },
          data: { order: { decrement: 1 } },
        })
      }

      await tx.project.update({
        where: { id: projectId },
        data: { order: newOrder },
      })
    })

    return { message: 'Ordem atualizada com sucesso' }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }

    throw new Error('Erro desconhecido ao atualizar a ordem do projeto')
  }
}
