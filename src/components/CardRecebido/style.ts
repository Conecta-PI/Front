
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
    resumo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    contador: {
        alignItems: "flex-end",
        gap: 2,
    },
    contadorNumero: {
        ...themes.typography.botao,
        color: themes.colors["branco"],
    },
    contadorRotulo: {
        ...themes.typography.apoio,
        color: themes.colors["branco"],
    },
    botoes: {
        flexDirection: "row",
        gap: 12,
    },
    botao: { flex: 1 },
    rodape: {
        flexDirection: "row",
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