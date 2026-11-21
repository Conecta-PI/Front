
import React, { useCallback, useMemo, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Pressable, Text, TextInput, View } from "react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Ionicons } from "@expo/vector-icons"

import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import { themes } from "../../global/themes"
import { style } from "./style"
import type { RootStackParamList } from "../../routes"
import { listarEncomendas, atualizarStatusEncomenda, type Encomenda } from "../../services/encomendas"
import { atualizarStatusEncomendaMock, listarEncomendasMock } from "../../services/encomendasMock"

export default function Encomendas() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [dados, setDados] = useState<Encomenda[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [busca, setBusca] = useState("")
    const [filtro, setFiltro] = useState("todas")

    const carregar = useCallback(() => {
        setCarregando(true)
        listarEncomendas()
            .then((reais) => setDados([...reais, ...listarEncomendasMock()]))
            .catch(() => {
                setDados(listarEncomendasMock())
                setErro(null)
            })
            .finally(() => setCarregando(false))
    }, [])

    useFocusEffect(useCallback(() => {
        carregar()
    }, [carregar]))

    async function mudarStatus(id: number, status: string) {
        try {
            if (id < 0) {
                atualizarStatusEncomendaMock(id, status)
                carregar()
            } else {
                await atualizarStatusEncomenda(id, status)
                carregar()
            }
        } catch (error) {
            Alert.alert("Não foi possível atualizar", error instanceof Error ? error.message : "Tente novamente.")
        }
    }

    function confirmarStatus(item: Encomenda, status: string, titulo: string) {
        Alert.alert(titulo, `Atualizar a encomenda ${item.codigo}?`, [
            { text: "Cancelar", style: "cancel" },
            { text: "Confirmar", onPress: () => mudarStatus(item.id, status) },
        ])
    }

    const normalizar = (valor: string) => valor.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    const filtradas = useMemo(() => {
        const termo = normalizar(busca.trim())
        return dados.filter((item) => {
            const status = normalizar(item.status)
            const correspondeBusca = !termo || normalizar(`${item.codigo} ${item.clienteNome}`).includes(termo)
            const correspondeFiltro = filtro === "todas" || status.includes(filtro)
            return correspondeBusca && correspondeFiltro
        })
    }, [dados, busca, filtro])

    const contagem = useMemo(() => ({
        todas: dados.length,
        pendente: dados.filter((item) => normalizar(item.status).includes("pendente") || normalizar(item.status).includes("aguardando")).length,
        producao: dados.filter((item) => normalizar(item.status).includes("produ") || normalizar(item.status).includes("andamento")).length,
        pronta: dados.filter((item) => normalizar(item.status).includes("pronta") || normalizar(item.status).includes("preparada")).length,
        entregue: dados.filter((item) => normalizar(item.status).includes("entregue")).length,
    }), [dados])

    function textoStatus(status: string) {
        const normalizado = normalizar(status)
        if (normalizado.includes("entregue")) return "Entregue"
        if (normalizado.includes("cancel")) return "Cancelada"
        if (normalizado.includes("pronta") || normalizado.includes("preparada")) return "Pronta"
        if (normalizado.includes("produ") || normalizado.includes("andamento")) return "Em produção"
        return "Pendente"
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Encomendas" }}>
            <View style={style.tela}>
                <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                    {[
                        { label: "Pendentes", valor: contagem.pendente, cor: "#A7702A" },
                        { label: "Produção", valor: contagem.producao, cor: "#2563EB" },
                        { label: "Entregues", valor: contagem.entregue, cor: "#0E7C56" },
                    ].map((card) => (
                        <View key={card.label} style={style.resumoCard}>
                            <Text style={style.resumoRotulo}>{card.label}</Text>
                            <Text style={[style.resumoValor, { color: card.cor }]}>{card.valor}</Text>
                        </View>
                    ))}
                </View>

                <View style={style.buscaLinha}>
                    <View style={style.buscaCampo}>
                        <Ionicons name="search-outline" size={18} color={themes.colors["marrom-suave"]} />
                        <TextInput
                            value={busca}
                            onChangeText={setBusca}
                            placeholder="Código ou cliente"
                            placeholderTextColor={themes.colors["texto-secundario"]}
                            style={style.buscaInput}
                        />
                    </View>
                    <Button
                        texto="Nova"
                        icone="add"
                        formato="arredondado"
                        onPress={() => navigation.navigate("Clientes")}
                        style={style.novoBotao}
                    />
                </View>

                <View style={style.filtros}>
                    {["todas", "pendente", "producao", "pronta", "entregue"].map((opcao) => {
                        const ativo = filtro === opcao
                        const rotulo = opcao === "producao" ? "Produção" : opcao === "pronta" ? "Prontas" : opcao === "pendente" ? "Pendentes" : opcao === "entregue" ? "Entregues" : "Todas"
                        return (
                            <Pressable
                                key={opcao}
                                onPress={() => setFiltro(opcao)}
                                style={[style.filtro, ativo && style.filtroAtivo]}
                            >
                                <Text style={[style.filtroTexto, ativo && style.filtroTextoAtivo]} adjustsFontSizeToFit numberOfLines={1}>{rotulo}</Text>
                            </Pressable>
                        )
                    })}
                </View>

                {carregando ? (
                    <View style={style.centro}>
                        <ActivityIndicator size="large" color="#A7702A" />
                    </View>
                ) : erro ? (
                    <Text style={style.erro}>{erro}</Text>
                ) : (
                    <FlatList
                        data={filtradas}
                        keyExtractor={(item) => String(item.id)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={style.lista}
                        ListEmptyComponent={<Text style={style.vazio}>Nenhuma encomenda encontrada.</Text>}
                        renderItem={({ item }) => {
                            const statusNormalizado = normalizar(item.status)
                            const finalizada = statusNormalizado.includes("entregue") || statusNormalizado.includes("cancel")
                            return (
                                <Pressable
                                    onPress={() => navigation.navigate("DetalheEncomenda", { id: String(item.id) })}
                                    style={style.card}
                                >
                                    <View style={style.cardTopo}>
                                        <Text style={style.codigo}>{item.codigo}</Text>
                                        <View style={[style.statusBadge, { backgroundColor: finalizada ? "#EDF0ED" : "#FFF4D6" }]}>
                                            <Text style={[style.statusTexto, { color: finalizada ? "#5F6B7A" : "#8A5A12" }]}>{textoStatus(item.status)}</Text>
                                        </View>
                                    </View>
                                    <Text style={style.cliente}>{item.clienteNome}</Text>
                                    {!!item.dataEntrega && <Text style={style.detalhe}>Entrega: {item.dataEntrega}</Text>}
                                    <Text style={style.detalhe}>
                                        {Number(item.valorTotal ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </Text>

                                    {!finalizada && (
                                        <View style={style.acoes}>
                                            <Pressable
                                                onPress={() => confirmarStatus(item, "em_producao", "Colocar em produção?")}
                                                style={[style.acao, { backgroundColor: "#EDF4FF" }]}
                                            >
                                                <Text style={[style.acaoTexto, { color: "#2563EB" }]}>Produção</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => confirmarStatus(item, "pronta", "Marcar como pronta?")}
                                                style={[style.acao, { backgroundColor: "#FFF4D6" }]}
                                            >
                                                <Text style={[style.acaoTexto, { color: "#8A5A12" }]}>Pronta</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => confirmarStatus(item, "entregue", "Marcar como entregue?")}
                                                style={[style.acao, { backgroundColor: "#D9F7E8" }]}
                                            >
                                                <Text style={[style.acaoTexto, { color: "#0E7C56" }]}>Entregue</Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </Pressable>
                            )
                        }}
                    />
                )}
            </View>
        </AppLayout>
    )
}
