let aceitePendente = false

export function registrarAceiteTermos() {
    aceitePendente = true
}

export function consumirAceiteTermos(): boolean {
    const aceito = aceitePendente
    aceitePendente = false
    return aceito
}
