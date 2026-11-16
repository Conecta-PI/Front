
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        backgroundColor: themes.colors["branco"],
    },
    produto: {
        flex: 1,
        gap: 2,
    },
    nomeLinha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    nome: {
        ...themes.typography.rotulo,
        fontFamily: "Poppins_600SemiBold",
        color: themes.colors["texto"],
        flexShrink: 1,
    },
    nomeVazio: {
        color: themes.colors["texto-secundario"],
    },
    preco: {
        ...themes.typography.nav,
        color: themes.colors["marrom-suave"],
    },
    quantidade: {
        width: 112,
    },
})