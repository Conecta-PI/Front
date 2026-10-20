import React from "react"
import { Image, Text, View } from "react-native"

import { style } from "./style"
import { themes } from "../../global/themes"

import Logo from "../../assets/images/logo.png"

type HeaderProps = {
    titulo?: string
    descricao?: string
}

export default function Header({ titulo, descricao }: HeaderProps) {
    const boasVindas = titulo === undefined

    return (
        <View style={style.container}>
            <Image source={Logo} style={style.logo} resizeMode="contain" />

            <View style={style.textos}>
                {boasVindas && (
                    <Text
                        style={[
                            themes.typography.rotulo,
                            { color: themes.colors["texto-secundario"] },
                        ]}
                    >
                        Bem-Vindo ao
                    </Text>
                )}

                <Text style={[themes.typography.titulo1, style.nome]}>
                    {boasVindas ? "Conecta." : titulo}
                </Text>

                {!!descricao && <Text style={style.descricao}>{descricao}</Text>}
            </View>
        </View>
    )
}