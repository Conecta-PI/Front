import { apiGet, apiPatch } from "./api"
import type { Perfil } from "../types/perfil"

export async function buscarPerfil(): Promise<Perfil> {
    return apiGet<Perfil>("/perfil")
}

export async function atualizarPerfil(dados: Partial<Perfil>): Promise<Perfil> {
    return apiPatch<Perfil>("/perfil", dados)
}
