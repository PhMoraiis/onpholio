import type { FastifyReply, FastifyRequest } from 'fastify'

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  const token = req.cookies.access_token

  if (!token) {
    return reply.status(401).send({
      success: false,
      message: 'User is not logged in!',
    })
  }

  reply.clearCookie('access_token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return reply.status(200).send({
    success: true,
    message: 'See you soon! Redirecting...',
  })
}
