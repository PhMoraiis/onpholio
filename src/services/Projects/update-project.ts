import { Prisma } from '@/database/index'
import type { Stats } from '@prisma/client'

interface UpdateProjectRequest {
  id: string
  title?: string
  description?: string
  href?: string
  status?: Stats
  images?: {
    id: string
  }[]
  techs?: {
    id: string
  }[]
}

export async function updateProject({
  id,
  title,
  description,
  href,
  status,
  images,
  techs,
}: UpdateProjectRequest) {
  const updateProject = await Prisma.project.update({
    // Changed tech to project
    where: {
      id: id,
    },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(href && { href }),
      ...(status && { status }),
      ...(images && {
        images: {
          connect: images,
        },
      }),
      ...(techs && {
        techs: {
          connect: techs,
        },
      }),
    },
  })

  return {
    updateProject,
  }
}
