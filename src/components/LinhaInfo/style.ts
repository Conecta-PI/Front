// src/components/LinhaInfo/style.ts
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    linha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 12,
    },
    borda: {
        borderBottomWidth: 1,
        borderBottomColor: themes.colors["borda"],
    },
    icone: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["campo-desabilitado"],
    },
    textos: {
        flex: 1,
    },
    rotulo: {
        ...themes.typography.nav,
        color: themes.colors["marrom-suave"],
    },
    valor: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
})