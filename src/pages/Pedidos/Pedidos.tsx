
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FlatList, Pressable, ScrollView, Text } from "react-native"
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import type { NavigationProp, RouteProp } from "@react-navigation/native"
import type { RootTabParamList } from "../../routes"

import { style } from "./style"
import AppLayout from "../../components/AppLayout/AppLayout"
import PedidoCard from "../../components/PedidoCard/"
import PopupStatus, { type TipoPopup } from "../../components/PopupStatus"
import { listarPedidos } from "../../services/pedido"
import { cancelarVenda } from "../../services/vendas"
import type { Pedido } from "../../types/pedido"

type FiltroStatus = "todos" | "pendente" | "pago" | "cancelado"

type ChipProps = {
    texto: string
    ativo: boolean
    estilo: object
    estiloTexto: object
    onPress: () => void
}

function Chip({ texto, ativo, estilo, estiloTexto, onPress }: ChipProps) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: ativo }}
            style={[style.chip, estilo, ativo && style.chipAtivo]}
        >
            <Text style={[style.chipTexto, estiloTexto, ativo && style.chipTextoAtivo]}>
                {texto}
            </Text>
        </Pressable>
    )
}

export default function Pedidos() {
    const route = useRoute<RouteProp<RootTabParamList, "Pedidos">>()
    const navigation = useNavigation<NavigationProp<RootTabParamList>>()

    const [popupVisivel, setPopupVisivel] = useState(false)
    const [popupTipo, setPopupTipo] = useState<TipoPopup>("confirmacao")
    const [popupTitulo, setPopupTitulo] = useState("")
    const [popupMensagem, setPopupMensagem] = useState("")
    const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null)
    const [cancelando, setCancelando] = useState(false)

    const [filtro, setFiltro] = useState<FiltroStatus>(
        route.params?.filtro ?? "todos"
    )

    const [todos, setTodos] = useState<Pedido[]>([])
    const [erro, setErro] = useState<string | null>(null)

    const filtrosScrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null)

    useEffect(() => {
        const filtroRecebido = route.params?.filtro

        if (!filtroRecebido) return

        setFiltro(filtroRecebido)
        navigation.setParams({ filtro: undefined })
    }, [route.params?.filtro, navigation])

    useEffect(() => {
        requestAnimationFrame(() => {
            if (filtro === "pago" || filtro === "cancelado") {
                filtrosScrollRef.current?.scrollToEnd({ animated: true })
            } else if (filtro === "todos") {
                filtrosScrollRef.current?.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                })
            }
        })
    }, [filtro])

    useFocusEffect(
        useCallback(() => {
            let ativo = true

            setErro(null)

            listarPedidos()
                .then((lista) => {
                    if (ativo) {
                        setTodos(lista)
                        setErro(null)
                    }
                })
                .catch((error: unknown) => {
                    if (ativo) {
                        setTodos([])
                        setErro(
                            error instanceof Error
                                ? error.message
                                : "Não foi possível carregar os pedidos."
                        )
                    }
                })

            return () => {
                ativo = false
            }
        }, [])
    )

    function solicitarCancelamento(pedido: Pedido) {
        if (pedido.status === "cancelado") return

        setPedidoSelecionado(pedido)
        setPopupTipo("confirmacao")
        setPopupTitulo(`Cancelar pedido #${pedido.id}?`)
        setPopupMensagem(
            "O pedido será marcado como cancelado. O estoque dos produtos será restaurado e o estorno financeiro será registrado. O pedido continuará no histórico."
        )
        setPopupVisivel(true)
    }

    function fecharPopup() {
        if (cancelando) return

        setPopupVisivel(false)
        setPedidoSelecionado(null)
    }

    async function executarCancelamento() {
        if (!pedidoSelecionado || cancelando) return

        const vendaId = pedidoSelecionado.vendaId

        try {
            setCancelando(true)

            await cancelarVenda(vendaId)

            // Atualiza imediatamente o pedido na tela.
            setTodos((pedidosAtuais) =>
                pedidosAtuais.map((pedido) =>
                    pedido.vendaId === vendaId
                        ? { ...pedido, status: "cancelado" as const }
                        : pedido
                )
            )

            setPedidoSelecionado(null)
            setPopupTipo("sucesso")
            setPopupTitulo("Pedido cancelado!")
            setPopupMensagem(
                "O pedido foi mantido no histórico, o estoque foi atualizado e o estorno financeiro foi registrado."
            )

            // Sincroniza novamente com o backend.
            try {
                const pedidosAtualizados = await listarPedidos()
                setTodos(pedidosAtualizados)
            } catch {
                // Mantém a atualização local caso a consulta falhe.
            }
        } catch (error) {
            setPopupTipo("erro")
            setPopupTitulo("Não foi possível cancelar")
            setPopupMensagem(
                error instanceof Error
                    ? error.message
                    : "Ocorreu um erro ao cancelar o pedido. Tente novamente."
            )
        } finally {
            setCancelando(false)
        }
    }

    const pendentes = todos.filter((p) => p.status === "pendente").length
    const pagos = todos.filter((p) => p.status === "pago").length
    const cancelados = todos.filter((p) => p.status === "cancelado").length

    const pedidos = useMemo(
        () =>
            filtro === "todos"
                ? todos
                : todos.filter((p) => p.status === filtro),
        [todos, filtro]
    )

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Pedidos", semVoltar: false }}>
            <ScrollView
                ref={filtrosScrollRef}
                horizontal={true}
                directionalLockEnabled={true}
                nestedScrollEnabled={true}
                showsHorizontalScrollIndicator={true}
                bounces={false}
                style={{
                    flexGrow: 0,
                    flexShrink: 0,
                    width: "100%",
                }}
                contentContainerStyle={style.filtros}
            >
                <Chip
                    texto={`Todos (${todos.length})`}
                    ativo={filtro === "todos"}
                    estilo={{}}
                    estiloTexto={{}}
                    onPress={() => setFiltro("todos")}
                />

                <Chip
                    texto={`Pendentes (${pendentes})`}
                    ativo={filtro === "pendente"}
                    estilo={style.chipPendentes}
                    estiloTexto={style.chipTextoPendentes}
                    onPress={() => setFiltro("pendente")}
                />

                <Chip
                    texto={`Pagos (${pagos})`}
                    ativo={filtro === "pago"}
                    estilo={style.chipPagos}
                    estiloTexto={style.chipTextoPagos}
                    onPress={() => setFiltro("pago")}
                />

                <Chip
                    texto={`Cancelados (${cancelados})`}
                    ativo={filtro === "cancelado"}
                    estilo={style.chipCancelados}
                    estiloTexto={style.chipTextoCancelados}
                    onPress={() => setFiltro("cancelado")}
                />
            </ScrollView>

            <FlatList
                data={pedidos}
                keyExtractor={(p) => p.id}
                contentContainerStyle={style.lista}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <PedidoCard
                        id={item.id}
                        data={item.data}
                        status={item.status}
                        cliente={item.cliente}
                        itens={item.itens}
                        total={item.total}
                        onCancelar={() => solicitarCancelamento(item)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={style.vazio}>
                        {erro ?? "Nenhum pedido encontrado."}
                    </Text>
                }
            />

            <PopupStatus
                visivel={popupVisivel}
                tipo={popupTipo}
                titulo={popupTitulo}
                mensagem={popupMensagem}
                textoConfirmar="Cancelar pedido"
                textoCarregando="Cancelando..."
                carregando={cancelando}
                onFechar={fecharPopup}
                onConfirmar={executarCancelamento}
            />
        </AppLayout>
    )
}
