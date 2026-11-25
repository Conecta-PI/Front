
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    tela: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    resumoLinha: {
        width: "100%",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 12,
    },

    resumoCard: {
        flex: 1,
        minWidth: 0,
        height: 68,
        backgroundColor: themes.colors.branco,
        borderRadius: 14,
        paddingHorizontal: 4,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    resumoRotulo: {
        ...themes.typography.nav,
        color: themes.colors["texto-secundario"],
        fontSize: 10,
        textAlign: "center",
        width: "100%",
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
        alignItems: "center",
        gap: 8,
        paddingVertical: 8,
        paddingRight: 16,
        marginBottom: 12,
    },
    filtro: {
        flexShrink: 0,
        paddingVertical: 7,
        paddingHorizontal: 13,
        borderWidth: 1,
        borderColor: themes.colors.dourado,
        borderRadius: 999,
        backgroundColor: themes.colors.branco,
    },
    filtroAtivo: {
        backgroundColor: themes.colors.dourado,
        borderColor: themes.colors.dourado,
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
        gap: 8,
    },
    cliente: {
        ...themes.typography.rotulo,
        color: themes.colors.texto,
        flex: 1,
        minWidth: 0,
    },
    codigo: {
        ...themes.typography.nav,
        color: themes.colors["texto-secundario"],
        marginTop: 4,
    },
    statusBadge: {
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 8,
        flexShrink: 0,
        maxWidth: 120,
    },
    statusTexto: {
        ...themes.typography.nav,
        fontWeight: "600",
    },
    detalhe: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
        marginTop: 6,
    },
    acoes: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        marginTop: 12,
    },
    acao: {
        flex: 1,
        minWidth: 0,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 3,
        paddingVertical: 10,
        borderRadius: 10,
    },
    acaoTexto: {
        ...themes.typography.nav,
        fontSize: 11,
        fontWeight: "600",
        textAlign: "center",
    },
})
