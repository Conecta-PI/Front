import React, { ReactNode } from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"

type CheckboxProps = {
    marcado: boolean
    onChange: (valor: boolean) => void
    children: ReactNode
    erro?: boolean
}

export default function Checkbox({ marcado, onChange, children, erro }: CheckboxProps) {
    return (
        <View style={style.container}>
            <Pressable
                onPress={() => onChange(!marcado)}
                hitSlop={10}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: marcado }}
                style={[
                    style.caixa,
                    marcado && style.caixaMarcada,
                    !!erro && !marcado && style.caixaErro,
                ]}
            >
                {marcado && (
                    <Ionicons name="checkmark" size={14} color={themes.colors["azul-escuro"]} />
                )}
            </Pressable>

            <Text style={style.texto}>{children}</Text>
        </View>
    )
}