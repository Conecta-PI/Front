
export function dataBrParaIso(texto: string): string | null {
    const m = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (!m) return null

    const dia = Number(m[1])
    const mes = Number(m[2])
    const ano = Number(m[3])
    const data = new Date(ano, mes - 1, dia)

    if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
        return null
    }

    return `${m[3]}-${m[2]}-${m[1]}`
}

export function dataNoPassado(iso: string) {
    const hoje = new Date()
    const mes = String(hoje.getMonth() + 1).padStart(2, "0")
    const dia = String(hoje.getDate()).padStart(2, "0")

    return iso < `${hoje.getFullYear()}-${mes}-${dia}`
}

export function horaValida(texto: string) {
    const m = texto.match(/^(\d{2}):(\d{2})$/)
    return !!m && Number(m[1]) < 24 && Number(m[2]) < 60
}