//Classe responsável por manipular dados da lotofacil

import axios, { AxiosResponse } from "axios"
import { ApiType } from "../../../@Types/API/ApiType"
import disconnectClient from "../../../Prisma/disconnectClient"
import prismaClient from "../../../Prisma/prismaClient"
import { ErrorService } from "../../Errors/ErrorService"
import { LotofacilType } from "./Types/LotofacilType"

export class LotofacilService {

    //API responsável pelas informações dos concursos
    #ApiUrl: string = process.env.API_RESULTS + '/lotofacil' as string

    //Registra um concurso da quina no banco de dados
    async register(conc: LotofacilType): Promise<void> {

        //Tenta registrar o dado no banco de dados
        try {

            //Registra no banco de dados o concurso da megasena
            await prismaClient.lotofacil.create({
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

    //Requisita o resultado da Lotofacil mais recente
    async updateResults(): Promise<void> {

        //Desabilita a verificação do certificado ssl
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        //Tenta realizar uma requisição
        try {

            //Retorna a requisição
            const result: AxiosResponse<any, any> = await axios.get(this.#ApiUrl)

            //Atribui a variável aos resultados retornados
            const lotofacil_results: ApiType = result.data

            //Cria o dado Lotofacil, com os dados do concurso
            const lotofacilConc: LotofacilType = {
                date: lotofacil_results.dataApuracao,
                conc: lotofacil_results.numero,
                ball1: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[0]),
                ball2: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[1]),
                ball3: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[2]),
                ball4: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[3]),
                ball5: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[4]),
                ball6: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[5]),
                ball7: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[6]),
                ball8: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[7]),
                ball9: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[8]),
                ball10: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[9]),
                ball11: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[10]),
                ball12: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[11]),
                ball13: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[12]),
                ball14: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[13]),
                ball15: parseInt(lotofacil_results.dezenasSorteadasOrdemSorteio[14]),
            }

            //Registra no banco de dados o concurso
            await this.register(lotofacilConc)

        } catch (error: any) {

            //Instancializa o servico responsável por registrar um erro no banco de dados
            await new ErrorService().register(error)

        }

        return

    }

}