//Tipo do dado do sorteio Quina
export interface QuinaType {
    conc: number
    date: string
    ball1: number
    ball2: number
    ball3: number
    ball4: number
    ball5: number
}

//Tipo retornado do excelManager
export interface QuinaExcel {
    Concurso: number,
    Data: string,
    'bola 1': number,
    'bola 2': number,
    'bola 3': number,
    'bola 4': number,
    'bola 5': number,
}