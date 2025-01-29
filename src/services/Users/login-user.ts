import type { FastifyReply, FastifyRequest } from 'fastify'
import bcryptjs from 'bcryptjs'
import { Prisma } from '@/database/index'

export interface ILoginUserRequest {
  email: string
  password: string
}

export async function loginUser(
  { email, password }: ILoginUserRequest,
  reply: FastifyReply,
  req: FastifyRequest
) {
  try {
    // Procurar o usuário no banco de dados
    const user = await Prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return reply.status(404).send({
        success: false,
        message: 'User not found! Verify your credentials and try again.',
      })
    }

    // Verificar a senha
    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
      return reply.status(401).send({
        success: false,
        message: 'Invalid email or password!',
      })
    }

    // Se as credenciais estiverem corretas, gerar o token JWT
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    const token = req.jwt.sign(payload)

    // Configurar o cookie com o JWT gerado
    reply.setCookie('access_token', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    return reply.send({
      success: true,
      message: `Welcome back, ${user.name}! Redirecting...`,
      name: user.name,
      accessToken: token,
    })
  } catch (error) {
    return reply.status(500).send({
      success: false,
      message: 'An internal server error occurred. Please try again later.',
    })
  }
}
