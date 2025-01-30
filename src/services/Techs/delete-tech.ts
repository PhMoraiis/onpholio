import { Prisma } from '@/database/index'

interface DeleteTechRequest {
  id: string
}

export async function deleteAllTechs() {
  try {
    const techs = await Prisma.tech.deleteMany()

    if (!techs) {
      return {
        success: false,
        statusCode: 404,
        message: 'No techs found! Nothing to delete.',
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: 'All techs deleted successfully!',
    }
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error! Failed to delete all techs.',
    }
  }
}

export async function deleteTechById({ id }: DeleteTechRequest) {
  try {
    const tech = await Prisma.tech.findUnique({
      where: { id },
    })

    if (!tech) {
      return {
        success: false,
        statusCode: 404,
        message: 'Tech not found! Verify the ID and try again.',
      }
    }

    await Prisma.tech.delete({
      where: { id },
    })

    return {
      success: true,
      statusCode: 200,
      message: 'Tech deleted successfully!',
    }
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error! Failed to delete the tech.',
    }
  }
}
