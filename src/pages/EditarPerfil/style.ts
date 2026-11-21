import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    flex: {
        flex: 1,
    },
    conteudo: {
        padding: 16,
        gap: 16,
    },
    estado: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
        textAlign: "center",
        marginTop: 24,
    },
    erro: {
        ...themes.typography.apoio,
        color: themes.colors.erro,
    },
})
