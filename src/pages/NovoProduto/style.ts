import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    flex: {
        flex: 1,
    },
    conteudo: {
        padding: 16,
        paddingBottom: 24,
        gap: 16,
    },
    bloco: {
        gap: 8,
    },
    linha: {
        flexDirection: "row",
        gap: 12,
    },
    metade: {
        flex: 1,
    },
    rotulo: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    erro: {
        ...themes.typography.apoio,
        color: themes.colors["erro"],
    },
    rodape: {
        paddingHorizontal: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: themes.colors["borda"],
        backgroundColor: themes.colors["bege-claro"],
    },
})