import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    tela: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    resumoLinha: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },
    resumoCard: {
        flex: 1,
        backgroundColor: themes.colors.branco,
        borderRadius: 14,
        padding: 10,
    },
    resumoRotulo: {
        ...themes.typography.nav,
        color: themes.colors["texto-secundario"],
    },
    resumoValor: {
        ...themes.typography.titulo3,
        marginTop: 2,
    },
    buscaLinha: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },
    buscaCampo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: themes.colors.branco,
        borderRadius: 12,
        paddingHorizontal: 10,
    },
    buscaInput: {
        ...themes.typography.apoio,
        flex: 1,
        height: 44,
        paddingHorizontal: 8,
        color: themes.colors.texto,
    },
    novoBotao: {
        minWidth: 92,
    },
    filtros: {
        flexDirection: "row",
        gap: 6,
        marginBottom: 12,
    },
    filtro: {
        flexGrow: 1,
        paddingVertical: 8,
        paddingHorizontal: 7,
        borderRadius: 10,
        backgroundColor: themes.colors.branco,
    },
    filtroAtivo: {
        backgroundColor: themes.colors.dourado,
    },
    filtroTexto: {
        ...themes.typography.rotulo,
        textAlign: "center",
        color: themes.colors["texto-secundario"],
    },
    filtroTextoAtivo: {
        color: themes.colors.branco,
    },
    centro: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    erro: {
        ...themes.typography.apoio,
        color: themes.colors.erro,
        textAlign: "center",
        marginTop: 24,
    },
    vazio: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
        textAlign: "center",
        marginTop: 24,
    },
    lista: {
        paddingBottom: 24,
    },
    card: {
        backgroundColor: themes.colors.branco,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
    },
    cardTopo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    codigo: {
        ...themes.typography.titulo3,
        color: themes.colors.texto,
    },
    statusBadge: {
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 8,
    },
    statusTexto: {
        ...themes.typography.rotulo,
    },
    cliente: {
        ...themes.typography.rotulo,
        color: themes.colors.texto,
        marginTop: 8,
    },
    detalhe: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
        marginTop: 4,
    },
    acoes: {
        flexDirection: "row",
        gap: 8,
        marginTop: 12,
    },
    acao: {
        flex: 1,
        paddingVertical: 9,
        borderRadius: 10,
    },
    acaoTexto: {
        ...themes.typography.rotulo,
        textAlign: "center",
    },
})
