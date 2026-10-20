import { useEffect, useState } from "react"
import { buscarDashboard } from "../services/dashboard"
import { Dashboard, Periodo } from "../types/dashboard"

export function useDashboard(periodo: Periodo) {
    const [dados, setDados] = useState<Dashboard | null>(null)

    useEffect(() => {
        let cancelado = false

        buscarDashboard(periodo).then((d) => {
            if (!cancelado) setDados(d)
        })

        return () => {
            cancelado = true
        }
    }, [periodo])

    return { dados }
}