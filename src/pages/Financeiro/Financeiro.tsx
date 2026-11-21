import React, { useCallback, useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

import AppLayout from "../../components/AppLayout/AppLayout"
import BottomSheet from "../../components/BottomSheet/"
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import { textoParaNumero } from "../../utils/numeros"
import { buscarResumoFinanceiro, criarLancamentoFinanceiro, listarLancamentosFinanceiro, type FinanceiroLancamento, type FinanceiroResumo } from "../../services/financeiro"
import { registrarLancamentoDashboard, sincronizarLancamentosDashboard } from "../../services/dashboardFinanceiro"

export default function Financeiro() {
    const [resumo, setResumo] = useState<FinanceiroResumo | null>(null)
    const [lancamentos, setLancamentos] = useState<FinanceiroLancamento[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [sheetLancamento, setSheetLancamento] = useState(false)
    const [tipoLancamento, setTipoLancamento] = useState<"entrada" | "saida">("entrada")
    const [valorLancamento, setValorLancamento] = useState("")
    const [erroValor, setErroValor] = useState<string | null>(null)
    const [enviando, setEnviando] = useState(false)

    const carregar = useCallback(() => {
        setCarregando(true)
        Promise.all([buscarResumoFinanceiro(), listarLancamentosFinanceiro()])
            .then(([resumoDados, lancamentosDados]) => {
                setResumo(resumoDados)
                setLancamentos(lancamentosDados)
                sincronizarLancamentosDashboard(lancamentosDados)
                setErro(null)
            })
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar financeiro."))
            .finally(() => setCarregando(false))
    }, [])

    useFocusEffect(useCallback(() => {
        carregar()
    }, [carregar]))

    function abrirLancamento(tipo: "entrada" | "saida") {
        setTipoLancamento(tipo)
        setValorLancamento("")
        setErroValor(null)
        setSheetLancamento(true)
    }

    async function confirmarLancamento() {
        const valor = textoParaNumero(valorLancamento)

        if (valor <= 0) {
            setErroValor("Informe um valor maior que zero")
            return
        }

        setErroValor(null)
        setEnviando(true)

        try {
            const lancamentoCriado = await criarLancamentoFinanceiro({
                tipo: tipoLancamento,
                categoria: tipoLancamento === "entrada" ? "Venda" : "Despesa",
                valor,
            })
            registrarLancamentoDashboard({
                tipo: tipoLancamento,
                valor,
                categoria: tipoLancamento === "entrada" ? "Venda" : "Despesa",
                descricao: lancamentoCriado.descricao ?? "Lancamento manual",
                data: lancamentoCriado.data ?? new Date().toISOString(),
            })
            setSheetLancamento(false)
            setValorLancamento("")
            carregar()
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível registrar o lançamento.")
        } finally {
            setEnviando(false)
        }
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Financeiro" }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {carregando ? (
                    <View style={{ minHeight: 300, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color="#A7702A" />
                    </View>
                ) : erro ? (
                    <Text style={{ color: "#B42318", textAlign: "center" }}>{erro}</Text>
                ) : resumo ? (
                    <>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                            {[
                                { label: "Entradas", value: resumo.entradas, color: "#0E7C56" },
                                { label: "Saídas", value: resumo.saidas, color: "#B42318" },
                                { label: "Saldo", value: resumo.saldo, color: "#A7702A" },
                            ].map((item) => (
                                <View key={item.label} style={{ flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 12, marginHorizontal: 4 }}>
                                    <Text style={{ color: "#6B7280", fontSize: 12 }}>{item.label}</Text>
                                    <Text style={{ color: item.color, fontSize: 18, fontWeight: "700", marginTop: 4 }}>
                                        {Number(item.value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <View style={{ flexDirection: "row", marginBottom: 16 }}>
                            <Pressable onPress={() => abrirLancamento("entrada")} style={{ flex: 1, backgroundColor: "#D9F7E8", padding: 12, borderRadius: 12, marginRight: 8 }}>
                                <Text style={{ color: "#0E7C56", fontWeight: "700", textAlign: "center" }}>+ Entrada</Text>
                            </Pressable>
                            <Pressable onPress={() => abrirLancamento("saida")} style={{ flex: 1, backgroundColor: "#FDE7E7", padding: 12, borderRadius: 12, marginLeft: 8 }}>
                                <Text style={{ color: "#B42318", fontWeight: "700", textAlign: "center" }}>- Saída</Text>
                            </Pressable>
                        </View>

                        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Lançamentos</Text>
                        {lancamentos.map((item) => (
                            <View key={item.id} style={{ backgroundColor: "#fff", borderRadius: 14, padding: 12, marginBottom: 10 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontWeight: "600", textTransform: "capitalize" }}>{item.tipo}</Text>
                                    <Text style={{ color: item.tipo === "entrada" ? "#0E7C56" : "#B42318", fontWeight: "700" }}>
                                        {item.tipo === "entrada" ? "+" : "-"}
                                        {Number(item.valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </Text>
                                </View>
                                <Text style={{ color: "#6B7280", marginTop: 6 }}>{item.categoria}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 2 }}>{new Date(item.data).toLocaleString("pt-BR")}</Text>
                            </View>
                        ))}
                    </>
                ) : null}
            </ScrollView>

            <BottomSheet
                visivel={sheetLancamento}
                onFechar={() => {
                    if (!enviando) setSheetLancamento(false)
                }}
                titulo={tipoLancamento === "entrada" ? "Nova entrada" : "Nova saída"}
                descricao="Informe o valor do lançamento financeiro."
            >
                <Input
                    tipo="moeda"
                    label="Valor (R$)"
                    placeholder="0,00"
                    value={valorLancamento}
                    onChangeText={(valor) => {
                        setValorLancamento(valor)
                        setErroValor(null)
                    }}
                    erro={erroValor ?? undefined}
                />

                <Button
                    texto={enviando ? "Registrando..." : "Confirmar lançamento"}
                    disabled={enviando}
                    cor={tipoLancamento === "entrada" ? "dourado" : "erro"}
                    onPress={confirmarLancamento}
                />
            </BottomSheet>
        </AppLayout>
    )
}
