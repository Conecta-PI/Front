import React, { useRef, useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RouteProp } from "@react-navigation/native"

import Button from "../../components/Button/Button"
import RecuperacaoCard from "../../components/RecuperacaoCard/RecuperacaoCard"
import RecuperacaoHeader from "../../components/RecuperacaoHeader/RecuperacaoHeader"
import type { RootStackParamList } from "../../routes"
import { style } from "./style"

function formatarContato(contato?: string) {
    if (!contato) return "p***@docesnaturais.com"
    if (!contato.includes("@")) {
        const telefone = contato.replace(/\D/g, "")
        if (telefone.length === 11) {
            return `(${telefone.slice(0, 2)}) *****-${telefone.slice(7)}`
        }
    }

    return contato
}

export default function CodigoSeguranca() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const { params } = useRoute<RouteProp<RootStackParamList, "CodigoSeguranca">>()
    const [codigo, setCodigo] = useState(["", "", "", ""])
    const refs = useRef<Array<TextInput | null>>([])

    function alterarCodigo(valor: string, indice: number) {
        const digito = valor.replace(/\D/g, "").slice(-1)
        const novoCodigo = [...codigo]
        novoCodigo[indice] = digito
        setCodigo(novoCodigo)
        if (digito && indice < 3) refs.current[indice + 1]?.focus()
    }

    function verificar() {
        if (codigo.every(Boolean)) navigation.navigate("NovaSenha")
    }

    return (
        <View style={style.container}>
            <RecuperacaoHeader />
            <RecuperacaoCard>
                <Text style={style.titulo}>Código de segurança</Text>
                <Text style={style.descricao}>
                    Digite o código de 4 dígitos enviado{"\n"}para:
                </Text>
                <Text style={style.contato}>{formatarContato(params?.contato)}</Text>

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

                <Pressable onPress={() => undefined} hitSlop={8} style={style.reenviar}>
                    <Text style={style.reenviarTexto}>Reenviar código</Text>
                </Pressable>

                <Button texto="Verificar" onPress={verificar} style={style.botao} />
            </RecuperacaoCard>
        </View>
    )
}
