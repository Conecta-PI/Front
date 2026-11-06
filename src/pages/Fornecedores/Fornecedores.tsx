// src/pages/Financeiro/Financeiro.tsx
import React, { useCallback, useState } from "react"
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

import AppLayout from "../../components/AppLayout/AppLayout"
import { criarFornecedor, listarFornecedores, type Fornecedor } from "../../services/fornecedores"

export default function Fornecedores() {
    const [dados, setDados] = useState<Fornecedor[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    const carregar = useCallback(() => {
        setCarregando(true)
        listarFornecedores()
            .then(setDados)
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar fornecedores."))
            .finally(() => setCarregando(false))
    }, [])

    useFocusEffect(useCallback(() => {
        carregar()
    }, [carregar]))

    async function adicionarFornecedor() {
        try {
            await criarFornecedor({ nome: "Novo fornecedor", categoria: "Geral", contato: "Contato", telefone: "(11) 99999-9999", email: "email@fornecedor.com" })
            carregar()
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao cadastrar fornecedor.")
        }
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Fornecedores" }}>
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
                <Pressable onPress={adicionarFornecedor} style={{ backgroundColor: "#A7702A", padding: 12, borderRadius: 12, marginBottom: 12 }}>
                    <Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>Adicionar fornecedor</Text>
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
                                <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.nome}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 6 }}>{item.categoria ?? "Geral"}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 2 }}>{item.telefone ?? "Sem telefone"}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 2 }}>{item.email ?? "Sem e-mail"}</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </AppLayout>
    )
}

