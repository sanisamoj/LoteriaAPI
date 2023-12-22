import axios, { AxiosResponse } from "axios"
import { RequestResponse } from "../../@Types/RequestResponse/RequestResponse"
import { ExecelManager } from "../../Modules/ExcelManager/ExecelManager"
import disconnectClient from "../../Prisma/disconnectClient"
import prismaClient from "../../Prisma/prismaClient"
import { ErrorService } from "../Errors/ErrorService"
import path from "path"
import * as fs from 'fs'
import { ApiType, DrawInfo } from "../../@Types/API/ApiType"


export class ResultsManager {

    //API responsável pelas informações dos concursos
    #ApiUrl: string = process.env.API_RESULTS as string

    //Converte o dado de um tipo para outro
    redefiningData<TypeResult>(data: any): TypeResult {

        //Objeto será atribuido com um dado formatado para keys padrões
        let newValues: any = {}

        //Percorre todo o objeto redefinindo-a
        Object.keys(data).forEach((key) => {
            if (key !== 'Concurso' && key !== 'Data') {
                const novoNome: string = key.replace('bola ', 'ball');
                newValues[novoNome] = data[key]
            } else if (key === 'Concurso') {
                const novoNome: string = key.replace('Concurso', 'conc');
                newValues[novoNome] = data[key]
            } else if (key === 'Data') {
                const novoNome: string = key.replace('Data', 'date');
                newValues[novoNome] = data[key]
            }
        })

        return newValues as TypeResult

    }

    //Registra no banco de dados a partir de um arquivo excel, os resultados de um sorteio
    async registerByFile<TypeExcel, TypeDB>(tableName: any, filePath: string): Promise<void> {

        //Instancializa o manipulador de excel
        const excelManager: ExecelManager = new ExecelManager()

        //Retorna uma array de objetos da planilha
        const concs: TypeExcel[] = excelManager.read<TypeExcel>(filePath)

        //Percorre todos os jogos e registra todos os concursos
        for (const conc of concs) {

            //Tenta registrar no banco de dados
            try {

                //Convertendo um dado para outro tipo
                const data: TypeDB = this.redefiningData<TypeDB>(conc)

                //Registra no banco de dados os resultados
                await (prismaClient[tableName] as any).create({
                    data: data
                })

            } catch (error: any) {

                //Instancializa o servico responsável por registrar um erro no banco de dados
                await new ErrorService().register(error)

            }

        }

        return

    }

    //Registra um concurso no banco de dados
    async register<concType>(tableName: any, conc: concType): Promise<void> {

        //Tenta registrar o dado no banco de dados
        try {

            //Registra no banco de dados o concurso da megasena
            await (prismaClient[tableName] as any).create({
                data: conc
            })

            //Desconecta o prismaClient
            await disconnectClient()

        } catch (error: any) {

            //Instancializa o servico responsável por registrar um erro no banco de dados
            await new ErrorService().register(error)

        }

        return

    }

    //Retorna todos os resultados de um sorteio especifico
    async getAll<TypeDB>(tableName: any): Promise<RequestResponse> {

        //Retorna todos os concursos da megasena
        const allConc: TypeDB[] = await (prismaClient[tableName] as any).findMany({
            orderBy: {
                conc: 'desc'
            }
        })

        //Desconecta o prismaClient
        await disconnectClient()

        const response: RequestResponse = {
            statusCode: 200,
            message_server: 'all conc founded',
            content: {
                mega: allConc
            }
        }

        return response

    }

    //Retorna um concurso pelo valor atribuído a ele
    async getByConc<TypeDB>(tableName: any, concType: string, conc: number): Promise<RequestResponse> {

        //Caso não seja um número o concurso
        if (isNaN(conc)) {

            const response: RequestResponse = {
                statusCode: 404,
                message_server: 'conc not found',
                content: {}
            }

            return response

        }

        //Busca no banco de dados um concurso da megasena específico
        const concourse: TypeDB | null = await (prismaClient[tableName] as any).findUnique({
            where: {
                conc: conc
            }
        })

        //Desconecta o prismaClient
        await disconnectClient()

        //Caso não seja encontrado o concurso no banco de dados
        if (!concourse) {

            const response: RequestResponse = {
                statusCode: 404,
                message_server: 'conc not found',
                content: {}
            }

            return response

        }

        //Variável responsável por obter as informações de um concurso
        let concInfo: DrawInfo | null = null

        //Tenta requisitar as informações do concurso
        try {

            //Desabilita a verificação do certificado ssl
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

            //Retorna a requisição
            const result: AxiosResponse<any, any> = await axios.get(this.#ApiUrl + `/${concType}/${conc}`)

            //Atribui a variável aos resultados retornados
            const conc_results: ApiType = result.data

            //Cria as informações do sorteio
            const conc_info: DrawInfo = {
                listaRateioPremio: conc_results.listaRateioPremio,
                valorEstimadoProximoConcurso: conc_results.valorEstimadoProximoConcurso
            }

            //Atribui as informações da concurso
            concInfo = conc_info

        } catch (error: any) {

            //Instancializa o servico responsável por registrar um erro no banco de dados
            await new ErrorService().register(error)

        }

        const response: RequestResponse = {
            statusCode: 200,
            message_server: 'conc founded',
            content: {
                conc: concourse,
                info: concInfo
            }
        }

        return response

    }

    //Importa os resultados que estão armazenados na pasta Results de cada sorteio
    async importResults<TypeExcel, TypeDB>(tableName: any, filePath: string): Promise<void> {

        //Ler os nomes de todos os arquivos da pasta indicada
        fs.readdir(filePath, async (err: any, file: string[]) => {

            //Caso seja lançado um erro
            if (err) {

                //Instancializa o servico responsável por registrar um erro no banco de dados
                await new ErrorService().register(err)

                return

            }

            //Percorre a array dos nomes do arquivos, e registra os dados no banco de dados
            file.forEach(async fileName => {

                //Define o caminho do arquivo com o nome do arquivo pertinente
                const filePathWithFile: string = path.join(filePath, fileName)

                //Chama a função que registra os dados dos sorteios a partir de um arquivo excel
                await this.registerByFile<TypeExcel, TypeDB>(tableName, filePathWithFile)

            })

        })

        return

    }

    async deleteAll() {

        await prismaClient.error.deleteMany()
        await prismaClient.mega.deleteMany()
        await prismaClient.quina.deleteMany()


    }

}
