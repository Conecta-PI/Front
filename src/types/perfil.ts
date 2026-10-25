export type Perfil = {
    nome: string
    negocio: string
    premium: boolean
    telefone: string
    email: string
    cnpj: string
    chavePix: string
    resumo: { pedidos: number; clientes: number; produtos: number }
}