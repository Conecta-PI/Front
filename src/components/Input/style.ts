import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        width: "100%",
    },

    label: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
        marginBottom: 8,
    },

    field: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: themes.colors["branco"],
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 48,
    },

    fieldFocado: {
        borderColor: themes.colors["dourado"],
    },

    fieldErro: {
        borderColor: themes.colors["erro"],
    },

    input: {
        flex: 1,
        ...themes.typography.corpo,
        color: themes.colors["texto"],
        paddingVertical: 0,
    },

    eye: {
        paddingLeft: 12,
    },

    erro: {
        ...themes.typography.apoio,
        color: themes.colors["erro"],
        marginTop: 6,
    },
})