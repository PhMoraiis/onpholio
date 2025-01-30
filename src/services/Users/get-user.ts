import { Prisma } from '@/database/index'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function getUsers(req: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await Prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    if (!users) {
      return reply.status(404).send({
        success: false,
        message: 'Users not found',
      })
    }

    return reply.status(200).send({
      success: true,
      message: 'Users retrieved successfully',
      users,
    })
  } catch (error) {
    return reply.status(500).send({
      success: false,
      message: 'Internal server error',
    })
  }
}
