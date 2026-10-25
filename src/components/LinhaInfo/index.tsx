
import React from "react"
import { Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

type LinhaInfoProps = {
    icone: IconName
    rotulo: string
    valor: string
    semBorda?: boolean  
}

export default function LinhaInfo({ icone, rotulo, valor, semBorda }: LinhaInfoProps) {
    return (
        <View style={[style.linha, !semBorda && style.borda]}>
            <View style={style.icone}>
                <Ionicons name={icone} size={18} color={themes.colors["dourado"]} />
            </View>

            <View style={style.textos}>
                <Text style={style.rotulo}>{rotulo}</Text>
                <Text style={style.valor} numberOfLines={1}>
                    {valor}
                </Text>
            </View>
        </View>
    )
}