// src/components/ItemEncomenda/ItemEncomenda.tsx
import React from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"
import Quantidade from "../Quantidade/"
import { formatarMoeda } from "../../utils/formataMoeda"

type ItemEncomendaProps = {
    nome?: string          // sem nome = nenhum produto escolhido
    preco: number
    quantidade: number
    onEscolher: () => void
    onChangeQuantidade: (quantidade: number) => void
    onRemover?: () => void
}

export default function ItemEncomenda({
    nome,
    preco,
    quantidade,
    onEscolher,
    onChangeQuantidade,
    onRemover,
}: ItemEncomendaProps) {
    return (
        <View style={style.card}>
            <Pressable
                onPress={onEscolher}
                accessibilityRole="button"
                accessibilityLabel={nome ? `Trocar produto ${nome}` : "Selecionar produto"}
                style={style.produto}
            >
                <View style={style.nomeLinha}>
                    <Text style={[style.nome, !nome && style.nomeVazio]} numberOfLines={1}>
                        {nome ?? "Selecione um produto"}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={themes.colors["marrom-suave"]} />
                </View>

                <Text style={style.preco}>{formatarMoeda(preco)}</Text>
            </Pressable>

            <View style={style.quantidade}>
                <Quantidade valor={quantidade} onChange={onChangeQuantidade} />
            </View>

            {!!onRemover && (
                <Pressable
                    onPress={onRemover}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Remover produto"
                >
                    <Ionicons name="trash-outline" size={20} color={themes.colors["erro"]} />
                </Pressable>
            )}
        </View>
    )
}