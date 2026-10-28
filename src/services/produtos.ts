import { apiGet, ApiError } from "./api"

import type {
    NovoProduto,
    OpcaoCategoria,
    Produto,
    RespostaCadastro,
} from "../types/produto"

const atraso = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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

const SIMULAR_ERRO = false

export async function listarCategoriasProduto(): Promise<OpcaoCategoria[]> {
    await atraso(300)

    // const categorias = await apiGet<{ id: number; nome: string }[]>("/categorias")
    // return categorias.map((c) => ({ valor: String(c.id), label: c.nome }))
    return [
        { valor: "bolo-de-pote", label: "Bolo de pote" },
        { valor: "lanche", label: "Lanche" },
        { valor: "doce", label: "Doce" },
        { valor: "salgado", label: "Salgado" },
    ]
}

export async function cadastrarProduto(dados: NovoProduto): Promise<RespostaCadastro> {
    await atraso(900)

    // const form = new FormData()
    // form.append("nome", dados.nome)
    // form.append("categoria", dados.categoria)
    // form.append("preco", String(dados.preco))
    // form.append("descricao", dados.descricao)
    // form.append("preparo", dados.preparo)
    // form.append("rendimento", dados.rendimento)
    // form.append("ativo", String(dados.ativo))
    // form.append("ingredientes", JSON.stringify(dados.ingredientes))
    // if (dados.foto) {
    //     form.append("foto", { uri: dados.foto, name: "produto.jpg", type: "image/jpeg" } as any)
    // }
    //
    // try {
    //     const r = await fetch(`${API_URL}/produtos`, {
    //         method: "POST",
    //         headers: { Authorization: `Bearer ${token}` },
    //         body: form,
    //     })
    //     const json = await r.json()
    //     return {
    //         sucesso: r.ok,
    //         mensagem: json.mensagem ?? (r.ok ? "O novo produto já aparece no cardápio." : "Tente novamente."),
    //     }
    // } catch {
    //     return { sucesso: false, mensagem: "Sem conexão. Verifique sua internet e tente novamente." }
    // }

    if (SIMULAR_ERRO) {
        return { sucesso: false, mensagem: "Já existe um produto com esse nome." }
    }

    return { sucesso: true, mensagem: "O novo produto já aparece no cardápio." }
}