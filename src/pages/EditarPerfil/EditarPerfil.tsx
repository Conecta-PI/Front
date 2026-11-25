import React, { useEffect, useState } from "react"
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import CampoFoto from "../../components/CampoFoto/"
import Input from "../../components/Input/Input"
import { buscarPerfil, atualizarPerfil } from "../../services/perfil"
import { resolverUrlImagem } from "../../services/api"
import type { RootStackParamList } from "../../routes"
import { style } from "./style"

export default function EditarPerfil() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const insets = useSafeAreaInsets()

    const [nome, setNome] = useState("")
    const [negocio, setNegocio] = useState("")
    const [telefone, setTelefone] = useState("")
    const [email, setEmail] = useState("")
    const [cnpj, setCnpj] = useState("")
    const [cnpjOriginal, setCnpjOriginal] = useState("")
    const [chavePix, setChavePix] = useState("")
    const [foto, setFoto] = useState<string | null>(null)
    const [fotoOriginal, setFotoOriginal] = useState<string | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        let ativo = true
        buscarPerfil()
            .then((perfil) => {
                if (!ativo) return
                setNome(perfil.nome ?? "")
                setNegocio(perfil.negocio ?? "")
                setTelefone(perfil.telefone ?? "")
                setEmail(perfil.email ?? "")
                const cnpjCarregado = perfil.cnpj ?? ""
                setCnpj(cnpjCarregado)
                setCnpjOriginal(cnpjCarregado)
                setChavePix(perfil.chavePix ?? "")
                const fotoPerfil = resolverUrlImagem(perfil.foto) ?? null
                setFoto(fotoPerfil)
                setFotoOriginal(fotoPerfil)
            })
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar perfil."))
            .finally(() => {
                if (ativo) setCarregando(false)
            })
        return () => { ativo = false }
    }, [])

    async function salvar() {
        if (!nome.trim()) {
            setErro("Informe seu nome")
            return
        }
        if (!negocio.trim()) {
            setErro("Informe o nome do negócio")
            return
        }
        if (email && !/^\S+@\S+\.\S+$/.test(email.trim())) {
            setErro("Informe um e-mail válido")
            return
        }
        const cnpjNormalizado = cnpj.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
        const cnpjOriginalNormalizado = cnpjOriginal
            .replace(/[^a-zA-Z0-9]/g, "")
            .toUpperCase()

        const cnpjFoiAlterado = cnpjNormalizado !== cnpjOriginalNormalizado

        if (
            cnpjFoiAlterado &&
            cnpjNormalizado !== "" &&
            !/^[A-Z0-9]{12}[0-9]{2}$/.test(cnpjNormalizado)
        ) {
            setErro("O CNPJ deve conter 12 letras ou números e 2 números no final.")
            return
        }

        setErro(null)
        setSalvando(true)

        try {
            let fotoParaEnviar: string | null | undefined

            if (foto === null) {
                fotoParaEnviar = null
            } else if (foto !== fotoOriginal) {
                fotoParaEnviar = foto
            } else {
                fotoParaEnviar = undefined
            }

            await atualizarPerfil({
                nome: nome.trim(),
                negocio: negocio.trim(),
                telefone: telefone.trim(),
                email: email.trim(),
                ...(cnpjFoiAlterado ? { cnpj: cnpj.trim() } : {}),
                chavePix: chavePix.trim(),
                ...(fotoParaEnviar !== undefined ? { foto: fotoParaEnviar } : {}),
            })

            navigation.goBack()
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível salvar o perfil.")
        } finally {
            setSalvando(false)
        }
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Editar perfil" }}>
            <KeyboardAvoidingView style={style.flex} behavior="padding">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={[style.conteudo, { paddingBottom: 24 + insets.bottom }]}
                >
                    {carregando ? (
                        <Text style={style.estado}>Carregando perfil...</Text>
                    ) : (
                        <>
                            <CampoFoto
                                label="Foto de perfil"
                                tituloModal="Foto de perfil"
                                uri={foto}
                                onChange={setFoto}
                                retornarDataUrl
                            />
                            <Input tipo="texto" label="Nome" placeholder="Seu nome" value={nome} onChangeText={(valor) => { setNome(valor); setErro(null) }} />
                            <Input tipo="texto" label="Nome do negócio" placeholder="Nome do seu negócio" value={negocio} onChangeText={(valor) => { setNegocio(valor); setErro(null) }} />
                            <Input tipo="telefone" label="Telefone" placeholder="(00) 00000-0000" value={telefone} onChangeText={setTelefone} />
                            <Input tipo="email" label="E-mail" placeholder="seu@email.com" value={email} onChangeText={(valor) => { setEmail(valor); setErro(null) }} />
                            <Input tipo="cnpj" label="CNPJ" placeholder="00.000.000/0000-00" value={cnpj} onChangeText={(valor) => { setCnpj(valor); setErro(null) }} />
                            <Input tipo="texto" label="Chave PIX" placeholder="CPF, e-mail, telefone ou chave aleatória" value={chavePix} onChangeText={setChavePix} />
                            {!!erro && <Text style={style.erro}>{erro}</Text>}
                            <Button texto={salvando ? "Salvando..." : "Salvar alterações"} disabled={salvando || carregando} onPress={salvar} />
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </AppLayout>
    )
}
