import type { FastifyReply, FastifyRequest } from 'fastify'
import { Prisma } from '../../database'

export async function getUsers(req: FastifyRequest, reply: FastifyReply) {
  const users = await Prisma.user.findMany({
    select: {
      name: true,
      id: true,
      email: true,
    },
  })

  return reply.code(200).send(users)
}
