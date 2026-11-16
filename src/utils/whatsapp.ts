import { Linking } from "react-native"

function numeroWhatsapp(telefone: string) {
    const digitos = telefone.replace(/\D/g, "")

    return digitos.length === 10 || digitos.length === 11 ? `55${digitos}` : digitos
}

export async function abrirWhatsapp(telefone: string) {
    const numero = numeroWhatsapp(telefone)

    if (numero.length < 12) {
        throw new Error("O telefone deste cliente parece inválido.")
    }

    await Linking.openURL(`https://wa.me/${numero}`)
}