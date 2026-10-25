import React, { useRef, useState } from "react"
import {
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native"
import type { ScrollViewInstance } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { style } from "./style"
import Header from "../../components/Header/Header"
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import type { RootStackParamList } from "../../routes"
import { autenticarResponsavel } from "../../services/auth"

export default function Login() {
    const insets = useSafeAreaInsets()
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const scrollRef = useRef<ScrollViewInstance>(null)
    const alturaHeader = useRef(0)

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState<string | null>(null)
    const [carregando, setCarregando] = useState(false)

    function rolarParaFormulario() {
        scrollRef.current?.scrollTo({ y: alturaHeader.current, animated: true })
    }

    async function entrar() {
        setErro(null)
        setCarregando(true)
        try {
            await autenticarResponsavel(email.trim(), senha)
            navigation.replace("Main")
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível entrar.")
        } finally {
            setCarregando(false)
        }
    }

    function criarConta() {
        navigation.navigate("Cadastro")
    }

    function esqueciSenha() {
        navigation.navigate("RecuperarSenha")
    }

    return (
        <KeyboardAvoidingView style={style.container} behavior="padding">
            <View style={[style.statusBarFundo, { height: insets.top }]} />

            <ScrollView
                ref={scrollRef}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{ paddingTop: insets.top }}
                    onLayout={(e) => {
                        alturaHeader.current = e.nativeEvent.layout.height
                    }}
                >
                    <Header tipo="boasVindas" />
                </View>

                <View style={[style.area, { paddingBottom: 16 + insets.bottom }]}>
                    <View style={style.card}>
                        <View style={style.cabecalho}>
                            <Text style={style.titulo}>Entrar na conta</Text>
                            <Text style={style.subtitulo}>
                                Use seu e-mail e senha cadastrados para acessar o painel.
                            </Text>
                        </View>

                        <Input
                            tipo="email"
                            label="E-mail"
                            placeholder="Insira seu e-mail"
                            value={email}
                            onChangeText={setEmail}
                            onFocus={rolarParaFormulario}
                        />

                        <View>
                            <Input
                                tipo="senha"
                                label="Senha"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChangeText={setSenha}
                                onFocus={rolarParaFormulario}
                            />

                            <Pressable
                                onPress={esqueciSenha}
                                hitSlop={8}
                                style={{ marginTop: 8 }}
                            >
                                <Text style={style.esqueci}>Esqueci minha senha</Text>
                            </Pressable>
                        </View>

                        {erro && <Text style={style.erroAutenticacao}>{erro}</Text>}
                        <Button
                            texto={carregando ? "Entrando..." : "Entrar"}
                            onPress={entrar}
                            disabled={carregando}
                        />

                        <View style={style.divisor}>
                            <View style={style.linha} />
                            <Text style={style.ou}>ou</Text>
                            <View style={style.linha} />
                        </View>

                        <Button texto="Criar conta" cor="bege-claro" onPress={criarConta} />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}