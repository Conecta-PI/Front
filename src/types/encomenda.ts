export type TipoEntrega = "retirada" | "entrega"

export type ItemEncomenda = {
    produtoId: string
    quantidade: number
}

export type NovaEncomenda = {
    clienteId: string
    itens: ItemEncomenda[]
    dataEntrega: string   
    horario: string   
    tipoEntrega: TipoEntrega
    sinalPago: number
    observacoes: string
}