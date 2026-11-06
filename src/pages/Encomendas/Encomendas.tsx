
import React, { useCallback, useState } from "react"
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from "react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import AppLayout from "../../components/AppLayout/AppLayout"
import type { RootStackParamList } from "../../routes"
import { listarEncomendas, atualizarStatusEncomenda, type Encomenda } from "../../services/encomendas"

export default function Encomendas() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [dados, setDados] = useState<Encomenda[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    const carregar = useCallback(() => {
        setCarregando(true)
        listarEncomendas()
            .then(setDados)
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar encomendas."))
            .finally(() => setCarregando(false))
    }, [])

    useFocusEffect(useCallback(() => {
        carregar()
    }, [carregar]))

    async function mudarStatus(id: number, status: string) {
        try {
            await atualizarStatusEncomenda(id, status)
            carregar()
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível atualizar a encomenda.")
        }
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Encomendas" }}>
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
                {carregando ? (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color="#A7702A" />
                    </View>
                ) : erro ? (
                    <Text style={{ color: "#B42318", textAlign: "center", marginTop: 24 }}>{erro}</Text>
                ) : (
                    <FlatList
                        data={dados}
                        keyExtractor={(item) => String(item.id)}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => navigation.navigate("DetalheEncomenda", { id: String(item.id) })}
                                style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }}
                            >
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#1F1F1F" }}>{item.codigo}</Text>
                                    <Text style={{ fontSize: 12, color: "#5F6B7A", textTransform: "capitalize" }}>{item.status}</Text>
                                </View>
                                <Text style={{ marginTop: 8, color: "#374151" }}>{item.clienteNome}</Text>
                                <Text style={{ marginTop: 4, color: "#6B7280" }}>
                                    {Number(item.valorTotal ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </Text>
                                <View style={{ flexDirection: "row", marginTop: 12 }}>
                                    <Pressable
                                        onPress={() => mudarStatus(item.id, "entregue")}
                                        style={{ backgroundColor: "#D9F7E8", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, marginRight: 8 }}
                                    >
                                        <Text style={{ color: "#0E7C56", fontWeight: "600" }}>Entregue</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => mudarStatus(item.id, "cancelado")}
                                        style={{ backgroundColor: "#FDE7E7", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 }}
                                    >
                                        <Text style={{ color: "#B42318", fontWeight: "600" }}>Cancelar</Text>
                                    </Pressable>
                                </View>
                            </Pressable>
                        )}
                    />
                )}
            </View>
        </AppLayout>
    )
}
