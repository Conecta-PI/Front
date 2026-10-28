
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        gap: 16,
    },
    linha: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    quantidade: {
        flex: 1,
    },
    unidade: {
        width: 128,
    },
    rotulo: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
        marginBottom: 8,
    },
    segmento: {
        flexDirection: "row",
        alignItems: "center",
        height: 48,
        padding: 4,
        gap: 4,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        backgroundColor: themes.colors["branco"],
    },
    opcao: {
        flex: 1,
        alignItems: "center",
    },
})