import { Prisma } from '../../database'

interface GetProjectRequest {
  id: string
}

export async function getAllProjects({
  sortBy = 'title',
  sortOrder = 'asc',
  filterBy,
}: {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filterBy?: string
}) {
  let query = /*sql*/ `
    SELECT * FROM projects
  `

  if (filterBy) {
    query += /*sql*/ `
      WHERE LOWER(title) LIKE LOWER(%${filterBy}%)
    `
  }

  const orderClause = sortOrder === 'asc' ? 'ASC' : 'DESC'
  query += /*sql*/ `
    ORDER BY LOWER(${sortBy}) ${orderClause}
  `

  const projects = await Prisma.$queryRaw`${query}`

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
