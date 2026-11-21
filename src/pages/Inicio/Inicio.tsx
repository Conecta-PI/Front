import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native"

import { style } from "./style"
import { themes } from "../../global/themes"
import { useDashboard } from "../../hooks/useDashboard"
import type { Periodo } from "../../types/dashboard"
import type { AppParamList, Destino } from "../../routes"
import { listarClientes, listarProdutos } from "../../services/produtos"
import { listarPedidos } from "../../services/pedido"
import { listarPedidosMock } from "../../services/pedidosMock"
import { listarEncomendas, type Encomenda } from "../../services/encomendas"
import { listarEncomendasMock } from "../../services/encomendasMock"
import { buscarPerfil } from "../../services/perfil"
import { resolverUrlImagem } from "../../services/api"

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

function formatarDiaEntrega(valor: string) {
    const partes = valor.split("-")
    if (partes.length !== 3) return valor

    const data = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]))
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

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
    const [pedidos, setPedidos] = useState<any[]>(listarPedidosMock())
    const [fotoPerfil, setFotoPerfil] = useState<string | undefined>()
    const [proximasEntregas, setProximasEntregas] = useState<Encomenda[]>([])
    const pedidosMock = listarPedidosMock()
    const { dados, erro } = useDashboard(periodo)

    const hojeIso = (() => {
        const hoje = new Date()
        const ano = hoje.getFullYear()
        const mes = String(hoje.getMonth() + 1).padStart(2, "0")
        const dia = String(hoje.getDate()).padStart(2, "0")
        return `${ano}-${mes}-${dia}`
    })()

    const encomendaHoje = [...proximasEntregas].find((encomenda) =>
        encomenda.dataEntrega === hojeIso && !["entregue", "cancelada", "cancelado"].includes(encomenda.status.toLowerCase())
    )

    const quantidadeEncomendasHoje = [...proximasEntregas].filter((encomenda) =>
        encomenda.dataEntrega === hojeIso && !["entregue", "cancelada", "cancelado"].includes(encomenda.status.toLowerCase())
    ).length

    const alertasBase = (dados?.alertas ?? [])
        .filter((a) => a.quantidade > 0)
        .map((a) => a.tipo === "informativo"
            ? { ...a, quantidade: quantidadeEncomendasHoje }
            : a.tipo === "aviso"
                ? { ...a, quantidade: pedidosMock.filter((pedido) => pedido.status === "pendente").length }
                : a)

    let alertas = alertasBase

    if (!alertas.some((a) => a.tipo === "aviso")) {
        alertas = [...alertas, { tipo: "aviso" as const, quantidade: pedidosMock.filter((pedido) => pedido.status === "pendente").length }]
    }

    if (quantidadeEncomendasHoje > 0 && !alertas.some((a) => a.tipo === "informativo")) {
        alertas = [...alertas, { tipo: "informativo" as const, quantidade: quantidadeEncomendasHoje }]
    }

    alertas = alertas.filter((a) => a.tipo !== "informativo" || a.quantidade > 0)

    useFocusEffect(useCallback(() => {
        let ativo = true
        buscarPerfil()
            .then((perfil) => {
                if (ativo) setFotoPerfil(resolverUrlImagem(perfil.foto) ?? resolverUrlImagem(dados?.usuario.foto))
            })
            .catch(() => {
                if (ativo) setFotoPerfil(resolverUrlImagem(dados?.usuario.foto))
            })
        return () => { ativo = false }
    }, [dados?.usuario.foto]))

    useFocusEffect(useCallback(() => {
        let ativo = true

        listarEncomendas()
            .then((encomendas) => {
                if (!ativo) return

                const hoje = new Date()
                hoje.setHours(0, 0, 0, 0)

                const futuras = [...encomendas, ...listarEncomendasMock()]
                    .filter((encomenda) => {
                        if (!encomenda.dataEntrega) return false
                        const status = encomenda.status.toLowerCase()
                        return !["entregue", "cancelada", "cancelado"].includes(status)
                    })
                    .sort((a, b) => {
                        const dataA = new Date(a.dataEntrega ?? "9999-12-31").getTime()
                        const dataB = new Date(b.dataEntrega ?? "9999-12-31").getTime()
                        return dataA - dataB
                    })
                    .filter((encomenda) => {
                        if (!encomenda.dataEntrega) return false
                        const data = new Date(`${encomenda.dataEntrega}T00:00:00`)
                        return data >= hoje
                    })
                    .slice(0, 3)

                setProximasEntregas(futuras)
            })
            .catch(() => {
                if (ativo) {
                    const hoje = new Date()
                    hoje.setHours(0, 0, 0, 0)
                    setProximasEntregas(
                        listarEncomendasMock().filter((encomenda) => {
                            if (!encomenda.dataEntrega) return false
                            const data = new Date(`${encomenda.dataEntrega}T00:00:00`)
                            return data >= hoje
                        })
                    )
                }
            })

        return () => { ativo = false }
    }, []))

    useEffect(() => {
        const termo = busca.trim()
        if (!termo) {
            setProdutos([])
            setClientes([])
            setPedidos(listarPedidosMock())
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
                setPedidos([...listaPedidos, ...listarPedidosMock()])
            })
            .catch(() => {
                if (ativo) {
                    setProdutos([])
                    setClientes([])
                    setPedidos(listarPedidosMock())
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

        const entregasEncontradas = proximasEntregas
            .map((entrega) => ({
                id: String(entrega.id),
                nome: entrega.clienteNome,
                dia: entrega.dataEntrega ?? "Data não informada",
                hora: (entrega as Encomenda & { horario?: string }).horario ?? "",
                relevancia: relevanciaBusca(entrega.clienteNome, termo),
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
    }, [busca, clientes, dados, pedidos, produtos, proximasEntregas])

    return (
        <AppLayout
            header={{
                tipo: "inicio",
                nome: dados?.usuario.nome,
                negocio: dados?.usuario.negocio,
                foto: fotoPerfil ?? resolverUrlImagem(dados?.usuario.foto),
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
                                        encomendaHojeId={a.tipo === "informativo" && encomendaHoje ? String(encomendaHoje.id) : undefined}
                                    />
                                ))}
                            </View>
                        </Secao>
                    )}

                    {proximasEntregas.length > 0 && (
                        <Secao titulo="Próximas entregas">
                            <View style={style.lista}>
                                {proximasEntregas.map((encomenda) => (
                                    <EntregaCard
                                        key={encomenda.id}
                                        id={String(encomenda.id)}
                                        nome={encomenda.clienteNome}
                                        dia={formatarDiaEntrega(encomenda.dataEntrega ?? "")}
                                        hora={encomenda.horario ?? ""}
                                    />
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