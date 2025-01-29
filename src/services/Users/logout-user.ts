import type { FastifyReply, FastifyRequest } from 'fastify'

export async function logout(
  req: FastifyRequest
): Promise<{ success: boolean; message: string; code: number }> {
  if (!req.cookies.access_token) {
    return {
      success: false,
      message: 'User is not logged in!',
      code: 401,
    }
  }

  return {
    success: true,
    message: 'Logged out successfully!',
    code: 200,
  }
}
