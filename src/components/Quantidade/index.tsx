
import React from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"

type QuantidadeProps = {
    valor: number
    onChange: (valor: number) => void
    min?: number
    max?: number
}

export default function Quantidade({ valor, onChange, min = 0, max }: QuantidadeProps) {
    const noMinimo = valor <= min
    const noMaximo = max !== undefined && valor >= max

    return (
        <View style={style.container}>
            <Pressable
                onPress={() => onChange(valor - 1)}
                disabled={noMinimo}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Diminuir quantidade"
                style={noMinimo && style.desabilitado}
            >
                <Ionicons name="remove" size={18} color={themes.colors["marrom-suave"]} />
            </Pressable>

            <Text style={style.valor}>{valor}</Text>

            <Pressable
                onPress={() => onChange(valor + 1)}
                disabled={noMaximo}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Aumentar quantidade"
                style={noMaximo && style.desabilitado}
            >
                <Ionicons name="add" size={18} color={themes.colors["marrom-suave"]} />
            </Pressable>
        </View>
    )
}