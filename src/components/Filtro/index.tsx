
import React from "react"
import { Pressable, Text } from "react-native"

import { style } from "./style"

type FiltroProps = {
    texto: string
    ativo: boolean
    onPress: () => void
}

export default function Filtro({ texto, ativo, onPress }: FiltroProps) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: ativo }}
            style={[style.chip, ativo && style.chipAtivo]}
        >
            <Text style={[style.texto, ativo && style.textoAtivo]}>{texto}</Text>
        </Pressable>
    )
}