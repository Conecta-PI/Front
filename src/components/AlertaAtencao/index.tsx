
import React from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { CommonActions, NavigationProp, useNavigation } from "@react-navigation/native"

import { style } from "./style"
import { themes } from "../../global/themes"
import type { TipoAlerta } from "../../types/dashboard"
import type { AppParamList, Destino } from "../../routes"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

type Config = {
    titulo: string
    icone: IconName
    cor: string
    fundo: string
    destino: Destino
    filtro?: "pendente" | "pago" | "cancelado"
    descricao: (n: number) => string
}

const CONFIG: Record<TipoAlerta, Config> = {
    critico: {
        titulo: "Estoque crítico",
        icone: "warning-outline",
        cor: themes.colors["erro"],
        fundo: themes.colors["fundo-de-erro"],
        destino: "Estoque",
        descricao: (n) =>
            n === 1 ? "1 item em situação crítica" : `${n} itens em situação crítica`,
    },
    aviso: {
        titulo: "Estoque baixo",
        icone: "alert-circle-outline",
        cor: themes.colors["alerta"],
        fundo: themes.colors["fundo-de-alerta"],
        destino: "Estoque",
        descricao: (n) =>
            n === 1 ? "1 item precisa ser reposto" : `${n} itens precisam ser repostos`,
    },
    informativo: {
        titulo: "Encomendas hoje",
        icone: "time-outline",
        cor: themes.colors["sucesso"],
        fundo: themes.colors["fundo-de-sucesso"],
        destino: "Encomendas",
        descricao: (n) =>
            n === 1 ? "1 entrega agendada para hoje" : `${n} entregas agendadas para hoje`,
    },
    pedidoPendente: {
        titulo: "Pedidos aguardando confirmação",
        icone: "time-outline",
        cor: themes.colors["alerta"],
        fundo: themes.colors["fundo-de-alerta"],
        destino: "Pedidos",
        filtro: "pendente",
        descricao: (n) =>
            n === 1 ? "1 pedido pendente" : `${n} pedidos pendentes`,
    },
    pedidoPago: {
        titulo: "Pedidos pagos",
        icone: "checkmark-circle-outline",
        cor: themes.colors["sucesso"],
        fundo: themes.colors["fundo-de-sucesso"],
        destino: "Pedidos",
        filtro: "pago",
        descricao: (n) =>
            n === 1 ? "1 pedido pago" : `${n} pedidos pagos`,
    },
    pedidoCancelado: {
        titulo: "Pedidos cancelados",
        icone: "close-circle-outline",
        cor: themes.colors["erro"],
        fundo: themes.colors["fundo-de-erro"],
        destino: "Pedidos",
        filtro: "cancelado",
        descricao: (n) =>
            n === 1 ? "1 pedido cancelado" : `${n} pedidos cancelados`,
    },
}

type AlertaAtencaoProps = {
    tipo: TipoAlerta
    quantidade: number
    encomendaHojeId?: string
}

export default function AlertaAtencao({
    tipo,
    quantidade,
    encomendaHojeId,
}: AlertaAtencaoProps) {
    const navigation = useNavigation<NavigationProp<AppParamList>>()
    const config = CONFIG[tipo]

    return (
        <Pressable
            onPress={() => {
                if (tipo === "informativo" && encomendaHojeId) {
                    navigation.navigate("DetalheEncomenda", { id: encomendaHojeId })
                    return
                }

                if (config.filtro) {
                    navigation.navigate("Pedidos", { filtro: config.filtro })
                    return
                }

                navigation.dispatch(CommonActions.navigate(config.destino))
            }}
            accessibilityRole="button"
            style={({ pressed }) => [style.container, pressed && style.pressionado]}
        >
            <View style={[style.icone, { backgroundColor: config.fundo }]}>
                <Ionicons name={config.icone} size={22} color={config.cor} />
            </View>

            <View style={style.textos}>
                <Text style={style.titulo}>{config.titulo}</Text>
                <Text style={[style.descricao, { color: config.cor }]}>
                    {config.descricao(quantidade)}
                </Text>
            </View>

            <Ionicons
                name="chevron-forward"
                size={20}
                color={themes.colors["marrom-suave"]}
            />
        </Pressable>
    )
}
