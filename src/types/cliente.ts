
export type Cliente = {
    id: string
    nome: string
    telefone: string
    email: string
    ativo?: boolean
    totalGasto?: number
    quantidadePedidos?: number
    ultimoPedido?: string | null
    temPendencia?: boolean
    observacao?: string
}
