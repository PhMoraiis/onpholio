import { Prisma } from '@/database/index'

interface CreateTechRequest {
  name: string
}

export async function createTech({ name }: CreateTechRequest) {
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
      data: { name },
    })

    return {
      success: true,
      statusCode: 201,
      message: 'Tech created successfully!',
      tech,
    }
  } catch (error) {
    console.log('Error creating tech:', error)
    throw new Error('Error creating tech')
  }
}
