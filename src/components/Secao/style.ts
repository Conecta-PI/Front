
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: { gap: 12 },
    titulo: {
        ...themes.typography.titulo3,
        color: themes.colors["texto"],
    },
})