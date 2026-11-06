import { apiGet, apiPost } from "./api"

export type FinanceiroResumo = {
    entradas: number
    saidas: number
    saldo: number
    totalLancamentos: number
}

export type FinanceiroLancamento = {
    id: number
    tipo: "entrada" | "saida"
    valor: number
    categoria: string
    descricao: string
    data: string
}

export async function buscarResumoFinanceiro(): Promise<FinanceiroResumo> {
    return apiGet<FinanceiroResumo>("/financeiro/resumo")
}

export async function listarLancamentosFinanceiro(): Promise<FinanceiroLancamento[]> {
    return apiGet<FinanceiroLancamento[]>("/financeiro/lancamentos")
}

export async function criarLancamentoFinanceiro(payload: {
    tipo: "entrada" | "saida"
    valor: number
    categoria: string
}): Promise<FinanceiroLancamento> {
    return apiPost<FinanceiroLancamento>("/financeiro/lancamentos", payload)
}
