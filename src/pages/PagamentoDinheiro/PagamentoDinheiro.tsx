import React, { useMemo, useState } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import { formatarMoeda } from "../../utils/formataMoeda"
import { style } from "./style"

type PagamentoDinheiroProps = {
    total: number
    onVoltar: () => void
    onConfirmar: () => void
    onTrocarForma: () => void
}

const VALORES_SUGERIDOS = [20, 50, 100, 200]

export default function PagamentoDinheiro({
    total,
    onVoltar,
    onConfirmar,
    onTrocarForma,
}: PagamentoDinheiroProps) {
    const [recebido, setRecebido] = useState<number | null>(null)

    const troco = useMemo(
        () => Math.max((recebido ?? 0) - total, 0),
        [recebido, total]
    )

    return (
        <AppLayout
            header={{
                tipo: "detalhe",
                titulo: "Pagamento em dinheiro",
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

                <View style={style.card}>
                    <Text style={style.tituloCard}>Quanto o cliente entregou?</Text>

                    <View style={style.chips}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityState={{ selected: recebido === total }}
                            onPress={() => setRecebido(total)}
                            style={[style.chip, recebido === total && style.chipSelecionado]}
                        >
                            <Text style={style.chipTexto}>Valor exato</Text>
                        </Pressable>

                        {VALORES_SUGERIDOS.map((valor) => (
                            <Pressable
                                key={valor}
                                accessibilityRole="button"
                                accessibilityState={{ selected: recebido === valor }}
                                onPress={() => setRecebido(valor)}
                                style={[style.chip, recebido === valor && style.chipSelecionado]}
                            >
                                <Text style={style.chipTexto}>{formatarMoeda(valor)}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <View style={style.resumo}>
                        <Text style={style.rotulo}>Recebido</Text>
                        <Text style={style.resumoValor}>
                            {formatarMoeda(recebido ?? 0)}
                        </Text>
                    </View>
                    <View style={style.resumo}>
                        <Text style={style.trocoRotulo}>Troco</Text>
                        <Text style={style.troco}>{formatarMoeda(troco)}</Text>
                    </View>
                </View>

                <View style={style.card}>
                    <Text style={style.tituloCard}>Como receber em dinheiro</Text>
                    <View style={style.instrucoes}>
                        <Instrucao numero="1">Receba as notas e confira o valor.</Instrucao>
                        <Instrucao numero="2">
                            Toque no valor recebido acima para ver o troco.
                        </Instrucao>
                        <Instrucao numero="3">
                            Entregue o troco e toque em “Pagamento confirmado”.
                        </Instrucao>
                    </View>
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

function Instrucao({ numero, children }: { numero: string; children: string }) {
    return (
        <View style={style.instrucao}>
            <View style={style.numero}>
                <Text style={style.numeroTexto}>{numero}</Text>
            </View>
            <Text style={style.instrucaoTexto}>{children}</Text>
        </View>
    )
}
