import { Prisma } from '@/database/index'

interface UpdateProjectRequest {
  id: string
  title?: string
  description?: string
  imagesDesktop?: string[]
  imagesMobile?: string[]
  href?: string
  order?: number
  status?: 'ONLINE' | 'DEVELOPMENT' | 'INTERRUPTED'
  techs?: { techId: string; order: number }[]
}

export async function updateProject({
  id,
  title,
  description,
  imagesDesktop,
  imagesMobile,
  href,
  order,
  status,
  techs,
}: UpdateProjectRequest) {
  const result = await Prisma.tech.update({
    where: {
      id: id,
    },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(imagesDesktop && { imagesDesktop }),
      ...(imagesMobile && { imagesMobile }),
      ...(href && { href }),
      ...(order && { order }),
      ...(status && { status }),
      ...(techs && {
        techs: { connect: techs.map(tech => ({ id: tech.techId })) },
      }),
    },
  })

  const updateProject = result

  return {
    updateProject,
  }
}
