import type { FastifyReply, FastifyRequest } from 'fastify'

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token')
  return reply.send({
    message: 'Logged out successfully',
  })
}
