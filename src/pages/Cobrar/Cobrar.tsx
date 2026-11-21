
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Alert, FlatList, Text, View } from "react-native"
import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"

import { style } from "./style"
import AppLayout from "../../components/AppLayout/AppLayout"
import ProdutoCard from "../../components/ProdutoCard/"
import Dropdown from "../../components/Dropdown/"
import FormaPagamento, {
    PAGAMENTOS,
    TipoPagamento,
} from "../../components/FormaPagamento/"
import { useNavBar } from "../../contexts/NavBarContext"
import { filtrarProdutos, listarClientes, listarProdutos } from "../../services/produtos"
import { criarVenda } from "../../services/vendas"
import type { VendaResponse } from "../../services/vendas"
import type { DropdownOpcao } from "../../components/Dropdown/"
import type { Produto } from "../../types/produto"
import PagamentoCartao from "../PagamentoCartao/PagamentoCartao"
import PagamentoDinheiro from "../PagamentoDinheiro/PagamentoDinheiro"
import PagamentoPix from "../PagamentoPix/PagamentoPix"
import AgendarPagamento from "../AgendarPagamento/AgendarPagamento"
import AgendamentoConfirmado from "../AgendamentoConfirmado/AgendamentoConfirmado"
import type { AppParamList, RootTabParamList } from "../../routes"
import VendaConfirmada from "../VendaConfirmada/VendaConfirmada"

export default function Cobrar() {
    const { setCobranca } = useNavBar()
    const navigation = useNavigation<NavigationProp<AppParamList>>()
    const route = useRoute<RouteProp<RootTabParamList, "Cobrar">>()

    const [busca, setBusca] = useState("")
    const [quantidades, setQuantidades] = useState<Record<string, number>>({})
    const [cliente, setCliente] = useState<string | null>(null)
    const [pagamento, setPagamento] = useState<TipoPagamento | null>(null)
    const [todosProdutos, setTodosProdutos] = useState<Produto[]>([])
    const [clientes, setClientes] = useState<DropdownOpcao[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [vendaCriada, setVendaCriada] = useState<VendaResponse | null>(null)
    const produtoAdicionado = useRef<string | null>(null)

    // Impede duas requisições simultâneas de venda.
    const enviandoVenda = useRef(false)

    const [etapa, setEtapa] = useState<
        "produtos" | "pagamento" | "agendamento-confirmado" | "venda-confirmada"
    >("produtos")

    const [dataAgendada, setDataAgendada] = useState<Date | null>(null)

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
        if (!produtoId || todosProdutos.length === 0 || produtoAdicionado.current === produtoId) {
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
        let itens = 0
        let total = 0

        for (const produto of todosProdutos) {
            const quantidade = quantidades[produto.id] ?? 0
            itens += quantidade
            total += quantidade * produto.preco
        }

        return { itens, total }
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

    async function confirmarPagamento() {
        if (enviandoVenda.current) {
            return
        }

        if (!clienteSelecionado) {
            Alert.alert("Cliente obrigatório", "Selecione um cliente.")
            setEtapa("produtos")
            return
        }

        if (!pagamento || pagamento === "agendar") {
            Alert.alert("Atenção", "Forma de pagamento inválida.")
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

    function confirmarAgendamento(data: Date) {
        setDataAgendada(data)
        setEtapa("agendamento-confirmado")
    }

    function iniciarNovaVenda() {
        setQuantidades({})
        setCliente(null)
        setPagamento(null)
        setDataAgendada(null)
        setVendaCriada(null)
        enviandoVenda.current = false
        setEtapa("produtos")
    }

    const cobrarRef = useRef(cobrar)
    cobrarRef.current = cobrar

    useFocusEffect(
        useCallback(() => {
            if (etapa !== "produtos") {
                setCobranca(null)
                return () => setCobranca(null)
            }

            setCobranca({
                itens,
                total,
                desabilitado: itens === 0 || !pagamento || !cliente,
                onCobrar: () => cobrarRef.current(),
            })

            return () => setCobranca(null)
        }, [etapa, itens, total, pagamento, cliente, setCobranca])
    )

    if (etapa === "agendamento-confirmado" && dataAgendada) {
        return (
            <AgendamentoConfirmado
                total={total}
                dataEscolhida={dataAgendada}
                onVerPendentes={() => navigation.navigate("Pedidos")}
                onNovaVenda={iniciarNovaVenda}
            />
        )
    }

    if (etapa === "venda-confirmada" && vendaCriada && pagamento && pagamento !== "agendar") {
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
                    onVoltar={() => setEtapa("produtos")}
                    onConfirmar={confirmarAgendamento}
                    onTrocarForma={() => setEtapa("produtos")}
                />
            )
        }

        if (pagamento === "pix") {
            return (
                <PagamentoPix
                    total={total}
                    clienteNome={clienteSelecionado?.label ?? ""}
                    onVoltar={() => setEtapa("produtos")}
                    onConfirmar={confirmarPagamento}
                    onTrocarForma={() => setEtapa("produtos")}
                />
            )
        }

        if (pagamento === "cartao") {
            return (
                <PagamentoCartao
                    total={total}
                    clienteNome={clienteSelecionado?.label ?? ""}
                    onVoltar={() => setEtapa("produtos")}
                    onConfirmar={confirmarPagamento}
                    onTrocarForma={() => setEtapa("produtos")}
                />
            )
        }

        return (
            <PagamentoDinheiro
                total={total}
                clienteNome={clienteSelecionado?.label ?? ""}
                onVoltar={() => setEtapa("produtos")}
                onConfirmar={confirmarPagamento}
                onTrocarForma={() => setEtapa("produtos")}
            />
        )
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
                data={produtos}
                keyExtractor={(produto) => produto.id}
                numColumns={2}
                columnWrapperStyle={style.coluna}
                contentContainerStyle={style.lista}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
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
                        {erro && <Text style={style.vazio}>{erro}</Text>}

                        <Dropdown
                            label="Cliente"
                            placeholder="Selecione o cliente"
                            opcoes={clientes}
                            valor={cliente}
                            onChange={setCliente}
                        />

                        <View style={style.bloco}>
                            <Text style={style.rotulo}>Forma de Pagamento</Text>

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
            />
        </AppLayout>
    )
}
