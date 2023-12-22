import { FastifyReply } from "fastify"
import { FastifyRequestUser } from "../../../@Types/FastifyExtends/FastifyRequestUser"
import { ResultsManager } from "../../../Services/Results/ResultsManager"
import { RequestResponse } from "../../../@Types/RequestResponse/RequestResponse"
import { LotofacilType } from "../../../Services/Games/Lotofacil/Types/LotofacilType"


export class LotofacilController {

    //Retorna todos os resultados da lotofacil
    async getAll(request: FastifyRequestUser, reply: FastifyReply): Promise<RequestResponse> {

        //Chama o serviço responsável por retornar todos os resultados da lotofacil
        const resultManager: ResultsManager = new ResultsManager()
        const response: RequestResponse = await resultManager.getAll('lotofacil')

        return reply.status(response.statusCode).send(response)

    }

    //Retorna um resultado pelo concurso da lotofacil
    async getByConc(request: FastifyRequestUser, reply: FastifyReply): Promise<RequestResponse> {

        //Retorna o número do concurso a ser buscado
        const { conc } = await request.query as any

        //Chama o serviço responsável por retornar um resultado a partir do seu concurso
        const resultsManager: ResultsManager = new ResultsManager()
        const response: RequestResponse = await resultsManager.getByConc<LotofacilType>('lotofacil', 'lotofacil', parseInt(conc))

        return reply.status(response.statusCode).send(response)
    }

}