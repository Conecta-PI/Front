import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: { flex: 1, backgroundColor: themes.colors["bege-claro"] },
    introducao: { marginBottom: 42 },
    titulo: { ...themes.typography.titulo1, color: themes.colors["texto"] },
    descricao: { ...themes.typography.apoio, color: themes.colors["marrom-suave"], marginTop: 6 },
    ajuda: {
        ...themes.typography.apoio,
        color: themes.colors["texto-secundario"],
        lineHeight: 21,
        marginTop: 6,
        marginBottom: 22,
    },
})
