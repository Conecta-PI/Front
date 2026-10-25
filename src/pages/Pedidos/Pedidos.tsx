import React, { useMemo, useState } from "react"
import { FlatList, Pressable, Text, View } from "react-native"

import { style } from "./style"
import AppLayout from "../../components/AppLayout/AppLayout"
import PedidoCard from "../../components/PedidoCard/"
import { listarPedidos } from "../../services/pedido"
import type { StatusPedido } from "../../types/pedido"

type FiltroStatus = "todos" | StatusPedido

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
    const [filtro, setFiltro] = useState<FiltroStatus>("todos")

    const todos = useMemo(() => listarPedidos(), [])

    const pendentes = todos.filter((p) => p.status === "pendente").length
    const pagos = todos.filter((p) => p.status === "pago").length

    const pedidos = useMemo(
        () => (filtro === "todos" ? todos : todos.filter((p) => p.status === filtro)),
        [todos, filtro]
    )

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Pedidos", semVoltar: false }}>
            <View style={style.filtros}>
                <Chip
                    texto={`Todos (${todos.length})`}
                    ativo={filtro === "todos"}
                    estilo={style.chipTodos}
                    estiloTexto={style.chipTextoTodos}
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
            </View>

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
                    />
                )}
                ListEmptyComponent={
                    <Text style={style.vazio}>Nenhum pedido encontrado.</Text>
                }
            />
        </AppLayout>
    )
}