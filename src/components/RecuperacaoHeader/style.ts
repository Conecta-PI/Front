import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        height: 64,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        backgroundColor: themes.colors["azul-escuro"],
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
    },
    voltar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["dourado"],
    },
    voltarPressionado: {
        backgroundColor: themes.colors["dourado-pressionado"],
    },
    titulo: {
        ...themes.typography.titulo3,
        color: themes.colors["branco"],
    },
})
