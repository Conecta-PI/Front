import React, { useEffect, useMemo, useRef, useState } from "react"
import { Animated, Easing, Text, useWindowDimensions, View } from "react-native"
import type { LayoutChangeEvent } from "react-native"
import { StatusBar } from "expo-status-bar"
import Svg, { Circle, Path } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import type { RootStackParamList } from "../../routes"
import { style } from "./style"

type Ponto = { x: number; y: number }
type PontoRaio = Ponto & { r: number }
type Quadro = PontoRaio & { t: number }

const COR_BRANCA = "#FFFFFF"
const COR_BOLINHA = "#D9A441"

// ---- Geometria do logo (unidades do viewBox 300x300) ----
const VIEWBOX = 300
const CENTRO: Ponto = { x: 150, y: 150 }
const RAIO_ARCO = 108 // raio da linha central do "C"
const ESPESSURA_ARCO = 24 // espessura do "C"
const ABERTURA_GRAUS = 42 // abertura do "C" (para cada lado)
const ESPESSURA_LINHA = 10 // espessura da linha em zigue-zague

// Nós brancos (o último encosta na ponta superior do "C")
const NOS: PontoRaio[] = [
    { x: 98, y: 196, r: 20 },
    { x: 158, y: 138, r: 16 },
    { x: 198, y: 174, r: 20 },
    { x: 254, y: 98, r: 22 },
]

// ---- Tempos da animação (ms) ----
const TEMPOS = {
    surgir: 280,
    pausaNo: 120,
    trechos: [560, 380, 620],
    arco: 1500,
    queda: 520,
    quicada1: 340,
    quicada2: 190,
}
const ESPERA_FINAL = 900
const RAIO_MINIMO = 0.01

const interpolar = (a: number, b: number, f: number) => a + (b - a) * f
const easeInOutSeno = (s: number) => -(Math.cos(Math.PI * s) - 1) / 2
const easeInSeno = (s: number) => 1 - Math.cos((s * Math.PI) / 2)
const easeOutCubico = (s: number) => 1 - Math.pow(1 - s, 3)

function pontoDoArco(graus: number): Ponto {
    const rad = (graus * Math.PI) / 180
    return {
        x: CENTRO.x + Math.cos(rad) * RAIO_ARCO,
        y: CENTRO.y + Math.sin(rad) * RAIO_ARCO,
    }
}

const ARCO_INICIO = pontoDoArco(-ABERTURA_GRAUS)
const ARCO_FIM = pontoDoArco(ABERTURA_GRAUS)

const CAMINHO_ARCO = `M${ARCO_INICIO.x.toFixed(2)} ${ARCO_INICIO.y.toFixed(2)} A${RAIO_ARCO} ${RAIO_ARCO} 0 1 0 ${ARCO_FIM.x.toFixed(2)} ${ARCO_FIM.y.toFixed(2)}`
const CAMINHO_LINHA = NOS.map((no, i) => `${i === 0 ? "M" : "L"}${no.x} ${no.y}`).join(" ")

/**
 * Raio do maior círculo que cabe dentro da forma branca (nó + linha saindo dele).
 * No centro do nó = raio do nó; conforme entra na linha, encolhe até a meia largura.
 */
function raioInscrito(distancia: number, raioNo: number, meiaLargura: number) {
    const limite = Math.sqrt(Math.max(raioNo * raioNo - meiaLargura * meiaLargura, 0))
    const d = Math.max(distancia, 0)

    if (d >= limite) {
        return meiaLargura
    }

    return Math.sqrt((limite - d) * (limite - d) + meiaLargura * meiaLargura)
}

function trechoDaLinha(de: PontoRaio, para: PontoRaio, passos: number): PontoRaio[] {
    const comprimento = Math.hypot(para.x - de.x, para.y - de.y)
    const meia = ESPESSURA_LINHA / 2

    return Array.from({ length: passos + 1 }, (_, i) => {
        const f = i / passos
        const d = comprimento * f

        return {
            x: interpolar(de.x, para.x, f),
            y: interpolar(de.y, para.y, f),
            r: Math.max(
                raioInscrito(d, de.r, meia),
                raioInscrito(comprimento - d, para.r, meia),
            ),
        }
    })
}

// Do último nó até a ponta do "C" e depois ao redor dele
function trechoDoArco(): PontoRaio[] {
    const meia = ESPESSURA_ARCO / 2
    const ultimoNo = NOS[NOS.length - 1]
    const salto = Math.hypot(ARCO_INICIO.x - ultimoNo.x, ARCO_INICIO.y - ultimoNo.y)
    const pontos: PontoRaio[] = []

    for (let i = 0; i <= 10; i += 1) {
        const f = i / 10
        pontos.push({
            x: interpolar(ultimoNo.x, ARCO_INICIO.x, f),
            y: interpolar(ultimoNo.y, ARCO_INICIO.y, f),
            r: raioInscrito(salto * f, ultimoNo.r, meia),
        })
    }

    const passos = 46
    const varredura = 360 - ABERTURA_GRAUS * 2

    for (let i = 1; i <= passos; i += 1) {
        const ponto = pontoDoArco(-ABERTURA_GRAUS - (varredura * i) / passos)
        pontos.push({ ...ponto, r: meia })
    }

    return pontos
}

// Reamostra um caminho por comprimento, aplicando uma curva de aceleração
function gerarQuadros(
    caminho: PontoRaio[],
    duracao: number,
    amostras: number,
    easing: (s: number) => number,
    tempoInicial: number,
): Quadro[] {
    const acumulado = [0]

    for (let i = 1; i < caminho.length; i += 1) {
        acumulado.push(
            acumulado[i - 1] +
                Math.hypot(caminho[i].x - caminho[i - 1].x, caminho[i].y - caminho[i - 1].y),
        )
    }

    const total = acumulado[acumulado.length - 1] || 1
    const quadros: Quadro[] = []
    let indice = 0

    for (let n = 1; n <= amostras; n += 1) {
        const tau = n / amostras
        const distancia = easing(tau) * total

        while (indice < caminho.length - 2 && acumulado[indice + 1] < distancia) {
            indice += 1
        }

        const a = caminho[indice]
        const b = caminho[indice + 1]
        const comprimento = acumulado[indice + 1] - acumulado[indice] || 1
        const f = Math.min(Math.max((distancia - acumulado[indice]) / comprimento, 0), 1)

        quadros.push({
            t: tempoInicial + duracao * tau,
            x: interpolar(a.x, b.x, f),
            y: interpolar(a.y, b.y, f),
            r: interpolar(a.r, b.r, f),
        })
    }

    return quadros
}

// Tudo em px: símbolo (escala do viewBox) + queda e quicadas até o alvo
function criarQuadros(escala: number, alvo: Ponto, raioFinal: number): Quadro[] {
    const emPx = (p: PontoRaio): PontoRaio => ({
        x: p.x * escala,
        y: p.y * escala,
        r: p.r * escala,
    })

    const primeiro = emPx(NOS[0])
    const quadros: Quadro[] = [{ ...primeiro, r: RAIO_MINIMO, t: 0 }]
    const ultimo = () => quadros[quadros.length - 1]
    const segurar = (duracao: number) => {
        quadros.push({ ...ultimo(), t: ultimo().t + duracao })
    }

    // 1) bolinha surge preenchendo o primeiro nó
    for (let i = 1; i <= 6; i += 1) {
        const s = i / 6
        quadros.push({
            ...primeiro,
            r: Math.max(primeiro.r * easeOutCubico(s), RAIO_MINIMO),
            t: TEMPOS.surgir * s,
        })
    }
    segurar(TEMPOS.pausaNo)

    // 2) zigue-zague: enche os nós, encolhe na linha
    for (let i = 0; i < NOS.length - 1; i += 1) {
        const trecho = trechoDaLinha(NOS[i], NOS[i + 1], 40).map(emPx)
        quadros.push(...gerarQuadros(trecho, TEMPOS.trechos[i], 30, easeInOutSeno, ultimo().t))
        segurar(TEMPOS.pausaNo)
    }

    // 3) contorna o "C" acelerando
    quadros.push(...gerarQuadros(trechoDoArco().map(emPx), TEMPOS.arco, 60, easeInSeno, ultimo().t))

    // 4) sai do símbolo e cai até o alvo
    const saida = ultimo()
    const altura = Math.max(alvo.y - saida.y, 1)
    const impulso = 0.9
    const gravidade = 2 * altura * (1 + impulso)
    const velocidadeInicial = -impulso * altura
    const inicioQueda = saida.t

    for (let i = 1; i <= 18; i += 1) {
        const u = i / 18
        quadros.push({
            t: inicioQueda + TEMPOS.queda * u,
            x: interpolar(saida.x, alvo.x, u),
            y: saida.y + velocidadeInicial * u + 0.5 * gravidade * u * u,
            r: interpolar(saida.r, raioFinal, u),
        })
    }

    // 5) quicadas até parar
    const alturaQuicada = Math.min(Math.max(altura * 0.2, 14), 36)
    const quicadas = [
        { altura: alturaQuicada, duracao: TEMPOS.quicada1 },
        { altura: alturaQuicada * 0.3, duracao: TEMPOS.quicada2 },
    ]

    quicadas.forEach((quicada) => {
        const inicio = ultimo().t

        for (let i = 1; i <= 14; i += 1) {
            const s = i / 14
            quadros.push({
                t: inicio + quicada.duracao * s,
                x: alvo.x,
                y: alvo.y - 4 * quicada.altura * s * (1 - s),
                r: raioFinal,
            })
        }
    })

    return quadros
}

export default function Abertura() {
    const { width } = useWindowDimensions()
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const tempo = useRef(new Animated.Value(0)).current
    const [alvo, setAlvo] = useState<Ponto | null>(null)

    const tamanhoSvg = Math.min(width * 0.86, 320)
    const escala = tamanhoSvg / VIEWBOX
    const tamanhoFonte = tamanhoSvg * 0.12
    const raioFinal = tamanhoFonte * 0.33
    const espacoPonto = tamanhoFonte * 0.5

    // O ponto final é o "buraco" reservado ao lado do texto, medido no layout
    const aoMedirNome = (evento: LayoutChangeEvent) => {
        const { x, y, width: larguraLinha, height } = evento.nativeEvent.layout
        const novo = { x: x + larguraLinha - raioFinal, y: y + height / 2 }

        setAlvo((atual) =>
            atual && Math.abs(atual.x - novo.x) < 0.5 && Math.abs(atual.y - novo.y) < 0.5
                ? atual
                : novo,
        )
    }

    const animacao = useMemo(() => {
        if (!alvo) {
            return null
        }

        const quadros = criarQuadros(escala, alvo, raioFinal)
        const tempos = quadros.map((q) => q.t)
        const raioMax = Math.max(...quadros.map((q) => q.r))

        return {
            total: tempos[tempos.length - 1],
            raioMax,
            x: tempo.interpolate({
                inputRange: tempos,
                outputRange: quadros.map((q) => q.x - raioMax),
            }),
            y: tempo.interpolate({
                inputRange: tempos,
                outputRange: quadros.map((q) => q.y - raioMax),
            }),
            escala: tempo.interpolate({
                inputRange: tempos,
                outputRange: quadros.map((q) => q.r / raioMax),
            }),
        }
    }, [alvo, escala, raioFinal, tempo])

    useEffect(() => {
        if (!animacao) {
            return
        }

        tempo.setValue(0)

        const sequencia = Animated.sequence([
            Animated.timing(tempo, {
                toValue: animacao.total,
                duration: animacao.total,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.delay(ESPERA_FINAL),
        ])

        sequencia.start(({ finished }) => {
            if (finished) {
                navigation.replace("Onboarding")
            }
        })

        return () => sequencia.stop()
    }, [animacao, navigation, tempo])

    return (
        <View style={style.container}>
            <StatusBar style="light" />
            <View style={style.panel}>
                <View style={[style.logoArea, { width: tamanhoSvg }]}>
                    <Svg
                        width={tamanhoSvg}
                        height={tamanhoSvg}
                        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
                    >
                        <Path
                            d={CAMINHO_ARCO}
                            fill="none"
                            stroke={COR_BRANCA}
                            strokeWidth={ESPESSURA_ARCO}
                            strokeLinecap="round"
                        />
                        <Path
                            d={CAMINHO_LINHA}
                            fill="none"
                            stroke={COR_BRANCA}
                            strokeWidth={ESPESSURA_LINHA}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {NOS.map((no, indice) => (
                            <Circle
                                key={indice}
                                cx={no.x}
                                cy={no.y}
                                r={no.r}
                                fill={COR_BRANCA}
                            />
                        ))}
                    </Svg>

                    <View
                        style={[style.nomeLinha, { marginTop: tamanhoSvg * 0.01 }]}
                        onLayout={aoMedirNome}
                    >
                        <Text
                            allowFontScaling={false}
                            style={[style.title, { fontSize: tamanhoFonte }]}
                        >
                            CONECTA
                        </Text>
                        {/* Espaço onde a bolinha vai parar */}
                        <View
                            style={{
                                width: raioFinal * 2,
                                height: raioFinal * 2,
                                marginLeft: espacoPonto,
                            }}
                        />
                    </View>

                    {animacao && (
                        <Animated.View
                            pointerEvents="none"
                            style={[
                                style.bolinha,
                                {
                                    width: animacao.raioMax * 2,
                                    height: animacao.raioMax * 2,
                                    borderRadius: animacao.raioMax,
                                    transform: [
                                        { translateX: animacao.x },
                                        { translateY: animacao.y },
                                        { scale: animacao.escala },
                                    ],
                                },
                            ]}
                        />
                    )}
                </View>
            </View>
        </View>
    )
}