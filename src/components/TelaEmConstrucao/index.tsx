
import React from "react"
import { Text, View } from "react-native"

import AppLayout from "../AppLayout/AppLayout"
import { themes } from "../../global/themes"

export default function TelaEmConstrucao({ titulo }: { titulo: string }) {
    return (
        <AppLayout header={{ tipo: "detalhe", titulo }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ ...themes.typography.titulo1, color: themes.colors["texto"] }}>
                    {titulo}
                </Text>
            </View>
        </AppLayout>
    )
}