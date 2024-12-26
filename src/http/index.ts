import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastifyScalar from '@scalar/fastify-api-reference'
import fjwt, { type FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import { env } from '@/lib/env'
import { getUsersRoute } from '@/routes/Users/get-users'
import {
  getAllProjectsRoute
} from '@/routes/Projects/get-project'
import { getAllTechsRoute } from '@/routes/Techs/get-tech'
import type { version } from 'typescript'
import { userLoginRoute } from '@/routes/Users/user-login'
import { userLogoutRoute } from '@/routes/Users/user-logout'
import { registerUserRoute } from '@/routes/Users/user-register'

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()

// Cors
app.register(fastifyCors, {
  origin:
    env.NODE_ENV === 'production'
      ? 'https://philipemorais.com'
      : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

// Swagger OPEN API
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Onpholio API Reference',
      version: '1.0.0',
      description: 'API Reference for Onpholio',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifyScalar, {
    routePrefix: '/docs',
    configuration: {
      theme: 'moon',
      metaData: {
        title: 'Onpholio API Reference',
        description: 'API Reference for Onpholio',
        version: '1.0.0',
      }
    }
});

// JWT
app.register(fjwt, {
  secret: env.JWT_SECRET,
})
app.addHook('preHandler', (req, res, next) => {
  req.jwt = app.jwt
  return next()
})
app.decorate(
  'authenticate',
  async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token

    if (!token) {
      return reply.status(401).send({ message: 'Unauthorized' })
    }

    const decoded = req.jwt.verify<FastifyJWT['user']>(token)
    req.user = decoded
  }
)

// Cookies
app.register(fCookie, {
  secret: env.COOKIE_SECRET,
  hook: 'preHandler',
})

// Validator and Serializers ZOD
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Routes
app.get('/', () => 'Hello World!')

// Route Users
app.register(getUsersRoute)
app.register(userLoginRoute)
app.register(userLogoutRoute)
app.register(registerUserRoute)

// Route Techs
app.register(getAllTechsRoute)

// Route Projects
app.register(getAllProjectsRoute)

// Server
app
  .listen({
    port: env.PORT || 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`HTTP Server running on http://localhost:${env.PORT}`)
  })
  .catch(err => {
    console.error('Error starting server:', err)
  })
