// src/components/AtalhoRapido/style.ts
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    card: {
        flex: 1,
        alignItems: "center",
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        backgroundColor: themes.colors["branco"],
    },
    cardPressionado: {
        backgroundColor: themes.colors["bege-claro"],
    },
    circulo: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["campo-desabilitado"],
    },
    texto: {
        ...themes.typography.nav,
        color: themes.colors["texto"],
        textAlign: "center",
        minHeight: 32, // reserva 2 linhas, deixando todos os cards com a mesma altura
    },
})