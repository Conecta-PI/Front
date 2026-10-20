import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    base: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 48,
    },

    quadrado: {
        alignSelf: "stretch",
        borderRadius: 12,
        paddingHorizontal: 16,
    },

    arredondado: {
        alignSelf: "center",
        borderRadius: 999,
        paddingHorizontal: 24,
    },

    texto: {
        ...themes.typography.botao,
    },

    iconeEsquerda: {
        marginRight: 8,
    },

    iconeDireita: {
        marginLeft: 8,
    },

    desabilitado: {
        opacity: 0.5,
    },
})