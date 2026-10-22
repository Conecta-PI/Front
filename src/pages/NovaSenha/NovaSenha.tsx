import React, { useState } from "react"
import { Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import RecuperacaoCard from "../../components/RecuperacaoCard/RecuperacaoCard"
import RecuperacaoHeader from "../../components/RecuperacaoHeader/RecuperacaoHeader"
import type { RootStackParamList } from "../../routes"
import { style } from "./style"

export default function NovaSenha() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [senha, setSenha] = useState("")
    const [confirmacao, setConfirmacao] = useState("")
    const [erroSenha, setErroSenha] = useState("")
    const [erroConfirmacao, setErroConfirmacao] = useState("")

    function redefinir() {
        const novaErroSenha = senha.length < 8 ? "A senha deve ter no mínimo 8 caracteres" : ""
        const novaErroConfirmacao =
            senha !== confirmacao ? "As senhas não coincidem" : ""

        setErroSenha(novaErroSenha)
        setErroConfirmacao(novaErroConfirmacao)

        if (!novaErroSenha && !novaErroConfirmacao) {
            navigation.replace("RecuperacaoSucesso")
        }
    }

    return (
        <View style={style.container}>
            <RecuperacaoHeader />
            <RecuperacaoCard>
                <Text style={style.titulo}>Crie sua nova senha</Text>
                <Text style={style.descricao}>
                    Use pelo menos 8 caracteres, com letras e{"\n"}números.
                </Text>

                <View style={style.formulario}>
                    <Input
                        tipo="senha"
                        label="Nova senha"
                        placeholder="Mínimo de 8 caracteres"
                        value={senha}
                        onChangeText={(valor) => {
                            setSenha(valor)
                            setErroSenha("")
                        }}
                        erro={erroSenha}
                    />
                    <Input
                        tipo="senha"
                        label="Confirmar nova senha"
                        placeholder="Repita a nova senha"
                        value={confirmacao}
                        onChangeText={(valor) => {
                            setConfirmacao(valor)
                            setErroConfirmacao("")
                        }}
                        erro={erroConfirmacao}
                    />
                </View>

                <Button texto="Redefinir senha" onPress={redefinir} />
            </RecuperacaoCard>
        </View>
    )
}
