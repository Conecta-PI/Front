import React, { useEffect, useState } from "react"
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import { listarProdutos } from "../../services/produtos"
import { apiGet } from "../../services/api"
import type { Produto } from "../../types/produto"

type Ficha = {
    preparo?: string | null
    rendimento?: string | null
    ingredientes?: ({ nome?: string } | string)[]
}

export default function FichaTecnica() {
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [selecionado, setSelecionado] = useState<Produto | null>(null)
    const [ficha, setFicha] = useState<Ficha | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

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
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar produtos."))
            .finally(() => setCarregando(false))
    }, [])

    useEffect(() => {
        if (!selecionado) return

        let ativo = true
        setFicha(null)
        setErro(null)
        apiGet<Ficha>(`/produtos/${encodeURIComponent(selecionado.id)}/ficha-tecnica`)
            .then((dados) => {
                if (ativo) setFicha(dados)
            })
            .catch((error: unknown) => {
                if (ativo) setErro(error instanceof Error ? error.message : "Erro ao carregar ficha técnica.")
            })

        return () => {
            ativo = false
        }
    }, [selecionado])

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
                                    <Text style={{ color: ativo ? "#FFFFFF" : "#374151" }}>{item.nome}</Text>
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
                    <Text style={{ color: "#B42318", textAlign: "center" }}>{erro ?? "Ficha técnica indisponível."}</Text>
                ) : (
                    <View>
                        {selecionado.imagem ? <Image source={{ uri: selecionado.imagem }} style={{ width: "100%", height: 220, borderRadius: 18, marginBottom: 16 }} /> : null}
                        <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 8 }}>{selecionado.nome}</Text>
                        <Text style={{ color: "#374151", marginBottom: 12 }}>{selecionado.descricao || "Sem descrição cadastrada."}</Text>
                        <Text style={{ color: "#6B7280", marginBottom: 8 }}>Preparo: {ficha.preparo || "Não informado"}</Text>
                        <Text style={{ color: "#6B7280", marginBottom: 8 }}>Rendimento: {ficha.rendimento || "Não informado"}</Text>
                        <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 12, marginBottom: 8 }}>Ingredientes</Text>
                        {(ficha.ingredientes ?? []).map((item, index) => (
                            <Text key={`${typeof item === "string" ? item : item.nome ?? "ingrediente"}-${index}`} style={{ color: "#374151", marginBottom: 6 }}>
                                • {typeof item === "string" ? item : item.nome ?? "Ingrediente"}
                            </Text>
                        ))}
                    </View>
                )}
            </ScrollView>
        </AppLayout>
    )
}
