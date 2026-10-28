import { apiDelete, apiGet, apiPatch, apiPost } from "./api"
import type { Cliente } from "../types/cliente"

type ClienteApi = {
    id: number
    nome: string
    telefone: string
    email: string
    totalGasto?: number
    quantidadePedidos?: number
    ultimoPedido?: string | null
    temPendencia?: boolean
}

function mapearCliente(cliente: ClienteApi): Cliente {
    return { ...cliente, id: String(cliente.id) }
}

export async function listarClientes(): Promise<Cliente[]> {
    const clientes = await apiGet<ClienteApi[]>("/clientes")
    return clientes.map(mapearCliente)
}

export async function buscarCliente(id: string): Promise<Cliente | null> {
    const clientes = await listarClientes()
    return clientes.find((cliente) => cliente.id === id) ?? null
}

export type DadosCliente = Pick<Cliente, "nome" | "telefone" | "email">

export async function criarCliente(dados: DadosCliente): Promise<Cliente> {
    const cliente = await apiPost<ClienteApi>("/clientes", dados)
    return mapearCliente(cliente)
}

export async function atualizarCliente(id: string, dados: DadosCliente): Promise<Cliente> {
    const cliente = await apiPatch<ClienteApi>(`/clientes/${encodeURIComponent(id)}`, dados)
    return mapearCliente(cliente)
}

export function excluirCliente(id: string): Promise<void> {
    return apiDelete<void>(`/clientes/${encodeURIComponent(id)}`)
}
