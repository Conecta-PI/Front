import type { Cliente } from "../types/cliente"

export type PedidoCliente = {
    id: string
    data: string
    valor: number
    status: "Pago" | "Pendente"
}

type DadosMock = Pick<Cliente, "totalGasto" | "quantidadePedidos" | "ultimoPedido" | "temPendencia"> & {
    telefone: string
    email: string
    observacao: string
    pedidos: PedidoCliente[]
}

const DADOS: Record<string, DadosMock> = {
    "maria silva": {
        telefone: "(11) 98765-432",
        email: "maria.silva@email.com",
        observacao: "Alergia a amendoim",
        totalGasto: 156.8,
        quantidadePedidos: 8,
        ultimoPedido: "2026-09-27",
        temPendencia: false,
        pedidos: [
            { id: "#0012", data: "27/09", valor: 29, status: "Pago" },
            { id: "#0008", data: "25/09", valor: 24, status: "Pago" },
            { id: "#0005", data: "18/09", valor: 56, status: "Pago" },
            { id: "#0002", data: "10/09", valor: 47.8, status: "Pago" },
        ],
    },
    "joão santos": {
        telefone: "(11) 97654-321",
        email: "joao.santos@email.com",
        observacao: "",
        totalGasto: 89,
        quantidadePedidos: 5,
        ultimoPedido: "2026-09-25",
        temPendencia: false,
        pedidos: [
            { id: "#0010", data: "25/09", valor: 32, status: "Pago" },
            { id: "#0004", data: "12/09", valor: 57, status: "Pago" },
        ],
    },
    "ana oliveira": {
        telefone: "(11) 96543-210",
        email: "ana.oliveira@email.com",
        observacao: "Prefere contato por mensagem",
        totalGasto: 210.12,
        quantidadePedidos: 10,
        ultimoPedido: "2026-09-27",
        temPendencia: true,
        pedidos: [{ id: "#0011", data: "27/09", valor: 42, status: "Pendente" }],
    },
    "carlos lima": {
        telefone: "(11) 95432-109",
        email: "carlos.lima@email.com",
        observacao: "Confirmar endereço antes da entrega",
        totalGasto: 45.3,
        quantidadePedidos: 3,
        ultimoPedido: "2026-09-22",
        temPendencia: true,
        pedidos: [{ id: "#0009", data: "22/09", valor: 45.3, status: "Pendente" }],
    },
    "lucia mendes": {
        telefone: "(11) 94321-098",
        email: "lucia.mendes@email.com",
        observacao: "",
        totalGasto: 178,
        quantidadePedidos: 9,
        ultimoPedido: "2026-09-28",
        temPendencia: false,
        pedidos: [{ id: "#0013", data: "28/09", valor: 38, status: "Pago" }],
    },
    "pedro costa": {
        telefone: "(11) 93210-987",
        email: "pedro.costa@email.com",
        observacao: "",
        totalGasto: 67.4,
        quantidadePedidos: 4,
        ultimoPedido: "2026-09-24",
        temPendencia: false,
        pedidos: [{ id: "#0007", data: "24/09", valor: 67.4, status: "Pago" }],
    },
    "fernanda rocha": {
        telefone: "(11) 92109-876",
        email: "fernanda.rocha@email.com",
        observacao: "Entregar após as 18h",
        totalGasto: 134,
        quantidadePedidos: 7,
        ultimoPedido: "2026-09-26",
        temPendencia: true,
        pedidos: [{ id: "#0006", data: "26/09", valor: 134, status: "Pendente" }],
    },
}

export const CLIENTES_MOCK = Object.entries(DADOS).map(([nome, dados], indice): Cliente => ({
    id: `demo-${indice + 1}`,
    nome: nome.replace(/\b\w/g, (letra) => letra.toUpperCase()),
    ...dados,
}))

export function obterClienteMock(id: string): (Cliente & { pedidos: PedidoCliente[] }) | null {
    const indice = Number(id.replace("demo-", "")) - 1
    const cliente = CLIENTES_MOCK[indice]
    if (!cliente) return null

    const dados = DADOS[cliente.nome.toLocaleLowerCase()]
    return dados ? { ...cliente, pedidos: dados.pedidos } : null
}
