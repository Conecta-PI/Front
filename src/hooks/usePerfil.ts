import { useCallback, useState } from "react"
import { buscarPerfil } from "../services/perfil"
import type { Perfil } from "../types/perfil"

export function usePerfil() {
    const [perfil, setPerfil] = useState<Perfil | null>(null)
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    const recarregarPerfil = useCallback(async () => {
        setCarregando(true)
        setErro(null)

        try {
            const dados = await buscarPerfil()
            setPerfil(dados)
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível carregar o perfil.")
        } finally {
            setCarregando(false)
        }
    }, [])

    return { perfil, carregando, erro, recarregarPerfil }
}