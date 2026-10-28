
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    raiz: {
        flex: 1,
    },
    posicao: {
        flex: 1,
        justifyContent: "flex-end",
    },
    folha: {
        maxHeight: "85%",
        gap: 12,
        paddingTop: 20,
        paddingHorizontal: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: themes.colors["branco"],
        elevation: 12,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -4 },
    },
    cabecalho: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    titulo: {
        ...themes.typography.titulo3,
        color: themes.colors["texto"],
        flex: 1,
    },
    descricao: {
        ...themes.typography.apoio,
        color: themes.colors["marrom-suave"],
    },
    scroll: {
        flexShrink: 1,
    },
    conteudo: {
        gap: 12,
        paddingTop: 4,
    },
})