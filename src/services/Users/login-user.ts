import type { FastifyReply, FastifyRequest } from 'fastify'
import bcryptjs from 'bcryptjs'
import { Prisma } from '@/database/index'

interface LoginUserRequest {
  email: string
  password: string
}

export async function loginUser(
  { email, password }: LoginUserRequest,
  reply: FastifyReply,
  req: FastifyRequest
) {
  // Procurar o usuário no banco de dados
  const user = await Prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return {
      success: false,
      code: 401,
      message: 'Invalid email or password',
    }
  }

  // Verificar a senha
  const isMatch = await bcryptjs.compare(password, user.password)
  if (!isMatch) {
    return {
      success: false,
      code: 401,
      message: 'Invalid email or password',
    }
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

  return { accessToken: token }
}
