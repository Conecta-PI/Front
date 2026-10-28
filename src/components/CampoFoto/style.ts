
import { StyleSheet } from "react-native"
import { themes } from "../../global/themes"

export const style = StyleSheet.create({
    container: {
        gap: 8,
    },
    label: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    caixa: {
        height: 140,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: themes.colors["dourado"],
        overflow: "hidden",
    },
    caixaComFoto: {
        borderStyle: "solid",
        borderColor: themes.colors["borda"],
    },
    pressionado: {
        backgroundColor: themes.colors["campo-desabilitado"],
    },
    texto: {
        ...themes.typography.rotulo,
        color: themes.colors["texto"],
    },
    imagem: {
        width: "100%",
        height: "100%",
    },
    remover: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors["branco"],
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
    },
})