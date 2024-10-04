import { Prisma } from '../../database'

interface GetTechRequest {
  id: string
}

export async function getAllTechs({
  sortBy = 'name',
  sortOrder = 'asc',
  filterBy,
}: {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filterBy?: string
}) {
  let query = /*sql*/ `
    SELECT * FROM techs
  `

  if (filterBy) {
    query += /*sql*/ `
      WHERE LOWER(name) LIKE LOWER(%${filterBy}%)
    `
  }

  const orderClause = sortOrder === 'asc' ? 'ASC' : 'DESC'
  query += /*sql*/ `
    ORDER BY LOWER(${sortBy}) ${orderClause}
  `

  const techs = await Prisma.$queryRaw`${query}`

  return {
    techs,
  }
}

export async function getTechByID({ id }: GetTechRequest) {
  const tech = await Prisma.tech.findUnique({
    where: {
      id: id,
    },
  })

  return {
    tech,
  }
}
