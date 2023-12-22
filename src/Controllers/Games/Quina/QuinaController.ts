//Esta classe controladora recebe as requisições referentes ao jogo Quina e chama os serviços pertinentes

import { FastifyReply } from "fastify"
import { FastifyRequestUser } from "../../../@Types/FastifyExtends/FastifyRequestUser"
import { RequestResponse } from "../../../@Types/RequestResponse/RequestResponse"
import { MegaType } from "../../../Services/Games/Mega/Types/MegaTypes"
import { ResultsManager } from "../../../Services/Results/ResultsManager"

export class QuinaController {

    //Retorna todos os resultados da megasena
    async getAll(request: FastifyRequestUser, reply: FastifyReply): Promise<RequestResponse> {

        //Chama o serviço responsável por retornar todos os resultados da megasena
        const resultsManager: ResultsManager = new ResultsManager()
        const response: RequestResponse = await resultsManager.getAll('quina')

        return reply.status(response.statusCode).send(response)

    }

    //Retorna todos os resultados da megasena
    async getByConc(request: FastifyRequestUser, reply: FastifyReply): Promise<RequestResponse> {

        //Retorna o número do concurso a ser retornado
        const { conc } = await request.query as any

        //Chama o serviço responsável por retornar um resultado a partir do seu concurso
        const resultsManager: ResultsManager = new ResultsManager()
        const response: RequestResponse = await resultsManager.getByConc<MegaType>('quina', 'quina', parseInt(conc))

        return reply.status(response.statusCode).send(response)

    }

}