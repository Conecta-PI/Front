
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    borda: {
        borderBottomWidth: 1,
        borderBottomColor: themes.colors["borda"],
    },
    pressionado: {
        backgroundColor: themes.colors["bege-claro"],
    },
    icone: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["campo-desabilitado"],
    },
    texto: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
        flex: 1,
    },
})