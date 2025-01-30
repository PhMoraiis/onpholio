import { Prisma } from '@/database/index'

interface CreateTechRequest {
  name: string
  image: string
}

export async function createTech({ name, image }: CreateTechRequest) {
  const existingTech = await Prisma.tech.findFirst({
    where: { name },
  })

  if (existingTech) {
    return {
      success: false,
      statusCode: 409,
      message: 'Tech already exists!',
    }
  }

  try {
    const tech = await Prisma.tech.create({
      data: { name, image },
    })

    return {
      success: true,
      statusCode: 201,
      message: 'Tech created successfully!',
      tech,
    }
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error! Failed to create tech.',
    }
  }
}
