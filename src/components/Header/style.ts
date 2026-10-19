import { Dimensions, StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const style = StyleSheet.create({
    container: {
        backgroundColor: themes.colors["azul-escuro"],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 30,
        paddingTop: 30,
        gap: 10,
        borderBottomEndRadius: 32,
        borderBottomStartRadius: 32
    },
    logo: {
        width: 130,
        height: 130,
    },
    nome: {
        color: themes.colors.branco
    }
})