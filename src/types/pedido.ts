
export type StatusPedido = "pago" | "pendente" | "cancelado"

export type ItemPedido = {
    quantidade: number
    nome: string
}

export type Pedido = {
    id: string
    vendaId: number
    data: string
    status: StatusPedido
    cliente: string
    itens: ItemPedido[]
    total: number
}
