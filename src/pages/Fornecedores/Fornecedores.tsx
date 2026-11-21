import React, { useCallback, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

import AppLayout from "../../components/AppLayout/AppLayout"
import BottomSheet from "../../components/BottomSheet/"
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import {
    atualizarFornecedor,
    criarFornecedor,
    excluirFornecedor,
    listarFornecedores,
    type Fornecedor,
} from "../../services/fornecedores"

type FormFornecedor = {
    nome: string
    categoria: string
    contato: string
    telefone: string
    email: string
    observacao: string
}

const formVazio: FormFornecedor = {
    nome: "",
    categoria: "",
    contato: "",
    telefone: "",
    email: "",
    observacao: "",
}

export default function Fornecedores() {
    const [dados, setDados] = useState<Fornecedor[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [sheetVisivel, setSheetVisivel] = useState(false)
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [form, setForm] = useState<FormFornecedor>(formVazio)
    const [erros, setErros] = useState<Partial<Record<keyof FormFornecedor, string>>>({})
    const [enviando, setEnviando] = useState(false)

    const carregar = useCallback(() => {
        setCarregando(true)
        setErro(null)
        listarFornecedores()
            .then(setDados)
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar fornecedores."))
            .finally(() => setCarregando(false))
    }, [])

    useFocusEffect(useCallback(() => {
        carregar()
    }, [carregar]))

    function alterar(campo: keyof FormFornecedor, valor: string) {
        setForm((atual) => ({ ...atual, [campo]: valor }))
        setErros((atual) => ({ ...atual, [campo]: undefined }))
    }

    function abrirNovo() {
        setEditandoId(null)
        setForm(formVazio)
        setErros({})
        setSheetVisivel(true)
    }

    function abrirEdicao(item: Fornecedor) {
        setEditandoId(item.id)
        setForm({
            nome: item.nome ?? "",
            categoria: item.categoria ?? "",
            contato: item.contato ?? "",
            telefone: item.telefone ?? "",
            email: item.email ?? "",
            observacao: item.observacao ?? "",
        })
        setErros({})
        setSheetVisivel(true)
    }

    function validar() {
        const novos: Partial<Record<keyof FormFornecedor, string>> = {}
        if (!form.nome.trim()) novos.nome = "Informe o nome do fornecedor"
        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) novos.email = "Informe um e-mail válido"
        setErros(novos)
        return Object.keys(novos).length === 0
    }

    async function salvar() {
        if (enviando || !validar()) return

        const payload = {
            nome: form.nome.trim(),
            categoria: form.categoria.trim() || undefined,
            contato: form.contato.trim() || undefined,
            telefone: form.telefone.trim() || undefined,
            email: form.email.trim() || undefined,
            observacao: form.observacao.trim() || null,
        }

        setEnviando(true)
        try {
            if (editandoId !== null) {
                await atualizarFornecedor(editandoId, payload)
            } else {
                await criarFornecedor(payload)
            }
            setSheetVisivel(false)
            carregar()
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao salvar fornecedor.")
        } finally {
            setEnviando(false)
        }
    }

    function confirmarExclusao(item: Fornecedor) {
        Alert.alert(
            "Excluir fornecedor",
            `Deseja excluir ${item.nome}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await excluirFornecedor(item.id)
                            carregar()
                        } catch (error) {
                            Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível excluir o fornecedor.")
                        }
                    },
                },
            ]
        )
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Fornecedores" }}>
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
                <Button texto="Adicionar fornecedor" icone="add" onPress={abrirNovo} style={{ marginBottom: 12 }} />

                {carregando ? (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color="#A7702A" />
                    </View>
                ) : erro ? (
                    <Text style={{ color: "#B42318", textAlign: "center" }}>{erro}</Text>
                ) : (
                    <FlatList
                        data={dados}
                        keyExtractor={(item) => String(item.id)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 24 }}
                        ListEmptyComponent={<Text style={{ color: "#6B7280", textAlign: "center", marginTop: 24 }}>Nenhum fornecedor encontrado.</Text>}
                        renderItem={({ item }) => (
                            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                                <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.nome}</Text>
                                {!!item.categoria && <Text style={{ color: "#6B7280", marginTop: 6 }}>{item.categoria}</Text>}
                                {!!item.contato && <Text style={{ color: "#6B7280", marginTop: 2 }}>Contato: {item.contato}</Text>}
                                {!!item.telefone && <Text style={{ color: "#6B7280", marginTop: 2 }}>{item.telefone}</Text>}
                                {!!item.email && <Text style={{ color: "#6B7280", marginTop: 2 }}>{item.email}</Text>}

                                <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                                    <Button texto="Editar" icone="create-outline" variante="contorno" style={{ flex: 1 }} onPress={() => abrirEdicao(item)} />
                                    <Button texto="Excluir" icone="trash-outline" variante="contorno" cor="erro" style={{ flex: 1 }} onPress={() => confirmarExclusao(item)} />
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>

            <BottomSheet
                visivel={sheetVisivel}
                onFechar={() => {
                    if (!enviando) setSheetVisivel(false)
                }}
                titulo={editandoId !== null ? "Editar fornecedor" : "Novo fornecedor"}
                descricao="Preencha os dados do fornecedor."
            >
                <Input tipo="texto" label="Nome" placeholder="Nome do fornecedor" value={form.nome} onChangeText={(valor) => alterar("nome", valor)} erro={erros.nome} />
                <Input tipo="texto" label="Categoria" placeholder="Ex.: Embalagens" value={form.categoria} onChangeText={(valor) => alterar("categoria", valor)} />
                <Input tipo="texto" label="Contato" placeholder="Nome do contato" value={form.contato} onChangeText={(valor) => alterar("contato", valor)} />
                <Input tipo="telefone" label="Telefone" placeholder="(00) 00000-0000" value={form.telefone} onChangeText={(valor) => alterar("telefone", valor)} />
                <Input tipo="email" label="E-mail" placeholder="fornecedor@email.com" value={form.email} onChangeText={(valor) => alterar("email", valor)} erro={erros.email} />
                <Input tipo="texto" label="Observação" placeholder="Informações adicionais" value={form.observacao} onChangeText={(valor) => alterar("observacao", valor)} multiline />

                <Button
                    texto={enviando ? "Salvando..." : editandoId !== null ? "Salvar alterações" : "Cadastrar fornecedor"}
                    disabled={enviando}
                    onPress={salvar}
                />
            </BottomSheet>
        </AppLayout>
    )
}

