import React, { useMemo, useState } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"
import * as Clipboard from "expo-clipboard"
import Svg, { Rect } from "react-native-svg"

import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import { formatarMoeda } from "../../utils/formataMoeda"
import { style } from "./style"

type PagamentoPixProps = {
    total: number
    onVoltar: () => void
    onConfirmar: () => void
    onTrocarForma: () => void
}

const PIX_COPIA_E_COLA =
    "00020126580014br.gov.bcb.pix0136conecta-pi-pagamento-simulacao52040000530398654040.005802BR5925Conecta Doces e Naturais6009Sao Paulo62070503***6304ABCD"

export default function PagamentoPix({
    total,
    onVoltar,
    onConfirmar,
    onTrocarForma,
}: PagamentoPixProps) {
    const [copiado, setCopiado] = useState(false)
    const codigoPix = useMemo(
        () => PIX_COPIA_E_COLA.replace("40.00", total.toFixed(2)),
        [total]
    )

    async function copiarCodigo() {
        await Clipboard.setStringAsync(codigoPix)
        setCopiado(true)
    }

    return (
        <AppLayout
            header={{
                tipo: "detalhe",
                titulo: "Pagamento via PIX",
                onVoltar,
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={style.conteudo}
            >
                <View style={style.card}>
                    <Text style={style.rotulo}>Valor a cobrar</Text>
                    <Text style={style.valor}>{formatarMoeda(total)}</Text>

                    <View style={style.linhaCliente}>
                        <Text style={style.rotulo}>Cliente</Text>
                        <Text style={style.cliente}>Cliente não informado</Text>
                    </View>
                </View>

                <View style={style.cardPix}>
                    <QrCodeSimulado valor={codigoPix} />
                    <Text style={style.instrucao}>
                        Peça para o cliente abrir o app do banco e escanear o QR Code.
                    </Text>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Copiar código PIX"
                        onPress={copiarCodigo}
                        style={style.codigo}
                    >
                        <Text style={style.codigoTexto} numberOfLines={1}>
                            {codigoPix}
                        </Text>
                        <Text style={style.copiar}>{copiado ? "Copiado" : "Copiar"}</Text>
                    </Pressable>
                </View>

                <View style={style.aviso}>
                    <Text style={style.avisoTexto}>
                        Quando o cliente concluir, confira a notificação do banco e toque em
                        “Pagamento confirmado”.
                    </Text>
                </View>

                <Button
                    texto="Pagamento confirmado"
                    cor="dourado"
                    onPress={onConfirmar}
                    textoEmUmaLinha
                />
                <Button
                    texto="Trocar forma de pagamento"
                    cor="borda"
                    variante="contorno"
                    onPress={onTrocarForma}
                    textoEmUmaLinha
                />
            </ScrollView>
        </AppLayout>
    )
}

function QrCodeSimulado({ valor }: { valor: string }) {
    const tamanho = 29
    const matriz = criarMatriz(valor, tamanho)
    const modulo = 5

    return (
        <Svg width={tamanho * modulo} height={tamanho * modulo} viewBox={`0 0 ${tamanho * modulo} ${tamanho * modulo}`}>
            <Rect width="100%" height="100%" fill="#FFFFFF" />
            {matriz.map((linha, y) =>
                linha.map(
                    (preenchido, x) =>
                        preenchido && (
                            <Rect
                                key={`${x}-${y}`}
                                x={x * modulo}
                                y={y * modulo}
                                width={modulo}
                                height={modulo}
                                fill="#000000"
                            />
                        )
                )
            )}
        </Svg>
    )
}

function criarMatriz(valor: string, tamanho: number) {
    const matriz = Array.from({ length: tamanho }, () => Array(tamanho).fill(false))

    function marcador(inicioX: number, inicioY: number) {
        for (let y = 0; y < 7; y += 1) {
            for (let x = 0; x < 7; x += 1) {
                const borda = x === 0 || x === 6 || y === 0 || y === 6
                const centro = x >= 2 && x <= 4 && y >= 2 && y <= 4
                matriz[inicioY + y][inicioX + x] = borda || centro
            }
        }
    }

    marcador(0, 0)
    marcador(tamanho - 7, 0)
    marcador(0, tamanho - 7)

    let indice = 0
    for (let y = 0; y < tamanho; y += 1) {
        for (let x = 0; x < tamanho; x += 1) {
            const reservado =
                (x < 8 && y < 8) ||
                (x >= tamanho - 8 && y < 8) ||
                (x < 8 && y >= tamanho - 8)
            if (!reservado) {
                const codigo = valor.charCodeAt(indice % valor.length)
                matriz[y][x] = (codigo + x * 3 + y * 5 + indice) % 7 < 3
                indice += 1
            }
        }
    }

    return matriz
}
