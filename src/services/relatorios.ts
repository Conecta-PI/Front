import { apiGet } from "./api"

export type RelatorioResumo = {
    faturamento: number
    despesas: number
    lucro: number
    pedidosPendentes: number
    clientesAtivos: number
    produtosAtivos: number
}

export type RelatorioVenda = {
    mes: string
    valor: number
    quantidade: number
}

export async function buscarResumoRelatorios(): Promise<RelatorioResumo> {
    return apiGet<RelatorioResumo>("/relatorios/resumo")
}

export async function buscarVendasRelatorio(
    periodo: "hoje" | "semana" | "mes" | "ano" = "mes"
): Promise<RelatorioVenda[]> {
    return apiGet<RelatorioVenda[]>(`/relatorios/vendas?periodo=${encodeURIComponent(periodo)}`)
}

export async function buscarFinanceiroRelatorio(): Promise<Record<string, number | string>> {
    return apiGet<Record<string, number | string>>("/relatorios/financeiro")
}
