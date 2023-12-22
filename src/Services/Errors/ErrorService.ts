//Esta classe é responsável por manipular os erros da aplicação e registrar no banco de dados

import disconnectClient from "../../Prisma/disconnectClient"
import prismaClient from "../../Prisma/prismaClient"
import { ErrorType } from "./Types/ErrorTypes"

export class ErrorService {

    //Registra o erro no banco de dados
    async register(error: any): Promise<void> {

        //Gera o dado de erro passado
        const errorPass: ErrorType = {
            name: error.name,
            message: error.message,
            stack: error.stack
        }

        //Tenta registrar o dado no banco de dados
        try {

            //Registra no banco de dados o erro gerado
            await prismaClient.error.create({
                data: {
                    name: errorPass.name,
                    message: errorPass.message,
                    stack: errorPass.stack
                }
            })

            //Desconecta o prismaClient
            await disconnectClient()

        } catch (error: any) {

            console.log(error)

            return

        }

        return

    }

    //Retorna todos os erros
    async getAll(): Promise<ErrorType[]> {

        //Retorna todos os erros do banco de dados
        const allError: ErrorType[] = await prismaClient.error.findMany()

        //Desconecta o prismaClient
        await disconnectClient()

        return allError

    }

    //Retorna um erro pelo ID do erro
    async getById(errorId: string): Promise<ErrorType | null> {

        //Retorna o erro pelo ID
        const error: ErrorType | null = await prismaClient.error.findFirst({
            where: {
                id: errorId
            }
        })

        //Desconecta o prismaClient
        await disconnectClient()

        return error

    }

}