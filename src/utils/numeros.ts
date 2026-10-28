
export function textoParaNumero(texto: string) {
    const n = parseFloat(texto.replace(/\./g, "").replace(",", "."))
    return Number.isNaN(n) ? 0 : n
}