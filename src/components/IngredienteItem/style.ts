
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        alignSelf: "stretch",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        backgroundColor: themes.colors["branco"],
    },
    texto: {
        ...themes.typography.apoio,
        color: themes.colors["texto"],
        flex: 1,
    },
})