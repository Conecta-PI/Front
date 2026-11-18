
import { apiPost } from "./api"

export type FormaPagamentoVenda = "pix" | "dinheiro" | "cartao"

export type ItemVendaRequest = {
    produtoId: number
    quantidade: number
}

export type VendaRequest = {
    clienteId: number
    formaPagamento: FormaPagamentoVenda
    itens: ItemVendaRequest[]
}

export type VendaResponse = {
    id: number
    cliente: string
    data: string
    total: number
    status: string
    formaPagamento: FormaPagamentoVenda
    itens: {
        nome: string
        quantidade: number
    }[]
}

export async function criarVenda(
    dados: VendaRequest
): Promise<VendaResponse> {
    return apiPost<VendaResponse>("/vendas", dados)
}
