
import React from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"
import type { UnidadePeso } from "../../types/produto"

type IngredienteItemProps = {
    nome: string
    quantidade: number
    unidade: UnidadePeso
    onRemover: () => void
}

export default function IngredienteItem({
    nome,
    quantidade,
    unidade,
    onRemover,
}: IngredienteItemProps) {
    const qtd = String(quantidade).replace(".", ",")

    return (
        <View style={style.card}>
            <Text style={style.texto} numberOfLines={1}>
                {nome}  –  {qtd} {unidade}
            </Text>

            <Pressable
                onPress={onRemover}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={`Remover ${nome}`}
            >
                <Ionicons name="trash-outline" size={20} color={themes.colors["erro"]} />
            </Pressable>
        </View>
    )
}