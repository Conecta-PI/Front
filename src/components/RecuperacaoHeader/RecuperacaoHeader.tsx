import React from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { style } from "./style"
import { themes } from "../../global/themes"

type Props = {
    titulo?: string
    onVoltar?: () => void
    semVoltar?: boolean
}

export default function RecuperacaoHeader({
    titulo = "Recuperar senha",
    onVoltar,
    semVoltar = false,
}: Props) {
    const navigation = useNavigation()
    const insets = useSafeAreaInsets()

    return (
        <View style={[style.container, { paddingTop: insets.top, height: 64 + insets.top }]}>
            {!semVoltar && (onVoltar !== undefined ? (
                <Pressable
                    onPress={onVoltar}
                    style={({ pressed }) => [style.voltar, pressed && style.voltarPressionado]}
                    accessibilityRole="button"
                    accessibilityLabel="Voltar"
                >
                    <Ionicons name="arrow-back" size={22} color={themes.colors["azul-escuro"]} />
                </Pressable>
            ) : (
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={({ pressed }) => [style.voltar, pressed && style.voltarPressionado]}
                    accessibilityRole="button"
                    accessibilityLabel="Voltar"
                >
                    <Ionicons name="arrow-back" size={22} color={themes.colors["azul-escuro"]} />
                </Pressable>
            ))}
            <Text style={style.titulo}>{titulo}</Text>
        </View>
    )
}
