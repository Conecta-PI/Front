import { apiGet, apiPatch, apiPost } from "./api"

import type { NovaEncomenda } from "../types/encomenda"

type EncomendaApi = {
    id: number
}

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

export async function criarEncomenda(dados: NovaEncomenda): Promise<{ id: string }> {
    const encomenda = await apiPost<EncomendaApi>("/encomendas", {
        clienteId: Number(dados.clienteId),
        itens: dados.itens.map((item) => ({
            produtoId: Number(item.produtoId),
            quantidade: item.quantidade, 
        })),
        dataEntrega: dados.dataEntrega,
        horario: dados.horario,
        tipoEntrega: dados.tipoEntrega,
        sinalPago: dados.sinalPago,
        observacoes: dados.observacoes,
    })

    return { id: String(encomenda.id) }
}

export async function atualizarStatusEncomenda(id: string | number, status: string): Promise<Encomenda> {
    return apiPatch<Encomenda>(`/encomendas/${encodeURIComponent(String(id))}/status`, { status })
}