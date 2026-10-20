// src/components/ProdutoCard/ProdutoCard.tsx
import React from "react"
import { Image, Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"
import Estoque from "../Estoque/"
import Quantidade from "../Quantidade/"
import { formatarMoeda } from "../../utils/formataMoeda"
import type { Produto } from "../../types/produto"

type ProdutoCardProps =
    | { tipo: "estoque"; produto: Produto; onPress?: () => void }
    | {
          tipo: "quantidade"
          produto: Produto
          quantidade: number
          onChangeQuantidade: (quantidade: number) => void
      }

export default function ProdutoCard(props: ProdutoCardProps) {
    const { produto } = props
    const clicavel = props.tipo === "estoque" && !!props.onPress

    return (
        <Pressable
            disabled={!clicavel}
            onPress={props.tipo === "estoque" ? props.onPress : undefined}
            accessibilityRole={clicavel ? "button" : undefined}
            accessibilityLabel={produto.nome}
            style={({ pressed }) => [style.card, pressed && clicavel && style.pressionado]}
        >
            {produto.imagem ? (
                <Image source={{ uri: produto.imagem }} style={style.imagem} />
            ) : (
                <View style={[style.imagem, style.semImagem]}>
                    <Ionicons name="image-outline" size={32} color={themes.colors["marrom-suave"]} />
                </View>
            )}

            <View style={style.textos}>
                <Text style={style.nome} numberOfLines={2}>
                    {produto.nome}
                </Text>

                <Text
                    style={[
                        style.preco,
                        props.tipo === "estoque" && { color: themes.colors["sucesso"] },
                    ]}
                >
                    {formatarMoeda(produto.preco)}
                </Text>

                {props.tipo === "estoque" ? (
                    <Estoque quantidade={produto.estoque} />
                ) : (
                    <Quantidade
                        valor={props.quantidade}
                        onChange={props.onChangeQuantidade}
                        max={produto.estoque}
                    />
                )}
            </View>
        </Pressable>
    )
}