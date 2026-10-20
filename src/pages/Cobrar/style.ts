
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    lista: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
        gap: 12,
    },
    coluna: {
        justifyContent: "space-between",
    },
    vazio: {
        ...themes.typography.corpo,
        color: themes.colors["texto-secundario"],
        textAlign: "center",
        marginTop: 40,
    },
    formulario: {
        gap: 20,
        marginTop: 12,
    },
    bloco: {
        gap: 10,
    },
    rotulo: {
        ...themes.typography.rotulo,
        color: themes.colors["marrom-suave"],
    },
    linhaPagamento: {
        flexDirection: "row",
        gap: 10,
    },
})