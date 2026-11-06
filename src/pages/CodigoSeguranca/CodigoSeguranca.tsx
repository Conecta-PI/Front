import React, { useRef, useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import type { TextInputInstance } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RouteProp } from "@react-navigation/native"

import Button from "../../components/Button/Button"
import RecuperacaoCard from "../../components/RecuperacaoCard/RecuperacaoCard"
import RecuperacaoHeader from "../../components/RecuperacaoHeader/RecuperacaoHeader"
import type { RootStackParamList } from "../../routes"
import { solicitarCodigoRecuperacao, verificarCodigoRecuperacao } from "../../services/auth"
import { style } from "./style"


export default function CodigoSeguranca() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const { params } = useRoute<RouteProp<RootStackParamList, "CodigoSeguranca">>()
    const [codigo, setCodigo] = useState(["", "", "", "", "", ""])
    const [erro, setErro] = useState("")
    const [mensagem, setMensagem] = useState(params.mensagem ?? "")
    const [carregando, setCarregando] = useState(false)
    const refs = useRef<Array<TextInputInstance | null>>([])

    function alterarCodigo(valor: string, indice: number) {
        const digito = valor.replace(/\D/g, "").slice(-1)
        const novoCodigo = [...codigo]
        novoCodigo[indice] = digito
        setCodigo(novoCodigo)
        setErro("")
        if (digito && indice < 5) refs.current[indice + 1]?.focus()
    }


    async function verificar() {
        if (carregando) return
        if (!codigo.every(Boolean)) {
            setErro("Informe os 6 dígitos do código")
            return
        }

        const codigoCompleto = codigo.join("")
        setCarregando(true)
        try {
            const valido = await verificarCodigoRecuperacao(params.email, codigoCompleto)
            if (valido) {
                navigation.navigate("NovaSenha", { email: params.email, codigo: codigoCompleto })
            } else {
                setErro("Código inválido. Confira e tente novamente.")
            }
        } catch (e) {
            setErro(e instanceof Error ? e.message : "Não foi possível verificar o código.")
        } finally {
            setCarregando(false)
        }
    }

    async function reenviar() {
        try {
            setMensagem(await solicitarCodigoRecuperacao(params.email))
            setCodigo(["", "", "", "", "", ""])
            setErro("")
        } catch (e) {
            setErro(e instanceof Error ? e.message : "Não foi possível reenviar o código.")
        }
    }

    return (
        <View style={style.container}>
            <RecuperacaoHeader />
            <RecuperacaoCard>
                <Text style={style.titulo}>Código de segurança</Text>
                <Text style={style.descricao}>
                    Digite o código de 6 dígitos enviado{"\n"}para:
                </Text>
                <Text style={style.contato}>{params.email}</Text>

                <View style={style.codigo}>
                    {codigo.map((digito, indice) => (
                        <TextInput
                            key={indice}
                            ref={(ref) => { refs.current[indice] = ref }}
                            value={digito}
                            onChangeText={(valor) => alterarCodigo(valor, indice)}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === "Backspace" && !codigo[indice] && indice > 0) {
                                    refs.current[indice - 1]?.focus()
                                }
                            }}
                            keyboardType="number-pad"
                            maxLength={1}
                            style={[style.digito, indice === 0 && style.digitoAtivo]}
                            textAlign="center"
                            accessibilityLabel={`Dígito ${indice + 1} do código`}
                        />
                    ))}
                </View>

                {!!mensagem && <Text style={style.descricao}>{mensagem}</Text>}
                {!!erro && <Text style={style.descricao}>{erro}</Text>}

                <Pressable onPress={reenviar} hitSlop={8} style={style.reenviar}>
                    <Text style={style.reenviarTexto}>Reenviar código</Text>
                </Pressable>

                <Button texto={carregando ? "Verificando..." : "Verificar"} onPress={verificar} style={style.botao} />
            </RecuperacaoCard>
        </View>
    )
}
