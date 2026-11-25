
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Alert, FlatList, Text, View } from "react-native"
import {
    NavigationProp,
    RouteProp,
    useFocusEffect,
    useNavigation,
    useRoute,
} from "@react-navigation/native"

import { style } from "./style"
import AppLayout from "../../components/AppLayout/AppLayout"
import ProdutoCard from "../../components/ProdutoCard/"
import Dropdown from "../../components/Dropdown/"
import FormaPagamento, {
    PAGAMENTOS,
    TipoPagamento,
} from "../../components/FormaPagamento/"
import { useNavBar } from "../../contexts/NavBarContext"
import {
    filtrarProdutos,
    listarClientes,
    listarProdutos,
} from "../../services/produtos"
import { criarVenda } from "../../services/vendas"
import type { VendaResponse } from "../../services/vendas"
import { criarEncomenda } from "../../services/encomendas"
import type { DropdownOpcao } from "../../components/Dropdown/"
import type { Produto } from "../../types/produto"
import type { TipoEntrega } from "../../types/encomenda"
import PagamentoCartao from "../PagamentoCartao/PagamentoCartao"
import PagamentoDinheiro from "../PagamentoDinheiro/PagamentoDinheiro"
import PagamentoPix from "../PagamentoPix/PagamentoPix"
import AgendarPagamento from "../AgendarPagamento/AgendarPagamento"
import AgendamentoConfirmado from "../AgendamentoConfirmado/AgendamentoConfirmado"
import type { AppParamList, RootTabParamList } from "../../routes"
import VendaConfirmada from "../VendaConfirmada/VendaConfirmada"

type Etapa =
    | "produtos"
    | "pagamento"
    | "agendamento-confirmado"
    | "venda-confirmada"

type EncomendaAgendada = {
    id: string
    clienteNome: string
    total: number
    dataEscolhida: Date
    horario: string
    tipoEntrega: TipoEntrega
    sinalPago: number
    quantidadeItens: number
}

export default function Cobrar() {
    const { setCobranca } = useNavBar()
    const navigation = useNavigation<NavigationProp<AppParamList>>()
    const route = useRoute<RouteProp<RootTabParamList, "Cobrar">>()

    const listaRef = useRef<FlatList<Produto>>(null)
    const rolarParaPagamento = useRef(false)
    const usuarioArrastando = useRef(false)
    const produtoAdicionado = useRef<string | null>(null)
    const frameRolagem = useRef<number | null>(null)

    const enviandoVenda = useRef(false)
    const enviandoEncomenda = useRef(false)

    const [busca, setBusca] = useState("")
    const [quantidades, setQuantidades] = useState<Record<string, number>>({})
    const [cliente, setCliente] = useState<string | null>(null)
    const [pagamento, setPagamento] = useState<TipoPagamento | null>(null)
    const [todosProdutos, setTodosProdutos] = useState<Produto[]>([])
    const [clientes, setClientes] = useState<DropdownOpcao[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [vendaCriada, setVendaCriada] = useState<VendaResponse | null>(null)
    const [encomendaCriada, setEncomendaCriada] =
        useState<EncomendaAgendada | null>(null)
    const [etapa, setEtapa] = useState<Etapa>("produtos")
    const [secaoPagamentoVisivel, setSecaoPagamentoVisivel] = useState(false)

    const clienteSelecionado = useMemo(
        () => clientes.find((item) => item.valor === cliente) ?? null,
        [clientes, cliente]
    )

    const produtos = useMemo(
        () => filtrarProdutos(todosProdutos, busca, "Todos"),
        [todosProdutos, busca]
    )

    useEffect(() => {
        const produtoId = route.params?.produtoId

        if (
            !produtoId ||
            todosProdutos.length === 0 ||
            produtoAdicionado.current === produtoId
        ) {
            return
        }

        const produto = todosProdutos.find((item) => item.id === produtoId)

        if (produto) {
            setQuantidades((atual) => ({
                ...atual,
                [produtoId]: (atual[produtoId] ?? 0) + 1,
            }))

            produtoAdicionado.current = produtoId
        }
    }, [route.params?.produtoId, todosProdutos])

    const { itens, total } = useMemo(() => {
        let quantidadeItens = 0
        let valorTotal = 0

        for (const produto of todosProdutos) {
            const quantidade = quantidades[produto.id] ?? 0
            quantidadeItens += quantidade
            valorTotal += quantidade * produto.preco
        }

        return {
            itens: quantidadeItens,
            total: valorTotal,
        }
    }, [todosProdutos, quantidades])

    useFocusEffect(
        useCallback(() => {
            let ativo = true

            Promise.all([listarProdutos(), listarClientes()])
                .then(([produtosCarregados, clientesCarregados]) => {
                    if (ativo) {
                        setTodosProdutos(produtosCarregados)
                        setClientes(clientesCarregados)
                        setErro(null)
                        setCarregando(false)
                    }
                })
                .catch((error: unknown) => {
                    if (ativo) {
                        setErro(
                            error instanceof Error
                                ? error.message
                                : "Erro ao carregar dados."
                        )
                        setCarregando(false)
                    }
                })

            return () => {
                ativo = false
            }
        }, [])
    )

    const rolarAtePagamento = useCallback(() => {
        if (frameRolagem.current !== null) {
            cancelAnimationFrame(frameRolagem.current)
        }

        frameRolagem.current = requestAnimationFrame(() => {
            frameRolagem.current = requestAnimationFrame(() => {
                listaRef.current?.scrollToEnd({ animated: true })

                frameRolagem.current = null
                rolarParaPagamento.current = false
            })
        })
    }, [])

    useEffect(() => {
        if (etapa !== "produtos" || !rolarParaPagamento.current) {
            return
        }

        rolarAtePagamento()

        return () => {
            if (frameRolagem.current !== null) {
                cancelAnimationFrame(frameRolagem.current)
                frameRolagem.current = null
            }
        }
    }, [etapa, rolarAtePagamento])

    function alterarQuantidade(id: string, quantidade: number) {
        setQuantidades((atual) => ({
            ...atual,
            [id]: quantidade,
        }))
    }

    function cobrar() {
        if (itens === 0) {
            Alert.alert("Atenção", "Adicione pelo menos um produto.")
            return
        }

        usuarioArrastando.current = false
        rolarParaPagamento.current = true
        setSecaoPagamentoVisivel(true)
        rolarAtePagamento()
    }

    function continuarPagamento() {
        if (!clienteSelecionado) {
            Alert.alert(
                "Cliente obrigatório",
                "Selecione um cliente antes de continuar."
            )
            return
        }

        if (!pagamento) {
            Alert.alert("Atenção", "Selecione uma forma de pagamento.")
            return
        }

        setEtapa("pagamento")
    }

    function voltarParaPagamento() {
        usuarioArrastando.current = false
        rolarParaPagamento.current = true
        setSecaoPagamentoVisivel(true)
        setEtapa("produtos")
    }

    async function confirmarPagamento() {
        if (enviandoVenda.current) {
            return
        }

        if (!clienteSelecionado) {
            Alert.alert("Cliente obrigatório", "Selecione um cliente.")
            voltarParaPagamento()
            return
        }

        if (!pagamento) {
            Alert.alert("Atenção", "Forma de pagamento inválida.")
            voltarParaPagamento()
            return
        }

        if (
            pagamento !== "cartao" &&
            pagamento !== "dinheiro" &&
            pagamento !== "pix"
        ) {
            Alert.alert(
                "Forma de pagamento indisponível",
                "Selecione cartão, dinheiro ou PIX."
            )
            voltarParaPagamento()
            return
        }

        const clienteId = Number(clienteSelecionado.valor)

        const itensVenda = todosProdutos
            .filter((produto) => (quantidades[produto.id] ?? 0) > 0)
            .map((produto) => ({
                produtoId: Number(produto.id),
                quantidade: quantidades[produto.id],
            }))

        if (!Number.isSafeInteger(clienteId) || clienteId <= 0) {
            Alert.alert("Erro", "O ID do cliente selecionado é inválido.")
            return
        }

        if (
            itensVenda.length === 0 ||
            itensVenda.some(
                (item) =>
                    !Number.isSafeInteger(item.produtoId) ||
                    item.produtoId <= 0 ||
                    !Number.isSafeInteger(item.quantidade) ||
                    item.quantidade <= 0
            )
        ) {
            Alert.alert("Erro", "Confira os produtos e as quantidades.")
            return
        }

        enviandoVenda.current = true

        try {
            const resposta = await criarVenda({
                clienteId,
                formaPagamento: pagamento,
                itens: itensVenda,
            })

            setVendaCriada(resposta)
            setEtapa("venda-confirmada")
        } catch (error: unknown) {
            Alert.alert(
                "Não foi possível registrar a venda",
                error instanceof Error
                    ? error.message
                    : "Ocorreu um erro ao salvar a venda. Tente novamente."
            )
        } finally {
            enviandoVenda.current = false
        }
    }

    async function confirmarAgendamento(
        data: Date,
        horario: string,
        tipoEntrega: TipoEntrega,
        sinalPago: number
    ) {
        if (enviandoEncomenda.current) {
            return
        }

        if (!clienteSelecionado) {
            Alert.alert("Cliente obrigatório", "Selecione um cliente.")
            voltarParaPagamento()
            return
        }

        if (itens === 0) {
            Alert.alert("Atenção", "Adicione pelo menos um produto.")
            voltarParaPagamento()
            return
        }

        const itensEncomenda = todosProdutos
            .filter((produto) => (quantidades[produto.id] ?? 0) > 0)
            .map((produto) => ({
                produtoId: produto.id,
                quantidade: quantidades[produto.id],
            }))

        if (
            itensEncomenda.length === 0 ||
            itensEncomenda.some(
                (item) =>
                    !item.produtoId ||
                    !Number.isSafeInteger(item.quantidade) ||
                    item.quantidade <= 0
            )
        ) {
            Alert.alert("Erro", "Confira os produtos e as quantidades.")
            return
        }

        if (!Number.isFinite(sinalPago) || sinalPago < 0 || sinalPago > total) {
            Alert.alert("Sinal inválido", "Confira o valor do sinal pago.")
            return
        }

        const dataEntrega = [
            data.getFullYear(),
            String(data.getMonth() + 1).padStart(2, "0"),
            String(data.getDate()).padStart(2, "0"),
        ].join("-")

        enviandoEncomenda.current = true

        try {
            const resposta = await criarEncomenda({
                clienteId: clienteSelecionado.valor,
                itens: itensEncomenda,
                dataEntrega,
                horario,
                tipoEntrega,
                sinalPago,
                observacoes: "",
            })

            setEncomendaCriada({
                id: resposta.id,
                clienteNome: clienteSelecionado.label,
                total,
                dataEscolhida: data,
                horario,
                tipoEntrega,
                sinalPago,
                quantidadeItens: itens,
            })

            setEtapa("agendamento-confirmado")
        } catch (error: unknown) {
            Alert.alert(
                "Não foi possível criar a encomenda",
                error instanceof Error
                    ? error.message
                    : "Ocorreu um erro ao salvar a encomenda. Tente novamente."
            )
        } finally {
            enviandoEncomenda.current = false
        }
    }

    function iniciarNovaVenda() {
        setQuantidades({})
        setCliente(null)
        setPagamento(null)
        setEncomendaCriada(null)
        setVendaCriada(null)
        setBusca("")
        setSecaoPagamentoVisivel(false)
        rolarParaPagamento.current = false
        usuarioArrastando.current = false
        produtoAdicionado.current = null
        enviandoVenda.current = false
        enviandoEncomenda.current = false
        setEtapa("produtos")
    }

    const cobrarRef = useRef(cobrar)
    cobrarRef.current = cobrar

    const continuarPagamentoRef = useRef(continuarPagamento)
    continuarPagamentoRef.current = continuarPagamento

    useFocusEffect(
        useCallback(() => {
            if (etapa !== "produtos") {
                setCobranca(null)
                return () => setCobranca(null)
            }

            setCobranca({
                itens,
                total,
                desabilitado: secaoPagamentoVisivel
                    ? !cliente || !pagamento
                    : itens === 0,
                textoBotao: secaoPagamentoVisivel
                    ? "Ir para pagamento"
                    : "Continuar",
                onCobrar: () => {
                    if (secaoPagamentoVisivel) {
                        continuarPagamentoRef.current()
                    } else {
                        cobrarRef.current()
                    }
                },
            })

            return () => setCobranca(null)
        }, [
            etapa,
            itens,
            total,
            cliente,
            pagamento,
            secaoPagamentoVisivel,
            setCobranca,
        ])
    )

    if (etapa === "agendamento-confirmado" && encomendaCriada) {
        return (
            <AgendamentoConfirmado
                encomendaId={encomendaCriada.id}
                clienteNome={encomendaCriada.clienteNome}
                total={encomendaCriada.total}
                dataEscolhida={encomendaCriada.dataEscolhida}
                horario={encomendaCriada.horario}
                tipoEntrega={encomendaCriada.tipoEntrega}
                sinalPago={encomendaCriada.sinalPago}
                quantidadeItens={encomendaCriada.quantidadeItens}
                onVerEncomendas={() => navigation.navigate("Encomendas")}
                onNovaVenda={iniciarNovaVenda}
            />
        )
    }

    if (etapa === "venda-confirmada" && vendaCriada && pagamento) {
        return (
            <VendaConfirmada
                total={vendaCriada.total}
                pagamento={pagamento}
                clienteNome={vendaCriada.cliente}
                vendaId={vendaCriada.id}
                onVoltar={() => navigation.navigate("Inicio")}
                onVerPedidos={() => navigation.navigate("Pedidos")}
                onNovaVenda={iniciarNovaVenda}
            />
        )
    }

    if (etapa === "pagamento") {
        if (pagamento === "agendar") {
            return (
                <AgendarPagamento
                    total={total}
                    clienteNome={clienteSelecionado?.label ?? ""}
                    onVoltar={voltarParaPagamento}
                    onConfirmar={confirmarAgendamento}
                    onTrocarForma={voltarParaPagamento}
                />
            )
        }

        if (pagamento === "pix") {
            return (
                <PagamentoPix
                    total={total}
                    clienteNome={clienteSelecionado?.label ?? ""}
                    onVoltar={voltarParaPagamento}
                    onConfirmar={confirmarPagamento}
                    onTrocarForma={voltarParaPagamento}
                />
            )
        }

        if (pagamento === "cartao") {
            return (
                <PagamentoCartao
                    total={total}
                    clienteNome={clienteSelecionado?.label ?? ""}
                    onVoltar={voltarParaPagamento}
                    onConfirmar={confirmarPagamento}
                    onTrocarForma={voltarParaPagamento}
                />
            )
        }

        if (pagamento === "dinheiro") {
            return (
                <PagamentoDinheiro
                    total={total}
                    clienteNome={clienteSelecionado?.label ?? ""}
                    onVoltar={voltarParaPagamento}
                    onConfirmar={confirmarPagamento}
                    onTrocarForma={voltarParaPagamento}
                />
            )
        }

        return null
    }

    return (
        <AppLayout
            header={{
                tipo: "buscaVoltar",
                titulo: "Cobrar pedido",
                busca,
                onChangeBusca: setBusca,
            }}
        >
            <FlatList
                ref={listaRef}
                data={produtos}
                keyExtractor={(produto) => produto.id}
                numColumns={2}
                columnWrapperStyle={style.coluna}
                contentContainerStyle={style.lista}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={16}
                onScrollBeginDrag={() => {
                    usuarioArrastando.current = true
                }}
                onScroll={(event) => {
                    const {
                        contentOffset,
                        contentSize,
                        layoutMeasurement,
                    } = event.nativeEvent

                    const distanciaDoFinal =
                        contentSize.height -
                        (contentOffset.y + layoutMeasurement.height)

                    if (
                        usuarioArrastando.current &&
                        distanciaDoFinal > 120 &&
                        secaoPagamentoVisivel
                    ) {
                        setSecaoPagamentoVisivel(false)
                    }
                }}
                onScrollEndDrag={() => {
                    usuarioArrastando.current = false
                }}
                onMomentumScrollEnd={() => {
                    usuarioArrastando.current = false
                }}
                renderItem={({ item }) => (
                    <ProdutoCard
                        tipo="quantidade"
                        produto={item}
                        quantidade={quantidades[item.id] ?? 0}
                        onChangeQuantidade={(quantidade) =>
                            alterarQuantidade(item.id, quantidade)
                        }
                    />
                )}
                ListEmptyComponent={
                    <Text style={style.vazio}>
                        {erro ??
                            (carregando
                                ? "Carregando produtos..."
                                : "Nenhum produto encontrado.")}
                    </Text>
                }
                ListFooterComponent={
                    <View style={style.formulario}>
                        {erro && (
                            <Text style={style.vazio}>{erro}</Text>
                        )}

                        <Dropdown
                            label="Cliente"
                            placeholder="Selecione o cliente"
                            opcoes={clientes}
                            valor={cliente}
                            onChange={setCliente}
                        />

                        <View style={style.bloco}>
                            <Text style={style.rotulo}>
                                Forma de Pagamento
                            </Text>

                            <View style={style.linhaPagamento}>
                                {PAGAMENTOS.map((tipo) => (
                                    <FormaPagamento
                                        key={tipo}
                                        tipo={tipo}
                                        selecionado={pagamento === tipo}
                                        onPress={() => setPagamento(tipo)}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                }
                onContentSizeChange={() => {
                    if (rolarParaPagamento.current) {
                        rolarAtePagamento()
                    }
                }}
            />
        </AppLayout>
    )
}
