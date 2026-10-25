import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    carregando: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    erro: {
        ...themes.typography.corpo,
        color: themes.colors["erro"],
        textAlign: "center",
        paddingHorizontal: 24,
    },
    conteudo: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
        gap: 24,
    },
    linha: {
        flexDirection: "row",
        gap: 8,
    },
    lista: {
        gap: 12,
    },
    listaAlertas: {
        gap: 4,
    },
})