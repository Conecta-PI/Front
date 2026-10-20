
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        backgroundColor: themes.colors["branco"],
    },
    pressionado: {
        backgroundColor: themes.colors["bege-claro"],
    },
    icone: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["campo-desabilitado"],
    },
    textos: { flex: 1 },
    titulo: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
    },
    descricao: {
        ...themes.typography.apoio,
        color: themes.colors["marrom-suave"],
    },
})