
import React from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { NavigationProp, useNavigation } from "@react-navigation/native"

import { style } from "./style"
import { themes } from "../../global/themes"
import type { AppParamList, Destino } from "../../routes"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

type AtalhoRapidoProps = {
    icone: IconName
    texto: string
    destino: Destino
}

export default function AtalhoRapido({ icone, texto, destino }: AtalhoRapidoProps) {
    const navigation = useNavigation<NavigationProp<AppParamList>>()

    return (
        <Pressable
            onPress={() => navigation.navigate(destino)}
            accessibilityRole="button"
            accessibilityLabel={texto}
            style={({ pressed }) => [style.card, pressed && style.cardPressionado]}
        >
            <View style={style.circulo}>
                <Ionicons name={icone} size={22} color={themes.colors["dourado"]} />
            </View>

            <Text style={style.texto} numberOfLines={2}>
                {texto}
            </Text>
        </Pressable>
    )
}