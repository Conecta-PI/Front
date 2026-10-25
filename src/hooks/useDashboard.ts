import { useEffect, useState } from "react"
import { buscarDashboard } from "../services/dashboard"
import { Dashboard, Periodo } from "../types/dashboard"

export function useDashboard(periodo: Periodo) {
    const [dados, setDados] = useState<Dashboard | null>(null)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        let cancelado = false

        setDados(null)
        setErro(null)

        buscarDashboard(periodo)
            .then((d) => {
                if (!cancelado) {
                    setDados(d)
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
    }, [periodo])

    return { dados, erro }
}