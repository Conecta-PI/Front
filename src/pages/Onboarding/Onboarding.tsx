import React, { useState } from "react"
import { Pressable, Text, useWindowDimensions, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Circle, Line, Path, Rect, Svg } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import Button from "../../components/Button/Button"
import { themes } from "../../global/themes"
import type { RootStackParamList } from "../../routes"
import { style } from "./style"

type Navigation = NativeStackNavigationProp<RootStackParamList>

const ILUSTRACAO_TAMANHO = 132

function IlustracaoCobranca() {
    return (
        <Svg width={ILUSTRACAO_TAMANHO} height={ILUSTRACAO_TAMANHO} viewBox="0 0 132 132">
            <Path
                d="M34 19h62v84l-10-8-11 8-10-8-11 8-10-8-10 8V19Z"
                fill="#fff"
                stroke={themes.colors["azul-escuro"]}
                strokeWidth="2"
            />
            <Line
                x1="46"
                y1="37"
                x2="82"
                y2="37"
                stroke={themes.colors["azul-escuro"]}
                strokeWidth="7"
                strokeLinecap="round"
            />
            <Line
                x1="47"
                y1="54"
                x2="80"
                y2="54"
                stroke="#DDE3E4"
                strokeWidth="5"
                strokeLinecap="round"
            />
            <Line
                x1="47"
                y1="68"
                x2="80"
                y2="68"
                stroke="#DDE3E4"
                strokeWidth="5"
                strokeLinecap="round"
            />
            <Circle cx="80" cy="82" r="15" fill={themes.colors["sucesso"]} />
            <Path
                d="m73 82 5 5 9-11"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

function IlustracaoEstoque() {
    return (
        <Svg width={ILUSTRACAO_TAMANHO} height={ILUSTRACAO_TAMANHO} viewBox="0 0 132 132">
            <Rect x="29" y="22" width="74" height="94" rx="11" fill={themes.colors["azul-escuro"]} />
            <Rect x="37" y="31" width="58" height="77" rx="4" fill="#fff" />
            <Rect x="52" y="14" width="31" height="18" rx="6" fill={themes.colors["dourado"]} />
            <Rect x="44" y="48" width="10" height="10" rx="2" fill={themes.colors["sucesso"]} />
            <Rect x="61" y="49" width="27" height="7" rx="3.5" fill="#DDE3E4" />
            <Rect x="44" y="67" width="10" height="10" rx="2" fill={themes.colors["sucesso"]} />
            <Rect x="61" y="68" width="27" height="7" rx="3.5" fill="#DDE3E4" />
            <Rect x="44" y="86" width="10" height="10" rx="2" fill={themes.colors["dourado"]} />
            <Rect x="61" y="87" width="27" height="7" rx="3.5" fill="#DDE3E4" />
        </Svg>
    )
}

function IlustracaoClientes() {
    return (
        <Svg width={ILUSTRACAO_TAMANHO} height={ILUSTRACAO_TAMANHO} viewBox="0 0 132 132">
            <Circle cx="66" cy="38" r="16" fill={themes.colors["dourado"]} />
            <Circle cx="31" cy="41" r="12" fill="#fff" stroke="#123A46" strokeWidth="2.5" />
            <Circle cx="101" cy="41" r="12" fill="#fff" stroke="#123A46" strokeWidth="2.5" />
            <Path
                d="M43 96c0-22 9-35 23-35s23 13 23 35"
                fill={themes.colors["azul-escuro"]}
                stroke="#123A46"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            <Path
                d="M5 96c1-19 9-29 26-29 10 0 17 5 21 14-6 6-9 14-9 25H10c-3 0-5-3-5-10ZM127 96c-1-19-9-29-26-29-10 0-17 5-21 14 6 6 9 14 9 25h33c3 0 5-3 5-10Z"
                fill="#fff"
                stroke="#123A46"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

const PAGINAS = [
    {
        titulo: "Cobre rápido",
        descricao: "Do produto ao pagamento em poucos toques. Pix, cartão ou dinheiro.",
        ilustracao: <IlustracaoCobranca />,
        botao: "Continuar",
    },
    {
        titulo: "Estoque sob controle",
        descricao: "Controle seu estoque e saiba o custo real de cada produto.",
        ilustracao: <IlustracaoEstoque />,
        botao: "Continuar",
    },
    {
        titulo: "Clientes e encomendas",
        descricao: "Organize entregas, fidelize clientes e nunca perca um pedido.",
        ilustracao: <IlustracaoClientes />,
        botao: "Começar",
    },
] as const

export default function Onboarding() {
    const navigation = useNavigation<Navigation>()
    const { height } = useWindowDimensions()
    const insets = useSafeAreaInsets()
    const [pagina, setPagina] = useState(0)
    const atual = PAGINAS[pagina]

    function pular() {
        navigation.replace("Login")
    }

    function continuar() {
        if (pagina === PAGINAS.length - 1) {
            navigation.replace("Login")
            return
        }

        setPagina((valor) => valor + 1)
    }

    return (
        <View style={style.container}>
            <View style={[style.content, { paddingTop: insets.top }]}>
                <View style={style.topo}>
                    {pagina > 0 ? (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Voltar"
                            hitSlop={10}
                            onPress={() => setPagina((valor) => valor - 1)}
                            style={style.voltar}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={22}
                                color={themes.colors["marrom-suave"]}
                            />
                        </Pressable>
                    ) : (
                        <View style={style.voltar} />
                    )}

                    {pagina < PAGINAS.length - 1 && (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Pular onboarding"
                            hitSlop={10}
                            onPress={pular}
                        >
                            <Text style={style.pular}>Pular</Text>
                        </Pressable>
                    )}
                </View>

                <View style={[style.corpo, { minHeight: Math.min(height * 0.64, 560) }]}>
                    <View style={style.ilustracao}>{atual.ilustracao}</View>

                    <View style={style.textos}>
                        <Text style={style.titulo}>{atual.titulo}</Text>
                        <Text style={style.descricao}>{atual.descricao}</Text>
                    </View>

                    <View style={style.indicadores} accessibilityLabel={`Tela ${pagina + 1} de 3`}>
                        {PAGINAS.map((_, indice) => (
                            <View
                                key={indice}
                                style={[style.indicador, indice === pagina && style.indicadorAtivo]}
                            />
                        ))}
                    </View>
                </View>

                <View style={[style.rodape, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                    <Button
                        texto={atual.botao}
                        icone="chevron-forward"
                        posicaoIcone="direita"
                        onPress={continuar}
                        style={style.botao}
                    />
                </View>
            </View>
        </View>
    )
}
