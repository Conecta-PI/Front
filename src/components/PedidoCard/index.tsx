import React from "react"
import { Pressable, Text, View } from "react-native"

import { style } from "./style"
import { themes } from "../../global/themes"
import { formatarMoeda } from "../../utils/formataMoeda"
import type { ItemPedido, StatusPedido } from "../../types/pedido"

const CONFIG: Record<
    StatusPedido,
    { texto: string; cor: string; fundo: string; corTotal: string }
> = {
    pago: {
        texto: "Pago",
        cor: themes.colors["sucesso"],
        fundo: themes.colors["fundo-de-sucesso"],
        corTotal: themes.colors["sucesso"],
    },
    pendente: {
        texto: "Pendente",
        cor: themes.colors["marrom-suave"],
        fundo: themes.colors["campo-desabilitado"],
        corTotal: themes.colors["texto"],
    },
}

type PedidoCardProps = {
    id: string
    data: string
    status: StatusPedido
    cliente: string
    itens: ItemPedido[]
    total: number
    onPress?: () => void
}

export default function PedidoCard({
    id,
    data,
    status,
    cliente,
    itens,
    total,
    onPress,
}: PedidoCardProps) {
    const config = CONFIG[status]

    const resumo = itens.map((i) => `${i.quantidade}x ${i.nome}`).join(" • ")

    return (
        <Pressable
            disabled={!onPress}
            onPress={onPress}
            accessibilityRole={onPress ? "button" : undefined}
            accessibilityLabel={`Pedido ${id}, ${cliente}, ${config.texto}`}
            style={({ pressed }) => [style.card, pressed && style.pressionado]}
        >
            <View style={style.topo}>
                <View style={style.identificacao}>
                    <Text style={style.id}>#{id}</Text>
                    <Text style={style.data}>• {data}</Text>
                </View>

                <View style={[style.status, { backgroundColor: config.fundo }]}>
                    <Text style={[style.statusTexto, { color: config.cor }]}>
                        {config.texto}
                    </Text>
                </View>
            </View>

            <View style={style.corpo}>
                <Text style={style.cliente} numberOfLines={1}>
                    {cliente}
                </Text>
                <Text style={style.itens} numberOfLines={2}>
                    {resumo}
                </Text>
            </View>

            <View style={style.rodape}>
                <Text style={style.rotuloTotal}>Total cobrado</Text>
                <Text style={[style.total, { color: config.corTotal }]}>
                    {formatarMoeda(total)}
                </Text>
            </View>
        </Pressable>
    )
}