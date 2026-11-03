import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    conteudo: {
        padding: 16,
        paddingBottom: 24,
        gap: 12,
    },
    card: {
        backgroundColor: themes.colors["branco"],
        borderColor: themes.colors["borda"],
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        gap: 8,
    },
    rotulo: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
    },
    valor: {
        ...themes.typography.titulo1,
        color: themes.colors["texto"],
    },
    linhaCliente: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cliente: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
    },
    cardPix: {
        backgroundColor: themes.colors["branco"],
        borderColor: themes.colors["borda"],
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        alignItems: "center",
        gap: 10,
    },
    instrucao: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
        textAlign: "center",
        lineHeight: 18,
    },
    codigo: {
        alignSelf: "stretch",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: themes.colors["bege-claro"],
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    codigoTexto: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
        flex: 1,
        fontSize: 10,
    },
    copiar: {
        ...themes.typography.rotulo,
        color: themes.colors["marrom-suave"],
    },
    aviso: {
        backgroundColor: themes.colors["fundo-de-alerta"],
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    avisoTexto: {
        ...themes.typography.apoio,
        color: themes.colors["alerta"],
        fontSize: 12,
        lineHeight: 16,
    },
})
