import React from "react"
import { Pressable, PressableProps, StyleProp, Text, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"

type IconName = React.ComponentProps<typeof Ionicons>["name"]
type CorTema = keyof typeof themes.colors

export type ButtonFormato = "quadrado" | "arredondado"
export type ButtonVariante = "preenchido" | "contorno"

type ButtonProps = Omit<PressableProps, "style" | "children"> & {
    texto: string
    cor?: CorTema
    formato?: ButtonFormato
    variante?: ButtonVariante
    icone?: IconName
    posicaoIcone?: "esquerda" | "direita"
    corTexto?: CorTema
    textoEmUmaLinha?: boolean
    style?: StyleProp<ViewStyle>
}

const COR_PRESSIONADA: Partial<Record<CorTema, string>> = {
    "dourado": themes.colors["dourado-pressionado"],
    "azul-escuro": "#0E2830",
    "bege-claro": themes.colors["campo-desabilitado"],
    "branco": themes.colors["bege-claro"],
    "marrom-suave": "#76523D",
}

const COR_TEXTO_PADRAO: Partial<Record<CorTema, CorTema>> = {
    "azul-escuro": "branco",
    "marrom-suave": "branco",
}

export default function Button({
    texto,
    cor = "dourado",
    formato = "quadrado",
    variante = "preenchido",
    icone,
    posicaoIcone = "esquerda",
    corTexto,
    textoEmUmaLinha = false,
    disabled,
    style: styleExterno,
    ...rest
}: ButtonProps) {
    const contorno = variante === "contorno"

    const corFundo = contorno ? "transparent" : themes.colors[cor]
    const corFundoPressionado = contorno
        ? themes.colors["campo-desabilitado"]
        : COR_PRESSIONADA[cor] ?? themes.colors[cor]

    const corConteudo =
        themes.colors[
            corTexto ?? (contorno ? "azul-escuro" : COR_TEXTO_PADRAO[cor] ?? "azul-escuro")
        ]

    const iconeEl = icone ? (
        <Ionicons
            name={icone}
            size={20}
            color={corConteudo}
            style={posicaoIcone === "esquerda" ? style.iconeEsquerda : style.iconeDireita}
        />
    ) : null

    return (
        <Pressable
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={texto}
            accessibilityState={{ disabled: !!disabled }}
            style={({ pressed }) => [
                style.base,
                formato === "quadrado" ? style.quadrado : style.arredondado,
                { backgroundColor: pressed ? corFundoPressionado : corFundo },
                contorno && [style.contorno, { borderColor: themes.colors[cor] }],
                disabled && style.desabilitado,
                styleExterno,
            ]}
            {...rest}
        >
            {posicaoIcone === "esquerda" && iconeEl}

            <Text
                numberOfLines={textoEmUmaLinha ? 1 : undefined}
                adjustsFontSizeToFit={textoEmUmaLinha}
                style={[style.texto, textoEmUmaLinha && style.textoCentralizado, { color: corConteudo }]}
            >
                {texto}
            </Text>

            {posicaoIcone === "direita" && iconeEl}
        </Pressable>
    )
}