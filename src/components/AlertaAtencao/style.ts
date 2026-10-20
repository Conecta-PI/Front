
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 16,
    },
    pressionado: {
        backgroundColor: themes.colors["campo-desabilitado"],
    },
    icone: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    textos: { flex: 1 },
    titulo: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
    },
    descricao: {
        ...themes.typography.apoio,
    },
})