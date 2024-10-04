import type { FastifyReply } from 'fastify'
import bcryptjs from 'bcryptjs'
import { Prisma } from '@/database/index'

interface CreateUserRequest {
  name?: string
  email: string
  password: string
}

export async function createUser(
  { name, email, password }: CreateUserRequest,
  reply: FastifyReply
) {
  const existingUser = await Prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (existingUser) {
    return reply.code(401).send({
      message: 'User already exists with this email',
    })
  }

  try {
    const hash = await bcryptjs.hash(password, 10)
    const result = await Prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    })

    return reply.code(201).send({
      message: 'User created successfully',
      user: result,
    })
  } catch (error) {
    return reply.code(500).send({
      message: 'Internal server error',
    })
  }
}
