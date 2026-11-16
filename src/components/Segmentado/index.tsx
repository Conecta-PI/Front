
import React from "react"
import { Pressable, Text, View } from "react-native"

import { style } from "./style"

type Opcao<T extends string> = { valor: T; label: string }

type SegmentadoProps<T extends string> = {
    opcoes: Opcao<T>[]
    valor: T
    onChange: (valor: T) => void
}

export default function Segmentado<T extends string>({
    opcoes,
    valor,
    onChange,
}: SegmentadoProps<T>) {
    return (
        <View style={style.container}>
            {opcoes.map((opcao) => {
                const ativo = opcao.valor === valor

                return (
                    <Pressable
                        key={opcao.valor}
                        onPress={() => onChange(opcao.valor)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: ativo }}
                        style={[style.opcao, ativo && style.opcaoAtiva]}
                    >
                        <Text style={[style.texto, ativo && style.textoAtivo]}>{opcao.label}</Text>
                    </Pressable>
                )
            })}
        </View>
    )
}