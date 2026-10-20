
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    card: {
        backgroundColor: themes.colors["azul-escuro"],
        borderRadius: 24,
        padding: 20,
        gap: 16,
    },
    titulo: {
        ...themes.typography.titulo3,
        color: themes.colors["branco"],
    },
    valor: {
        ...themes.typography.valorGrande,
        color: themes.colors["branco"],
    },
    botoes: {
        flexDirection: "row",
        gap: 12,
    },
    botao: { flex: 1 },
    rodape: {
        flexDirection: "row",
        gap: 40,
        paddingHorizontal: 4,
    },
    info: { gap: 2 },
    rotulo: {
        ...themes.typography.apoio,
        color: themes.colors["borda"],
    },
    numero: {
        ...themes.typography.botao,
        color: themes.colors["branco"],
    },
})