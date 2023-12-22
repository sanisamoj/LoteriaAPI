//Este arquivo é responsável por inicializar o servidor da aplicação

import Fastify, { FastifyInstance } from "fastify"
import multipart from '@fastify/multipart'
import {routes} from './routes'
import { RedisClient } from "./Modules/Redis/RedisClient"
import { Launcher } from "./Config/Launcher"

const fastify: FastifyInstance = Fastify({
    logger: true,
    disableRequestLogging: true
})

//Registra o multipart
fastify.register(multipart, {

    //Limite o tamanho máximo do arquivo para 3MB
    limits: { fileSize: 3 * 1024 * 1024 }, //byte , kbyte , megabyte

    //Permita apenas arquivos de imagem
    sharedSchemaId: 'MultipartFileType',

    //Adiciona informações ao body
    attachFieldsToBody: true,
})

//Registra as rotas
fastify.register(routes)

//Função que inicia o servidor
const start = async (): Promise<void> => {

    try {

        await fastify.listen({ port: 3000, host: '0.0.0.0' })
        console.log('Servidor Principal | Online ✅')

    } catch (error) {

        fastify.log.error(error)
        process.exit
    }
}

start()

//Quando o servidor estiver pronto, inicializa as demais dependências
fastify.ready().then(async () => {

    //Inicializa o redis
    await RedisClient.getInstance()

    //Inicia as configurações iniciais
    const launcher: Launcher = new Launcher()

})

export default fastify