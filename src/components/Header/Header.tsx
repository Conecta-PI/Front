import React from "react"

import { Text, View, Image } from "react-native"

import { style } from "./style"
import { themes } from "../../global/themes"

import Logo from "../../assets/images/logo.png"

export default function Header() {
    return (
        <View style={style.container}>
            <Image
                source={Logo}
                style={style.logo}
                resizeMode="contain"
            />

            <View>
                <Text style={[
                    themes.typography.rotulo,
                    { color: themes.colors["texto-secundario"] },
                ]}>
                    Bem-Vindo ao
                </Text>

                <Text style={[
                    themes.typography.titulo1,
                    style.nome
                ]}>
                    Conecta.
                </Text>
            </View>
        </View>
    )
} 