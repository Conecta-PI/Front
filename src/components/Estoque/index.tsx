// src/components/Estoque/Estoque.tsx
import React from "react"
import { Text, View } from "react-native"

import { style } from "./style"
import { themes } from "../../global/themes"

type EstoqueProps = {
    quantidade: number
    limiteBaixo?: number
}

export default function Estoque({ quantidade, limiteBaixo = 3 }: EstoqueProps) {
    let texto = `Em estoque: ${quantidade}`
    let cor = themes.colors["sucesso"]
    let fundo = themes.colors["fundo-de-sucesso"]

    if (quantidade <= 0) {
        texto = "Esgotado"
        cor = themes.colors["erro"]
        fundo = themes.colors["fundo-de-erro"]
    } else if (quantidade <= limiteBaixo) {
        texto = `Baixo: ${quantidade}`
        cor = themes.colors["alerta"]
        fundo = themes.colors["fundo-de-alerta"]
    }

    return (
        <View style={[style.pill, { backgroundColor: fundo }]}>
            <Text style={[style.texto, { color: cor }]}>{texto}</Text>
        </View>
    )
}