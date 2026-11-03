import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    conteudo: {
        alignItems: "center",
        padding: 16,
        paddingBottom: 24,
        gap: 8,
    },
    icone: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["fundo-de-alerta"],
        marginTop: 6,
    },
    iconeTexto: {
        ...themes.typography.titulo2,
        color: themes.colors["alerta"],
    },
    titulo: {
        ...themes.typography.titulo2,
        color: themes.colors["texto"],
        textAlign: "center",
        marginTop: 2,
    },
    descricao: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
        textAlign: "center",
        maxWidth: 280,
        lineHeight: 18,
    },
    card: {
        alignSelf: "stretch",
        backgroundColor: themes.colors["branco"],
        borderColor: themes.colors["borda"],
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        gap: 10,
        marginTop: 4,
    },
    linha: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    rotulo: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
    },
    valorLinha: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
        textAlign: "right",
    },
    status: {
        borderRadius: 999,
        backgroundColor: themes.colors["fundo-de-alerta"],
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    statusTexto: {
        ...themes.typography.nav,
        color: themes.colors["alerta"],
    },
    divisor: {
        height: 1,
        backgroundColor: themes.colors["borda"],
        marginVertical: 2,
    },
    itens: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    acoes: {
        alignSelf: "stretch",
        gap: 8,
        marginTop: "auto",
    },
})
