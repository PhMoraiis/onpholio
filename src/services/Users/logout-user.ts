import type { FastifyReply, FastifyRequest } from 'fastify'

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token', {
    path: '/',
    httpOnly: true,
    secure: true, // Certifique-se de definir 'secure: true' para produção
    sameSite: 'none', // Para permitir que o cookie seja enviado em requisições cross-site
  })
  return reply.send({
    message: 'Logged out successfully',
  })
}
