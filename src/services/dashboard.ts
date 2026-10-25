import { apiGet } from "./api"
import type { Dashboard, Periodo } from "../types/dashboard"

export function buscarDashboard(periodo: Periodo): Promise<Dashboard> {
    return apiGet<Dashboard>(`/dashboard?periodo=${encodeURIComponent(periodo)}`)
}
