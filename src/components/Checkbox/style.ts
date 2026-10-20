import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    caixa: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: themes.colors["azul-escuro"],
        backgroundColor: themes.colors["branco"],
        alignItems: "center",
        justifyContent: "center",
    },

    caixaMarcada: {
        backgroundColor: themes.colors["dourado"],
        borderColor: themes.colors["dourado"],
    },

    caixaErro: {
        borderColor: themes.colors["erro"],
    },

    texto: {
        ...themes.typography.apoio,
        color: themes.colors["texto"],
        flexShrink: 1,
    },
})