import { Prisma } from '.'

async function seed() {
  await Prisma.user.create({
    data: {
      id: 'cm1tzm48y00010cky0olb1dir',
      name: 'Ada Lovelace',
      email: 'ada.lovelace@example.com',
      password: 'password123',
    },
  })

  await Prisma.tech.create({
    data: {
      id: 'cm1tzm48y00010cky0olb2dir',
      name: 'JavaScript',
      image:
        'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg',
    },
  })

  await Prisma.project.create({
    data: {
      id: 'cm1tzm48y00010cky0olb3dir',
      title: 'Onpholio',
      description: 'My personal portfolio',
      imagesDesktop: [
        'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg',
        'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg',
      ],
      imagesMobile: [
        'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg',
        'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg',
      ],
      href: 'https://onpholio.vercel.app',
      order: 1,
      status: 'ONLINE',
      techs: {
        connect: [{ id: 'cm1tzm48y00010cky0olb2dir' }],
      },
    },
  })

  await Prisma.projectTech.create({
    data: {
      id: 'cm1tzm48y00010cky0olb4die',
      projectId: 'cm1tzm48y00010cky0olb3dir',
      techId: 'cm1tzm48y00010cky0olb2dir',
      order: 1,
    },
  })
}

seed().then(() => {
  console.log('Database seeded')
  Prisma.$disconnect()
})
