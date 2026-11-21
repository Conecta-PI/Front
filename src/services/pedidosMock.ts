import type { Pedido } from "../types/pedido"

function dataAtual() {
    const hoje = new Date()
    const mes = String(hoje.getMonth() + 1).padStart(2, "0")
    const dia = String(hoje.getDate()).padStart(2, "0")
    return `${dia}/${mes}`
}

export function listarPedidosMock(): Pedido[] {
    const data = dataAtual()
    return [
        {
            id: "DEMO-001",
            data,
            status: "pendente",
            cliente: "Ana Clara",
            itens: [
                { nome: "Bolo de chocolate", quantidade: 1 },
                { nome: "Cento de brigadeiros", quantidade: 1 },
            ],
            total: 180,
        },
        {
            id: "DEMO-002",
            data,
            status: "pendente",
            cliente: "Carlos Souza",
            itens: [
                { nome: "Bolo de pote sortido", quantidade: 12 },
                { nome: "Torta de morango", quantidade: 1 },
            ],
            total: 210,
        },
        {
            id: "DEMO-003",
            data,
            status: "pendente",
            cliente: "Fernanda Lima",
            itens: [
                { nome: "Cento de beijinhos", quantidade: 1 },
                { nome: "Torta de limão", quantidade: 1 },
            ],
            total: 150,
        },
    ]
}
