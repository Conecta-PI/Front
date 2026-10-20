export type Periodo = "hoje" | "semana" | "mes"
export type TipoAlerta = "critico" | "aviso" | "informativo"
export type TipoMetrica = "lucro" | "custo" | "investido"

export type Dashboard = {
    usuario: { nome: string; negocio: string }
    recebido: { valor: number; meta: number; pedidos: number }
    alertas: { tipo: TipoAlerta; quantidade: number }[]
    proximasEntregas: { id: string; nome: string; dia: string; hora: string }[]
    metricas: Record<TipoMetrica, number>
    lucroMensal: { mes: string; valor: number }[]
}