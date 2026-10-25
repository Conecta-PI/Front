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
