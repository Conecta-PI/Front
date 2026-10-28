
import React from "react"
import { Switch, Text, View } from "react-native"

import { style } from "./style"
import { themes } from "../../global/themes"

type InterruptorProps = {
    titulo: string
    descricao?: string
    valor: boolean
    onChange: (valor: boolean) => void
}

export default function Interruptor({ titulo, descricao, valor, onChange }: InterruptorProps) {
    return (
        <View style={style.container}>
            <View style={style.textos}>
                <Text style={style.titulo}>{titulo}</Text>
                {!!descricao && <Text style={style.descricao}>{descricao}</Text>}
            </View>

            <Switch
                value={valor}
                onValueChange={onChange}
                trackColor={{ false: themes.colors["borda"], true: themes.colors["dourado"] }}
                thumbColor={themes.colors["branco"]}
                ios_backgroundColor={themes.colors["borda"]}
                accessibilityLabel={titulo}
            />
        </View>
    )
}