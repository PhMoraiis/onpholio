import { Prisma } from '@/database/index'

interface CreateProjectRequest {
  title: string
  description: string
  imagesDesktop: string[]
  imagesMobile: string[]
  href: string
  order: number
  status: 'ONLINE' | 'DEVELOPMENT' | 'INTERRUPTED'
  techs: { techId: string; order: number }[] 
}

export async function createProject({
  title,
  description,
  imagesDesktop,
  imagesMobile,
  href,
  order,
  status,
  techs,
}: CreateProjectRequest) {
  const result = await Prisma.project.create({
    data: {
      title,
      description,
      imagesDesktop,
      imagesMobile,
      href,
      order,
      status,
      techs: {
        create: techs.map(tech => ({
          tech: {
            connect: { id: tech.techId }, // Conecta a tecnologia já existente
          },
          order: tech.order,
        })),
      },
    },
  })

  const project = result

  return {
    project,
  }
}
