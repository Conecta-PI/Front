import { useCallback, useEffect, useState } from "react"
import { buscarPerfil } from "../services/perfil"
import type { Perfil } from "../types/perfil"

export function usePerfil() {
    const [perfil, setPerfil] = useState<Perfil | null>(null)

    const recarregarPerfil = useCallback(async () => {
        const dados = await buscarPerfil()
        setPerfil(dados)
    }, [])

    useEffect(() => {
        let cancelado = false

        buscarPerfil().then((p) => {
            if (!cancelado) setPerfil(p)
        })

        return () => {
            cancelado = true
        }
    }, [])

    return { perfil, recarregarPerfil }
}