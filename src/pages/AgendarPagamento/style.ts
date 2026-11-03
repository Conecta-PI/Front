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
