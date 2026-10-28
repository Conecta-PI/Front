
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        gap: 8,
    },
    label: {
        ...themes.typography.rotulo,
        color: themes.colors["marrom-suave"],
    },
    campo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        backgroundColor: themes.colors["branco"],
    },
    textoCampo: {
        ...themes.typography.apoio,
        color: themes.colors["texto"],
        flex: 1,
    },
    placeholder: {
        color: themes.colors["texto-secundario"],
    },
    lista: {
        maxHeight: 220,
        borderRadius: 16,
        backgroundColor: themes.colors["branco"],
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    opcao: {
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    opcaoPressionada: {
        backgroundColor: themes.colors["bege-claro"],
    },
    textoOpcao: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    textoOpcaoAtiva: {
        fontFamily: "Poppins_600SemiBold",
    },

    campoAberto: {
        borderColor: themes.colors["dourado"],
    },
})