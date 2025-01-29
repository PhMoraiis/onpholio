import type { FastifyReply } from 'fastify'
import bcryptjs from 'bcryptjs'
import { Prisma } from '@/database/index'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

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
    const hash = await bcryptjs.hash(password, 12)

    // Gerar chave secreta para 2FA
    const secret = speakeasy.generateSecret({ length: 20 })

    // Verificar se o 'otpauth_url' está presente
    if (!secret.otpauth_url) {
      return reply.code(500).send({
        message: 'Failed to generate OTP auth URL for 2FA',
      })
    }

    // Gerar QR code para o app autenticador
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url)

    const result = await Prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        twoFactorSecret: secret.base32,
      },
    })

    return reply.code(201).send({
      message: 'User created successfully',
      user: result,
      twoFactorQrCode: qrCodeUrl, // Retornar o QR code para configuração do 2FA
    })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({
      message: 'Internal server error',
    })
  }
}
