import { Prisma } from '@/database/index'

// Atualiza a ordem de um projeto após o drag-and-drop e reorganiza os demais conforme necessário
export async function updateProjectOrder(projectId: string, newOrder: number) {
  try {
    // Validações iniciais
    if (newOrder < 1) {
      throw new Error('A nova ordem deve ser maior ou igual a 1')
    }

    return await Prisma.$transaction(async transaction => {
      // Busca o projeto a ser movido
      const project = await transaction.project.findUnique({
        where: { id: projectId },
        select: { order: true },
      })

      if (!project) {
        throw new Error('Projeto não encontrado')
      }

      const currentOrder = project.order

      // Caso a ordem não tenha mudado
      if (newOrder === currentOrder) {
        return { message: 'Ordem já está correta', updatedProject: project }
      }

      // Atualiza a ordem dos projetos afetados
      if (newOrder < currentOrder) {
        await transaction.project.updateMany({
          where: {
            order: { gte: newOrder, lt: currentOrder },
          },
          data: { order: { increment: 1 } },
        })
      } else if (newOrder > currentOrder) {
        await transaction.project.updateMany({
          where: {
            order: { gt: currentOrder, lte: newOrder },
          },
          data: { order: { decrement: 1 } },
        })
      }

      // Atualiza o projeto movido
      const updatedProject = await transaction.project.update({
        where: { id: projectId },
        data: { order: newOrder },
      })

      return { updatedProject }
    })
  } catch (error) {
    console.error('Erro ao atualizar a ordem do projeto:', error)
    throw error
  }
}
