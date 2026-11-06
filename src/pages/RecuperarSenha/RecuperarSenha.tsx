import React, { useState } from "react"
import { Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import RecuperacaoCard from "../../components/RecuperacaoCard/RecuperacaoCard"
import RecuperacaoHeader from "../../components/RecuperacaoHeader/RecuperacaoHeader"
import type { RootStackParamList } from "../../routes"
import { solicitarCodigoRecuperacao } from "../../services/auth"
import { style } from "./style"

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RecuperarSenha() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [email, setEmail] = useState("")
    const [erro, setErro] = useState("")
    const [enviando, setEnviando] = useState(false)

    async function enviarCodigo() {
        const emailLimpo = email.trim()
        if (!EMAIL_VALIDO.test(emailLimpo)) {
            setErro("Informe um e-mail válido")
            return
        }

        setEnviando(true)
        try {
            const mensagem = await solicitarCodigoRecuperacao(emailLimpo)
            navigation.navigate("CodigoSeguranca", { email: emailLimpo, mensagem })
        } catch (e) {
            setErro(e instanceof Error ? e.message : "Não foi possível enviar o código.")
        } finally {
            setEnviando(false)
        }
    }

    return (
        <View style={style.container}>
            <RecuperacaoHeader />
            <RecuperacaoCard>
                <View style={style.introducao}>
                    <Text style={style.titulo}>Recuperar senha</Text>
                    <Text style={style.descricao}>
                        Informe o e-mail da sua conta para receber o código de verificação.
                    </Text>
                </View>

                <Input
                    tipo="email"
                    label="E-mail"
                    placeholder="seu@email.com"
                    value={email}
                    onChangeText={(valor) => {
                        setEmail(valor)
                        setErro("")
                    }}
                    erro={erro}
                />

                <Button texto={enviando ? "Enviando..." : "Enviar código"} onPress={enviarCodigo} />
            </RecuperacaoCard>
        </View>
    )
}
