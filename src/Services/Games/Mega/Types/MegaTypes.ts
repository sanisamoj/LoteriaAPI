//Tipo do dado do sorteio da mega
export interface MegaType {
    id?: string
    conc: number
    date: string
    ball1: number
    ball2: number
    ball3: number
    ball4: number
    ball5: number
    ball6: number
}

//Tipo retornado do excelManager
export interface MegaExcel {
    Concurso: number,
    Data: string,
    'bola 1': number,
    'bola 2': number,
    'bola 3': number,
    'bola 4': number,
    'bola 5': number,
    'bola 6': number
}
