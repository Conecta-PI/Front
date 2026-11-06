import React, { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { NavigationProp, useNavigation } from "@react-navigation/native"

import { style } from "./style"
import { themes } from "../../global/themes"
import { useDashboard } from "../../hooks/useDashboard"
import type { Periodo } from "../../types/dashboard"
import type { AppParamList, Destino } from "../../routes"
import { listarClientes, listarProdutos } from "../../services/produtos"
import { listarPedidos } from "../../services/pedido"

import AppLayout from "../../components/AppLayout/AppLayout"
import SeletorPeriodo from "../../components/SeletorPeriodo/"
import CardRecebido from "../../components/CardRecebido/"
import Secao from "../../components/Secao/"
import AtalhoRapido from "../../components/AtalhoRapido/"
import AlertaAtencao from "../../components/AlertaAtencao/"
import EntregaCard from "../../components/EntregaCard/"
import MetricaCard from "../../components/MetricaCard/"
import GraficoLucroMensal from "../../components/GraficoLucroMensal/"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

const ATALHOS: { icone: IconName; texto: string; destino: Destino }[] = [
    { icone: "add-circle-outline", texto: "Novo produto", destino: "NovoProduto" },
    { icone: "cash-outline", texto: "Cobrar", destino: "Cobrar" },
    { icone: "people-outline", texto: "Clientes", destino: "Clientes" },
    { icone: "calendar-outline", texto: "Encomendas", destino: "Encomendas" },
]

const TITULO_RECEBIDO: Record<Periodo, string> = {
    hoje: "Recebido hoje",
    semana: "Recebido na semana",
    mes: "Recebido no mês",
}

const normalizar = (valor: string | undefined) =>
    (valor ?? "").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

const relevanciaBusca = (texto: string, termo: string) => {
    const normalizado = normalizar(texto)
    if (!termo) return 0
    if (normalizado === termo) return 3
    if (normalizado.startsWith(termo)) return 2
    return 0
}

export default function Inicio() {
    const navigation = useNavigation<NavigationProp<AppParamList>>()

    const [periodo, setPeriodo] = useState<Periodo>("hoje")
    const [busca, setBusca] = useState("")
    const [produtos, setProdutos] = useState<any[]>([])
    const [clientes, setClientes] = useState<any[]>([])
    const [pedidos, setPedidos] = useState<any[]>([])
    const { dados, erro } = useDashboard(periodo)

    const alertas = dados?.alertas.filter((a) => a.quantidade > 0) ?? []

    useEffect(() => {
        const termo = busca.trim()
        if (!termo) {
            setProdutos([])
            setClientes([])
            setPedidos([])
            return
        }

        let ativo = true

        Promise.all([
            listarProdutos().catch(() => []),
            listarClientes().catch(() => []),
            listarPedidos().catch(() => []),
        ])
            .then(([listaProdutos, listaClientes, listaPedidos]) => {
                if (!ativo) return
                setProdutos(listaProdutos)
                setClientes(listaClientes)
                setPedidos(listaPedidos)
            })
            .catch(() => {
                if (ativo) {
                    setProdutos([])
                    setClientes([])
                    setPedidos([])
                }
            })

        return () => {
            ativo = false
        }
    }, [busca])

    const resultadosBusca = useMemo(() => {
        const termo = normalizar(busca.trim())
        if (!termo) return []

        const produtosEncontrados = produtos
            .map((produto) => ({
                ...produto,
                relevancia: relevanciaBusca(produto.nome, termo),
            }))
            .filter((produto) => produto.relevancia > 0)
            .sort((a, b) => b.relevancia - a.relevancia)
            .slice(0, 3)
            .map((produto) => ({
                tipo: "Produto",
                nome: produto.nome,
                descricao: `${produto.categoria} • R$ ${produto.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                destino: "DetalheProduto" as const,
                params: { id: String(produto.id) },
            }))

        const clientesEncontrados = clientes
            .map((cliente) => ({
                ...cliente,
                relevancia: relevanciaBusca(cliente.label, termo),
            }))
            .filter((cliente) => cliente.relevancia > 0)
            .sort((a, b) => b.relevancia - a.relevancia)
            .slice(0, 3)
            .map((cliente) => ({
                tipo: "Cliente",
                nome: cliente.label,
                descricao: "Cliente cadastrado",
                destino: "DetalheCliente" as const,
                params: { id: String(cliente.valor) },
            }))

        const pedidosEncontrados = pedidos
            .map((pedido) => ({
                ...pedido,
                relevancia:
                    Math.max(
                        relevanciaBusca(pedido.cliente, termo),
                        pedido.itens.reduce(
                            (maior: number, item: any) =>
                                Math.max(maior, relevanciaBusca(item.nome, termo)),
                            0
                        )
                    ),
            }))
            .filter((pedido) => pedido.relevancia > 0)
            .sort((a, b) => b.relevancia - a.relevancia)
            .slice(0, 3)
            .map((pedido) => ({
                tipo: "Pedido",
                nome: pedido.cliente,
                descricao: `${pedido.data} • ${pedido.status}`,
                destino: "Pedidos" as const,
                params: undefined,
            }))

        const entregasEncontradas = (dados?.proximasEntregas ?? [])
            .map((entrega) => ({
                ...entrega,
                relevancia: relevanciaBusca(entrega.nome, termo),
            }))
            .filter((entrega) => entrega.relevancia > 0)
            .sort((a, b) => b.relevancia - a.relevancia)
            .slice(0, 3)
            .map((entrega) => ({
                tipo: "Entrega",
                nome: entrega.nome,
                descricao: `${entrega.dia} • ${entrega.hora}`,
                destino: "Encomendas" as const,
                params: undefined,
            }))

        return [...produtosEncontrados, ...clientesEncontrados, ...pedidosEncontrados, ...entregasEncontradas]
    }, [busca, clientes, dados, pedidos, produtos])

    return (
        <AppLayout
            header={{
                tipo: "inicio",
                nome: dados?.usuario.nome,
                negocio: dados?.usuario.negocio,
                busca,
                onChangeBusca: setBusca,
            }}
        >
            {!dados ? (
                <View style={style.carregando}>
                    {erro ? (
                        <Text style={style.erro}>{erro}</Text>
                    ) : (
                        <ActivityIndicator color={themes.colors["dourado"]} size="large" />
                    )}
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={style.conteudo}
                >
                    {busca.trim() && (
                        <Secao titulo="Resultados da busca">
                            {resultadosBusca.length > 0 ? (
                                <View style={style.lista}>
                                    {resultadosBusca.map((resultado, indice) => (
                                        <Pressable
                                            key={`${resultado.tipo}-${resultado.nome}-${indice}`}
                                            onPress={() => {
                                                if (resultado.destino === "DetalheProduto") {
                                                    navigation.navigate("DetalheProduto", { id: resultado.params.id })
                                                    return
                                                }

                                                if (resultado.destino === "DetalheCliente") {
                                                    navigation.navigate("DetalheCliente", { id: resultado.params.id })
                                                    return
                                                }

                                                navigation.navigate(resultado.destino)
                                            }}
                                            accessibilityRole="button"
                                            accessibilityLabel={`Abrir ${resultado.tipo} ${resultado.nome}`}
                                        >
                                            <View style={style.resultadoBusca}>
                                                <Text style={style.resultadoTipo}>{resultado.tipo}</Text>
                                                <Text style={style.resultadoNome}>{resultado.nome}</Text>
                                                <Text style={style.resultadoDescricao}>{resultado.descricao}</Text>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                            ) : (
                                <Text style={style.buscaVazia}>
                                    Nenhum pedido, cliente ou produto encontrado para "{busca.trim()}".
                                </Text>
                            )}
                        </Secao>
                    )}

                    <SeletorPeriodo valor={periodo} onChange={setPeriodo} />

                    <CardRecebido
                        titulo={TITULO_RECEBIDO[periodo]}
                        valor={dados.recebido.valor}
                        meta={dados.recebido.meta}
                        vendas={dados.recebido.pedidos}
                        onCobrar={() => navigation.navigate("Cobrar")}
                        onReceber={() => navigation.navigate("Pedidos")}
                    />

                    <Secao titulo="Atalhos rápidos">
                        <View style={style.linha}>
                            {ATALHOS.map((a) => (
                                <AtalhoRapido key={a.texto} {...a} />
                            ))}
                        </View>
                    </Secao>

                    {alertas.length > 0 && (
                        <Secao titulo="Precisa de atenção">
                            <View style={style.listaAlertas}>
                                {alertas.map((a) => (
                                    <AlertaAtencao
                                        key={a.tipo}
                                        tipo={a.tipo}
                                        quantidade={a.quantidade}
                                    />
                                ))}
                            </View>
                        </Secao>
                    )}

                    {dados.proximasEntregas.length > 0 && (
                        <Secao titulo="Próximas entregas">
                            <View style={style.lista}>
                                {dados.proximasEntregas.map((e) => (
                                    <EntregaCard key={e.id} {...e} />
                                ))}
                            </View>
                        </Secao>
                    )}

                    <Secao titulo="Métricas">
                        <View style={style.lista}>
                            <View style={style.linha}>
                                <MetricaCard tipo="lucro" valor={dados.metricas.lucro} />
                                <MetricaCard tipo="custo" valor={dados.metricas.custo} />
                                <MetricaCard tipo="investido" valor={dados.metricas.investido} />
                            </View>

                            <GraficoLucroMensal dados={dados.lucroMensal} />
                        </View>
                    </Secao>
                </ScrollView>
            )}
        </AppLayout>
    )
}