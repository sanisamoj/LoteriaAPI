//Esta classe é responsável por manipular os token registrado no cache do redis

import { RedisClientType } from "redis"
import { RedisClient } from "../../RedisClient"

export class TokenCacheManager {

    //Grava o token revogado no Redis
    async writeOldToken(token: string): Promise<string | null> {

        // 300 dias em segundos
        const timeExpiration: number = 300 * 24 * 60 * 60

        //Retorna a instancia do redis
        const client: RedisClientType = await RedisClient.getInstance()

        //Recebe o token , e registrar no redis com a Key e value iguais
        const data: string | null = await client.set(token, token)

        //Atribui um tempo para o dado ser apagado do redis
        await client.expire(token, timeExpiration)

        return data

    }

    //Busca o token revogado no Redis
    async compareOldToken(token: string): Promise<string | null> {

        //Retorna a instancia do redis
        const client: RedisClientType = await RedisClient.getInstance()

        //Retorna com a key token, o token registrado
        const data: string | null = await client.get(token)

        return data

    }

}