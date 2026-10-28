
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    textos: {
        flex: 1,
    },
    titulo: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    descricao: {
        ...themes.typography.nav,
        color: themes.colors["texto-secundario"],
    },
})