// src/components/MetricaCard/style.ts
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    card: {
        flex: 1,
        gap: 6,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        backgroundColor: themes.colors["branco"],
    },
    topo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    ponto: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    rotulo: {
        ...themes.typography.apoio,
        fontSize: 13,
        color: themes.colors["texto-secundario"],
    },
    valor: {
        ...themes.typography.botao,
    },
})