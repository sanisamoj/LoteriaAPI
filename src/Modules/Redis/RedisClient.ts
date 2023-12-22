//Esta classe é responsável por iniciar uma conexão e cliente com o Redis

import { RedisClientType, createClient } from "redis"

export class RedisClient {

    //Instancia do objeto
    static #instance: RedisClient | null = null

    static #redis: RedisClientType

    //Aqui não permite que o objeto seja instanciado por códigos externos
    private constructor() {

        console.log('Módulo de cache - Redis | Online ✅')

    }

    //Retorna a instancia, ou cria ela (singleton)
    static async getInstance(): Promise<RedisClientType> {

        //Caso não exista uma instância do redis, é criado uma
        if (!this.#instance) {
            
            //Gera o cliente do Redis
            this.#redis = createClient({
                password: process.env.REDIS_AUTH
            })

            //Caso seja lançado um erro
            this.#redis.on('error', async (error: any) => {

                throw new Error('Redis Failure')

            })

            //Instancializa o Cliente Redis
            RedisClient.#instance = new RedisClient

            //Conecta o cliente Redis
            await this.#redis.connect()

        }

        return this.#redis

    }

}