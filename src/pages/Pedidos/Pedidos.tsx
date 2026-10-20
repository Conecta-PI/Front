import React from "react"
import { Text, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import { themes } from "../../global/themes"

export default function Pedidos() {
    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Pedidos" }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ ...themes.typography.titulo1, color: themes.colors["texto"] }}>
                    Pedidos
                </Text>
            </View>
        </AppLayout>
    )
}