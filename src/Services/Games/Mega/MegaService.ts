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

    //Registra um concurso da megasena no banco de dados
    async register(conc: MegaType): Promise<void | null> {

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

            return null

        }

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

    //Alternativa para atualizar todos os concursos
    async updateResultsByApi(): Promise<void> {

        //Desabilita a verificação do certificado ssl
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        //Retorna a requisição
        const result: AxiosResponse<any, any> = await axios.get(this.#ApiUrl)

        //Atribui a variável aos resultados retornados
        const quina_results: ApiType = result.data

        //Número do concurso mais atual
        const lastConc: number = quina_results.numero

        //Irá realizar um loop em todos os concursos e irá atualizar o banco de dados
        for (let i = lastConc; i > 1; i--) {

            try {

                //Retorna a requisição
                const result: AxiosResponse<any, any> = await axios.get(this.#ApiUrl + `/${i}`)

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
                const isNull: void | null = await this.register(megaConc)

                //Caso não consiga registrar, para por aqui
                if(isNull === null) {

                    return

                }

            } catch (error) {

                //Instancializa o servico responsável por registrar um erro no banco de dados
                await new ErrorService().register(error)

            }

        }

        return

    }
}
