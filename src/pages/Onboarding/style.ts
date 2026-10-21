import { StyleSheet } from "react-native"

import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors["bege-claro"],
    },

    content: {
        flex: 1,
        paddingHorizontal: 16,
    },

    topo: {
        height: 48,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    voltar: {
        width: 40,
        height: 40,
        alignItems: "flex-start",
        justifyContent: "center",
    },

    pular: {
        ...themes.typography.rotulo,
        color: themes.colors["marrom-suave"],
    },

    corpo: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },

    ilustracao: {
        width: 156,
        height: 156,
        borderRadius: 78,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["branco"],
    },

    textos: {
        width: "100%",
        alignItems: "center",
        marginTop: 48,
    },

    titulo: {
        ...themes.typography.titulo1,
        color: themes.colors["texto"],
        textAlign: "center",
    },

    descricao: {
        ...themes.typography.apoio,
        color: themes.colors["marrom-suave"],
        textAlign: "center",
        lineHeight: 21,
        marginTop: 8,
        maxWidth: 310,
    },

    indicadores: {
        height: 28,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
    },

    indicador: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#C9D8DC",
    },

    indicadorAtivo: {
        width: 20,
        backgroundColor: themes.colors["dourado"],
    },

    rodape: {
        paddingBottom: 16,
        paddingTop: 12,
    },

    botao: {
        height: 48,
    },
})
