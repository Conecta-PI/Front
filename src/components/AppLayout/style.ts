import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors["bege-claro"],
    },

    statusBarFundo: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: themes.colors["azul-escuro"],
    },

    content: {
        flex: 1,
    },
})