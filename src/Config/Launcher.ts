//Esta classe é responsável por inicializar o projeto com a funções pertinentes

import cron from 'node-cron'
import { ResultsManager } from "../Services/Results/ResultsManager"
import path from "path"
import { MegaService } from '../Services/Games/Mega/MegaService'
import { QuinaService } from '../Services/Games/Quina/QuinaService'
import { LotofacilService } from '../Services/Games/Lotofacil/LotofacilService'
import { LotofacilExcel, LotofacilType } from '../Services/Games/Lotofacil/Types/LotofacilType'
import { MegaExcel, MegaType } from '../Services/Games/Mega/Types/MegaTypes'
import { QuinaExcel, QuinaType } from '../Services/Games/Quina/Types/QuinaType'
import { LotomaniaType, LotomanialExcel } from '../Services/Games/Lotomania/Types/LotomaniaType'
import { LotomaniaService } from '../Services/Games/Lotomania/LotomaniaService'

export class Launcher {

    //Inicializa a funções pertinentes
    constructor() {

        //Inicializa as configurações
        this.config()

        //Inicializa o atualizador de resultados
        this.updateResults()

    }

    //Inicia as configurações pertinentes
    //Importa os resultados dos sorteios para o banco de dados
    async config(): Promise<void> {

        //Instancialiaza o objeto responsável por manipular os resultados dos sorteios
        const resultsManager: ResultsManager = new ResultsManager()

        //Importa a partir de um arquivo excel todos os resultados dos sorteios da megasena
        await resultsManager.importResults<MegaExcel, MegaType>('mega', path.resolve(__dirname, '..', 'Services', 'Games', 'Mega', 'Results'))

        //Importa a partir de um arquivo excel todos os resultados dos sorteios da Quina
        await resultsManager.importResults<QuinaExcel, QuinaType>('quina', path.resolve(__dirname, '..', 'Services', 'Games', 'Quina', 'Results'))

        //Importa a partir de um arquivo excel todos os resultados dos sorteios da lotofacil
        await resultsManager.importResults<LotofacilExcel, LotofacilType>('lotofacil', path.resolve(__dirname, '..', 'Services', 'Games', 'Lotofacil', 'Results'))

        //Importa a partir de um arquivo excel todos os resultados dos sorteios da lotomania
        await resultsManager.importResults<LotomanialExcel, LotomaniaType>('lotomania', path.resolve(__dirname, '..', 'Services', 'Games', 'Lotomania', 'Results'))

        //Alternativa para atualizar os resultados faltarantes
        this.updateResultsByApi()
    }

    //Inicia o atualizador de resultados
    async updateResults(): Promise<void> {

        //Cron para executar toda quinta-feira ás 23h
        cron.schedule('0 23 * * 4', async (): Promise<void> => {

            //Realiza a atualização do sorteio da megasena
            await new MegaService().updateResults()

        })

        //Cron para executar todo sábado ás 23h
        cron.schedule('0 23 * * 6', async (): Promise<void> => {

            //Realiza a atualização do sorteio da megasena
            await new MegaService().updateResults()

        })

        //Cron para executar de segunda a sábado ás 21h
        cron.schedule('0 21 * * 1-6', async (): Promise<void> => {

            //Realiza a atualização do sorteio da Quina
            await new QuinaService().updateResults()

            //Realiza a atualização do sorteio da LotoFácil
            await new LotofacilService().updateResults()

        })

        //Cron para executar ás segundas, quartas e sextas
        cron.schedule('0 21 * * 1,3,5', async (): Promise<void> => {

            //Realiza a atualização do sorteio da lotomania
            await new LotomaniaService().updateResults()

        })  

    }

    //Alternativa para atualizar os resultados
    async updateResultsByApi() {

        //Tenta atualizar os resultados faltantes dos jogos
        await new MegaService().updateResultsByApi()
        await new QuinaService().updateResultsByApi()
        await new LotofacilService().updateResultsByApi()
        await new LotomaniaService().updateResultsByApi()

    }

}