
import React from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native"

import { style } from "./style"
import { themes } from "../../global/themes"
import type { Destino } from "../../routes"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

type ItemMenuProps = {
    icone: IconName
    texto: string
    destino: Destino
    semBorda?: boolean
}

export default function ItemMenu({ icone, texto, destino, semBorda }: ItemMenuProps) {
    const navigation = useNavigation<NavigationProp<ParamListBase>>()

    return (
        <Pressable
            onPress={() => navigation.navigate(destino)}
            accessibilityRole="button"
            accessibilityLabel={texto}
            style={({ pressed }) => [
                style.item,
                !semBorda && style.borda,
                pressed && style.pressionado,
            ]}
        >
            <View style={style.icone}>
                <Ionicons name={icone} size={20} color={themes.colors["dourado"]} />
            </View>

            <Text style={style.texto}>{texto}</Text>

            <Ionicons name="chevron-forward" size={20} color={themes.colors["marrom-suave"]} />
        </Pressable>
    )
}