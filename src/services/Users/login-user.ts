import type { FastifyReply, FastifyRequest } from 'fastify'
import { Prisma } from '../../database'
import bcrypt from 'bcrypt'

interface LoginUserRequest {
  email: string
  password: string
}

export async function loginUser({ email, password }: LoginUserRequest,
  reply: FastifyReply, req: FastifyRequest
) {
  const user = await Prisma.user.findUnique({
    where: {
      email,
    },
  })

  const isMatch = user && (await bcrypt.compare(password, user.password))
  if (!user || !isMatch) {
    return {
      success: false,
      code: 401,
      message: 'Invalid email or password',
    }
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  }

  const token = req.jwt.sign(payload)

  reply.setCookie('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  })

  return { accessToken: token }
}
