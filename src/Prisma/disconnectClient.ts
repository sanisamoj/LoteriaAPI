import prismaClient from "./prismaClient"

export default async function disconnectClient(): Promise<void> {

    //Desconecta o prismaClient, caso não ocorra gera um erro 500, e chama o controller Error
    await prismaClient.$disconnect().catch(async (e: any) => {
        console.error(e)
        await prismaClient.$disconnect()
        throw new Error('DB FAILURE')
    })

}