import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    containerLogo: {
        backgroundColor: themes.colors["azul-escuro"],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 30,
        paddingTop: 30,
        paddingHorizontal: 16,
        gap: 10,
        borderBottomEndRadius: 32,
        borderBottomStartRadius: 32,
    },
    logo: {
        width: 130,
        height: 130,
    },
    textos: {
        flexShrink: 1,
    },
    nome: {
        color: themes.colors.branco,
    },
    descricao: {
        ...themes.typography.apoio,
        color: themes.colors["borda"],
        marginTop: 4,
    },

    containerInicio: {
        backgroundColor: themes.colors["azul-escuro"],
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 24,
        gap: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    topoInicio: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    textosInicio: {
        flex: 1,
    },
    negocio: {
        ...themes.typography.apoio,
        color: themes.colors["dourado"],
    },
    saudacao: {
        ...themes.typography.titulo1,
        color: themes.colors["branco"],
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: themes.colors["branco"],
        alignItems: "center",
        justifyContent: "center",
    },
    inicial: {
        ...themes.typography.botao,
        color: themes.colors["azul-escuro"],
    },

    busca: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: themes.colors["branco"],
    },
    campoBusca: {
        flex: 1,
        ...themes.typography.apoio,
        color: themes.colors["texto"],
        paddingVertical: 0,
    },

    containerBarra: {
        backgroundColor: themes.colors["azul-escuro"],
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 20,
        gap: 16,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    topoBarra: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    tituloBarra: {
        ...themes.typography.titulo3,
        color: themes.colors["branco"],
        flex: 1,
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

    categoriasScroll: {
        flexGrow: 0,
    },
    categorias: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 999,
    },
    chipAtivo: {
        backgroundColor: themes.colors["marrom-suave"],
    },
    chipTexto: {
        ...themes.typography.nav,
        color: themes.colors["texto"],
    },
    chipTextoAtivo: {
        color: themes.colors["branco"],
    },
})