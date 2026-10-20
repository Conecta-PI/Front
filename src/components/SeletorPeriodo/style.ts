
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    pill: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 999,
        backgroundColor: themes.colors["branco"],
        borderWidth: 1,
        borderColor: themes.colors["borda"],
    },
    pillAtivo: {
        backgroundColor: themes.colors["azul-escuro"],
        borderColor: themes.colors["azul-escuro"],
    },
    texto: {
        ...themes.typography.rotulo,
        color: themes.colors["marrom-suave"],
    },
    textoAtivo: {
        color: themes.colors["branco"],
    },
})