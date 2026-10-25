import React, { useRef, useState } from "react"
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native"
import type { ScrollViewInstance, ViewInstance } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { style } from "./style"
import Header from "../../components/Header/Header"
import Input, { InputProps } from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import Checkbox from "../../components/Checkbox/Checkbox"
import type { RootStackParamList } from "../../routes"
import { cadastrarResponsavel } from "../../services/auth"
type CampoProps = InputProps & {
    aoFocar: (view: ViewInstance | null) => void
}

function Campo({ aoFocar, onFocus, ...props }: CampoProps) {
    const ref = useRef<ViewInstance>(null)

    return (
        <View ref={ref} collapsable={false}>
            <Input
                {...props}
                onFocus={(e) => {
                    onFocus?.(e)
                    aoFocar(ref.current)
                }}
            />
        </View>
    )
}

type Form = {
    nome: string
    email: string
    telefone: string
    senha: string
    confirmar: string
    negocio: string
}

type Erros = Partial<Record<keyof Form | "termos", string>>

export default function Cadastro() {
    const insets = useSafeAreaInsets()
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const scrollRef = useRef<ScrollViewInstance>(null)
    const scrollY = useRef(0)

    const [form, setForm] = useState<Form>({
        nome: "",
        email: "",
        telefone: "",
        senha: "",
        confirmar: "",
        negocio: "",
    })
    const [aceito, setAceito] = useState(false)
    const [erros, setErros] = useState<Erros>({})
    const [erroServidor, setErroServidor] = useState<string | null>(null)
    const [carregando, setCarregando] = useState(false)

    function alterar(campo: keyof Form, valor: string) {
        setForm((f) => ({ ...f, [campo]: valor }))
        setErros((e) => ({ ...e, [campo]: undefined }))
    }

    function rolarParaCampo(view: ViewInstance | null) {
        if (!view) return

        setTimeout(() => {
            view.measureInWindow((_x, y) => {
                scrollRef.current?.scrollTo({
                    y: Math.max(0, scrollY.current + y - insets.top - 24),
                    animated: true,
                })
            })
        }, 150)
    }

    function validar() {
        const novos: Erros = {}

        if (!form.nome.trim()) novos.nome = "Informe seu nome completo"
        if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) novos.email = "Informe um e-mail válido"
        if (form.telefone.replace(/\D/g, "").length < 10) novos.telefone = "Informe um telefone válido"
        if (form.senha.length < 8) novos.senha = "A senha deve ter no mínimo 8 caracteres"
        if (form.confirmar !== form.senha) novos.confirmar = "As senhas não coincidem"
        if (!form.negocio.trim()) novos.negocio = "Informe o nome do seu negócio"
        if (!aceito) novos.termos = "Aceite os termos de uso para continuar"

        setErros(novos)
        return Object.keys(novos).length === 0
    }

    async function criarConta() {
        if (!validar()) return

        setErroServidor(null)
        setCarregando(true)
        try {
            await cadastrarResponsavel({
                nome: form.nome.trim(),
                email: form.email.trim(),
                telefone: form.telefone,
                senha: form.senha,
                negocio: form.negocio.trim(),
            })
            navigation.replace("Main")
        } catch (error) {
            setErroServidor(error instanceof Error ? error.message : "Não foi possível criar a conta.")
        } finally {
            setCarregando(false)
        }
    }

    function abrirTermos() {
        
    }

    function jaTenhoConta() {
        navigation.navigate("Login")
    }

    return (
        <KeyboardAvoidingView style={style.container} behavior="padding">
            <View style={[style.statusBarFundo, { height: insets.top }]} />

            <ScrollView
                ref={scrollRef}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onScroll={(e) => {
                    scrollY.current = e.nativeEvent.contentOffset.y
                }}
                scrollEventThrottle={16}
            >
                <View style={{ paddingTop: insets.top }}>
                    <Header
                        tipo="titulo"
                        titulo="Criar conta"
                        descricao="Cadastre-se e comece a organizar seu negócio com o Conecta."
                    />
                </View>

                <View style={[style.area, { paddingBottom: 16 + insets.bottom }]}>
                    <View style={style.card}>
                        <Campo
                            tipo="texto"
                            label="Nome completo"
                            placeholder="Insira seu nome completo"
                            value={form.nome}
                            onChangeText={(t) => alterar("nome", t)}
                            erro={erros.nome}
                            aoFocar={rolarParaCampo}
                        />

                        <Campo
                            tipo="email"
                            label="E-mail"
                            placeholder="Insira seu e-mail"
                            value={form.email}
                            onChangeText={(t) => alterar("email", t)}
                            erro={erros.email}
                            aoFocar={rolarParaCampo}
                        />

                        <Campo
                            tipo="telefone"
                            label="Telefone"
                            placeholder="(00) 0000-0000"
                            value={form.telefone}
                            onChangeText={(t) => alterar("telefone", t)}
                            erro={erros.telefone}
                            aoFocar={rolarParaCampo}
                        />

                        <Campo
                            tipo="senha"
                            label="Senha"
                            placeholder="Mínimo de 8 caracteres"
                            value={form.senha}
                            onChangeText={(t) => alterar("senha", t)}
                            erro={erros.senha}
                            aoFocar={rolarParaCampo}
                        />

                        <Campo
                            tipo="senha"
                            label="Confirmar senha"
                            placeholder="Repita a senha"
                            value={form.confirmar}
                            onChangeText={(t) => alterar("confirmar", t)}
                            erro={erros.confirmar}
                            aoFocar={rolarParaCampo}
                        />

                        <Campo
                            tipo="texto"
                            label="Nome do negócio"
                            placeholder="Insira o nome do seu negócio"
                            value={form.negocio}
                            onChangeText={(t) => alterar("negocio", t)}
                            erro={erros.negocio}
                            aoFocar={rolarParaCampo}
                        />

                        <View>
                            <Checkbox
                                marcado={aceito}
                                onChange={(v) => {
                                    setAceito(v)
                                    setErros((e) => ({ ...e, termos: undefined }))
                                }}
                                erro={!!erros.termos}
                            >
                                Aceito os{" "}
                                <Text style={style.link} onPress={abrirTermos}>
                                    termos de uso
                                </Text>
                            </Checkbox>

                            {!!erros.termos && (
                                <Text style={style.erroTermos}>{erros.termos}</Text>
                            )}
                        </View>

                        {erroServidor && (
                            <Text style={style.erroTermos}>{erroServidor}</Text>
                        )}
                        <Button
                            texto={carregando ? "Criando conta..." : "Criar conta"}
                            onPress={criarConta}
                            disabled={carregando}
                        />

                        <View style={style.divisor}>
                            <View style={style.linha} />
                            <Text style={style.ou}>ou</Text>
                            <View style={style.linha} />
                        </View>

                        <Button texto="Já tenho conta" cor="bege-claro" onPress={jaTenhoConta} />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}