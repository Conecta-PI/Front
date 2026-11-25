
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
        gap: 8,
    },
    cliente: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
        flexShrink: 1,
        textAlign: "right",
    },
    tituloCard: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
    },
    datas: {
        flexDirection: "row",
        gap: 6,
        paddingVertical: 6,
    },
    data: {
        flex: 1,
        height: 54,
        alignItems: "center",
        justifyContent: "center",
        borderColor: themes.colors["borda"],
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: themes.colors["branco"],
        gap: 2,
    },
    dataSelecionada: {
        borderColor: themes.colors["azul-escuro"],
        backgroundColor: themes.colors["bege-claro"],
    },
    dataSemana: {
        ...themes.typography.rotulo,
        color: themes.colors["texto-secundario"],
    },
    dataDia: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
    },
    dataEscolhida: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 2,
    },
    dataEscolhidaValor: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    campoTexto: {
        minHeight: 46,
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: themes.colors["texto"],
        backgroundColor: themes.colors["branco"],
        fontSize: 15,
    },
    opcoesEntrega: {
        flexDirection: "row",
        gap: 10,
        marginTop: 4,
    },
    opcaoEntrega: {
        flex: 1,
        minHeight: 46,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        borderRadius: 8,
        backgroundColor: themes.colors["branco"],
        paddingHorizontal: 12,
    },
    opcaoEntregaSelecionada: {
        borderColor: themes.colors["azul-escuro"],
        backgroundColor: themes.colors["bege-claro"],
    },
    textoOpcaoEntrega: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
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
