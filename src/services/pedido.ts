import { apiGet } from "./api"
import type { Pedido, StatusPedido } from "../types/pedido"

type VendaApi = {
    id: number
    cliente: string
    data: string
    total: number
    status: string
    itens?: { nome: string; quantidade: number }[]
}

function formatarData(iso: string): string {
    const [data] = iso.split("T")
    const [, mes, dia] = data.split("-")
    return dia + "/" + mes
}

function mapearPedido(venda: VendaApi): Pedido {
    const status: StatusPedido = venda.status === "pago" ? "pago" : "pendente"

    return {
        id: String(venda.id).padStart(4, "0"),
        data: formatarData(venda.data),
        status,
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
    return vendas.filter((venda) => venda.status !== "cancelado").map(mapearPedido)
}
