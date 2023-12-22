//Esta classe é usada como um middleware, que é responsável por limitar a quantidade de requisições

import { FastifyReply } from "fastify"
import { FastifyRequestUser } from "../../@Types/FastifyExtends/FastifyRequestUser"
import { RequestResponse } from "../../@Types/RequestResponse/RequestResponse"

export class AcessRateLimiter {

    //Gera um mapa com key string e value number, para armazenar os ips que realizaram as requisições
    static #requestStore: Map<string, number[]> = new Map<string, number[]>()

    //Gera um objeto que armazena os ips que realizaram muitas requisições
    static #requestAttempts: any = {}

    //Define se está em teste ou não
    static test : boolean = false

    //Responsável por verificar se houve várias requisições em um curto período de tempo
    async rateLimiter(request: FastifyRequestUser, reply: FastifyReply): Promise<RequestResponse | void> {

        //Caso esteja em ambiente de testes
        if(AcessRateLimiter.test === true) {
            return
        }

        //Atribui o IP e o momento
        const ip: string = request.ip
        const now: number = Date.now()

        //Tempo no qual será contado as requisições (Segundos)
        const timeWindow: number = 1000

        //Máximo de requisições por segundo
        const maxRequestsPerWindow: number = 3

        //Máximo de requisições
        const MAX_REQUESTS: number = 3
        //Tempo de bloqueio (1 minuto)
        const BLOCK_TIME: number = 1 * 60 * 1000

        //Verufuca se existe o IP no mapa de IPS
        let requests: undefined | number[] = AcessRateLimiter.#requestStore.get(ip)

        //Caso não exista um IP registrado no mapa
        if (!requests) {

            //Gera uma array vazia para o IP, para que seja armazenada os milessegundos das requisições do IP
            requests = []

            //Adiciona o IP no mapa
            AcessRateLimiter.#requestStore.set(ip, requests)

        }

        //Caso não exista o IP no objeto de violação de requisições, é adicionado o IP
        if (!AcessRateLimiter.#requestAttempts[ip]) {

            //Cria um propriedade com o IP, e gera uma array vazia que conterá a quantidade de muitas requisições
            AcessRateLimiter.#requestAttempts[ip] = []

        }

        //Caso a diferença de tentativas for menor que o tempo de bloqueio, ele adiciona o ip
        const recentRequest = AcessRateLimiter.#requestAttempts[ip].filter((attempt: number) => now - attempt < BLOCK_TIME)

        //Se a quantidade de tentativas for maior que o máximo de muitas requisições
        if (recentRequest.length >= MAX_REQUESTS) {

            //Tempo para a requisição ser respondida
            const delay: number = 3000
            await new Promise(resolve => setTimeout(resolve, delay))

            const response: RequestResponse = {
                statusCode: 429,
                message_server: 'Too many requests | Try again in 1 minute',
                content: {}
            }

            return reply.code(response.statusCode).send(response)

        }

        //Adiciona o momento da requisição
        requests.push(now)

        //Filtra as requisições que foram feitas em menos de 1s
        requests = requests.filter(requestTime => now - requestTime < timeWindow)

        //Atribui as requisições no array do IP
        AcessRateLimiter.#requestStore.set(ip, requests)

        //Verifica se a quantidade de requisições do IP é maior que o máximo
        if (requests.length > maxRequestsPerWindow) {

            //Adiciona no objeto que o IP atingiu o limite de requisições
            AcessRateLimiter.#requestAttempts[ip].push(now)

            const response: RequestResponse = {
                statusCode: 429,
                message_server: 'Too many requests',
                content: {}
            }

            return reply.code(response.statusCode).send(response)

        }

        return

    }

}