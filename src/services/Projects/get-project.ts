import { Prisma } from '@/database/index'

interface GetProjectRequest {
  id: string
}

export async function getAllProjects() {
  const projects = await Prisma.project.findMany({
   include: {
    techs: true,
   },
   orderBy: {
    createdAt: 'asc',
   },
  })

  return {
    projects,
  }
}

export async function getProjectByID({ id }: GetProjectRequest) {
  const project = await Prisma.project.findUnique({
    where: {
      id: id,
    },
  })

  return {
    project,
  }
}
