import axios, { AxiosResponse } from "axios"
import { ApiType } from "../../../@Types/API/ApiType"
import disconnectClient from "../../../Prisma/disconnectClient"
import prismaClient from "../../../Prisma/prismaClient"
import { ErrorService } from "../../Errors/ErrorService"
import { LotomaniaType } from "./Types/LotomaniaType"

export class LotomaniaService {

    //API responsável pelas informações dos concursos
    #ApiUrl: string = process.env.API_RESULTS + '/lotomania' as string

    //Registra um concurso da quina no banco de dados
    async register(conc: LotomaniaType): Promise<void | null> {

        //Tenta registrar o dado no banco de dados
        try {

            //Registra no banco de dados o concurso da megasena
            await prismaClient.lotomania.create({
                data: conc
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

    //Requisita o resultado da Lotomania mais recente
    async updateResults(): Promise<void> {

        //Desabilita a verificação do certificado ssl
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        //Tenta realizar uma requisição
        try {

            //Retorna a requisição
            const result: AxiosResponse<any, any> = await axios.get(this.#ApiUrl)

            //Atribui a variável aos resultados retornados
            const lotomania_results: ApiType = result.data

            //Cria o dado Lotofacil, com os dados do concurso
            const lotomaniaConc: LotomaniaType = {
                date: lotomania_results.dataApuracao,
                conc: lotomania_results.numero,
                ball1: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[0]),
                ball2: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[1]),
                ball3: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[2]),
                ball4: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[3]),
                ball5: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[4]),
                ball6: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[5]),
                ball7: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[6]),
                ball8: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[7]),
                ball9: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[8]),
                ball10: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[9]),
                ball11: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[10]),
                ball12: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[11]),
                ball13: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[12]),
                ball14: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[13]),
                ball15: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[14]),
                ball16: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[15]),
                ball17: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[16]),
                ball18: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[17]),
                ball19: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[18]),
                ball20: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[19]),
            }

            //Registra no banco de dados o concurso
            await this.register(lotomaniaConc)

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
        for (let i = lastConc; i >= 1; i--) {

            try {

                //Retorna a requisição
                const result: AxiosResponse<any, any> = await axios.get(this.#ApiUrl + `/${i}`)

                //Atribui a variável aos resultados retornados
                const lotomania_results: ApiType = result.data

                //Cria o dado Lotofacil, com os dados do concurso
                const lotomaniaConc: LotomaniaType = {
                    date: lotomania_results.dataApuracao,
                    conc: lotomania_results.numero,
                    ball1: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[0]),
                    ball2: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[1]),
                    ball3: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[2]),
                    ball4: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[3]),
                    ball5: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[4]),
                    ball6: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[5]),
                    ball7: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[6]),
                    ball8: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[7]),
                    ball9: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[8]),
                    ball10: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[9]),
                    ball11: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[10]),
                    ball12: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[11]),
                    ball13: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[12]),
                    ball14: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[13]),
                    ball15: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[14]),
                    ball16: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[15]),
                    ball17: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[16]),
                    ball18: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[17]),
                    ball19: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[18]),
                    ball20: parseInt(lotomania_results.dezenasSorteadasOrdemSorteio[19]),
                }

                //Registra no banco de dados o concurso
                const isNull: void | null = await this.register(lotomaniaConc)

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