
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"

import AppLayout from "../../components/AppLayout/AppLayout"
import type { RootStackParamList } from "../../routes"
import { atualizarStatusEncomenda, buscarEncomenda, type Encomenda } from "../../services/encomendas"
import { atualizarStatusEncomendaMock, buscarEncomendaMock } from "../../services/encomendasMock"

export default function DetalheEncomenda() {
    const { params } = useRoute<RouteProp<RootStackParamList, "DetalheEncomenda">>()
    const [encomenda, setEncomenda] = useState<Encomenda | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [atualizando, setAtualizando] = useState(false)

    useEffect(() => {
        if (params.id.startsWith("-")) {
            const mock = buscarEncomendaMock(params.id)
            setEncomenda(mock)
            setErro(mock ? null : "Encomenda demonstrativa não encontrada.")
            setCarregando(false)
            return
        }

        buscarEncomenda(params.id)
            .then(setEncomenda)
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar encomenda."))
            .finally(() => setCarregando(false))
    }, [params.id])

    async function confirmarMudanca(status: string, titulo: string) {
        Alert.alert(titulo, "Deseja atualizar o status desta encomenda?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Confirmar",
                onPress: async () => {
                    setAtualizando(true)
                    try {
                        const atualizada = params.id.startsWith("-")
                            ? atualizarStatusEncomendaMock(params.id, status)
                            : await atualizarStatusEncomenda(params.id, status)
                        if (atualizada) setEncomenda(atualizada)
                    } catch (error) {
                        Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível atualizar o status.")
                    } finally {
                        setAtualizando(false)
                    }
                },
            },
        ])
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: `Encomenda #${params.id}` }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {carregando ? (
                    <View style={{ minHeight: 200, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color="#A7702A" />
                    </View>
                ) : erro || !encomenda ? (
                    <Text style={{ color: "#B42318", textAlign: "center" }}>{erro ?? "Encomenda não encontrada."}</Text>
                ) : (
                    <View>
                        <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ fontSize: 24, fontWeight: "700" }}>{encomenda.codigo}</Text>
                                <View style={{ backgroundColor: "#FFF4D6", borderRadius: 10, paddingVertical: 5, paddingHorizontal: 8 }}>
                                    <Text style={{ color: "#8A5A12", fontWeight: "700", textTransform: "capitalize" }}>{encomenda.status}</Text>
                                </View>
                            </View>
                            <Text style={{ color: "#374151", marginTop: 12, fontWeight: "600" }}>{encomenda.clienteNome}</Text>
                            {!!encomenda.dataEntrega && <Text style={{ color: "#6B7280", marginTop: 6 }}>Entrega: {encomenda.dataEntrega}{encomenda.horario ? ` às ${encomenda.horario}` : ""}</Text>}
                            {!!encomenda.tipoEntrega && <Text style={{ color: "#6B7280", marginTop: 4 }}>Modalidade: {encomenda.tipoEntrega === "entrega" ? "Entrega" : "Retirada"}</Text>}
                            <Text style={{ color: "#374151", marginTop: 10, fontWeight: "700" }}>
                                Valor total: {Number(encomenda.valorTotal ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </Text>
                            <Text style={{ color: "#0E7C56", marginTop: 4 }}>
                                Sinal pago: {Number(encomenda.sinalPago ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </Text>
                            {!!encomenda.observacao && <Text style={{ color: "#6B7280", marginTop: 8 }}>Observação: {encomenda.observacao}</Text>}
                        </View>

                        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Itens</Text>
                        <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                            {encomenda.itens?.length ? encomenda.itens.map((item, index) => (
                                <View key={`${item.nomeProduto}-${index}`} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                    <Text style={{ flex: 1, color: "#374151" }}>{item.nomeProduto} × {item.quantidade}</Text>
                                    <Text style={{ color: "#374151", fontWeight: "700" }}>
                                        {(Number(item.precoUnitario ?? 0) * item.quantidade).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </Text>
                                </View>
                            )) : <Text>Nenhum item nesta encomenda.</Text>}
                        </View>

                        {!["entregue", "cancelada", "cancelado"].includes(encomenda.status.toLowerCase()) && (
                            <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                                <Pressable
                                    disabled={atualizando}
                                    onPress={() => confirmarMudanca("em_producao", "Colocar em produção?")}
                                    style={{ flex: 1, backgroundColor: "#EDF4FF", padding: 12, borderRadius: 12 }}
                                >
                                    <Text style={{ color: "#2563EB", fontWeight: "700", textAlign: "center" }}>Produção</Text>
                                </Pressable>
                                <Pressable
                                    disabled={atualizando}
                                    onPress={() => confirmarMudanca("pronta", "Marcar como pronta?")}
                                    style={{ flex: 1, backgroundColor: "#FFF4D6", padding: 12, borderRadius: 12 }}
                                >
                                    <Text style={{ color: "#8A5A12", fontWeight: "700", textAlign: "center" }}>Pronta</Text>
                                </Pressable>
                                <Pressable
                                    disabled={atualizando}
                                    onPress={() => confirmarMudanca("entregue", "Marcar como entregue?")}
                                    style={{ flex: 1, backgroundColor: "#D9F7E8", padding: 12, borderRadius: 12 }}
                                >
                                    <Text style={{ color: "#0E7C56", fontWeight: "700", textAlign: "center" }}>Entregue</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </AppLayout>
    )
}