
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 4,
        gap: 4,
        borderRadius: 14,
        backgroundColor: themes.colors["campo-desabilitado"],
    },
    opcao: {
        flex: 1,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    opcaoAtiva: {
        backgroundColor: themes.colors["branco"],
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
    },
    texto: {
        ...themes.typography.rotulo,
        color: themes.colors["texto-secundario"],
    },
    textoAtivo: {
        fontFamily: "Poppins_600SemiBold",
        color: themes.colors["texto"],
    },
})