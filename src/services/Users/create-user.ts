import type { FastifyReply } from 'fastify'
import bcryptjs from 'bcryptjs'
import { Prisma } from '@/database/index'

export interface ICreateUserRequest {
  name?: string
  email: string
  password: string
}

export async function createUser(
  { name, email, password }: ICreateUserRequest,
  reply: FastifyReply
) {
  try {
    // Verifica se o usuário já existe
    const existingUser = await Prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return reply.status(409).send({
        success: false,
        message: 'A user with this email already exists.',
      })
    }

    // Hash da senha
    const hash = await bcryptjs.hash(password, 12)

    // Criação do usuário no banco de dados
    const newUser = await Prisma.user.create({
      data: { name, email, password: hash },
    })

    return reply.status(201).send({
      success: true,
      message: 'User created successfully!',
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    })
  } catch (error) {
    return reply.status(500).send({
      success: false,
      message: 'An internal server error occurred. Please try again later.',
    })
  }
}
