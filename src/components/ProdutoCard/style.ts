
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    card: {
        width: "48%",
        borderRadius: 20,
        backgroundColor: themes.colors["branco"],
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    pressionado: {
        backgroundColor: themes.colors["bege-claro"],
    },
    imagem: {
        width: "100%",
        height: 100,
    },
    semImagem: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["campo-desabilitado"],
    },
    textos: {
        padding: 12,
        gap: 6,
    },
    nome: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
        minHeight: 40, 
    },
    preco: {
        ...themes.typography.botao,
        color: themes.colors["texto"],
    },
})