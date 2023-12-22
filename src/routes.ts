//Este arquivo é responsável por manter todas as rotas da aplicação

import { RouteShorthandOptions } from "fastify"
import { AcessRateLimiter } from "./Middlewares/Requests/AcessRateLimiter"
import { MegaController } from "./Controllers/Games/Mega/MegaController"
import { QuinaController } from "./Controllers/Games/Quina/QuinaController"
import { LotofacilController } from "./Controllers/Games/Lotofacil/LotofacilController"
import { LotomaniaController } from "./Controllers/Games/Lotomania/LotomaniaController"

//Responsável por armazenar as rotas
export async function routes(fastify: any, options: RouteShorthandOptions) {

    //Middleware que limita a quantidade de requisições por segundo
    const acessRateLimiter: AcessRateLimiter = new AcessRateLimiter()

    //Rota de teste
    fastify.get("/teste", { preHandler: [acessRateLimiter.rateLimiter] }, (request: any, reply: any) => {
        reply.status(200).send({ ServerOnline: true })
    })

    // Tratador para rotas não encontradas
    fastify.setNotFoundHandler((request: any, reply: any) => {
        reply.code(404).send('Página não encontrada')
    })

    /// Rotas responsáveis pela megasena

    //Rota responsável por retornar todos os concursos da megasena
    fastify.get('/megasena/all', { preHandler: [acessRateLimiter.rateLimiter] }, new MegaController().getAll)
    //Rota responsável por retornar um concurso específico da megasena
    fastify.get('/megasena', { preHandler: [acessRateLimiter.rateLimiter] }, new MegaController().getByConc)

    /// Rotas responsáveis pela quina

    //Rota responsável por retornar todos os concursos da quina
    fastify.get('/quina/all', { preHandler: [acessRateLimiter.rateLimiter] }, new QuinaController().getAll)
    //Rota responsável por retornar um concurso específico da quina
    fastify.get('/quina', { preHandler: [acessRateLimiter.rateLimiter] }, new QuinaController().getByConc)

    /// Rotas responsáveis pela lotofacil

    //Rota responsável por retornar todos os concursos da lotofacil
    fastify.get('/lotofacil/all', { preHandler: [acessRateLimiter.rateLimiter] }, new LotofacilController().getAll)
    //Rota responsável por retornar um concurso específico da quina
    fastify.get('/lotofacil', { preHandler: [acessRateLimiter.rateLimiter] }, new LotofacilController().getByConc)

    /// Rotas responsáveis pela lotomania

    //Rota responsável por retornar todos os concursos da lotomania
    fastify.get('/lotomania/all', { preHandler: [acessRateLimiter.rateLimiter] }, new LotomaniaController().getAll)
    //Rota responsável por retornar um concurso específico da quina
    fastify.get('/lotomania', { preHandler: [acessRateLimiter.rateLimiter] }, new LotomaniaController().getByConc)

}