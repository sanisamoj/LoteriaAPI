import { FastifyReply } from "fastify"
import { FastifyRequestUser } from "../../../@Types/FastifyExtends/FastifyRequestUser"
import { RequestResponse } from "../../../@Types/RequestResponse/RequestResponse"
import { LotomaniaType } from "../../../Services/Games/Lotomania/Types/LotomaniaType"
import { ResultsManager } from "../../../Services/Results/ResultsManager"


export class LotomaniaController {

    //Retorna todos os resultados da lotomania
    async getAll(request: FastifyRequestUser, reply: FastifyReply): Promise<RequestResponse> {

        //Chama o serviço responsável por retornar todos os resultados da lotomania
        const resultManager: ResultsManager = new ResultsManager()
        const response: RequestResponse = await resultManager.getAll('lotomania')

        return reply.status(response.statusCode).send(response)

    }

    //Retorna um resultado pelo concurso da lotomania
    async getByConc(request: FastifyRequestUser, reply: FastifyReply): Promise<RequestResponse> {

        //Retorna o número do concurso a ser buscado
        const { conc } = await request.query as any

        //Chama o serviço responsável por retornar um resultado a partir do seu concurso
        const resultsManager: ResultsManager = new ResultsManager()
        const response: RequestResponse = await resultsManager.getByConc<LotomaniaType>('lotomania', 'lotomania', parseInt(conc))

        return reply.status(response.statusCode).send(response)
    }

}