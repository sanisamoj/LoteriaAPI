//Classe responsável por gerar token de sessão

import JwtModule from 'jsonwebtoken'

export class SessionToken {

    //Gera um token
    static create(userId: string, email: string): string {

        const JWT = JwtModule

        //Gera um token
        const sessionToken: string = JWT.sign(
            {
                email: email
            },
            process.env.PASSWORD_JWT as string,
            {
                subject: userId,
                expiresIn: '300d'
            }
        )

        return sessionToken

    }

}