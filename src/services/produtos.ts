import type { Produto } from "../types/produto"

export const CATEGORIAS = ["Todos", "Bolo de pote", "Lanche", "Doce"]

export const CLIENTES = [
    { valor: "1", label: "Maria Silva" },
    { valor: "2", label: "Pedro Carvalho" },
    { valor: "3", label: "Jonas Oliveira" },
    { valor: "4", label: "Ana Costa" },
]

const PRODUTOS: Produto[] = [
    { id: "1", nome: "Bolo de Pote Choc", preco: 12, categoria: "Bolo de pote", estoque: 8, descricao: "Camadas de bolo de chocolate, brigadeiro cremoso e cobertura de morango." },
    { id: "2", nome: "Bolo de Pote Morango", preco: 12, categoria: "Bolo de pote", estoque: 5, descricao: "Bolo branco, creme de baunilha e morangos frescos." },
    { id: "3", nome: "Bolo de Pote Churros", preco: 14, categoria: "Bolo de pote", estoque: 2, descricao: "Bolo de canela com doce de leite e açúcar com canela." },
    { id: "4", nome: "Lanche Nat. Frango", preco: 15, categoria: "Lanche", estoque: 10, descricao: "Pão integral, frango desfiado, cenoura e alface." },
    { id: "5", nome: "Lanche Nat. Atum", preco: 15, categoria: "Lanche", estoque: 0, descricao: "Pão italiano, atum, tomate e alface." },
    { id: "6", nome: "Brigadeiro Gourmet", preco: 5, categoria: "Doce", estoque: 15, descricao: "Brigadeiro com chocolate belga e granulado." },
]

const normalizar = (t: string) =>
    t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export function listarProdutos() {
    return PRODUTOS
}

export function filtrarProdutos(busca: string, categoria: string) {
    const termo = normalizar(busca.trim())

    return PRODUTOS.filter(
        (p) =>
            (categoria === "Todos" || p.categoria === categoria) &&
            normalizar(p.nome).includes(termo)
    )
}

export function buscarProduto(id: string) {
    return PRODUTOS.find((p) => p.id === id)
}