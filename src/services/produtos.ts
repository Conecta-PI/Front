import type { Produto } from "../types/produto"
import { apiGet, ApiError } from "./api"

export const CATEGORIAS = ["Todos", "Bolo de pote", "Lanche", "Doce"]

type ProdutoApi = {
    id: number
    nome: string
    preco: number
    categoria: string
    descricao: string
    estoque: number
}

type ClienteApi = {
    id: number
    nome: string
}

function mapearProduto(produto: ProdutoApi): Produto {
    return { ...produto, id: String(produto.id) }
}

export async function listarProdutos(): Promise<Produto[]> {
    const produtos = await apiGet<ProdutoApi[]>("/produtos")
    return produtos.map(mapearProduto)
}

export async function buscarProduto(id: string): Promise<Produto | null> {
    try {
        const produto = await apiGet<ProdutoApi>(`/produtos/${encodeURIComponent(id)}`)
        return mapearProduto(produto)
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return null
        }
        throw error
    }
}

export async function listarClientes() {
    const clientes = await apiGet<ClienteApi[]>("/clientes")
    return clientes.map((cliente) => ({
        valor: String(cliente.id),
        label: cliente.nome,
    }))
}

const normalizar = (t: string) =>
    t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export function filtrarProdutos(produtos: Produto[], busca: string, categoria: string) {
    const termo = normalizar(busca.trim())

    return produtos.filter(
        (p) =>
            (categoria === "Todos" || p.categoria === categoria) &&
            normalizar(p.nome).includes(termo)
    )
}