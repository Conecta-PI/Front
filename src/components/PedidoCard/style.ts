import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    card: {
        padding: 16,
        gap: 12,
        borderRadius: 16,
        backgroundColor: themes.colors["branco"],
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    pressionado: {
        backgroundColor: themes.colors["bege-claro"],
    },

    topo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    identificacao: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 6,
    },
    id: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
    },
    data: {
        ...themes.typography.nav,
        color: themes.colors["marrom-suave"],
    },
    status: {
        paddingVertical: 3,
        paddingHorizontal: 12,
        borderRadius: 999,
    },
    statusTexto: {
        ...themes.typography.nav,
        fontFamily: "Poppins_600SemiBold",
    },

    corpo: {
        gap: 2,
    },
    cliente: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
    },
    itens: {
        ...themes.typography.apoio,
        color: themes.colors["marrom-suave"],
    },

    rodape: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: themes.colors["borda"],
    },
    rotuloTotal: {
        ...themes.typography.apoio,
        color: themes.colors["marrom-suave"],
    },
    total: {
        ...themes.typography.titulo3,
    },
})