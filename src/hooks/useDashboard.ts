import { useCallback, useEffect, useState } from "react"
import { buscarDashboard } from "../services/dashboard"
import { Dashboard, Periodo } from "../types/dashboard"
import { listarLancamentosFinanceiro } from "../services/financeiro"
import { assinarLancamentosDashboard, calcularResumoDashboard, sincronizarLancamentosDashboard } from "../services/dashboardFinanceiro"

export function useDashboard(periodo: Periodo) {
    const [dados, setDados] = useState<Dashboard | null>(null)
    const [erro, setErro] = useState<string | null>(null)

    const atualizarComLancamentos = useCallback((base: Dashboard) => {
        const resumo = calcularResumoDashboard(periodo)
        return {
            ...base,
            recebido: {
                ...base.recebido,
                valor: resumo.recebido,
                pedidos: resumo.vendas,
            },
            metricas: {
                lucro: resumo.lucro,
                custo: resumo.saidas,
                investido: base.metricas.investido,
            },
        }
    }, [periodo])

    useEffect(() => {
        let cancelado = false

        setDados(null)
        setErro(null)

        Promise.all([
            buscarDashboard(periodo),
            listarLancamentosFinanceiro().catch(() => []),
        ])
            .then(([d, lancamentos]) => {
                if (!cancelado) {
                    if (lancamentos.length > 0) sincronizarLancamentosDashboard(lancamentos)
                    setDados(atualizarComLancamentos(d))
                    setErro(null)
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(error instanceof Error ? error.message : "Erro ao carregar dashboard.")
                }
            })

        return () => {
            cancelado = true
        }
    }, [periodo, atualizarComLancamentos])

    useEffect(() => assinarLancamentosDashboard(() => {
        setDados((atual) => atual ? atualizarComLancamentos(atual) : atual)
    }), [atualizarComLancamentos])

    return { dados, erro }
}