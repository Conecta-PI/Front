// src/pages/Produtos/style.ts
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    lista: {
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 96,
        gap: 12,
    },
    coluna: {
        justifyContent: "space-between",
    },
    vazio: {
        ...themes.typography.corpo,
        color: themes.colors["texto-secundario"],
        textAlign: "center",
        marginTop: 40,
    },
    botaoAdicionar: {
        position: "absolute",
        right: 16,
        bottom: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
})