
export function formatarMoeda(valor: number) {
    const [inteiro, decimal] = Math.abs(valor).toFixed(2).split(".")
    const comPontos = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return `${valor < 0 ? "-" : ""}R$ ${comPontos},${decimal}`
}