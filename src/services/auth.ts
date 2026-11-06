import { apiPost, salvarToken } from "./api"

export type DadosConta = {
    nome: string
    email: string
    telefone: string
    senha: string
    negocio: string
}

type RespostaAutenticacao = {
    accessToken: string
}

export async function cadastrarResponsavel(dados: DadosConta): Promise<void> {
    const resposta = await apiPost<RespostaAutenticacao>("/auth/register", dados)
    await salvarToken(resposta.accessToken)
}

export async function autenticarResponsavel(email: string, senha: string): Promise<void> {
    const resposta = await apiPost<RespostaAutenticacao>("/auth/login", { email, senha })
    await salvarToken(resposta.accessToken)
}


export async function solicitarCodigoRecuperacao(email: string): Promise<string> {
    const resposta = await apiPost<{ message: string }>("/auth/forgot-password", { email })
    return resposta.message
}

export async function verificarCodigoRecuperacao(email: string, codigo: string): Promise<boolean> {
    const resposta = await apiPost<{ valido: boolean }>("/auth/verify-recovery-code", { email, codigo })
    return resposta.valido
}

export async function redefinirSenha(email: string, codigo: string, novaSenha: string): Promise<void> {
    await apiPost("/auth/reset-password", { email, codigo, novaSenha })
}
