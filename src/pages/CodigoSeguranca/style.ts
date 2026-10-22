import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: { flex: 1, backgroundColor: themes.colors["bege-claro"] },
    titulo: { ...themes.typography.titulo1, color: themes.colors["texto"] },
    descricao: { ...themes.typography.apoio, color: themes.colors["marrom-suave"], marginTop: 4 },
    contato: { ...themes.typography.rotulo, color: themes.colors["texto"], marginTop: 2 },
    codigo: { flexDirection: "row", justifyContent: "space-between", marginTop: 22 },
    digito: {
        width: 38,
        height: 38,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: themes.colors["borda"],
        color: themes.colors["texto"],
        ...themes.typography.titulo2,
        padding: 0,
    },
    digitoAtivo: { borderColor: themes.colors["dourado"] },
    reenviar: { alignSelf: "center", marginTop: 22, marginBottom: 42 },
    reenviarTexto: {
        ...themes.typography.apoio,
        color: themes.colors["marrom-suave"],
        textDecorationLine: "underline",
        fontSize: 14,
    },
    botao: { marginTop: 0 },
})
