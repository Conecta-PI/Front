import React, { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, Text, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import { listarProdutos } from "../../services/produtos"
import type { Produto } from "../../types/produto"

export default function Estoque() {
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        listarProdutos()
            .then(setProdutos)
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar estoque."))
            .finally(() => setCarregando(false))
    }, [])

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Estoque" }}>
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
                {carregando ? (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color="#A7702A" />
                    </View>
                ) : erro ? (
                    <Text style={{ color: "#B42318", textAlign: "center" }}>{erro}</Text>
                ) : (
                    <FlatList
                        data={produtos}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 14, marginBottom: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.nome}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 6 }}>{item.categoria}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 2 }}>Estoque: {item.estoque}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 2 }}>
                                    Preço: {Number(item.preco ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </AppLayout>
    )
}
