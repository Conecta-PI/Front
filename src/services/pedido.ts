
import { apiGet } from "./api"
import type { Pedido, StatusPedido } from "../types/pedido"

type VendaApi = {
    id: number
    cliente: string
    data: string
    total: number
    status: string
    itens?: {
        nome: string
        quantidade: number
    }[]
}

function formatarData(iso: string): string {
    const [data] = iso.split("T")
    const partes = data.split("-")

    if (partes.length !== 3) {
        return iso
    }

    const [, mes, dia] = partes
    return `${dia}/${mes}`
}

function mapearStatus(statusApi: string): StatusPedido {
    const status = statusApi.toLowerCase()

    if (status === "cancelada" || status === "cancelado") {
        return "cancelado"
    }

    if (status === "concluida" || status === "concluída" || status === "pago") {
        return "pago"
    }

    return "pendente"
}

function mapearPedido(venda: VendaApi): Pedido {
    return {
        id: String(venda.id).padStart(4, "0"),
        vendaId: venda.id,
        data: formatarData(venda.data),
        status: mapearStatus(venda.status),
        cliente: venda.cliente,
        itens: (venda.itens ?? []).map((item) => ({
            quantidade: item.quantidade,
            nome: item.nome,
        })),
        total: venda.total,
    }
}

export async function listarPedidos(): Promise<Pedido[]> {
    const vendas = await apiGet<VendaApi[]>("/vendas")
    return vendas.map(mapearPedido)
}
