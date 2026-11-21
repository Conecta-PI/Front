export type Perfil = {
    nome: string
    negocio: string
    premium: boolean
    telefone: string
    email: string
    cnpj: string
    chavePix: string
    foto?: string | null
    resumo: { pedidos: number; clientes: number; produtos: number }
}