
import React, { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"

import AppLayout from "../../components/AppLayout/AppLayout"
import type { RootStackParamList } from "../../routes"
import { buscarEncomenda, type Encomenda } from "../../services/encomendas"

export default function DetalheEncomenda() {
    const { params } = useRoute<RouteProp<RootStackParamList, "DetalheEncomenda">>()
    const [encomenda, setEncomenda] = useState<Encomenda | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        buscarEncomenda(params.id)
            .then(setEncomenda)
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar encomenda."))
            .finally(() => setCarregando(false))
    }, [params.id])

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
                        <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 10 }}>{encomenda.codigo}</Text>
                        <Text style={{ color: "#374151", marginBottom: 8 }}>Cliente: {encomenda.clienteNome}</Text>
                        <Text style={{ color: "#374151", marginBottom: 8 }}>Status: {encomenda.status}</Text>
                        <Text style={{ color: "#374151", marginBottom: 16 }}>
                            Valor total: {Number(encomenda.valorTotal ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </Text>

                        <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16 }}>
                            {encomenda.itens?.length ? encomenda.itens.map((item, index) => (
                                <View key={`${item.nomeProduto}-${index}`} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                    <Text>{item.nomeProduto} x{item.quantidade}</Text>
                                    <Text>
                                        {Number(item.precoUnitario ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </Text>
                                </View>
                            )) : <Text>Nenhum item nesta encomenda.</Text>}
                        </View>
                    </View>
                )}
            </ScrollView>
        </AppLayout>
    )
}