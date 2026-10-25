import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    filtros: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 999,
    },
    chipTexto: {
        ...themes.typography.rotulo,
    },

    chipTodos: { backgroundColor: themes.colors["branco"] },
    chipTextoTodos: { color: themes.colors["texto"] },

    chipPendentes: { backgroundColor: themes.colors["campo-desabilitado"] },
    chipTextoPendentes: { color: themes.colors["marrom-suave"] },

    chipPagos: { backgroundColor: themes.colors["fundo-de-sucesso"] },
    chipTextoPagos: { color: themes.colors["sucesso"] },

    chipAtivo: { backgroundColor: themes.colors["azul-escuro"] },
    chipTextoAtivo: {
        fontFamily: "Poppins_600SemiBold",
        color: themes.colors["branco"],
    },

    lista: {
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 24,
        gap: 12,
    },
    vazio: {
        ...themes.typography.corpo,
        color: themes.colors["texto-secundario"],
        textAlign: "center",
        marginTop: 40,
    },
})