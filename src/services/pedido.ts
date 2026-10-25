import type { Pedido } from "../types/pedido"

const PEDIDOS: Pedido[] = [
    { id: "0012", data: "27/09", status: "pago", cliente: "Maria Silva", itens: [{ quantidade: 2, nome: "Bolo Pote Choc" }, { quantidade: 1, nome: "Brigadeiro" }], total: 29 },
    { id: "0011", data: "27/09", status: "pendente", cliente: "João Santos", itens: [{ quantidade: 1, nome: "Lanche Nat. Frango" }], total: 15 },
    { id: "0010", data: "26/09", status: "pago", cliente: "Ana Oliveira", itens: [{ quantidade: 3, nome: "Bolo Pote Morango" }], total: 36 },
    { id: "0009", data: "26/09", status: "pendente", cliente: "Carlos Lima", itens: [{ quantidade: 1, nome: "Bolo Pote Churros" }], total: 12 },
    { id: "0008", data: "25/09", status: "pago", cliente: "Lucia Mendes", itens: [{ quantidade: 2, nome: "Bolo Pote Choc" }], total: 24 },
    { id: "0007", data: "25/09", status: "pago", cliente: "Pedro Carvalho", itens: [{ quantidade: 1, nome: "Lanche Nat. Atum" }], total: 15 },
    { id: "0006", data: "24/09", status: "pendente", cliente: "Jonas Oliveira", itens: [{ quantidade: 2, nome: "Brigadeiro" }], total: 10 },
    { id: "0005", data: "24/09", status: "pago", cliente: "Maria Silva", itens: [{ quantidade: 1, nome: "Bolo Pote Choc" }], total: 12 },
    { id: "0004", data: "23/09", status: "pago", cliente: "Ana Costa", itens: [{ quantidade: 2, nome: "Lanche Nat. Frango" }], total: 30 },
    { id: "0003", data: "22/09", status: "pago", cliente: "Pedro Carvalho", itens: [{ quantidade: 4, nome: "Brigadeiro" }], total: 20 },
    { id: "0002", data: "22/09", status: "pago", cliente: "Ana Oliveira", itens: [{ quantidade: 1, nome: "Bolo Pote Churros" }, { quantidade: 1, nome: "Brigadeiro" }], total: 19 },
    { id: "0001", data: "21/09", status: "pago", cliente: "João Santos", itens: [{ quantidade: 2, nome: "Bolo Pote Morango" }], total: 24 },
]

export function listarPedidos() {
    return PEDIDOS
}