// src/components/GraficoLucroMensal/GraficoLucroMensal.tsx
import React, { useState } from "react"
import { Text, View } from "react-native"
import { BarChart } from "react-native-gifted-charts"

import { style } from "./style"
import { themes } from "../../global/themes"

type GraficoLucroMensalProps = {
    dados: { mes: string; valor: number }[]
    titulo?: string
    legenda?: string
}

const LARGURA_BARRA = 16
const ALTURA = 110

export default function GraficoLucroMensal({
    dados,
    titulo = "Lucro mensal",
    legenda = "Receita líquida",
}: GraficoLucroMensalProps) {
    const [largura, setLargura] = useState(0)

    const espaco = dados.length > 0 ? (largura - dados.length * LARGURA_BARRA) / dados.length : 0
    const maximo = Math.max(...dados.map((d) => d.valor), 1)

    const data = dados.map((d) => ({
        value: d.valor,
        label: d.mes,
        frontColor: themes.colors["dourado"],
    }))

    return (
        <View style={style.card}>
            <View style={style.topo}>
                <Text style={style.titulo}>{titulo}</Text>

                <View style={style.legenda}>
                    <View style={style.ponto} />
                    <Text style={style.textoLegenda}>{legenda}</Text>
                </View>
            </View>

            <View onLayout={(e) => setLargura(e.nativeEvent.layout.width)}>
                {largura > 0 && (
                    <BarChart
                        data={data}
                        width={largura}
                        height={ALTURA}
                        maxValue={maximo}
                        barWidth={LARGURA_BARRA}
                        spacing={espaco}
                        initialSpacing={espaco / 2}
                        endSpacing={espaco / 2}
                        barBorderTopLeftRadius={4}
                        barBorderTopRightRadius={4}
                        hideRules
                        hideYAxisText
                        yAxisThickness={0}
                        xAxisThickness={0}
                        yAxisLabelWidth={0}
                        noOfSections={1}
                        disableScroll
                        isAnimated
                        xAxisLabelTextStyle={style.rotuloX}
                    />
                )}
            </View>
        </View>
    )
}