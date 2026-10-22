import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: { flex: 1, backgroundColor: themes.colors["bege-claro"] },
    titulo: { ...themes.typography.titulo1, color: themes.colors["texto"] },
    descricao: { ...themes.typography.apoio, color: themes.colors["marrom-suave"], marginTop: 4 },
    formulario: { gap: 18, marginTop: 20, marginBottom: 32 },
})
