
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 999,
        backgroundColor: "transparent",
    },
    chipAtivo: {
        backgroundColor: themes.colors["marrom-suave"],
    },
    texto: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    textoAtivo: {
        fontFamily: "Poppins_600SemiBold",
        color: themes.colors["branco"],
    },
})