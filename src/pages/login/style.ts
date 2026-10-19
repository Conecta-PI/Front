import { StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const style = StyleSheet.create({
    container: {
        backgroundColor: "green",
        flex: 1
    },
    main: {
        backgroundColor: "red",
        marginTop: 15
    },
    titulo: {
        color: themes.colors.texto
    }
})