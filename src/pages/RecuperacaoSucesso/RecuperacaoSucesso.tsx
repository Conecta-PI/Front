import React from "react"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import Button from "../../components/Button/Button"
import RecuperacaoCard from "../../components/RecuperacaoCard/RecuperacaoCard"
import RecuperacaoHeader from "../../components/RecuperacaoHeader/RecuperacaoHeader"
import type { RootStackParamList } from "../../routes"
import { themes } from "../../global/themes"
import { style } from "./style"

export default function RecuperacaoSucesso() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    return (
        <View style={style.container}>
            <RecuperacaoHeader semVoltar />
            <RecuperacaoCard>
                <View style={style.conteudo}>
                    <View style={style.icone}>
                        <Ionicons name="checkmark" size={42} color={themes.colors["sucesso"]} />
                    </View>
                    <Text style={style.titulo}>Senha redefinida!</Text>
                    <Text style={style.descricao}>
                        Sua senha foi alterada com sucesso. Use{"\n"}a nova senha para entrar no Conecta.
                    </Text>
                </View>
                <Button texto="Voltar para o login" onPress={() => navigation.replace("Login")} />
            </RecuperacaoCard>
        </View>
    )
}
