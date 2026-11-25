
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import { listarProdutos } from "../../services/produtos"
import { apiGet, apiPatch } from "../../services/api"
import type { Produto } from "../../types/produto"

type Ingrediente = {
    nome?: string
    quantidade?: number
    unidade?: string
}

type Ficha = {
    preparo?: string | null
    rendimento?: string | null
    ingredientes?: (Ingrediente | string)[] | string
}

function normalizarIngredientes(valor: Ficha["ingredientes"]): (Ingrediente | string)[] {
    if (Array.isArray(valor)) {
        return valor
    }

    if (typeof valor === "string") {
        try {
            const dados = JSON.parse(valor)
            return Array.isArray(dados) ? dados : []
        } catch {
            return []
        }
    }

    return []
}

export default function FichaTecnica() {
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [selecionado, setSelecionado] = useState<Produto | null>(null)
    const [ficha, setFicha] = useState<Ficha | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [editando, setEditando] = useState(false)
    const [preparo, setPreparo] = useState("")
    const [rendimento, setRendimento] = useState("")
    const [salvando, setSalvando] = useState(false)

    useEffect(() => {
        listarProdutos()
            .then((lista) => {
                if (!lista.length) {
                    setErro("Nenhum produto cadastrado para exibir a ficha técnica.")
                    return
                }

                setProdutos(lista)
                setSelecionado(lista[0])
            })
            .catch((error: unknown) => {
                setErro(error instanceof Error ? error.message : "Erro ao carregar produtos.")
            })
            .finally(() => setCarregando(false))
    }, [])

    useEffect(() => {
        if (!selecionado) return

        let ativo = true

        setFicha(null)
        setErro(null)
        setEditando(false)

        apiGet<Ficha>(`/produtos/${encodeURIComponent(selecionado.id)}/ficha-tecnica`)
            .then((dados) => {
                console.log("RESPOSTA AO BUSCAR:", dados)

                if (ativo) {
                    const fichaNormalizada: Ficha = {
                        ...dados,
                        ingredientes: normalizarIngredientes(dados.ingredientes),
                    }

                    setFicha(fichaNormalizada)
                    setPreparo(dados.preparo ?? "")
                    setRendimento(dados.rendimento ?? "")
                }
            })
            .catch((error: unknown) => {
                if (ativo) {
                    setErro(error instanceof Error ? error.message : "Erro ao carregar ficha técnica.")
                }
            })

        return () => {
            ativo = false
        }
    }, [selecionado])

    async function salvarFicha() {
        if (!selecionado) return

        setSalvando(true)
        setErro(null)

        try {
            const atualizada = await apiPatch<Ficha>(
                `/produtos/${encodeURIComponent(selecionado.id)}/ficha-tecnica`,
                {
                    preparo: preparo.trim(),
                    rendimento: rendimento.trim(),
                }
            )

            console.log("RESPOSTA AO SALVAR:", atualizada)

            const fichaNormalizada: Ficha = {
                ...atualizada,
                ingredientes: normalizarIngredientes(atualizada.ingredientes),
            }

            setFicha(fichaNormalizada)
            setPreparo(atualizada.preparo ?? "")
            setRendimento(atualizada.rendimento ?? "")
            setEditando(false)
        } catch (error: unknown) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Não foi possível salvar a ficha técnica."
            )
        } finally {
            setSalvando(false)
        }
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Ficha técnica" }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {produtos.length > 1 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                        {produtos.map((item) => {
                            const ativo = item.id === selecionado?.id

                            return (
                                <Pressable
                                    key={item.id}
                                    onPress={() => setSelecionado(item)}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: ativo }}
                                    style={{
                                        paddingHorizontal: 14,
                                        paddingVertical: 8,
                                        borderRadius: 20,
                                        marginRight: 8,
                                        backgroundColor: ativo ? "#A7702A" : "#F3EDE4",
                                    }}
                                >
                                    <Text style={{ color: ativo ? "#FFFFFF" : "#374151" }}>
                                        {item.nome}
                                    </Text>
                                </Pressable>
                            )
                        })}
                    </ScrollView>
                ) : null}

                {carregando || (selecionado && !ficha && !erro) ? (
                    <View style={{ minHeight: 300, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color="#A7702A" />
                    </View>
                ) : erro || !selecionado || !ficha ? (
                    <Text style={{ color: "#B42318", textAlign: "center" }}>
                        {erro ?? "Ficha técnica indisponível."}
                    </Text>
                ) : (
                    <View>
                        {selecionado.imagem ? (
                            <Image
                                source={{ uri: selecionado.imagem }}
                                style={{ width: "100%", height: 220, borderRadius: 18, marginBottom: 16 }}
                            />
                        ) : null}

                        <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 8 }}>
                            {selecionado.nome}
                        </Text>

                        <Text style={{ color: "#374151", marginBottom: 12 }}>
                            {selecionado.descricao || "Sem descrição cadastrada."}
                        </Text>

                        {editando ? (
                            <View>
                                <Text style={{ color: "#374151", fontWeight: "600", marginBottom: 6 }}>
                                    Preparo
                                </Text>

                                <TextInput
                                    value={preparo}
                                    onChangeText={setPreparo}
                                    multiline
                                    style={{
                                        backgroundColor: "#fff",
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        borderColor: "#D1D5DB",
                                        padding: 12,
                                        marginBottom: 12,
                                    }}
                                />

                                <Text style={{ color: "#374151", fontWeight: "600", marginBottom: 6 }}>
                                    Rendimento
                                </Text>

                                <TextInput
                                    value={rendimento}
                                    onChangeText={setRendimento}
                                    style={{
                                        backgroundColor: "#fff",
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        borderColor: "#D1D5DB",
                                        padding: 12,
                                        marginBottom: 12,
                                    }}
                                />

                                <Pressable
                                    onPress={salvarFicha}
                                    disabled={salvando}
                                    style={{
                                        backgroundColor: "#A7702A",
                                        borderRadius: 12,
                                        padding: 12,
                                        marginBottom: 12,
                                    }}
                                >
                                    <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
                                        {salvando ? "Salvando..." : "Salvar ficha técnica"}
                                    </Text>
                                </Pressable>
                            </View>
                        ) : (
                            <View>
                                <Text style={{ color: "#6B7280", marginBottom: 8 }}>
                                    Preparo: {ficha.preparo || "Não informado"}
                                </Text>

                                <Text style={{ color: "#6B7280", marginBottom: 8 }}>
                                    Rendimento: {ficha.rendimento || "Não informado"}
                                </Text>

                                <Pressable
                                    onPress={() => setEditando(true)}
                                    style={{
                                        backgroundColor: "#F3EDE4",
                                        borderRadius: 12,
                                        padding: 12,
                                        marginBottom: 12,
                                    }}
                                >
                                    <Text style={{ color: "#8A5A12", textAlign: "center", fontWeight: "700" }}>
                                        Editar ficha técnica
                                    </Text>
                                </Pressable>
                            </View>
                        )}

                        <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 12, marginBottom: 8 }}>
                            Ingredientes
                        </Text>

                        {normalizarIngredientes(ficha.ingredientes).map((item, index) => (
                            <Text
                                key={`${typeof item === "string" ? item : item.nome ?? "ingrediente"}-${index}`}
                                style={{ color: "#374151", marginBottom: 6 }}
                            >
                                • {typeof item === "string" ? item : `${item.nome ?? "Ingrediente"}${item.quantidade != null ? ` - ${item.quantidade}` : ""}${item.unidade ? ` ${item.unidade}` : ""}`}
                            </Text>
                        ))}
                    </View>
                )}
            </ScrollView>
        </AppLayout>
    )
}
