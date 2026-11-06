// src/pages/Financeiro/Financeiro.tsx
import React, { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import { buscarFinanceiroRelatorio, buscarResumoRelatorios, buscarVendasRelatorio, type RelatorioResumo, type RelatorioVenda } from "../../services/relatorios"

export default function Relatorios() {
    const [resumo, setResumo] = useState<RelatorioResumo | null>(null)
    const [vendas, setVendas] = useState<RelatorioVenda[]>([])
    const [financeiro, setFinanceiro] = useState<Record<string, number | string>>({})
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([buscarResumoRelatorios(), buscarVendasRelatorio(), buscarFinanceiroRelatorio()])
            .then(([resumoDados, vendasDados, financeiroDados]) => {
                setResumo(resumoDados)
                setVendas(vendasDados)
                setFinanceiro(financeiroDados)
                setErro(null)
            })
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar relatórios."))
            .finally(() => setCarregando(false))
    }, [])

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Relatórios" }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {carregando ? (
                    <View style={{ minHeight: 260, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color="#A7702A" />
                    </View>
                ) : erro ? (
                    <Text style={{ color: "#B42318", textAlign: "center" }}>{erro}</Text>
                ) : resumo ? (
                    <View>
                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            {[
                                { label: "Faturamento", value: resumo.faturamento },
                                { label: "Despesas", value: resumo.despesas },
                                { label: "Lucro", value: resumo.lucro },
                            ].map((item) => (
                                <View key={item.label} style={{ width: "48%", backgroundColor: "#fff", borderRadius: 16, padding: 12, margin: "1%" }}>
                                    <Text style={{ color: "#6B7280" }}>{item.label}</Text>
                                    <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 6 }}>
                                        {Number(item.value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 18, marginBottom: 10 }}>Vendas por mês</Text>
                        {vendas.map((item) => (
                            <View key={item.mes} style={{ backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 8 }}>
                                <Text style={{ fontWeight: "600" }}>{item.mes}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 4 }}>
                                    {Number(item.valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} • {item.quantidade} vendas
                                </Text>
                            </View>
                        ))}

                        <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 18, marginBottom: 10 }}>Resumo operacional</Text>
                        <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 12 }}>
                            <Text style={{ color: "#6B7280" }}>Pedidos pendentes: {resumo.pedidosPendentes}</Text>
                            <Text style={{ color: "#6B7280", marginTop: 4 }}>Clientes ativos: {resumo.clientesAtivos}</Text>
                            <Text style={{ color: "#6B7280", marginTop: 4 }}>Produtos ativos: {resumo.produtosAtivos}</Text>
                            <Text style={{ color: "#6B7280", marginTop: 4 }}>Financeiro: {String(financeiro.lucro ?? "-")}</Text>
                        </View>
                    </View>
                ) : null}
            </ScrollView>
        </AppLayout>
    )
}
