import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const BAR_HEIGHT = 68
export const BUTTON_SIZE = 56
export const BUTTON_OVERFLOW = 28 // quanto o botão central "sobe" acima da barra
export const TOTAL_HEIGHT = BAR_HEIGHT + BUTTON_OVERFLOW

export const style = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
    },

    bar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: themes.colors["azul-escuro"],
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    row: {
        flexDirection: "row",
        paddingHorizontal: 8,
    },

    // o item ocupa a altura total (inclusive a parte acima da barra),
    // assim o botão central inteiro fica clicável no Android
    item: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
    },

    label: {
        ...themes.typography.nav,
        marginTop: 4,
    },

    labelAtivo: {
        fontFamily: "Poppins_600SemiBold",
        color: themes.colors["branco"],
    },

    labelInativo: {
        color: themes.colors["borda"],
    },

    dot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        marginTop: 3,
        backgroundColor: themes.colors["dourado"],
    },

    // mantém o espaço reservado para não "pular" o layout
    dotOculto: {
        opacity: 0,
    },

    centerButton: {
        position: "absolute",
        top: 0,
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: themes.colors["dourado"],
        borderWidth: 3,
        borderColor: themes.colors["bege-claro"],
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },

    centerButtonPressed: {
        backgroundColor: themes.colors["dourado-pressionado"],
    },
})