import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    flex: {
        flex: 1,
    },
    conteudo: {
        padding: 16,
        paddingBottom: 24,
        gap: 16,
    },
    bloco: {
        gap: 8,
    },
    linha: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    metade: {
        flex: 1,
    },
    rotulo: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    erro: {
        ...themes.typography.apoio,
        color: themes.colors["erro"],
    },
    mensagem: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
        textAlign: "center",
    },
    estado: {
        gap: 12,
    },

    campoFixo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        backgroundColor: themes.colors["campo-desabilitado"],
    },
    campoFixoTexto: {
        ...themes.typography.corpo,
        color: themes.colors["texto"],
        flex: 1,
    },

    adicionar: {
        alignSelf: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    adicionarTexto: {
        ...themes.typography.botao,
        fontSize: 14,
        color: themes.colors["texto"],
    },

    total: {
        height: 77,
        justifyContent: "center",
        alignItems: "flex-end",
    },
    totalRotulo: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    totalValor: {
        ...themes.typography.titulo2,
        color: themes.colors["texto"],
    },

    opcaoProduto: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        backgroundColor: themes.colors["branco"],
    },
    opcaoPressionada: {
        backgroundColor: themes.colors["bege-claro"],
    },
    opcaoNome: {
        ...themes.typography.rotulo,
        fontFamily: "Poppins_600SemiBold",
        color: themes.colors["texto"],
        flex: 1,
    },
    opcaoPreco: {
        ...themes.typography.apoio,
        color: themes.colors["marrom-suave"],
    },

    rodape: {
        paddingHorizontal: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: themes.colors["borda"],
        backgroundColor: themes.colors["bege-claro"],
    },
})