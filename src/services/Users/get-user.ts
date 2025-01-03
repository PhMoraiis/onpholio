import { Prisma } from '@/database/index'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function getUsers(req: FastifyRequest, reply: FastifyReply) {
  const users = await Prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  return reply.code(200).send(users)
}
