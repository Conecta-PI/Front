import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    centro: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    vazio: {
        ...themes.typography.corpo,
        color: themes.colors["texto-secundario"],
    },
    conteudo: {
        padding: 16,
        gap: 20,
    },
    imagem: {
        width: "100%",
        height: 220,
        borderRadius: 20,
    },
    semImagem: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["campo-desabilitado"],
    },
    info: {
        gap: 6,
    },
    categoria: {
        ...themes.typography.rotulo,
        color: themes.colors["marrom-suave"],
    },
    preco: {
        ...themes.typography.titulo1,
        color: themes.colors["texto"],
    },
    descricao: {
        ...themes.typography.corpo,
        color: themes.colors["texto-secundario"],
    },
})