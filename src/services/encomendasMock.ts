import type { Encomenda } from "./encomendas"

function dataFutura(dias: number) {
    const data = new Date()
    data.setHours(12, 0, 0, 0)
    data.setDate(data.getDate() + dias)
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const dia = String(data.getDate()).padStart(2, "0")
    return `${ano}-${mes}-${dia}`
}

const iniciais: Encomenda[] = [
    {
        id: -1,
        codigo: "ENC-DEMO-001",
        clienteNome: "Ana Clara",
        status: "pendente",
        dataPedido: dataFutura(0),
        dataEntrega: dataFutura(0),
        horario: "14:30",
        tipoEntrega: "entrega",
        sinalPago: 50,
        valorTotal: 180,
        observacao: "Encomenda demonstrativa: bolo decorado para aniversário.",
        itens: [
            { nomeProduto: "Bolo de chocolate", quantidade: 1, precoUnitario: 120 },
            { nomeProduto: "Cento de brigadeiros", quantidade: 1, precoUnitario: 60 },
        ],
    },
    {
        id: -2,
        codigo: "ENC-DEMO-002",
        clienteNome: "Carlos Souza",
        status: "em_producao",
        dataPedido: dataFutura(0),
        dataEntrega: dataFutura(2),
        horario: "16:00",
        tipoEntrega: "retirada",
        sinalPago: 80,
        valorTotal: 210,
        observacao: "Encomenda demonstrativa: retirada na loja.",
        itens: [
            { nomeProduto: "Bolo de pote sortido", quantidade: 12, precoUnitario: 12 },
            { nomeProduto: "Torta de morango", quantidade: 1, precoUnitario: 66 },
        ],
    },
]

let mocks = iniciais.map((item) => ({ ...item, itens: item.itens.map((produto) => ({ ...produto })) }))

export function listarEncomendasMock(): Encomenda[] {
    return mocks.map((item) => ({ ...item, itens: item.itens.map((produto) => ({ ...produto })) }))
}

export function buscarEncomendaMock(id: string | number): Encomenda | null {
    const encontrado = mocks.find((item) => String(item.id) === String(id))
    return encontrado
        ? { ...encontrado, itens: encontrado.itens.map((produto) => ({ ...produto })) }
        : null
}

export function atualizarStatusEncomendaMock(id: string | number, status: string): Encomenda | null {
    const indice = mocks.findIndex((item) => String(item.id) === String(id))
    if (indice < 0) return null

    mocks[indice] = { ...mocks[indice], status }
    return { ...mocks[indice], itens: mocks[indice].itens.map((produto) => ({ ...produto })) }
}
