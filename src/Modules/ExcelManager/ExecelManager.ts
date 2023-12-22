//Esta classe é responsável por manipular arquivos excel

import * as XLSX from 'xlsx'
import { WorkBook, WorkSheet } from 'xlsx'

export class ExecelManager {

    //Responsável por ler o excel 
    read<concType>(filePath: string): concType[]{

        //Lê o arquivo excel
        const workbook: WorkBook = XLSX.readFile(filePath)

        //Obtém a primeira planilha do arquivo
        const firstSpreadsheet: WorkSheet = workbook.Sheets[workbook.SheetNames[0]]

        //Converte os dados da planilha para um array de objetos
        const jsonData: concType[] = XLSX.utils.sheet_to_json<concType>(firstSpreadsheet)

        return jsonData

    }

}