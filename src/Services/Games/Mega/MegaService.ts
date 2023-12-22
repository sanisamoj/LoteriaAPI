//Esta classe é responsável pela manipulação dos dados dos resultados da megasena

import { MegaExcel, MegaType } from "./Types/MegaTypes"
import axios, { AxiosResponse } from 'axios'
import * as fs from 'fs'
import path from "path"
import { RequestResponse } from "../../../@Types/RequestResponse/RequestResponse"
import { ExecelManager } from "../../../Modules/ExcelManager/ExecelManager"
import disconnectClient from "../../../Prisma/disconnectClient"
import prismaClient from "../../../Prisma/prismaClient"
import { ErrorService } from "../../Errors/ErrorService"
import { ApiType, DrawInfo } from "../../../@Types/API/ApiType"

export class MegaService {

    //API responsável pelas informações dos concursos
    #ApiUrl: string = process.env.API_RESULTS + '/megasena' as string

    //Registra no banco de dados a partir de um arquivo excel, os resultados da megasena
    async registerByFile(filePath: string, tableName: any): Promise<void> {

        //Instancializa o manipulador de excel
        const excelManager: ExecelManager = new ExecelManager()

        //Retorna uma array de objetos da planilha
        const concs: MegaExcel[] = excelManager.read<MegaExcel>(filePath)

        //Percorre todos os jogos e registra todos os concursos
        for (const conc of concs) {

            //Tenta registrar no banco de dados
            try {

                //Registra no banco de dados o concurso da megasena
                await prismaClient.mega.create({
                    data: {
                        conc: conc.Concurso,
                        date: conc.Data,
                        ball1: conc["bola 1"],
                        ball2: conc["bola 2"],
                        ball3: conc["bola 3"],
                        ball4: conc["bola 4"],
                        ball5: conc["bola 5"],
                        ball6: conc["bola 6"]
                    }
                })

                const data = {
                    conc: conc.Concurso,
                    date: conc.Data,
                    ball1: conc["bola 1"],
                    ball2: conc["bola 2"],
                    ball3: conc["bola 3"],
                    ball4: conc["bola 4"],
                    ball5: conc["bola 5"],
                    ball6: conc["bola 6"]
                }

                await (prismaClient[tableName] as any).create({
                    data
                })

            } catch (error: any) {

                //Instancializa o servico responsável por registrar um erro no banco de dados
                await new ErrorService().register(error)

            }

        }

        //Desconecta o prismaClient
        await disconnectClient()

        return

    }

    //Registra um concurso da megasena no banco de dados
    async register(conc: MegaType): Promise<void> {

        //Tenta registrar o dado no banco de dados
        try {

            //Registra no banco de dados o concurso da megasena
            await prismaClient.mega.create({
                data: {
                    conc: conc.conc,
                    date: conc.date,
                    ball1: conc.ball1,
                    ball2: conc.ball2,
                    ball3: conc.ball3,
                    ball4: conc.ball4,
                    ball5: conc.ball5,
                    ball6: conc.ball6,
                }
            })

            //Desconecta o prismaClient
            await disconnectClient()

        } catch (error: any) {

            //Instancializa o servico responsável por registrar um erro no banco de dados
            await new ErrorService().register(error)

        }

        return

    }

    //Retorna todos os resultados
    async getAll(): Promise<RequestResponse> {

        //Retorna todos os concursos da megasena
        const allConc: MegaType[] = await prismaClient.mega.findMany({
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
    async getByConc(conc: number): Promise<RequestResponse> {

        //Busca no banco de dados um concurso da megasena específico
        const megaConc: MegaType | null = await prismaClient.mega.findUnique({
            where: {
                conc: conc
            }
        })

        //Desconecta o prismaClient
        await disconnectClient()

        //Caso não seja encontrado o concurso no banco de dados
        if (!megaConc) {

            const response: RequestResponse = {
                statusCode: 404,
                message_server: 'conc not found',
                content: {}
            }

            return response

        }

        //Variável responsável por obter as informações de um concurso
        let megaInfo: DrawInfo | null = null

        //Tenta requisitar as informações do concurso
        try {

            //Desabilita a verificação do certificado ssl
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

            //Retorna a requisição
            const result: AxiosResponse<any, any> = await axios.get(this.#ApiUrl + `/${conc}`)

            //Atribui a variável aos resultados retornados
            const mega_results: ApiType = result.data

            //Cria as informações do sorteio
            const mega_info: DrawInfo = {
                listaRateioPremio: mega_results.listaRateioPremio,
                valorEstimadoProximoConcurso: mega_results.valorEstimadoProximoConcurso
            }

            //Atribui as informações da concurso
            megaInfo = mega_info

        } catch (error: any) {

            //Instancializa o servico responsável por registrar um erro no banco de dados
            await new ErrorService().register(error)

        }

        const response: RequestResponse = {
            statusCode: 200,
            message_server: 'conc founded',
            content: {
                mega: megaConc,
                info: megaInfo
            }
        }

        return response

    }

    //Importa os resultados que estão armazenados na pasta Results
    async importResults(): Promise<void> {

        //Define o local da pasta onde o arquivo será lido
        const filePath: string = path.resolve(__dirname, 'Results')

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
                const filePath: string = path.resolve(__dirname, 'Results', fileName)

                //Chama a função que registra os dados dos sorteios a partir de um arquivo excel
                await this.registerByFile(filePath, 'mega')

            })

        })

        return

    }

    //Requisita o resultado da megasena mais recente
    async updateResults(): Promise<void> {

        //Desabilita a verificação do certificado ssl
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        //Tenta realizar uma requisição
        try {

            //Retorna a requisição
            const result: AxiosResponse<any, any> = await axios.get(this.#ApiUrl)

            //Atribui a variável aos resultados retornados
            const mega_results: ApiType = result.data

            //Cria o dado megaType, com os dados do concurso
            const megaConc: MegaType = {
                date: mega_results.dataApuracao,
                conc: mega_results.numero,
                ball1: parseInt(mega_results.dezenasSorteadasOrdemSorteio[0]),
                ball2: parseInt(mega_results.dezenasSorteadasOrdemSorteio[1]),
                ball3: parseInt(mega_results.dezenasSorteadasOrdemSorteio[2]),
                ball4: parseInt(mega_results.dezenasSorteadasOrdemSorteio[3]),
                ball5: parseInt(mega_results.dezenasSorteadasOrdemSorteio[4]),
                ball6: parseInt(mega_results.dezenasSorteadasOrdemSorteio[5]),
            }

            //Registra no banco de dados o concurso
            await this.register(megaConc)

        } catch (error: any) {

            //Instancializa o servico responsável por registrar um erro no banco de dados
            await new ErrorService().register(error)

        }

        return

    }
}
