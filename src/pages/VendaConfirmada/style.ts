import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    conteudo: {
        alignItems: "center",
        padding: 16,
        paddingBottom: 24,
        gap: 6,
    },
    icone: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["fundo-de-sucesso"],
        marginTop: 6,
    },
    iconeTexto: {
        ...themes.typography.titulo1,
        color: themes.colors["sucesso"],
    },
    titulo: {
        ...themes.typography.titulo2,
        color: themes.colors["texto"],
        textAlign: "center",
        marginTop: 2,
    },
    subtitulo: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
    },
    card: {
        alignSelf: "stretch",
        backgroundColor: themes.colors["branco"],
        borderColor: themes.colors["borda"],
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        gap: 10,
        marginTop: 6,
    },
    negocio: {
        ...themes.typography.titulo3,
        color: themes.colors["texto"],
        textAlign: "center",
    },
    detalheVenda: {
        ...themes.typography.nav,
        color: themes.colors["texto-secundario"],
        textAlign: "center",
    },
    divisor: {
        height: 1,
        backgroundColor: themes.colors["borda"],
        marginVertical: 3,
    },
    itens: {
        minHeight: 34,
        justifyContent: "center",
    },
    itemRotulo: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    itemTexto: {
        ...themes.typography.nav,
        color: themes.colors["texto-secundario"],
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
    valor: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
        textAlign: "right",
    },
    rotuloDestaque: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    valorDestaque: {
        ...themes.typography.titulo3,
    },
    acoes: {
        alignSelf: "stretch",
        gap: 8,
        marginTop: "auto",
    },
})
