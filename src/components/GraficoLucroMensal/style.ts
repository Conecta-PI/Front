
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    card: {
        gap: 16,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        backgroundColor: themes.colors["branco"],
    },
    topo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    titulo: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
    },
    legenda: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    ponto: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: themes.colors["dourado"],
    },
    textoLegenda: {
        ...themes.typography.nav,
        color: themes.colors["marrom-suave"],
    },
    rotuloX: {
        ...themes.typography.nav,
        color: themes.colors["texto-secundario"],
    },
})