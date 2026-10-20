import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors["bege-claro"],
    },

    statusBarFundo: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: themes.colors["azul-escuro"],
        zIndex: 1,
    },

    area: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    card: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: themes.colors["branco"],
        borderRadius: 24,
        padding: 20,
        gap: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },

    link: {
        ...themes.typography.rotulo,
        color: themes.colors["marrom-suave"],
    },

    erroTermos: {
        ...themes.typography.apoio,
        color: themes.colors["erro"],
        marginTop: 6,
    },

    divisor: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    linha: {
        flex: 1,
        height: 1,
        backgroundColor: themes.colors["borda"],
    },

    ou: {
        ...themes.typography.apoio,
        color: themes.colors["marrom-suave"],
    },
})