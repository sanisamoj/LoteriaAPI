//Classe responsável por manipular dados da quina

import axios, { AxiosResponse } from "axios"
import { ApiType } from "../../../@Types/API/ApiType"
import disconnectClient from "../../../Prisma/disconnectClient"
import prismaClient from "../../../Prisma/prismaClient"
import { ErrorService } from "../../Errors/ErrorService"
import { QuinaType } from "./Types/QuinaType"

export class QuinaService {

    //API responsável pelas informações dos concursos
    #ApiUrl: string = process.env.API_RESULTS + '/quina' as string

    //Registra um concurso da quina no banco de dados
    async register(conc: QuinaType): Promise<void> {

        //Tenta registrar o dado no banco de dados
        try {

            //Registra no banco de dados o concurso da megasena
            await prismaClient.quina.create({
                data: {
                    conc: conc.conc,
                    date: conc.date,
                    ball1: conc.ball1,
                    ball2: conc.ball2,
                    ball3: conc.ball3,
                    ball4: conc.ball4,
                    ball5: conc.ball5,
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

    //Requisita o resultado da quina mais recente
    async updateResults(): Promise<void> {

        //Desabilita a verificação do certificado ssl
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        //Tenta realizar uma requisição
        try {

            //Retorna a requisição
            const result: AxiosResponse<any, any> = await axios.get(this.#ApiUrl)

            //Atribui a variável aos resultados retornados
            const quina_results: ApiType = result.data

            //Cria o dado QuinaType, com os dados do concurso
            const quinaConc: QuinaType = {
                date: quina_results.dataApuracao,
                conc: quina_results.numero,
                ball1: parseInt(quina_results.dezenasSorteadasOrdemSorteio[0]),
                ball2: parseInt(quina_results.dezenasSorteadasOrdemSorteio[1]),
                ball3: parseInt(quina_results.dezenasSorteadasOrdemSorteio[2]),
                ball4: parseInt(quina_results.dezenasSorteadasOrdemSorteio[3]),
                ball5: parseInt(quina_results.dezenasSorteadasOrdemSorteio[4]),
            }

            //Registra no banco de dados o concurso
            await this.register(quinaConc)

        } catch (error: any) {

            //Instancializa o servico responsável por registrar um erro no banco de dados
            await new ErrorService().register(error)

        }

        return

    }

}