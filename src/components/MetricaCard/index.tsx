// src/components/MetricaCard/MetricaCard.tsx
import React from "react"
import { Text, View } from "react-native"

import { style } from "./style"
import { themes } from "../../global/themes"
import { formatarMoeda } from "../../utils/formataMoeda"
import type { TipoMetrica } from "../../types/dashboard"

const CONFIG: Record<TipoMetrica, { rotulo: string; corPonto: string; corValor: string }> = {
    lucro: {
        rotulo: "Lucro",
        corPonto: themes.colors["sucesso"],
        corValor: themes.colors["sucesso"],
    },
    custo: {
        rotulo: "Custo",
        corPonto: themes.colors["erro"],
        corValor: themes.colors["erro"],
    },
    investido: {
        rotulo: "Investido",
        corPonto: themes.colors["dourado"],
        corValor: themes.colors["azul-escuro"],
    },
}

type MetricaCardProps = {
    tipo: TipoMetrica
    valor: number
}

export default function MetricaCard({ tipo, valor }: MetricaCardProps) {
    const config = CONFIG[tipo]

    return (
        <View style={style.card}>
            <View style={style.topo}>
                <View style={[style.ponto, { backgroundColor: config.corPonto }]} />
                <Text style={style.rotulo}>{config.rotulo}</Text>
            </View>

            <Text
                style={[style.valor, { color: config.corValor }]}
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                {formatarMoeda(valor)}
            </Text>
        </View>
    )
}