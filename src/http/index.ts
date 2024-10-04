import fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import fjwt, { type FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import { env } from '@/env'
import { getUsersRoute } from '@/routes/Users/get-users'
import { registerUserRoute } from '@/routes/Users/user-register'
import { userLoginRoute } from '@/routes/Users/user-login'
import { userLogoutRoute } from '@/routes/Users/user-logout'
import {
  getAllProjectsRoute,
  getProjectByIDRoute,
} from '@/routes/Projects/get-project'
import { getAllTechsRoute, getTechByIDRoute } from '@/routes/Techs/get-tech'
import {
  deleteAllProjectsRoute,
  deleteProjectByIdRoute,
} from '@/routes/Projects/delete-project'
import {
  deleteAllTechsRoute,
  deleteTechByIdRoute,
} from '@/routes/Techs/delete-tech'
import { createTechRoute } from '@/routes/Techs/create-tech'
import { updateTechRoute } from '@/routes/Techs/update-tech'
import { createProjectRoute } from '@/routes/Projects/create-project'
import { updateProjectRoute } from '@/routes/Projects/update-project'
import { updateTechOrderRoute } from '@/routes/ProjectTech/order'

const listeners = ['SIGINT', 'SIGTERM']
// biome-ignore lint/complexity/noForEach: <explanation>
listeners.forEach(signal => {
  process.on(signal, async () => {
    await app.close()
    process.exit(0)
  })
})

const app = fastify().withTypeProvider<ZodTypeProvider>()

// Cors
app.register(fastifyCors, {
  origin: '*',
})

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
app.register(registerUserRoute)
app.register(userLoginRoute)
app.register(userLogoutRoute)

// Route Techs
app.register(getAllTechsRoute)
app.register(getTechByIDRoute)
app.register(deleteAllTechsRoute)
app.register(deleteTechByIdRoute)
app.register(createTechRoute)
app.register(updateTechRoute)

// Route Projects
app.register(getAllProjectsRoute)
app.register(getProjectByIDRoute)
app.register(deleteAllProjectsRoute)
app.register(deleteProjectByIdRoute)
app.register(createProjectRoute)
app.register(updateProjectRoute)

// Route ProjectsTech
app.register(updateTechOrderRoute)

// Server
app
  .listen({
    port: env.PORT || 3333,
  })
  .then(() => {
    console.log(`HTTP Server running on http://localhost:${env.PORT}`)
  })
