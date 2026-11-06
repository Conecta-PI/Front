import { apiGet, apiPatch, apiPost } from "./api"

export type EncomendaItem = {
    nomeProduto: string
    quantidade: number
    precoUnitario: number
}

export type Encomenda = {
    id: number
    codigo: string
    clienteNome: string
    status: string
    dataPedido?: string
    dataEntrega?: string | null
    valorTotal: number
    observacao?: string | null
    itens: EncomendaItem[]
}

export async function listarEncomendas(): Promise<Encomenda[]> {
    return apiGet<Encomenda[]>("/encomendas")
}

export async function buscarEncomenda(id: string | number): Promise<Encomenda> {
    return apiGet<Encomenda>(`/encomendas/${encodeURIComponent(String(id))}`)
}

export async function criarEncomenda(payload: Partial<Encomenda>): Promise<Encomenda> {
    return apiPost<Encomenda>("/encomendas", payload)
}

export async function atualizarStatusEncomenda(id: string | number, status: string): Promise<Encomenda> {
    return apiPatch<Encomenda>(`/encomendas/${encodeURIComponent(String(id))}/status`, { status })
}
