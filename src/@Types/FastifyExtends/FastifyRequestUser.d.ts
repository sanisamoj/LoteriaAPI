import { FastifyRequest } from "fastify";

export interface FastifyRequestUser extends FastifyRequest {
  userId: string
  sessionToken: string
}