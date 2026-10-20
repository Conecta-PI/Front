// src/components/EntregaCard/EntregaCard.tsx
import React from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { NavigationProp, useNavigation } from "@react-navigation/native"

import { style } from "./style"
import { themes } from "../../global/themes"
import type { AppParamList } from "../../routes"

type EntregaCardProps = {
    id: string
    nome: string
    dia: string  
    hora: string  
}

export default function EntregaCard({ id, nome, dia, hora }: EntregaCardProps) {
    const navigation = useNavigation<NavigationProp<AppParamList>>()

    return (
        <Pressable
            onPress={() => navigation.navigate("DetalheEncomenda", { id })}
            accessibilityRole="button"
            style={({ pressed }) => [style.card, pressed && style.pressionado]}
        >
            <View style={style.icone}>
                <Ionicons name="calendar-outline" size={22} color={themes.colors["dourado"]} />
            </View>

            <View style={style.textos}>
                <Text style={style.titulo}>Entrega para {nome}</Text>
                <Text style={style.descricao}>
                    {dia} • {hora}
                </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={themes.colors["dourado"]} />
        </Pressable>
    )
}