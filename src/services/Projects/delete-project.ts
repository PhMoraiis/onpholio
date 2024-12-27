import { Prisma } from '@/database/index'

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

  await reorderProjects()

  return {
    success: true,
    message: 'Project deleted',
  }
}

async function reorderProjects() {
  const projects = await Prisma.project.findMany({
    orderBy: { order: 'asc' },
  })

  for (let i = 0; i < projects.length; i++) {
    await Prisma.project.update({
      where: { id: projects[i].id },
      data: { order: i + 1 },
    })
  }
}
