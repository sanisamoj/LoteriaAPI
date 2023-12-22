//Dado retornado da api
export interface ApiType {
    acumulado: boolean
    dataApuracao: string
    dataProximoConcurso: string
    dezenasSorteadasOrdemSorteio: string[],
    exibirDetalhamentoPorCidade: boolean
    id: string | null
    indicadorConcursoEspecial: number
    listaDezenas: string[]
    listaDezenasSegundoSorteio: string | null
    listaMunicipioUFGanhadores: string[],
    listaRateioPremio: PrizeApportionmentList[]
    listaResultadoEquipeEsportiva: null | string[],
    localSorteio: string
    nomeMunicipioUFSorteio: string
    nomeTimeCoracaoMesSorte: string
    numero: number
    numeroConcursoAnterior: number
    numeroConcursoFinal_0_5: number
    numeroConcursoProximo: number
    numeroJogo: number
    observacao: string
    premiacaoContingencia: any
    tipoJogo: string
    tipoPublicacao: number
    ultimoConcurso: boolean
    valorArrecadado: number
    valorAcumuladoConcurso_0_5: number
    valorAcumuladoConcursoEspecial: number
    valorAcumuladoProximoConcurso: number
    valorEstimadoProximoConcurso: number
    valorSaldoReservaGarantidora: number
    valorTotalPremioFaixaUm: number
}

//Tipo do dado que apresenta o rateio de ganhadores
export interface PrizeApportionmentList {
    descricaoFaixa: string
    faixa: number
    numeroDeGanhadores: number
    valorPremio: number
}

//Tipo de dado definido com as informações retornadas aos usuários com informações do concurso
export interface DrawInfo {
    listaRateioPremio : PrizeApportionmentList[]
    valorEstimadoProximoConcurso: number
}