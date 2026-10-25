export type StatusPedido = "pago" | "pendente"

export type ItemPedido = {
    quantidade: number
    nome: string
}

export type Pedido = {
    id: string     
    data: string   
    status: StatusPedido
    cliente: string
    itens: ItemPedido[]
    total: number
}