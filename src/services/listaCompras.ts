import { apiDelete, apiGet, apiPatch, apiPost } from "./api"

export type ListaCompraItem = {
    nomeProduto: string
    quantidade: number
    precoUnitario: number
    concluido?: boolean
}

export type ListaCompra = {
    id: number
    titulo: string
    status: string
    prioridade: string
    dataCriacao?: string
    dataConclusao?: string | null
    totalEstimado: number
    itens: ListaCompraItem[]
}

export async function listarListasCompras(): Promise<ListaCompra[]> {
    return apiGet<ListaCompra[]>("/lista-compras")
}

export async function buscarListaCompra(id: string | number): Promise<ListaCompra> {
    return apiGet<ListaCompra>(`/lista-compras/${encodeURIComponent(String(id))}`)
}

export async function criarListaCompra(payload: Partial<ListaCompra>): Promise<ListaCompra> {
    return apiPost<ListaCompra>("/lista-compras", payload)
}

export async function atualizarListaCompra(id: string | number, payload: Partial<ListaCompra>): Promise<ListaCompra> {
    return apiPatch<ListaCompra>(`/lista-compras/${encodeURIComponent(String(id))}`, payload)
}

export async function excluirListaCompra(id: string | number): Promise<void> {
    return apiDelete<void>(`/lista-compras/${encodeURIComponent(String(id))}`)
}
