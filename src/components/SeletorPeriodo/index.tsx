// src/components/SeletorPeriodo/SeletorPeriodo.tsx
import React from "react"
import { Pressable, Text, View } from "react-native"

import { style } from "./style"
import type { Periodo } from "../../types/dashboard"

const OPCOES: { valor: Periodo; texto: string }[] = [
    { valor: "hoje", texto: "Hoje" },
    { valor: "semana", texto: "Semana" },
    { valor: "mes", texto: "Mês" },
]

type SeletorPeriodoProps = {
    valor: Periodo
    onChange: (periodo: Periodo) => void
}

export default function SeletorPeriodo({ valor, onChange }: SeletorPeriodoProps) {
    return (
        <View style={style.container}>
            {OPCOES.map((op) => {
                const ativo = op.valor === valor

                return (
                    <Pressable
                        key={op.valor}
                        onPress={() => onChange(op.valor)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: ativo }}
                        style={[style.pill, ativo && style.pillAtivo]}
                    >
                        <Text style={[style.texto, ativo && style.textoAtivo]}>{op.texto}</Text>
                    </Pressable>
                )
            })}
        </View>
    )
}