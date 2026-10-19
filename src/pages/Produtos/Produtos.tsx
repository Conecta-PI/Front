
import React from "react"
import { Text, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import { themes } from "../../global/themes"

export default function Produtos() {
    return (
        <AppLayout>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ ...themes.typography.titulo1, color: themes.colors["texto"] }}>
                    Produtos
                </Text>
            </View>
        </AppLayout>
    )
}