//Tipo que é passado para o objeto que manipula os erros
export interface ErrorType {
    id?: string
    name: string
    message: string
    stack: string
}