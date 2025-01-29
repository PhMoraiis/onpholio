import { Prisma } from '@/database/index'

export async function deleteProjectAndReorder({ id }: { id: string }) {
  try {
    return await Prisma.$transaction(async transaction => {
      // Obter o projeto que será deletado
      const projectToDelete = await transaction.project.findUnique({
        where: { id },
        select: { order: true },
      })

      if (!projectToDelete) {
        throw new Error('Projeto não encontrado')
      }

      const { order } = projectToDelete

      // Deletar o projeto
      const deletedProject = await transaction.project.delete({
        where: { id },
      })

      // Atualizar as ordens dos projetos restantes
      await transaction.project.updateMany({
        where: {
          order: { gt: order },
        },
        data: {
          order: { decrement: 1 },
        },
      })

      return {
        success: true,
        message: 'Projeto deletado e ordens ajustadas',
        deletedProject,
      }
    })
  } catch (error) {
    console.error('Erro ao deletar e reordenar projetos:', error)
    throw error
  }
}
