import { apiGet, apiPost, ApiError, resolverUrlImagem } from "./api"

import type {
    NovoProduto,
    OpcaoCategoria,
    Produto,
    RespostaCadastro,
} from "../types/produto"

export const CATEGORIAS = ["Todos", "Bolo de pote", "Lanche", "Doce"]

type ProdutoApi = {
    id: number
    nome: string
    preco: number
    categoria: string
    descricao: string
    estoque: number
    foto?: string | null
}

function mapearProduto(produto: ProdutoApi): Produto {
    return {
        ...produto,
        id: String(produto.id),
        imagem: resolverUrlImagem(produto.foto),
    }
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
    const clientes = await apiGet<{ id: number; nome: string }[]>("/clientes")
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

const CATEGORIAS_PADRAO = ["Bolo de pote", "Lanche", "Doce", "Salgado"]

export async function listarCategoriasProduto(): Promise<OpcaoCategoria[]> {
    let categorias: string[] = []
    try {
        categorias = await apiGet<string[]>("/produtos/categorias")
    } catch {
        categorias = []
    }

    const unicas = [...categorias]
    for (const padrao of CATEGORIAS_PADRAO) {
        if (!unicas.some((c) => normalizar(c) === normalizar(padrao))) {
            unicas.push(padrao)
        }
    }

    return unicas.map((categoria) => ({ valor: categoria, label: categoria }))
}

function lerComoDataUrl(uri: string): Promise<string> {
    return fetch(uri)
        .then((resposta) => resposta.blob())
        .then(
            (blob) =>
                new Promise<string>((resolve, reject) => {
                    const leitor = new FileReader()
                    leitor.onloadend = () => resolve(String(leitor.result))
                    leitor.onerror = () => reject(leitor.error)
                    leitor.readAsDataURL(blob)
                })
        )
}

export async function cadastrarProduto(dados: NovoProduto): Promise<RespostaCadastro> {
    try {
        const foto = dados.foto ? await lerComoDataUrl(dados.foto) : null

        await apiPost("/produtos", {
            nome: dados.nome,
            categoria: dados.categoria,
            preco: dados.preco,
            descricao: dados.descricao,
            preparo: dados.preparo,
            rendimento: dados.rendimento,
            ingredientes: dados.ingredientes,
            ativo: dados.ativo,
            estoque: 0,
            foto,
        })

        return { sucesso: true, mensagem: "O novo produto já aparece no cardápio." }
    } catch (error) {
        return {
            sucesso: false,
            mensagem: error instanceof Error ? error.message : "Tente novamente.",
        }
    }
}
