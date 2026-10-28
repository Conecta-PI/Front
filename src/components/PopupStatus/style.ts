
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    raiz: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    card: {
        width: "100%",
        maxWidth: 340,
        alignItems: "center",
        gap: 8,
        padding: 24,
        borderRadius: 24,
        backgroundColor: themes.colors["branco"],
        elevation: 12,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
    },
    anel: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    circulo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    titulo: {
        ...themes.typography.titulo3,
        color: themes.colors["texto"],
        textAlign: "center",
    },
    mensagem: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
        textAlign: "center",
    },
    botao: {
        alignSelf: "stretch",
        marginTop: 8,
    },
})