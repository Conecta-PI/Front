// src/components/AlertaAtencao/AlertaAtencao.tsx
import React from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { NavigationProp, useNavigation } from "@react-navigation/native"

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
    descricao: (n: number) => string
}

const CONFIG: Record<TipoAlerta, Config> = {
    critico: {
        titulo: "Estoque baixo",
        icone: "warning-outline",
        cor: themes.colors["erro"],
        fundo: themes.colors["fundo-de-erro"],
        destino: "Estoque",
        descricao: (n) =>
            n === 1 ? "1 item precisa ser reposto" : `${n} itens precisam ser repostos`,
    },
    aviso: {
        titulo: "Pedidos pendentes",
        icone: "alert-circle-outline",
        cor: themes.colors["alerta"],
        fundo: themes.colors["fundo-de-alerta"],
        destino: "Pedidos",
        descricao: (n) =>
            n === 1 ? "1 pedido aguardando confirmação" : `${n} pedidos aguardando confirmação`,
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
}

type AlertaAtencaoProps = {
    tipo: TipoAlerta
    quantidade: number
}

export default function AlertaAtencao({ tipo, quantidade }: AlertaAtencaoProps) {
    const navigation = useNavigation<NavigationProp<AppParamList>>()
    const config = CONFIG[tipo]

    return (
        <Pressable
            onPress={() => navigation.navigate(config.destino)}
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

            <Ionicons name="chevron-forward" size={20} color={themes.colors["marrom-suave"]} />
        </Pressable>
    )
}