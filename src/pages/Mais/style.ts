import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    carregando: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    conteudo: {
        padding: 16,
        paddingBottom: 24,
        gap: 20,
    },

    card: {
        borderRadius: 20,
        backgroundColor: themes.colors["branco"],
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    cardLista: {
        paddingHorizontal: 16,
    },

    resumo: {
        flexDirection: "row",
        paddingVertical: 16,
    },
    resumoItem: {
        flex: 1,
        alignItems: "center",
        gap: 2,
    },
    resumoDivisor: {
        borderLeftWidth: 1,
        borderLeftColor: themes.colors["borda"],
    },
    resumoNumero: {
        ...themes.typography.titulo2,
        color: themes.colors["texto"],
    },
    resumoRotulo: {
        ...themes.typography.nav,
        color: themes.colors["marrom-suave"],
    },
})