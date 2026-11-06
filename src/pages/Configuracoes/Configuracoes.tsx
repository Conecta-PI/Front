import React, { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, Switch, Text, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import { listarConfiguracoes, listarNotificacoes, type Configuracao, type Notificacao, atualizarConfiguracoes } from "../../services/configuracoes"

export default function Configuracoes() {
    const [configs, setConfigs] = useState<Configuracao[]>([])
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([listarConfiguracoes(), listarNotificacoes()])
            .then(([configuracoes, notif]) => {
                setConfigs(configuracoes)
                setNotificacoes(notif)
            })
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar configurações."))
            .finally(() => setCarregando(false))
    }, [])

    async function alterar(chave: string, valor: boolean) {
        try {
            await atualizarConfiguracoes({ [chave]: valor })
            setNotificacoes((atual) => atual.map((item) => item.tipo === chave ? { ...item, ativa: valor } : item))
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível atualizar a configuração.")
        }
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Configurações" }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {carregando ? (
                    <View style={{ minHeight: 260, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color="#A7702A" />
                    </View>
                ) : erro ? (
                    <Text style={{ color: "#B42318", textAlign: "center" }}>{erro}</Text>
                ) : (
                    <>
                        <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 12, marginBottom: 16 }}>
                            {configs.map((item) => (
                                <View key={item.chave} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }}>
                                    <Text style={{ fontWeight: "600" }}>{item.chave}</Text>
                                    <Text style={{ color: "#6B7280" }}>{String(item.valor)}</Text>
                                </View>
                            ))}
                        </View>

                        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Notificações</Text>
                        {notificacoes.map((item) => (
                            <View key={item.tipo} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 12, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: "600" }}>{item.tipo}</Text>
                                    <Text style={{ color: "#6B7280", marginTop: 4 }}>{item.mensagem}</Text>
                                </View>
                                <Switch value={item.ativa} onValueChange={(value) => alterar(item.tipo, value)} />
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>
        </AppLayout>
    )
}
