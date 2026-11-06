import { apiDelete, apiGet, apiPatch, apiPost } from "./api"
import type { Cliente } from "../types/cliente"

type ClienteApi = {
    id: number
    nome: string
    telefone: string
    email: string
    observacoes?: string | null
    totalGasto?: number
    quantidadePedidos?: number
    ultimoPedido?: string | null
    temPendencia?: boolean
}

export type PedidoCliente = {
    id: string
    data: string
    valor: number
    status: "Pago" | "Pendente"
}

type ResumoApi = {
    totalGasto: number
    quantidadePedidos: number
    ultimoPedido: string | null
    temPendencia: boolean
    pedidos: { id: number; data: string; valor: number; status: string }[]
}

function mapearCliente({ id, observacoes, ...resto }: ClienteApi): Cliente {
    return { ...resto, id: String(id), observacao: observacoes ?? "" }
}

function formatarDataCurta(iso: string): string {
    const [, mes, dia] = iso.split("T")[0].split("-")
    return dia + "/" + mes
}

export async function listarClientes(): Promise<Cliente[]> {
    const clientes = await apiGet<ClienteApi[]>("/clientes")
    return clientes.map(mapearCliente)
}

export async function buscarDetalheCliente(
    id: string
): Promise<{ cliente: Cliente; pedidos: PedidoCliente[] }> {
    const [cliente, resumo] = await Promise.all([
        apiGet<ClienteApi>(`/clientes/${encodeURIComponent(id)}`),
        apiGet<ResumoApi>(`/clientes/${encodeURIComponent(id)}/resumo`),
    ])

    return {
        cliente: mapearCliente({
            ...cliente,
            totalGasto: resumo.totalGasto,
            quantidadePedidos: resumo.quantidadePedidos,
            ultimoPedido: resumo.ultimoPedido,
            temPendencia: resumo.temPendencia,
        }),
        pedidos: resumo.pedidos.map((pedido) => ({
            id: "#" + String(pedido.id).padStart(4, "0"),
            data: formatarDataCurta(pedido.data),
            valor: pedido.valor,
            status: pedido.status === "pago" ? "Pago" : "Pendente",
        })),
    }
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

export async function atualizarObservacaoCliente(id: string, observacao: string): Promise<void> {
    await apiPatch(`/clientes/${encodeURIComponent(id)}/observacao`, { observacao })
}

export function excluirCliente(id: string): Promise<void> {
    return apiDelete<void>(`/clientes/${encodeURIComponent(id)}`)
}
