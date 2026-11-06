import React, { useCallback, useState } from "react"
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

import AppLayout from "../../components/AppLayout/AppLayout"
import { criarListaCompra, listarListasCompras, type ListaCompra } from "../../services/listaCompras"

export default function ListaCompras() {
    const [dados, setDados] = useState<ListaCompra[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    const carregar = useCallback(() => {
        setCarregando(true)
        listarListasCompras()
            .then(setDados)
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar listas de compras."))
            .finally(() => setCarregando(false))
    }, [])

    useFocusEffect(useCallback(() => {
        carregar()
    }, [carregar]))

    async function adicionarNovaLista() {
        try {
            await criarListaCompra({ titulo: "Lista de compras", status: "aberta", prioridade: "media", itens: [] })
            carregar()
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível criar a lista.")
        }
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Lista de compras" }}>
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
                <Pressable onPress={adicionarNovaLista} style={{ backgroundColor: "#A7702A", padding: 12, borderRadius: 12, marginBottom: 12 }}>
                    <Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>Nova lista</Text>
                </Pressable>

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
                        renderItem={({ item }) => (
                            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                                <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.titulo}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 6 }}>Status: {item.status}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 2 }}>
                                    Total estimado: {Number(item.totalEstimado ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </Text>
                                <Text style={{ color: "#6B7280", marginTop: 2 }}>{item.itens?.length ?? 0} itens</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </AppLayout>
    )
}
