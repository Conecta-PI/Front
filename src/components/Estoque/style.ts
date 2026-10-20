
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    pill: {
        alignSelf: "flex-start",
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 999,
    },
    texto: {
        ...themes.typography.nav,
    },
})