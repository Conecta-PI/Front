import { StyleSheet } from "react-native"

import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors["azul-escuro"],
    },
    panel: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["azul-escuro"],
    },
    logoArea: {
        alignItems: "center",
        justifyContent: "center",
    },
    nomeLinha: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        color: themes.colors["branco"],
        fontFamily: "Poppins_600SemiBold",
        letterSpacing: 0,
        includeFontPadding: false,
    },
    bolinha: {
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: "#D9A441",
    },
})