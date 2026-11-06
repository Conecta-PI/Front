import { apiGet, apiPatch } from "./api"

export type Configuracao = {
    chave: string
    valor: boolean | string
    tipo: string
}

export type Notificacao = {
    tipo: string
    mensagem: string
    ativa: boolean
}

export async function listarConfiguracoes(): Promise<Configuracao[]> {
    return apiGet<Configuracao[]>("/configuracoes")
}

export async function atualizarConfiguracoes(payload: Record<string, string | boolean>): Promise<Record<string, string | boolean>> {
    return apiPatch<Record<string, string | boolean>>("/configuracoes", payload)
}

export async function listarNotificacoes(): Promise<Notificacao[]> {
    return apiGet<Notificacao[]>("/configuracoes/notificacoes")
}
