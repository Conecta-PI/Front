import type { Periodo } from "../types/dashboard"
import type { FinanceiroLancamento } from "./financeiro"

const ouvintes = new Set<() => void>()

function dataAtual() {
    const agora = new Date()
    const ano = agora.getFullYear()
    const mes = String(agora.getMonth() + 1).padStart(2, "0")
    const dia = String(agora.getDate()).padStart(2, "0")
    return `${ano}-${mes}-${dia}T12:00:00`
}

let lancamentosDemonstrativos: FinanceiroLancamento[] = [
    { id: -101, tipo: "entrada", valor: 320, categoria: "Venda", descricao: "Venda demonstrativa", data: dataAtual() },
    { id: -102, tipo: "entrada", valor: 180, categoria: "Venda", descricao: "Venda demonstrativa", data: dataAtual() },
    { id: -103, tipo: "saida", valor: 95, categoria: "Despesa", descricao: "Compra demonstrativa", data: dataAtual() },
]

let lancamentos: FinanceiroLancamento[] = [...lancamentosDemonstrativos]

export function obterLancamentosDashboard() {
    return lancamentos.map((item) => ({ ...item }))
}

export function registrarLancamentoDashboard(lancamento: Omit<FinanceiroLancamento, "id" | "data"> & { data?: string }) {
    lancamentos = [
        {
            id: Date.now(),
            tipo: lancamento.tipo,
            valor: lancamento.valor,
            categoria: lancamento.categoria,
            descricao: lancamento.descricao ?? "Lancamento manual",
            data: lancamento.data ?? dataAtual(),
        },
        ...lancamentos,
    ]
    notificar()
}

export function sincronizarLancamentosDashboard(lista: FinanceiroLancamento[]) {
    lancamentos = lista.length > 0
        ? lista.map((item) => ({ ...item }))
        : [...lancamentosDemonstrativos]
    notificar()
}

export function assinarLancamentosDashboard(listener: () => void) {
    ouvintes.add(listener)
    return () => {
        ouvintes.delete(listener)
    }
}

function notificar() {
    ouvintes.forEach((listener) => listener())
}

function inicioPeriodo(periodo: Periodo) {
    const inicio = new Date()
    inicio.setHours(0, 0, 0, 0)

    if (periodo === "semana") inicio.setDate(inicio.getDate() - 6)
    if (periodo === "mes") inicio.setDate(1)

    return inicio
}

export function calcularResumoDashboard(periodo: Periodo) {
    const inicio = inicioPeriodo(periodo)

    const filtrados = lancamentos.filter((item) => {
        const data = new Date(item.data)
        return !Number.isNaN(data.getTime()) && data >= inicio
    })

    const entradas = filtrados
        .filter((item) => item.tipo === "entrada")
        .reduce((total, item) => total + Number(item.valor ?? 0), 0)

    const saidas = filtrados
        .filter((item) => item.tipo === "saida")
        .reduce((total, item) => total + Number(item.valor ?? 0), 0)

    return {
        recebido: entradas,
        saidas,
        lucro: entradas - saidas,
        vendas: filtrados.filter((item) => item.tipo === "entrada").length,
    }
}
