import { Dashboard, Periodo } from "../types/dashboard"

const RECEBIDO: Record<Periodo, Dashboard["recebido"]> = {
    hoje: { valor: 120, meta: 2500, pedidos: 10 },
    semana: { valor: 870, meta: 2500, pedidos: 42 },
    mes: { valor: 2150, meta: 2500, pedidos: 118 },
}

// const resposta = await fetch(`${API_URL}/dashboard?periodo=${periodo}`)
// return resposta.json()
export async function buscarDashboard(periodo: Periodo): Promise<Dashboard> {
    await new Promise((r) => setTimeout(r, 600))

    return {
        usuario: { nome: "Paulo", negocio: "Conecta Doces & Naturais" },
        recebido: RECEBIDO[periodo],
        alertas: [
            { tipo: "aviso", quantidade: 3 },
            { tipo: "critico", quantidade: 2 },
            { tipo: "informativo", quantidade: 1 },
        ],
        proximasEntregas: [
            { id: "1042", nome: "Marina", dia: "Hoje", hora: "16:30" },
            { id: "1043", nome: "João", dia: "Amanhã", hora: "09:00" },
        ],
        metricas: { lucro: 1847.5, custo: 623, investido: 2470.5 },
        lucroMensal: [
            { mes: "Ago", valor: 320 },
            { mes: "Set", valor: 480 },
            { mes: "Out", valor: 400 },
            { mes: "Nov", valor: 760 },
            { mes: "Dez", valor: 1000 },
            { mes: "Jan", valor: 590 },
        ],
    }
}