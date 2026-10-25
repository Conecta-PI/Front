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
    nomeInicio: {
        ...themes.typography.titulo2,
        color: themes.colors["branco"],
        flexShrink: 1,
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
        // ---------- tipo perfil ----------
    containerPerfil: {
        backgroundColor: themes.colors["azul-escuro"],
        alignItems: "center",
        paddingTop: 16,
        paddingBottom: 28,
        paddingHorizontal: 16,
        gap: 6,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    avatarGrande: {
        width: 84,
        height: 84,
        borderRadius: 42,
        marginBottom: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["branco"],
        borderWidth: 3,
        borderColor: themes.colors["dourado"],
    },
    inicialGrande: {
        ...themes.typography.valorGrande,
        color: themes.colors["azul-escuro"],
    },
    editarPerfil: {
        position: "absolute",
        right: -4,
        bottom: -4,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["dourado"],
        borderWidth: 2,
        borderColor: themes.colors["azul-escuro"],
    },
    nomeLinha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    nomePerfil: {
        ...themes.typography.titulo2,
        color: themes.colors["branco"],
        flexShrink: 1,
    },
    negocioPerfil: {
        ...themes.typography.apoio,
        color: themes.colors["borda"],
    },
})