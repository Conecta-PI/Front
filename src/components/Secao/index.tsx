// src/components/Secao/Secao.tsx
import React, { ReactNode } from "react"
import { Text, View } from "react-native"
import { style } from "./style"

type SecaoProps = { titulo: string; children: ReactNode }

export default function Secao({ titulo, children }: SecaoProps) {
    return (
        <View style={style.container}>
            <Text style={style.titulo}>{titulo}</Text>
            {children}
        </View>
    )
}