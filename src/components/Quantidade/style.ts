
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 36,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: themes.colors["campo-desabilitado"],
    },
    valor: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    desabilitado: {
        opacity: 0.3,
    },
})