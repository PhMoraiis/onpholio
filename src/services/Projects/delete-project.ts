import { Prisma } from '../../database'

interface DeleteProjectRequest {
  id: string
}
export async function deleteAllProjects() {
  await Prisma.project.deleteMany()

  return {
    success: true,
    message: 'All projects deleted',
  }
}

export async function deleteProjectById({ id }: DeleteProjectRequest) {
  await Prisma.project.delete({
    where: {
      id: id,
    },
  })

  return {
    success: true,
    message: 'Project deleted',
  }
}
