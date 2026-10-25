import type { Perfil } from "../types/perfil"

export async function buscarPerfil(): Promise<Perfil> {
    await new Promise((r) => setTimeout(r, 400))

    return {
        nome: "Paulo Mendes",
        negocio: "Doces do Paulo",
        premium: true,
        telefone: "(11) 99876-5432",
        email: "paulo@docesdopaulo.com",
        cnpj: "12.345.678/0001-90",
        chavePix: "docesdopaulo@pix",
        resumo: { pedidos: 12, clientes: 48, produtos: 6 },
    }
}