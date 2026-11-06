import { apiDelete, apiGet, apiPatch, apiPost } from "./api"

export type Fornecedor = {
    id: number
    nome: string
    categoria?: string
    contato?: string
    telefone?: string
    email?: string
    observacao?: string | null
    ativo?: boolean
}

export async function listarFornecedores(): Promise<Fornecedor[]> {
    return apiGet<Fornecedor[]>("/fornecedores")
}

export async function buscarFornecedor(id: string | number): Promise<Fornecedor> {
    return apiGet<Fornecedor>(`/fornecedores/${encodeURIComponent(String(id))}`)
}

export async function criarFornecedor(payload: Partial<Fornecedor>): Promise<Fornecedor> {
    return apiPost<Fornecedor>("/fornecedores", payload)
}

export async function atualizarFornecedor(id: string | number, payload: Partial<Fornecedor>): Promise<Fornecedor> {
    return apiPatch<Fornecedor>(`/fornecedores/${encodeURIComponent(String(id))}`, payload)
}

export async function excluirFornecedor(id: string | number): Promise<void> {
    return apiDelete<void>(`/fornecedores/${encodeURIComponent(String(id))}`)
}
