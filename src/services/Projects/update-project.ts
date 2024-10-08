import { Prisma } from '@/database/index'
import type { Stats } from '@prisma/client'

interface UpdateProjectRequest {
  id: string
  title?: string
  description?: string
  lightImageDesktop?: string
  darkImageDesktop?: string
  lightImageMobile?: string
  darkImageMobile?: string
  href?: string
  status?: Stats
  techs?: {
    id: string
  }[]
}

export async function updateProject({
  id,
  title,
  description,
  lightImageDesktop,
  darkImageDesktop,
  lightImageMobile,
  darkImageMobile,
  href,
  status,
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
      ...(lightImageDesktop && { lightImageDesktop }),
      ...(darkImageDesktop && { darkImageDesktop }),
      ...(lightImageMobile && { lightImageMobile }),
      ...(darkImageMobile && { darkImageMobile }),
      ...(href && { href }),
      ...(status && { status }),
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
