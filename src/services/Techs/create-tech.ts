import { Prisma } from '../../database'

interface CreateTechRequest {
  name: string
  image?: string
}

export async function createTech({ name, image }: CreateTechRequest) {
  const result = await Prisma.tech.create({
    data: {
      name,
      image,
    },
  })

  const tech = result

  return {
    tech,
  }
}
