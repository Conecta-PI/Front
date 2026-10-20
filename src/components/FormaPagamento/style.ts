
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    card: {
        flex: 1,
        alignItems: "center",
        gap: 6,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: themes.colors["borda"],
        backgroundColor: themes.colors["branco"],
    },
    cardSelecionado: {
        borderColor: themes.colors["azul-escuro"],
    },
    icone: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["dourado"],
    },
    texto: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    textoSelecionado: {
        fontFamily: "Poppins_600SemiBold",
    },
    check: {
        position: "absolute",
        top: -8,
        right: -6,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["azul-escuro"],
    },
})