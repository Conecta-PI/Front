import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    conteudo: {
        padding: 16,
        gap: 16,
    },
    titulo: {
        ...themes.typography.titulo1,
        color: themes.colors["texto"],
    },
    secao: {
        gap: 6,
    },
    subtitulo: {
        ...themes.typography.titulo3,
        color: themes.colors["texto"],
    },
    texto: {
        ...themes.typography.corpo,
        color: themes.colors["texto-secundario"],
        lineHeight: 22,
    },
})
