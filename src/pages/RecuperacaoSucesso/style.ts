import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: { flex: 1, backgroundColor: themes.colors["bege-claro"] },
    conteudo: { flex: 1, alignItems: "center", justifyContent: "center" },
    icone: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["fundo-de-sucesso"],
        marginBottom: 18,
    },
    titulo: { ...themes.typography.titulo1, color: themes.colors["texto"] },
    descricao: {
        ...themes.typography.apoio,
        color: themes.colors["marrom-suave"],
        lineHeight: 21,
        textAlign: "center",
        marginTop: 8,
    },
})
