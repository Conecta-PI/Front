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
    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 4,
    },
    chip: {
        borderColor: themes.colors["borda"],
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    chipSelecionado: {
        backgroundColor: themes.colors["fundo-de-sucesso"],
        borderColor: themes.colors["sucesso"],
    },
    chipTexto: {
        ...themes.typography.apoio,
        color: themes.colors["texto"],
    },
    resumo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    resumoValor: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    trocoRotulo: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    troco: {
        ...themes.typography.titulo3,
        color: themes.colors["sucesso"],
    },
    instrucoes: {
        gap: 8,
        marginTop: 4,
    },
    instrucao: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    numero: {
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["dourado"],
    },
    numeroTexto: {
        ...themes.typography.rotulo,
        color: themes.colors["azul-escuro"],
    },
    instrucaoTexto: {
        ...themes.typography.apoio,
        color: themes.colors["texto"],
        flex: 1,
    },
})
