
import React from "react"
import { Text, View } from "react-native"

import { style } from "./style"
import Button from "../Button/Button"
import { formatarMoeda } from "../../utils/formataMoeda"

type CardRecebidoProps = {
    titulo: string
    valor: number
    meta: number
    pedidos: number
    onCobrar: () => void
    onReceber: () => void
}

export default function CardRecebido({
    titulo,
    valor,
    meta,
    pedidos,
    onCobrar,
    onReceber,
}: CardRecebidoProps) {
    return (
        <View style={style.card}>
            <Text style={style.titulo}>{titulo}</Text>
            <Text style={style.valor}>{formatarMoeda(valor)}</Text>

            <View style={style.botoes}>
                <Button
                    texto="Cobrar agora"
                    cor="dourado"
                    onPress={onCobrar}
                    textoEmUmaLinha
                    style={style.botao}
                />
                <Button
                    texto="A receber"
                    cor="branco"
                    onPress={onReceber}
                    textoEmUmaLinha
                    style={style.botao}
                />
            </View>

            <View style={style.rodape}>
                <View style={style.info}>
                    <Text style={style.rotulo}>Meta</Text>
                    <Text style={style.numero}>{formatarMoeda(meta)}</Text>
                </View>

                <View style={style.info}>
                    <Text style={style.rotulo}>Pedidos</Text>
                    <Text style={style.numero}>{pedidos}</Text>
                </View>
            </View>
        </View>
    )
}