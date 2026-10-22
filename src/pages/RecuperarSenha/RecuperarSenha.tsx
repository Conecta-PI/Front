import React from "react"
import { Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import Button from "../../components/Button/Button"
import RecuperacaoCard from "../../components/RecuperacaoCard/RecuperacaoCard"
import RecuperacaoHeader from "../../components/RecuperacaoHeader/RecuperacaoHeader"
import type { RootStackParamList } from "../../routes"
import { style } from "./style"

export default function RecuperarSenha() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    function escolherCanal() {
        navigation.navigate("CodigoSeguranca", { contato: "p***@docesnaturais.com" })
    }

    return (
        <View style={style.container}>
            <RecuperacaoHeader />
            <RecuperacaoCard>
                <View style={style.introducao}>
                    <Text style={style.titulo}>Como deseja receber o{"\n"}código de verificação?</Text>
                    <Text style={style.descricao}>
                        Escolha um dos meios abaixo para recuperar sua senha.
                    </Text>
                </View>

                <Button texto="E-mail" onPress={escolherCanal} />
                <Text style={style.ajuda}>Enviaremos o código para o e-mail{"\n"}cadastrado na sua conta.</Text>

                <Button texto="SMS" onPress={escolherCanal} />
                <Text style={style.ajuda}>Enviaremos o código por mensagem de texto{"\n"}para o celular cadastrado.</Text>
            </RecuperacaoCard>
        </View>
    )
}
